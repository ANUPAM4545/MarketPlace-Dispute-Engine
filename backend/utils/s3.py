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

    # Standard boto3 client initialization (picks up keys from env automatically)
    try:
        from botocore.config import Config
        s3_client = boto3.client(
            "s3",
            region_name=region,
            config=Config(signature_version='s3v4')
        )
    except Exception as e:
        print(f"Boto3 Client Error: {e}")
        return None

    try:
        # Generate target filename
        filename = file.filename
        s3_path = f"{folder}/{filename}"

        # Reset file pointer
        file.seek(0)

        # Upload file (Simple mode)
        s3_client.upload_fileobj(
            file,
            bucket_name,
            s3_path
        )

        # Build public URL
        url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{s3_path}"
        return url

    except Exception as e:
        print(f"--- S3 UPLOAD DETAILED ERROR ---")
        print(f"Error Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
