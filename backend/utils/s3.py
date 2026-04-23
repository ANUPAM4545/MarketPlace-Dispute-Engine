import boto3
import os
from flask import current_app

def upload_file_to_s3(file, folder="uploads"):
    """
    Uploads a file object to an AWS S3 bucket and returns the public URL.
    """
    bucket_name = os.environ.get("AWS_BUCKET_NAME")
    access_key = os.environ.get("S3_KEY_ID")
    secret_key = os.environ.get("S3_SECRET_KEY")
    region = os.environ.get("AWS_REGION", "ap-south-1")

    # Keyless IAM Role Detection (Best for AWS environments like App Runner)
    try:
        from botocore.config import Config
        # Try to initialize WITHOUT keys first (Native AWS Role)
        if not access_key or not secret_key:
            print("S3: No keys found. Attempting to use native IAM Role...")
            session = boto3.Session(region_name=region)
        else:
            # Cleanup and verify keys
            access_key = access_key.strip()
            secret_key = secret_key.strip()
            print(f"S3: Using provided S3_KEY_ID keys...")
            session = boto3.Session(
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name=region
            )
        
        s3_client = session.client(
            "s3",
            config=Config(signature_version='s3v4')
        )
    except Exception as e:
        print(f"Boto3 Initialization Error: {e}")
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
