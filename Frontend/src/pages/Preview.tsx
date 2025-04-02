import { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, Shield, FileText, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf'; // Import react-pdf
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Preview() {
  const [redactionLevel, setRedactionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; piiCount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string | null>(null);
  const [redactedText, setRedactedText] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load file info from sessionStorage or location state
  useEffect(() => {
    const storedFile = sessionStorage.getItem('currentFile');
    if (storedFile) {
      setFileInfo(JSON.parse(storedFile));
    }

    // Get file ID and filename from navigation state (passed from FileUploader)
    const { fileId, fileName } = location.state || {};
    if (fileId && fileName) {
      const pdfUrl = `http://localhost:8000/file/${fileId}/${fileName}`;
      setOriginalPdfUrl(pdfUrl);

      // Optionally fetch extracted text for redaction preview
      fetchExtractedText(fileId, fileName);
    }
  }, [location.state]);

  // Fetch extracted text from the backend (assuming an endpoint exists)
  const fetchExtractedText = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/extract-text/${fileId}/${fileName}`);
      const data = await response.json();
      if (data.status === 'success' && data.text) {
        setRedactedText(data.text); // Use this as the base for redaction
      }
    } catch (error) {
      console.error('Error fetching extracted text:', error);
      toast.error('Failed to load PDF text for redaction.');
    }
  };

  // Redact text based on level (simplified for demo; ideally done server-side)
  const getRedactedText = () => {
    if (!redactedText) return 'Loading...';
    let result = redactedText;

    if (redactionLevel === 'low') {
      result = result
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****'); // Credit Card
    } else if (redactionLevel === 'medium') {
      result = result
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****') // Credit Card
        .replace(/\(\d{3}\) \d{3}-\d{4}/g, '(***) ***-****') // Phone
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]'); // Email
    } else {
      result = result
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****') // Credit Card
        .replace(/\(\d{3}\) \d{3}-\d{4}/g, '(***) ***-****') // Phone
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]') // Email
        .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[REDACTED_NAME]') // Simple name redaction
        .replace(/\d+ [A-Za-z]+ Street, [A-Za-z]+, [A-Z]{2} \d{5}/g, '[REDACTED_ADDRESS]'); // Address
    }
    return result;
  };

  const getRedactionStats = () => {
    if (!redactedText) return { total: 0, redacted: 0, privacy: 'N/A', instances: 0 };
    const total = redactedText.split(/\s+/).length;
    const redactedMatches = redactedText.match(/\d{3}-\d{2}-\d{4}|\d{4}-\d{4}-\d{4}-\d{4}|\(\d{3}\) \d{3}-\d{4}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
    return {
      total,
      redacted: redactedMatches.length,
      privacy: redactionLevel === 'low' ? 'Basic' : redactionLevel === 'medium' ? 'Standard' : 'Maximum',
      instances: redactionLevel === 'low' ? 2 : redactionLevel === 'medium' ? 4 : 8,
    };
  };

  const handleApplyRedaction = async () => {
    setProcessing(true);
    const { fileId, fileName } = location.state || {};
    if (!fileId || !fileName) {
      toast.error('No file information available.');
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/redact/${fileId}/${fileName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redactionLevel }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Redaction applied successfully!');
        sessionStorage.setItem('redactionLevel', redactionLevel);
        navigate('/upload');
      } else {
        toast.error('Failed to apply redaction.');
      }
    } catch (error) {
      console.error('Error applying redaction:', error);
      toast.error('Error applying redaction.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToUpload = () => {
    navigate('/upload');
  };

  const stats = getRedactionStats();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and File Info */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#00F6FF]/10 to-[#A74FFF]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-[#A74FFF]/10 to-[#00F6FF]/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gradient">Redaction Preview</h1>
            <p className="text-[#A3A3A3] max-w-xl">
              Preview how your document will look after PII redaction with different security levels.
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToUpload}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>
        </div>

        {fileInfo && (
          <div className="mt-4 p-3 bg-[rgba(10,25,47,0.4)] rounded-lg border border-[#00F6FF]/10">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-[#00F6FF] mr-2" />
              <span className="font-medium">{fileInfo.name}</span>
              <span className="ml-2 text-sm text-[#A3A3A3]">({(fileInfo.size / 1024).toFixed(1)} KB)</span>
              <div className="ml-4 px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {fileInfo.piiCount} PII Found
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Redaction Level Selector */}
      <div className="flex flex-wrap items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-6">
        <span className="text-sm font-medium bg-[#00F6FF]/10 px-3 py-1 rounded-full text-[#00F6FF] w-full md:w-auto">Redaction Level:</span>
        <div className="flex rounded-full overflow-hidden border border-[#00F6FF]/20 bg-[rgba(255,255,255,0.04)] backdrop-blur-md">
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${redactionLevel === 'low' ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' : 'text-[#A3A3A3] hover:text-[#F5F5F5]'}`}
            onClick={() => setRedactionLevel('low')}
          >
            Low
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${redactionLevel === 'medium' ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' : 'text-[#A3A3A3] hover:text-[#F5F5F5]'}`}
            onClick={() => setRedactionLevel('medium')}
          >
            Medium
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${redactionLevel === 'high' ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' : 'text-[#A3A3A3] hover:text-[#F5F5F5]'}`}
            onClick={() => setRedactionLevel('high')}
          >
            High
          </button>
        </div>
      </div>

      {/* Original and Redacted Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Document */}
        <div className="neo-blur rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="bg-[rgba(10,25,47,0.8)] backdrop-blur-md border-b border-[#00F6FF]/20 py-3 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-[#00F6FF] mr-2" />
              <h3 className="font-medium text-[#F5F5F5]">Original Document</h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#00F6FF]/10 hover:text-[#00F6FF]">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#00F6FF]/10 hover:text-[#00F6FF]">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-[rgba(10,25,47,0.4)] h-80 overflow-auto text-left">
            {originalPdfUrl ? (
              <Document
                file={originalPdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="text-[#F5F5F5]/90">Loading PDF...</div>}
              >
                <Page pageNumber={1} height={300} />
              </Document>
            ) : (
              <div className="text-[#F5F5F5]/90">No PDF uploaded.</div>
            )}
          </div>
        </div>

        {/* Redacted Document */}
        <div className="neo-blur rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="bg-[rgba(10,25,47,0.8)] backdrop-blur-md border-b border-[#A74FFF]/20 py-3 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-[#A74FFF] mr-2" />
              <h3 className="font-medium text-[#F5F5F5]">Redacted Document</h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#A74FFF]/10 hover:text-[#A74FFF]">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#A74FFF]/10 hover:text-[#A74FFF]">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-[rgba(10,25,47,0.4)] h-80 overflow-auto text-left relative scan-effect">
            <pre className="whitespace-pre-wrap font-inter text-sm text-[#F5F5F5]/90">
              {getRedactedText()}
            </pre>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#A3A3A3] text-sm">Total Words</p>
          <p className="text-2xl font-bold text-[#F5F5F5] mt-1">{stats.total}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#A3A3A3] text-sm">Redacted Items</p>
          <p className="text-2xl font-bold text-[#00FF9F] mt-1">{stats.instances}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#A3A3A3] text-sm">Privacy Level</p>
          <p className="text-2xl font-bold text-[#A74FFF] mt-1">{stats.privacy}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#A3A3A3] text-sm">PII Types</p>
          <p className="text-2xl font-bold text-[#F5F5F5] mt-1">
            {redactionLevel === 'low' ? '2' : redactionLevel === 'medium' ? '4' : '8'}
          </p>
        </div>
      </div>

      {/* Apply Redaction Button */}
      <div className="flex justify-center mt-8">
        <Button
          className="relative overflow-hidden bg-gradient-to-r from-[#00F6FF] to-[#007BFF] text-black font-medium"
          onClick={handleApplyRedaction}
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Apply Redaction
            </>
          )}
        </Button>
      </div>
    </div>
  );
}