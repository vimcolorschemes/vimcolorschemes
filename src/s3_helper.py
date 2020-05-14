import boto3

from print_helper import colors

BUCKET_NAME = "vimcolorschemes"
REPOSITORIES_DIRECTORY_NAME = "repositories"

session = boto3.session.Session(profile_name="reobin")
s3 = session.resource("s3")


def upload_file(file_name, data):
    try:
        print(f"Writing file {REPOSITORIES_DIRECTORY_NAME}/{file_name} to s3...")
        s3.Bucket(BUCKET_NAME).put_object(
            Key=f"{REPOSITORIES_DIRECTORY_NAME}/{file_name}", Body=data
        )
    except Exception as e:
        print(
            f"{colors.ERROR}Error writing file {REPOSITORIES_DIRECTORY_NAME}/{file_name} to s3...\n{e}{colors.NORMAL}"
        )
