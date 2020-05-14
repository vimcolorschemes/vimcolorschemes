import os
import base64

from requests.auth import HTTPBasicAuth

from request_helper import get
from file_helper import decode_file_content

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

ITEMS_PER_PAGE = 100
BASE_URL = "https://api.github.com"

VIM_COLOR_SCHEME_QUERY = "vim color scheme language:vim sort:stars"


AUTH = (
    HTTPBasicAuth(GITHUB_USERNAME, GITHUB_TOKEN)
    if GITHUB_USERNAME and GITHUB_TOKEN
    else None
)


def list_repositories(query=VIM_COLOR_SCHEME_QUERY, page=1):
    search_path = "search/repositories"
    base_search_params = {"per_page": ITEMS_PER_PAGE}

    data = get(
        f"{BASE_URL}/{search_path}",
        params={"q": query, "page": page, **base_search_params},
        auth=AUTH,
    )

    repositories = list(map(map_response_item_to_repository, data["items"]))
    total_count = data["total_count"]

    return repositories, total_count


def map_response_item_to_repository(response_item):
    return {
        "id": response_item["id"],
        "name": response_item["name"],
        "description": response_item["description"],
        "github_url": response_item["html_url"],
        "homepage_url": response_item["homepage"],
        "stargazers_count": response_item["stargazers_count"],
        "owner": {
            "name": response_item["owner"]["login"],
            "avatar_url": response_item["owner"]["avatar_url"],
        },
    }


def get_readme_file(repository):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    if not owner_name or not name:
        return ""

    get_readme_path = f"repos/{owner_name}/{name}/readme"
    url = f"{BASE_URL}/{get_readme_path}"

    data = get(url, auth=AUTH)

    if not data:
        return ""

    return decode_file_content(data["content"])


def get_rate_limit():
    rate_limit_path = "rate_limit"
    data = get(f"{BASE_URL}/{rate_limit_path}", auth=AUTH)

    remaining_calls = data["resources"]["core"]["remaining"]
    reset = data["resources"]["core"]["reset"]

    print("Remaining calls for Github API:", remaining_calls)

    return remaining_calls, reset
