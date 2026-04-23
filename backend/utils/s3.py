import boto3
import os
from flask import current_app

def upload_file_to_s3(file, folder="uploads"):
    """
    Uploads a file object to an AWS S3 bucket and returns the public URL.
    """
    bucket_name = os.environ.get("AWS_BUCKET_NAME")
    access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    region = os.environ.get("AWS_REGION", "us-east-1")

    if not all([bucket_name, access_key, secret_key]):
        print("S3 Error: Missing AWS credentials in environment variables.")
        return None

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )

    try:
        # Generate target filename
        filename = file.filename
        s3_path = f"{folder}/{filename}"

        # Upload file (with public-read permission if allowed by bucket policy)
        s3_client.upload_fileobj(
            file,
            bucket_name,
            s3_path,
            ExtraArgs={"ContentType": file.content_type}
        )

        # Build public URL
        # For S3, the standard URL format is: https://bucket-name.s3.region.amazonaws.com/path
        url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{s3_path}"
        return url

    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return None
