import json
import math
import os
import re
import sys
import time

from file_helper import find_image_urls
from github_helper import (
    ITEMS_PER_PAGE,
    get_latest_commit_at,
    get_rate_limit,
    get_readme_file,
    list_repositories,
    list_repository_image_urls,
    sleep_until_reset,
)
from print_helper import start_sleeping
from s3_helper import upload_file, empty_bucket

BASE_URL = "https://api.github.com"


def search_repositories():
    repositories = []

    first_page_repositories, total_count = list_repositories()
    repositories.extend(first_page_repositories)

    page_count = math.ceil(total_count / ITEMS_PER_PAGE)

    for page in range(2, page_count + 1):
        (current_page_repositories, total_count) = list_repositories(page=page)
        repositories.extend(current_page_repositories)

    return repositories, total_count


def upload_repository_file(repository):
    file_name = f"{repository['owner']['name']}__{repository['name']}.json"
    upload_file(file_name, json.dumps(repository))


if __name__ == "__main__":
    repositories, total_count = search_repositories()
    print("Total repo count:", total_count)

    for index, repository in enumerate(repositories):
        repository["readme"] = get_readme_file(repository)
        readme_image_urls = find_image_urls(repository["readme"])

        repository["latest_commit_at"] = get_latest_commit_at(repository)

        repository_image_urls = list_repository_image_urls(repository)

        repository["image_urls"] = readme_image_urls + repository_image_urls

        upload_repository_file(repository)
