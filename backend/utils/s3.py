import boto3
import os
import uuid
from werkzeug.utils import secure_filename
import logging

logger = logging.getLogger(__name__)

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
        region_name=os.environ.get('AWS_REGION', 'us-east-1')
    )

def upload_file_to_s3(file_obj, filename):
    """
    Uploads a file to an AWS S3 bucket and returns the public URL.
    Falls back to local storage if AWS credentials or bucket name are missing.
    """
    bucket_name = os.environ.get('AWS_S3_BUCKET_NAME')
    
    if not bucket_name:
        # Fallback to local storage if no S3 bucket configured
        logger.warning("AWS_S3_BUCKET_NAME not set, falling back to local storage")
        from flask import current_app
        secure_name = secure_filename(filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'uploads', secure_name)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        
        # Need to save the file
        file_obj.save(upload_path)
        return f"/static/uploads/{secure_name}"

    try:
        s3 = get_s3_client()
        # Generate a unique filename to prevent collisions
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        unique_filename = f"{uuid.uuid4().hex}.{ext}" if ext else uuid.uuid4().hex
        
        # Upload to S3
        s3.upload_fileobj(
            file_obj,
            bucket_name,
            unique_filename,
            ExtraArgs={
                "ContentType": file_obj.content_type
            }
        )
        
        # Generate the public URL
        region = os.environ.get('AWS_REGION', 'us-east-1')
        return f"https://{bucket_name}.s3.{region}.amazonaws.com/{unique_filename}"
        
    except Exception as e:
        logger.error(f"Error uploading to S3: {str(e)}")
        raise e
