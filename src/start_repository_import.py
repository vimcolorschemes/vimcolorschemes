import json
import os

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


if __name__ == "__main__":
    repositories = search_repositories()

    if EMPTY_S3_BUCKET:
        empty_bucket()

    for index, repository in enumerate(repositories):
        print(
            f"{colors.INFO}# {repository['owner']['name']}/{repository['name']}{colors.NORMAL}"
        )
        repository["readme"] = get_readme_file(repository)
        readme_image_urls = find_image_urls(repository["readme"])

        repository_image_urls = list_repository_image_urls(repository)

        repository["image_urls"] = readme_image_urls + repository_image_urls

        repository["latest_commit_at"] = get_latest_commit_at(repository)

        save_file(repository, json.dumps(repository))
