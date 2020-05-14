import json
import math
import re
import time
import sys

from file_helper import find_image_urls
from request_helper import get
from print_helper import start_sleeping
from s3_helper import upload_file
from github_helper import (
    list_repositories,
    get_rate_limit,
    get_readme_file,
    ITEMS_PER_PAGE,
)


BASE_URL = "https://api.github.com"


def search_repositories(remaining_calls, reset):
    repositories = []

    first_page_repositories, total_count = list_repositories()
    repositories.extend(first_page_repositories)

    page_count = math.ceil(total_count / ITEMS_PER_PAGE)

    for page in range(2, page_count + 1):
        if remaining_calls <= 1:
            sleep_until_reset(reset)

        current_page_repositories, total_count = list_repositories(page=page)
        repositories.extend(current_page_repositories)

        remaining_calls = remaining_calls - 1

    return total_count, repositories


def upload_repository_file(repository):
    file_name = f"{repository['owner']['name']}__{repository['name']}.json"
    upload_file(file_name, json.dumps(repository))


def sleep_until_reset(reset):
    remaining_calls = 1

    while remaining_calls <= 1:
        now = int(time.time())
        time_until_reset = reset - now
        start_sleeping(time_until_reset + 100)
        remaining_calls, reset = get_rate_limit()

    return remaining_calls


if __name__ == "__main__":
    remaining_calls, reset = get_rate_limit()

    if remaining_calls <= 1:
        remaining_calls = sleep_until_reset(reset)

    total_count, repositories = search_repositories(remaining_calls, reset)

    remaining_calls = remaining_calls - 1

    print("Total repo count:", total_count)

    for index, repository in enumerate(repositories):
        if remaining_calls <= 1:
            remaining_calls = sleep_until_reset(reset)

        repository["readme"] = get_readme_file(repository)
        repository["image_urls"] = find_image_urls(repository["readme"])

        remaining_calls = remaining_calls - 1

        upload_repository_file(repository)
