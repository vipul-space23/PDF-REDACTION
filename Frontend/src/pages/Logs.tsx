
import { Database, Filter, Download, Clock, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Logs() {
  // Sample log data
  const logs = [
    {
      id: 'log-001',
      timestamp: '2023-06-15 10:32:45',
      action: 'File Upload',
      file: 'Financial_Report_2023.pdf',
      user: 'admin@example.com',
      status: 'success',
      hash: '0x7e9f4e8a2d1c3b5a...',
    },
    {
      id: 'log-002',
      timestamp: '2023-06-15 10:33:12',
      action: 'PII Scan',
      file: 'Financial_Report_2023.pdf',
      user: 'admin@example.com',
      status: 'alert',
      hash: '0x5a2b3c4d9e8f7a6b...',
    },
    {
      id: 'log-003',
      timestamp: '2023-06-15 10:35:02',
      action: 'Redaction',
      file: 'Financial_Report_2023.pdf',
      user: 'admin@example.com',
      status: 'success',
      hash: '0x1a2b3c4d5e6f7g8h...',
    },
    {
      id: 'log-004',
      timestamp: '2023-06-15 11:02:18',
      action: 'File Download',
      file: 'Financial_Report_2023_Redacted.pdf',
      user: 'user1@example.com',
      status: 'success',
      hash: '0x8h7g6f5e4d3c2b1a...',
    },
    {
      id: 'log-005',
      timestamp: '2023-06-15 11:45:33',
      action: 'File Upload',
      file: 'Employee_Directory.docx',
      user: 'admin@example.com',
      status: 'success',
      hash: '0x9a8b7c6d5e4f3g2h...',
    },
    {
      id: 'log-006',
      timestamp: '2023-06-15 11:46:01',
      action: 'PII Scan',
      file: 'Employee_Directory.docx',
      user: 'admin@example.com',
      status: 'alert',
      hash: '0x2h3g4f5e6d7c8b9a...',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Blockchain Logs</h1>
        <p className="text-softWhite/70">
          Transparent record of all file operations with blockchain verification.
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-softWhite/50" />
          <Input 
            placeholder="Search logs..." 
            className="pl-10 bg-cyberBlue/30 border-neonGreen/20 w-full md:w-80"
          />
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center border-neonGreen/20 text-softWhite hover:border-neonGreen hover:text-neonGreen">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center border-neonGreen/20 text-softWhite hover:border-neonGreen hover:text-neonGreen">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="glass-card rounded-lg overflow-hidden border border-neonGreen/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-darkGrey/70 border-b border-neonGreen/20">
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">Timestamp</th>
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">Action</th>
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">File</th>
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">User</th>
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">Status</th>
                <th className="py-3 px-4 text-softWhite/70 font-medium text-sm">Blockchain Hash</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-cyberBlue/30 hover:bg-cyberBlue/20">
                  <td className="py-3 px-4 flex items-center">
                    <Clock className="h-3 w-3 text-softWhite/50 mr-2" />
                    <span className="text-sm text-softWhite/90">{log.timestamp}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-softWhite/90">{log.action}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-softWhite/90">{log.file}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-softWhite/90">{log.user}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      log.status === 'success' 
                        ? 'bg-neonGreen/20 text-neonGreen' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {log.status === 'alert' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {log.status === 'success' ? 'Success' : 'Alert'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-softWhite/70 font-mono">{log.hash}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex items-center justify-between bg-darkGrey/30 border-t border-neonGreen/20">
          <p className="text-sm text-softWhite/70">Showing 6 of 124 records</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-neonGreen/20 text-softWhite/70">Previous</Button>
            <Button variant="outline" size="sm" className="border-neonGreen/20 text-neonGreen">Next</Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 rounded-lg bg-darkGrey/50 border border-neonGreen/20 flex items-center">
        <Database className="h-5 w-5 text-cyberPurple mr-3" />
        <div>
          <h3 className="text-sm font-medium">Blockchain Verification</h3>
          <p className="text-xs text-softWhite/70 mt-1">
            All operations are logged with a cryptographic hash on a private blockchain for immutable record-keeping
            and GDPR compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
