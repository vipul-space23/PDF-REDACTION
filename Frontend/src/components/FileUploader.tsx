
// import React, { useState } from 'react';
// import { FilePond, registerPlugin } from 'react-filepond';
// import 'filepond/dist/filepond.min.css';
// import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// // Register FilePond plugins
// registerPlugin(FilePondPluginFileValidateType);

// interface UploadResponse {
//   status: string;
//   file_id?: string;
//   filename?: string;
//   file_path?: string;
//   message?: string;
// }

// const FileUploader: React.FC = () => {
//   const [files, setFiles] = useState<any[]>([]);
//   const [statusMessage, setStatusMessage] = useState<string | null>(null);
//   const [isPasswordRequired, setIsPasswordRequired] = useState<boolean>(false);
//   const [password, setPassword] = useState<string>('');
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [fileId, setFileId] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
//   const [downloadLink, setDownloadLink] = useState<string | null>(null);

//   // Function to handle file upload
//   const handleProcessFile = async (fileItems: any[]) => {
//     if (fileItems.length === 0) {
//       resetState();
//       return;
//     }

//     setFiles(fileItems);
//     setIsProcessing(true);
//     setStatusMessage('Uploading and checking file...');
    
//     const file = fileItems[0].file;
//     const formData = new FormData();
//     formData.append('pdf', file);

//     try {
//       const response = await fetch('http://localhost:8000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data: UploadResponse = await response.json();

//       if (data.status === 'password_required') {
//         setStatusMessage('This PDF is password-protected. Please enter the password to proceed.');
//         setIsPasswordRequired(true);
//         setFileId(data.file_id || null);
//         setFileName(data.filename || null);
//       } else if (data.status === 'ready_for_processing') {
//         setStatusMessage('PDF is ready for processing!');
//         setIsPasswordRequired(false);
//         setIsDecrypted(true);
//         setFileId(data.file_id || null);
//         setFileName(data.filename || null);
        
//         if (data.file_id && data.filename) {
//           setDownloadLink(`http://localhost:8000/file/${data.file_id}/${data.filename}`);
//         }
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       setStatusMessage('Error uploading file. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Function to handle password submission
//   const handlePasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!fileId || !fileName) return;

//     setIsProcessing(true);
//     setStatusMessage('Decrypting PDF...');

//     const formData = new FormData();
//     formData.append('file_id', fileId);
//     formData.append('filename', fileName);
//     formData.append('password', password);

//     try {
//       const response = await fetch('http://localhost:8000/decrypt', {
//         method: 'POST',
//         body: formData,
//       });

//       const data: UploadResponse = await response.json();

//       if (data.status === 'decrypted') {
//         setStatusMessage('PDF successfully decrypted and ready for processing!');
//         setIsPasswordRequired(false);
//         setIsDecrypted(true);
        
//         if (data.file_id && data.filename) {
//           setDownloadLink(`http://localhost:8000/file/${data.file_id}/${data.filename}`);
//         }
//       } else if (data.status === 'wrong_password') {
//         setStatusMessage('Incorrect password. Please try again.');
//         setPassword('');
//       } else {
//         setStatusMessage(data.message || 'Failed to decrypt PDF. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting password:', error);
//       setStatusMessage('Error processing password. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Reset all state when starting over
//   const resetState = () => {
//     setStatusMessage(null);
//     setIsPasswordRequired(false);
//     setIsDecrypted(false);
//     setPassword('');
//     setFileId(null);
//     setFileName(null);
//     setDownloadLink(null);
    
//     // Clean up files on the server if we have a file ID
//     if (fileId && fileName) {
//       fetch(`http://localhost:8000/file/${fileId}/${fileName}`, {
//         method: 'DELETE',
//       }).catch(error => {
//         console.error('Error cleaning up files:', error);
//       });
//     }
//   };

//   // Proceed to next step after successful upload/decryption
//   const handleProceedToAnalysis = () => {
//     // Here you would implement the next steps in your workflow
//     setStatusMessage('Proceeding to PII analysis...');
    
//     // This is where you'd navigate to the next step or change the UI state
//     // For example: router.push(`/analyze?fileId=${fileId}&fileName=${fileName}`);
//   };

//   return (
//     <div className="space-y-6">
//       <FilePond
//         files={files}
//         onupdatefiles={handleProcessFile}
//         allowMultiple={false}
//         acceptedFileTypes={['application/pdf']}
//         labelIdle='Drag & Drop your PDF or <span class="filepond--label-action">Browse</span>'
//         disabled={isProcessing}
//       />

//       {statusMessage && (
//         <div className={`p-4 rounded-md ${isDecrypted ? 'bg-green-800/30 text-green-400' : 'bg-blue-800/30 text-blue-300'}`}>
//           <p>{statusMessage}</p>
//         </div>
//       )}

//       {isProcessing && (
//         <div className="flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neonGreen"></div>
//           <span className="ml-2 text-softWhite/70">Processing...</span>
//         </div>
//       )}

//       {isPasswordRequired && (
//         <form onSubmit={handlePasswordSubmit} className="mt-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="password"
//               placeholder="Enter PDF Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="flex-grow px-4 py-2 bg-darkGrey border border-neonGreen/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neonGreen/50"
//               disabled={isProcessing}
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-neonGreen text-black font-medium rounded-md hover:bg-neonGreen/80 transition-colors disabled:opacity-50"
//               disabled={isProcessing || !password}
//             >
//               Decrypt PDF
//             </button>
//           </div>
//         </form>
//       )}

//       {isDecrypted && (
//         <div className="flex flex-col sm:flex-row gap-3">
//           {downloadLink && (
//             <a
//               href={downloadLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-center"
//             >
//               View Decrypted PDF
//             </a>
//           )}
//           <button
//             onClick={handleProceedToAnalysis}
//             className="px-4 py-2 bg-neonGreen text-black font-medium rounded-md hover:bg-neonGreen/80 transition-colors"
//           >
//             Proceed to PII Analysis
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUploader;
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Register FilePond plugins
registerPlugin(FilePondPluginFileValidateType);

interface UploadResponse {
  status: string;
  file_id?: string;
  filename?: string;
  file_path?: string;
  message?: string;
}

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPasswordRequired, setIsPasswordRequired] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle file upload
  const handleProcessFile = async (fileItems: any[]) => {
    if (fileItems.length === 0) {
      resetState();
      return;
    }

    setFiles(fileItems);
    setIsProcessing(true);
    setStatusMessage('Uploading and checking file...');
    
    const file = fileItems[0].file;
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.status === 'password_required') {
        setStatusMessage('This PDF is password-protected. Please enter the password to proceed.');
        setIsPasswordRequired(true);
        setFileId(data.file_id || null);
        setFileName(data.filename || null);
      } else if (data.status === 'ready_for_processing') {
        setStatusMessage('PDF is ready for processing!');
        setIsPasswordRequired(false);
        setIsDecrypted(true);
        setFileId(data.file_id || null);
        setFileName(data.filename || null);
        
        if (data.file_id && data.filename) {
          setDownloadLink(`http://localhost:8000/file/${data.file_id}/${data.filename}`);
          // Store file info in sessionStorage for Preview.tsx
          sessionStorage.setItem('currentFile', JSON.stringify({
            name: data.filename,
            size: file.size,
            piiCount: 0, // Update this if backend provides PII count
          }));
          // Navigate to Preview.tsx with file data
          navigate('/preview', { state: { fileId: data.file_id, fileName: data.filename } });
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatusMessage('Error uploading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileId || !fileName) return;

    setIsProcessing(true);
    setStatusMessage('Decrypting PDF...');

    const formData = new FormData();
    formData.append('file_id', fileId);
    formData.append('filename', fileName);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/decrypt', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.status === 'decrypted') {
        setStatusMessage('PDF successfully decrypted and ready for processing!');
        setIsPasswordRequired(false);
        setIsDecrypted(true);
        
        if (data.file_id && data.filename) {
          setDownloadLink(`http://localhost:8000/file/${data.file_id}/${data.filename}`);
          // Store file info in sessionStorage for Preview.tsx
          sessionStorage.setItem('currentFile', JSON.stringify({
            name: data.filename,
            size: files[0].file.size,
            piiCount: 0, // Update this if backend provides PII count
          }));
          // Navigate to Preview.tsx with file data
          navigate('/preview', { state: { fileId: data.file_id, fileName: data.filename } });
        }
      } else if (data.status === 'wrong_password') {
        setStatusMessage('Incorrect password. Please try again.');
        setPassword('');
      } else {
        setStatusMessage(data.message || 'Failed to decrypt PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting password:', error);
      setStatusMessage('Error processing password. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset all state when starting over
  const resetState = () => {
    setStatusMessage(null);
    setIsPasswordRequired(false);
    setIsDecrypted(false);
    setPassword('');
    setFileId(null);
    setFileName(null);
    setDownloadLink(null);
    
    if (fileId && fileName) {
      fetch(`http://localhost:8000/file/${fileId}/${fileName}`, {
        method: 'DELETE',
      }).catch(error => {
        console.error('Error cleaning up files:', error);
      });
    }
  };

  // Proceed to next step after successful upload/decryption
  const handleProceedToAnalysis = () => {
    if (fileId && fileName) {
      navigate('/preview', { state: { fileId, fileName } });
    } else {
      setStatusMessage('No file available for analysis.');
    }
  };

  return (
    <div className="space-y-6">
      <FilePond
        files={files}
        onupdatefiles={handleProcessFile}
        allowMultiple={false}
        acceptedFileTypes={['application/pdf']}
        labelIdle='Drag & Drop your PDF or <span class="filepond--label-action">Browse</span>'
        disabled={isProcessing}
      />

      {statusMessage && (
        <div className={`p-4 rounded-md ${isDecrypted ? 'bg-green-800/30 text-green-400' : 'bg-blue-800/30 text-blue-300'}`}>
          <p>{statusMessage}</p>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neonGreen"></div>
          <span className="ml-2 text-softWhite/70">Processing...</span>
        </div>
      )}

      {isPasswordRequired && (
        <form onSubmit={handlePasswordSubmit} className="mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="Enter PDF Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-grow px-4 py-2 bg-darkGrey border border-neonGreen/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neonGreen/50"
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-neonGreen text-black font-medium rounded-md hover:bg-neonGreen/80 transition-colors disabled:opacity-50"
              disabled={isProcessing || !password}
            >
              Decrypt PDF
            </button>
          </div>
        </form>
      )}

      {isDecrypted && (
        <div className="flex flex-col sm:flex-row gap-3">
          {downloadLink && (
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              View Decrypted PDF
            </a>
          )}
          <button
            onClick={handleProceedToAnalysis}
            className="px-4 py-2 bg-neonGreen text-black font-medium rounded-md hover:bg-neonGreen/80 transition-colors"
          >
            Proceed to PII Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;