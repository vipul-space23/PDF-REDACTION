import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from io import BytesIO

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a text-based PDF using PyMuPDF."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_image_pdf(pdf_path: str) -> str:
    """Extract text from an image-based PDF using Tesseract OCR."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        # Convert page to an image
        pix = page.get_pixmap()
        img = Image.open(BytesIO(pix.tobytes()))
        
        # Use Tesseract to extract text from the image
        text += pytesseract.image_to_string(img)
    return text
