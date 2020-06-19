import json
import os
import glob

from file_helper import find_image_urls
from github_helper import (
    get_latest_commit_at,
    get_rate_limit,
    get_readme_file,
    list_repository_image_urls,
    search_repositories,
)
from print_helper import colors
from s3_helper import upload_file, empty_bucket

IS_PRODUCTION = os.getenv("IS_PRODUCTION")
EMPTY_S3_BUCKET = os.getenv("EMPTY_S3_BUCKET")
MAX_IMAGE_COUNT = os.getenv("MAX_IMAGE_COUNT")
MAX_IMAGE_COUNT = int(MAX_IMAGE_COUNT) if MAX_IMAGE_COUNT is not None else 5


def save_local_file(file_name, data):
    file_path = f"data/{file_name}"
    print(f"{colors.INFO}WRITE{colors.NORMAL} to local file {file_path}\n")
    with open(file_path, "w") as file:
        file.write(data)


def save_file(repository, data):
    separator = "/" if IS_PRODUCTION else "__"
    file_name = f"{repository['owner']['name']}{separator}{repository['name']}.json"
    if IS_PRODUCTION:
        upload_file(file_name, data)
    else:
        save_local_file(file_name, data)


def empty_local_data_directory():
    files = glob.glob("data/*.json")
    for data_file in files:
        try:
            os.remove(data_file)
        except OSError as e:
            print(f"{colors.ERROR}Error deleting {data_file}: {e.strerror}")


if __name__ == "__main__":
    repositories = search_repositories()

    if EMPTY_S3_BUCKET:
        empty_bucket()

    if not IS_PRODUCTION:
        empty_local_data_directory()

    for index, repository in enumerate(repositories):
        print(
            f"{colors.INFO}# {repository['owner']['name']}/{repository['name']}{colors.NORMAL}"
        )
        repository["readme"] = get_readme_file(repository)
        readme_image_urls = find_image_urls(repository["readme"], MAX_IMAGE_COUNT)
        print(f"{colors.INFO}INFO: {colors.NORMAL}Found {len(readme_image_urls)} valid image(s) in the readme file")
        repository_image_urls = list_repository_image_urls(
            repository, len(readme_image_urls), MAX_IMAGE_COUNT
        )
        print(f"{colors.INFO}INFO: {colors.NORMAL}Found {len(repository_image_urls)} valid image(s) in the repository files")
        repository["image_urls"] = readme_image_urls + repository_image_urls

        repository["latest_commit_at"] = get_latest_commit_at(repository)

        save_file(repository, json.dumps(repository))
