
import { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [processingResults, setProcessingResults] = useState<Record<string, {status: 'clean' | 'flagged', count: number}>>({});
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Only accept txt, pdf, docx, doc files
    const validFiles = newFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['txt', 'pdf', 'docx', 'doc'].includes(extension || '');
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file types",
        description: "Only .txt, .pdf, .docx, and .doc files are supported",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      
      // Simulate processing each file
      validFiles.forEach(file => {
        simulateProcessing(file);
      });
    }
  };

  const simulateProcessing = (file: File) => {
    setProcessing(prev => ({ ...prev, [file.name]: true }));
    
    // Simulate AI processing time
    setTimeout(() => {
      // Randomly determine if the file has PII
      const hasPII = Math.random() > 0.5;
      const piiCount = hasPII ? Math.floor(Math.random() * 10) + 1 : 0;
      
      setProcessingResults(prev => ({
        ...prev, 
        [file.name]: {
          status: piiCount > 0 ? 'flagged' : 'clean',
          count: piiCount
        }
      }));
      
      setProcessing(prev => ({ ...prev, [file.name]: false }));
      
      toast({
        title: piiCount > 0 ? "PII Detected" : "File is Clean",
        description: piiCount > 0 
          ? `Found ${piiCount} instances of PII in ${file.name}`
          : `No PII found in ${file.name}`,
        variant: piiCount > 0 ? "destructive" : "default"
      });
    }, 2000);
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    // Also remove from processing and results
    setProcessing(prev => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });
    
    setProcessingResults(prev => {
      const newState = { ...prev };
      delete newState[fileName];
      return newState;
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
    setProcessing({});
    setProcessingResults({});
  };

  return (
    <div className="space-y-6">
      <div 
        className={cn("upload-zone", dragging && "border-neonGreen bg-cyberBlue/50")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-neonGreen mb-4" />
          <h3 className="text-xl font-semibold text-softWhite mb-2">Drag & Drop Files</h3>
          <p className="text-softWhite/70 text-sm mb-4">
            or click to upload .txt, .pdf, .docx, .doc files
          </p>
          <input
            type="file"
            className="hidden"
            id="fileInput"
            onChange={handleFileInput}
            multiple
            accept=".txt,.pdf,.docx,.doc"
          />
          <Button 
            onClick={() => document.getElementById('fileInput')?.click()}
            className="neon-button"
          >
            Browse Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Uploaded Files ({files.length})</h3>
            <Button 
              variant="ghost"
              size="sm"
              onClick={clearAllFiles}
              className="text-softWhite/70 hover:text-neonGreen"
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {files.map((file) => (
              <div 
                key={file.name} 
                className={cn(
                  "flex items-center justify-between bg-cyberBlue/30 rounded-lg p-3 border",
                  processing[file.name] ? "border-cyberPurple/50 scan-effect" : 
                  processingResults[file.name]?.status === 'flagged' ? "border-red-500/50" : 
                  processingResults[file.name]?.status === 'clean' ? "border-neonGreen/50" : 
                  "border-softWhite/10"
                )}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-softWhite/70" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-softWhite/50">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processing[file.name] && (
                    <div className="flex items-center text-cyberPurple">
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      <span className="text-xs">Scanning</span>
                    </div>
                  )}
                  
                  {processingResults[file.name] && !processing[file.name] && (
                    <div className={cn(
                      "flex items-center text-xs rounded-full px-2 py-1",
                      processingResults[file.name].status === 'flagged' 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-green-500/10 text-green-500"
                    )}>
                      {processingResults[file.name].status === 'flagged' ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span>{processingResults[file.name].count} PII Found</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span>Clean</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => removeFile(file.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-cyberBlue">
            <Button 
              className="w-full bg-neonGreen text-cyberBlue hover:bg-neonGreen/90"
              disabled={!files.length || Object.keys(processing).some(k => processing[k])}
            >
              Process All Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
