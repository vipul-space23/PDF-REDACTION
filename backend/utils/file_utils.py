import os

def ensure_temp_dir_exists(upload_dir: str):
    """Ensure that the upload directory exists."""
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
