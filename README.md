# 🛡️ SafeDoc — Intelligent PII Detection & Masking

An AI-powered web application that automatically detects and masks Personally Identifiable Information (PII) in documents such as Aadhaar, PAN, and other IDs. Built to enhance document privacy, security, and regulatory compliance.

---

## 📌 Features

- 🔍 AI-based **PII detection** using NLP (e.g., names, addresses, Aadhaar, PAN)
- 📝 **Supports PDFs, text files, and images**
- 🎭 **Automatic redaction/masking** of sensitive data
- 🔐 **AES-256 encryption** for secure document handling
- ☁️ **Secure file storage** with Supabase
- ✅ **Manual redaction review** and download of redacted files
- 🛡️ **Compliance-ready** (GDPR, DPDP, etc.)
- 🔗 **Optional blockchain logging** for audit trails

---

## 🚀 Tech Stack

### Frontend
- **Next.js** – React framework for fast SSR
- **Tailwind CSS** – Utility-first styling
- **Material UI** – Prebuilt design components
- **PDF.js** – PDF rendering
- **FilePond.js** – Drag-and-drop file uploads

### Backend
- **Python + FastAPI** – High-performance backend
- **SpaCy** – NLP-based PII detection
- **PDFPlumber** – Text extraction from PDFs
- **Tesseract OCR** – Text extraction from images (if needed)

### Storage & Security
- **Supabase** – Real-time DB and secure file storage
- **AES-256 Encryption** – Local file encryption
- **JWT** – Authentication
- **HTTPS** – Secure communication

---

## 🧠 How It Works

1. Users upload a document (PDF/image/text).
2. Text is extracted and analyzed using AI (SpaCy).
3. PII is detected and automatically redacted.
4. Encrypted redacted file is saved securely.
5. User reviews and downloads the final safe document.

---

## 📂 Folder Structure

📁 SafeDoc
├── frontend/ # Next.js frontend
├── backend/ # FastAPI backend
├── models/ # NLP models and redaction logic
├── utils/ # Helpers for encryption, validation, etc.
└── README.md # You’re here!


---

## ⚙️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/SafeDoc.git
cd SafeDoc

2. Install Frontend Dependencies
cd frontend
npm install

3. Install Backend Dependencies
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm


▶️ Running the App
Start Backend (FastAPI)
uvicorn main:app --reload
Start Frontend (Next.js)
npm run dev
```

---

## 🛡️ Security & Compliance

- 🔒 Documents are encrypted locally before upload (**AES-256** encryption).
- 🚫 PII is never stored in plain text during or after processing.
- 🔗 Optional **blockchain logging** for immutable audit trails.
- 📜 Helps comply with **GDPR**, **India’s DPDP**, and other privacy laws.

---

## 💡 Future Enhancements

- 🧠 Train custom AI model for more accurate Indian document detection.
- 🌐 Add **multilingual PII detection** for non-English documents.
- 📜 Implement **role-based access control** for multi-user environments.
- 🔗 Integrate with external **cloud storage** (e.g., Google Drive, Dropbox).

---

## 📸 Screenshots

| Upload Page | Redaction Preview | Final Output |
|-------------|-------------------|--------------|
| ![Upload](screenshots/upload.png) | ![Preview](screenshots/preview.png) | ![Final](screenshots/final.png) |

> 📁 Place your screenshot images in the `screenshots/` folder.

---

## 👨‍💻 Authors

- **Your Name** – [@vipul-space23](https://github.com/vipul-space23)
- **Team Anon Force** – Hackathon Team

---

## 📃 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 🙌 Support

Leave a ⭐ if you like this project!  
Pull requests and contributions are always welcome 🤝

---
