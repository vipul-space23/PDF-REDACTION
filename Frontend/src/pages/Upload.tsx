
  import FileUploader from '@/components/FileUploader';

  export default function Upload() {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Upload Files</h1>
          <p className="text-softWhite/70">
            Upload documents to scan for personally identifiable information (PII). 
            Our AI will automatically detect and flag sensitive data.
          </p>
        </div>
        
        <div className="glass-card rounded-lg p-6">
          <FileUploader />
        </div>
        
        <div className="mt-8 bg-darkGrey/50 rounded-lg p-4 border border-neonGreen/20">
          <h3 className="font-semibold text-neonGreen mb-2 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-neonGreen mr-2"></span>
            Privacy First Approach
          </h3>
          <p className="text-sm text-softWhite/70">
            All scanning happens locally on your device. Your sensitive documents never leave your computer,
            ensuring maximum security and privacy compliance.
          </p>
        </div>
      </div>
    );
  }
