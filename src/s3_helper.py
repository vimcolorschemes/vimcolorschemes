import boto3
import os

from print_helper import colors

S3_REPOSITORIES_DIRECTORY_NAME = os.getenv("S3_REPOSITORIES_DIRECTORY_NAME")
S3_IMPORTS_DIRECTORY_NAME = os.getenv("S3_IMPORTS_DIRECTORY_NAME")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_PROFILE_NAME = os.getenv("AWS_PROFILE_NAME")

session = boto3.session.Session(profile_name=AWS_PROFILE_NAME)
s3 = session.resource("s3")
bucket = s3.Bucket(S3_BUCKET_NAME)


def empty_bucket():
    try:
        print(
            f"{colors.INFO}DELETE{colors.NORMAL} content of {S3_BUCKET_NAME} s3 bucket..."
        )
        bucket.objects.all().delete()
        print("")
    except Exception as e:
        print(f"{colors.ERROR}Error delete {S3_BUCKET_NAME} s3 bucket content\n{e}")


def upload_file(file_name, data):
    try:
        print(f"{colors.INFO}PUT{colors.NORMAL} file {file_name} to s3...")
        bucket.put_object(Key=f"{file_name}", Body=data)
        print("")
    except Exception as e:
        print(
            f"{colors.ERROR}Error writing file {S3_REPOSITORIES_DIRECTORY_NAME}/{file_name} to s3...\n{e}{colors.NORMAL}"
        )
