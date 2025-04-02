from fastapi import APIRouter, UploadFile, File
from storage.supabase_client import upload_to_supabase

router = APIRouter()

BUCKET_NAME = "documents"  # Change this to your Supabase bucket name

@router.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        file_url = upload_to_supabase(BUCKET_NAME, file.filename, file_bytes)

        if file_url:
            return {"message": "File uploaded successfully", "file_url": file_url}
        else:
            return {"message": "File upload failed", "error": "Supabase storage error"}

    except Exception as e:
        return {"message": "Error processing file", "error": str(e)}
