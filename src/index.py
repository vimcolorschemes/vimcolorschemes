import glob
import json
import os
import time
import dateutil.parser as dparser
from datetime import datetime

from file_helper import find_image_urls
from github_helper import (
    get_latest_commit_at,
    get_rate_limit,
    get_readme_file,
    list_repository_image_urls,
    search_repositories,
)
from print_helper import colors
from s3_helper import list_file_keys, empty_bucket, upload_file

IS_PRODUCTION = os.getenv("IS_PRODUCTION")
EMPTY_S3_BUCKET = os.getenv("EMPTY_S3_BUCKET")
MAX_IMAGE_COUNT = os.getenv("MAX_IMAGE_COUNT")
MAX_IMAGE_COUNT = int(MAX_IMAGE_COUNT) if MAX_IMAGE_COUNT is not None else 5

S3_IMPORTS_DIRECTORY_NAME = os.getenv("S3_IMPORTS_DIRECTORY_NAME")

LOCAL_REPOSITORIES_DIRECTORY_NAME = "repositories"
LOCAL_IMPORTS_DIRECTORY_NAME = "imports"


def save_local_file(file_name, data):
    file_path = f"data/{file_name}"
    print(f"{colors.INFO}WRITE{colors.NORMAL} to local file {file_path}\n")
    with open(file_path, "w") as file:
        file.write(data)


def save_file(file_name, data):
    if IS_PRODUCTION:
        upload_file(file_name, data)
    else:
        save_local_file(file_name, data)


def empty_local_data_directory():
    files = glob.glob("data/repositories/*.json")
    for data_file in files:
        try:
            os.remove(data_file)
        except OSError as e:
            print(f"{colors.ERROR}Error deleting {data_file}: {e.strerror}")


def get_last_imported_at():
    import_files = (
        list_file_keys("imports") if IS_PRODUCTION else glob.glob("data/imports/*.json")
    )
    dates = list(
        map(lambda file_name: dparser.parse(file_name, fuzzy=True), import_files)
    )
    dates.sort()
    return dates[len(dates) - 1] if len(dates) > 0 else None


if __name__ == "__main__":
    start = time.time()

    repositories = search_repositories()

    if EMPTY_S3_BUCKET:
        empty_bucket()

    if not IS_PRODUCTION:
        empty_local_data_directory()

    last_imported_at = get_last_imported_at()
    if last_imported_at:
        print(
            f"{colors.INFO}INFO: {colors.NORMAL}Last import was done at: {last_imported_at.strftime('%m-%d-%Y')}\n"
        )

    def add_repository_infos(repository):
        pushed_at = dparser.parse(repository["pushed_at"], fuzzy=True)
        naive_pushed_at = pushed_at.replace(tzinfo=None)
        print(
            f"{colors.INFO}# {repository['owner']['name']}/{repository['name']}{colors.NORMAL}"
        )
        if not last_imported_at or naive_pushed_at > last_imported_at:
            readme_image_urls = find_image_urls(get_readme_file(repository), MAX_IMAGE_COUNT)
            print(
                f"{colors.INFO}INFO: {colors.NORMAL}Found {len(readme_image_urls)} valid image(s) in the readme file"
            )
            repository_image_urls = list_repository_image_urls(
                repository, len(readme_image_urls), MAX_IMAGE_COUNT
            )
            print(
                f"{colors.INFO}INFO: {colors.NORMAL}Found {len(repository_image_urls)} valid image(s) in the repository files"
            )
            repository["image_urls"] = readme_image_urls + repository_image_urls
            repository["latest_commit_at"] = get_latest_commit_at(repository)
        else:
            print(f"{colors.INFO}INFO: {colors.NORMAL}Image urls search was skipped")
        print("")
        return repository

    repositories = list(map(add_repository_infos, repositories))

    end = time.time()

    elapsed_time = end - start

    now = datetime.utcnow().strftime("%Y-%m-%d_%H:%M:%S")
    summary = {
        "elapsed_time": elapsed_time,
        "imported_at": now,
        "repositories": repositories
    }
    summary_file_name = f"{now}.json"
    if IS_PRODUCTION:
        summary_file_name = f"{S3_IMPORTS_DIRECTORY_NAME}/{summary_file_name}"
    else:
        summary_file_name = f"{LOCAL_IMPORTS_DIRECTORY_NAME}/{summary_file_name}"

    save_file(summary_file_name, json.dumps(summary))

    print(f"#########################")
    print(f"#        Summary        #")
    print(f"#########################")
    print("")
    print(f"Elapsed time: {elapsed_time} seconds")
