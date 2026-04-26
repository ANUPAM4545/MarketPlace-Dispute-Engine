import boto3
import os
from werkzeug.utils import secure_filename
import uuid

def upload_to_s3(file_obj, bucket_name=None):
    """
    Uploads a file object to S3 and returns the public URL.
    Returns None if AWS credentials are not configured.
    """
    access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    bucket = bucket_name or os.environ.get('AWS_S3_BUCKET', 'market-dispute-uploads')
    region = os.environ.get('AWS_REGION', 'ap-south-1')

    if not all([access_key, secret_key, bucket]):
        print("S3: AWS credentials or bucket name not configured. Falling back to local storage.")
        return None

    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )

        original_filename = secure_filename(file_obj.filename)
        # Add a UUID to prevent filename collisions
        unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
        
        file_obj.seek(0)
        s3.upload_fileobj(
            file_obj,
            bucket,
            unique_filename,
            ExtraArgs={'ACL': 'public-read', 'ContentType': file_obj.content_type}
        )

        return f"https://{bucket}.s3.{region}.amazonaws.com/{unique_filename}"
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return None
