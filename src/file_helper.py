import base64
import os
import re

from print_helper import colors
from request_helper import get


def decode_file_content(data):
    base64_bytes = data.encode("utf-8")
    bytes = base64.b64decode(base64_bytes)
    return bytes.decode("utf-8")


def image_url_is_valid(image_url):
    data, used_cache = get(image_url, is_json=False)
    print(
        f"{colors.INFO}GET{colors.NORMAL} image at url={image_url} (used_cache={used_cache})"
    )
    return data is not None


def find_image_urls(file_content, max_image_count):
    image_url_regex = r"\b(https?:\/\/\S+(?:png|jpe?g|webp))\b"
    standard_image_urls = re.findall(image_url_regex, file_content)

    github_camo_url_regex = (
        r"\bhttps?:\/\/camo.githubusercontent.com(\/[0-9a-zA-Z]*)+\b"
    )
    github_camo_urls = re.findall(github_camo_url_regex, file_content)

    image_urls = standard_image_urls + github_camo_urls

    valid_image_urls = []
    index = 0

    while len(valid_image_urls) < max_image_count and index < len(image_urls):
        image_url = image_urls[index]
        is_valid = image_url_is_valid(image_url)
        if is_valid:
            valid_image_urls.append(image_url)
        index = index + 1

    return valid_image_urls

def read_file(path):
    return open(path, "r").read()

def write_file(path, data):
    with open(path, "w") as file:
        file.write(data)
