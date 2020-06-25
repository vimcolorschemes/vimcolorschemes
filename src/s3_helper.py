import boto3
import os

from print_helper import colors
from file_helper import read_file

S3_IMPORTS_DIRECTORY_NAME = os.getenv("S3_IMPORTS_DIRECTORY_NAME")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_PROFILE_NAME = os.getenv("AWS_PROFILE_NAME")

session = boto3.session.Session(profile_name=AWS_PROFILE_NAME)
s3 = session.resource("s3")
s3_client = session.client("s3")
bucket = s3.Bucket(S3_BUCKET_NAME) if S3_BUCKET_NAME else None


def get_import_content(file_name):
    temp_import_file = "temp_last_import.json"
    bucket.download_file(file_name, temp_import_file)
    content = read_file(temp_import_file)
    os.remove(temp_import_file)
    return content


def empty_bucket():
    try:
        print(
            f"\n{colors.INFO}DELETE{colors.NORMAL} content of {S3_BUCKET_NAME} s3 bucket..."
        )
        bucket.objects.all().delete()
    except Exception as e:
        print(f"{colors.ERROR}Error delete {S3_BUCKET_NAME} s3 bucket content\n{e}")


def upload_file(file_name, data):
    try:
        print(f"{colors.INFO}PUT{colors.NORMAL} file {file_name} to s3...")
        bucket.put_object(Key=f"{file_name}", Body=data)
        print("")
    except Exception as e:
        print(
            f"{colors.ERROR}Error writing file {file_name} to s3...\n{e}{colors.NORMAL}"
        )


def list_file_keys(path=""):
    try:
        return list(map(lambda file: file.key, bucket.objects.filter(Prefix=path)))
    except Exception as e:
        print(
            f"{colors.ERROR}Error fetching files of {path} from s3...\n{e}{colors.NORMAL}"
        )
