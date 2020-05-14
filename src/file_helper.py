import base64
import re


def decode_file_content(data):
    base64_bytes = data.encode("utf-8")
    bytes = base64.b64decode(base64_bytes)
    return bytes.decode("utf-8")


def find_image_urls(file_content):
    return re.findall(r"(https?:\/\/.*\.(?:png|jpg|jpeg|webp))", file_content)
