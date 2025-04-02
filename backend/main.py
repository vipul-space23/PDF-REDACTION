# # app/main.py
# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# from PyPDF2 import PdfReader, PdfWriter
# from io import BytesIO
# import os

# app = FastAPI()

# UPLOAD_DIR = './temp_files/'

# # Ensure the temporary directory exists
# if not os.path.exists(UPLOAD_DIR):
#     os.makedirs(UPLOAD_DIR)

# @app.post("/upload")
# async def upload_pdf(pdf: UploadFile = File(...)):
#     pdf_path = os.path.join(UPLOAD_DIR, f"temp_{pdf.filename}")
    
#     # Save the uploaded file to disk temporarily
#     with open(pdf_path, "wb") as file:
#         file.write(await pdf.read())

#     # Check if PDF is password protected
#     is_password_protected = check_pdf_password(pdf_path)

#     if is_password_protected:
#         return JSONResponse(content={"status": "password_required"}, status_code=200)
#     else:
#         return JSONResponse(content={"status": "ready_for_processing"}, status_code=200)

# def check_pdf_password(pdf_path: str) -> bool:
#     """Check if the PDF is password-protected."""
#     try:
#         with open(pdf_path, 'rb') as f:
#             pdf_reader = PdfReader(f)
#             if pdf_reader.is_encrypted:
#                 return True
#         return False
#     except Exception as e:
#         return False

# @app.post("/decrypt")
# async def decrypt_pdf(pdf: UploadFile = File(...), password: str = ""):
#     """Attempt to decrypt the PDF with the given password."""
#     pdf_path = os.path.join(UPLOAD_DIR, f"temp_{pdf.filename}")
    
#     with open(pdf_path, "wb") as file:
#         file.write(await pdf.read())
    
#     try:
#         with open(pdf_path, 'rb') as f:
#             pdf_reader = PdfReader(f)
#             if pdf_reader.is_encrypted:
#                 # Try decrypting with the provided password
#                 pdf_reader.decrypt(password)
                
#                 # If successful, save the decrypted PDF
#                 pdf_writer = PdfWriter()
#                 for page_num in range(len(pdf_reader.pages)):
#                     pdf_writer.add_page(pdf_reader.pages[page_num])

#                 decrypted_pdf_path = pdf_path.replace(".pdf", "_decrypted.pdf")
#                 with open(decrypted_pdf_path, "wb") as decrypted_pdf:
#                     pdf_writer.write(decrypted_pdf)
                
#                 return JSONResponse(content={"status": "decrypted"}, status_code=200)
#             else:
#                 return JSONResponse(content={"status": "not_encrypted"}, status_code=200)
#     except Exception as e:
#         return JSONResponse(content={"status": "failed_to_decrypt", "message": str(e)}, status_code=500)
    # app/main.py
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader, PdfWriter
from io import BytesIO
import os
import uuid
import shutil

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = './temp_files/'

# Ensure the temporary directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...)):
    # Generate unique filename to prevent collisions
    unique_id = str(uuid.uuid4())
    original_filename = pdf.filename
    pdf_path = os.path.join(UPLOAD_DIR, f"{unique_id}_{original_filename}")
    
    # Save the uploaded file to disk temporarily
    with open(pdf_path, "wb") as file:
        file.write(await pdf.read())

    # Check if PDF is password protected
    is_password_protected = check_pdf_password(pdf_path)

    if is_password_protected:
        return JSONResponse(
            content={
                "status": "password_required", 
                "file_id": unique_id,
                "filename": original_filename
            }, 
            status_code=200
        )
    else:
        return JSONResponse(
            content={
                "status": "ready_for_processing", 
                "file_id": unique_id,
                "filename": original_filename,
                "file_path": pdf_path
            }, 
            status_code=200
        )

def check_pdf_password(pdf_path: str) -> bool:
    """Check if the PDF is password-protected."""
    try:
        with open(pdf_path, 'rb') as f:
            pdf_reader = PdfReader(f)
            if pdf_reader.is_encrypted:
                return True
        return False
    except Exception as e:
        print(f"Error checking PDF password: {str(e)}")
        return False

@app.post("/decrypt")
async def decrypt_pdf(
    file_id: str = Form(...), 
    filename: str = Form(...),
    password: str = Form(...)
):
    """Attempt to decrypt the PDF with the given password."""
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Open the encrypted PDF
        with open(pdf_path, 'rb') as f:
            pdf_reader = PdfReader(f)
            if pdf_reader.is_encrypted:
                # Try decrypting with the provided password
                if pdf_reader.decrypt(password) == 0:
                    return JSONResponse(
                        content={"status": "wrong_password"}, 
                        status_code=400
                    )
                
                # Create decrypted version
                pdf_writer = PdfWriter()
                for page_num in range(len(pdf_reader.pages)):
                    pdf_writer.add_page(pdf_reader.pages[page_num])
                
                # Save to a new file path that indicates it's decrypted
                decrypted_pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}_decrypted_{filename}")
                with open(decrypted_pdf_path, "wb") as decrypted_pdf:
                    pdf_writer.write(decrypted_pdf)
                
                return JSONResponse(
                    content={
                        "status": "decrypted",
                        "file_id": file_id,
                        "filename": filename,
                        "file_path": decrypted_pdf_path
                    }, 
                    status_code=200
                )
            else:
                return JSONResponse(
                    content={"status": "not_encrypted"}, 
                    status_code=200
                )
    except Exception as e:
        return JSONResponse(
            content={"status": "failed_to_decrypt", "message": str(e)}, 
            status_code=500
        )

@app.get("/file/{file_id}/{filename}")
async def get_file(file_id: str, filename: str):
    """Retrieve the processed PDF file."""
    # First check if a decrypted version exists
    decrypted_path = os.path.join(UPLOAD_DIR, f"{file_id}_decrypted_{filename}")
    
    if os.path.exists(decrypted_path):
        return FileResponse(
            decrypted_path, 
            media_type="application/pdf", 
            filename=filename
        )
    
    # If not, check for the original
    original_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")
    
    if os.path.exists(original_path):
        return FileResponse(
            original_path, 
            media_type="application/pdf", 
            filename=filename
        )
    
    raise HTTPException(status_code=404, detail="File not found")

@app.delete("/file/{file_id}/{filename}")
async def delete_file(file_id: str, filename: str):
    """Delete temporary files."""
    success = False
    
    # Try to delete original file
    original_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")
    if os.path.exists(original_path):
        os.remove(original_path)
        success = True
    
    # Try to delete decrypted file if it exists
    decrypted_path = os.path.join(UPLOAD_DIR, f"{file_id}_decrypted_{filename}")
    if os.path.exists(decrypted_path):
        os.remove(decrypted_path)
        success = True
        
    if success:
        return JSONResponse(content={"status": "files_deleted"}, status_code=200)
    else:
        raise HTTPException(status_code=404, detail="No files found to delete")

# Clean up temporary files periodically (in a production app, use a scheduled task)
@app.on_event("startup")
async def cleanup_temp_files():
    """Clean up any leftover temporary files on startup."""
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")