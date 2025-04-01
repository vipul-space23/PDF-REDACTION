
import { File, Eye, Download, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileCardProps {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  piiCount: number;
  status: 'clean' | 'redacted' | 'flagged';
  previewUrl?: string;
}

export default function FileCard({
  fileName,
  fileSize,
  uploadDate,
  piiCount,
  status,
  previewUrl
}: FileCardProps) {
  return (
    <div className="glass-card rounded-lg p-4 animate-fade-in hover:border-neonGreen/40 transition-all">
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-2 rounded-lg",
          status === 'clean' ? 'bg-green-500/10 text-green-500' : 
          status === 'redacted' ? 'bg-blue-500/10 text-blue-500' : 
          'bg-yellow-500/10 text-yellow-500'
        )}>
          <File size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-softWhite">{fileName}</h3>
          <div className="flex items-center mt-1 text-xs text-softWhite/70 space-x-3">
            <span>{fileSize}</span>
            <span className="h-1 w-1 rounded-full bg-softWhite/50"></span>
            <span>{uploadDate}</span>
          </div>
          
          <div className="flex items-center mt-3">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
              status === 'clean' ? 'bg-green-500/10 text-green-500' : 
              status === 'redacted' ? 'bg-blue-500/10 text-blue-500' : 
              'bg-yellow-500/10 text-yellow-500'
            )}>
              {status === 'clean' ? <CheckCircle size={12} /> : 
               status === 'redacted' ? <CheckCircle size={12} /> : 
               <AlertTriangle size={12} />}
              <span>
                {status === 'clean' ? 'PII Free' : 
                 status === 'redacted' ? `${piiCount} PII Redacted` : 
                 `${piiCount} PII Found`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyberBlue hover:text-neonGreen">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyberBlue hover:text-neonGreen">
            <Download size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyberBlue hover:text-red-500">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
