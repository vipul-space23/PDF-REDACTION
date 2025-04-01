
import { FileText, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import SummaryCard from '@/components/SummaryCard';
import FileCard from '@/components/FileCard';

export default function Dashboard() {
  // Sample data for dashboard
  const summaryData = [
    { 
      title: 'Total Files', 
      value: '128', 
      icon: <FileText className="h-5 w-5 text-neonGreen" />,
      trend: 'up' as const,
      trendValue: '12% from last month'
    },
    { 
      title: 'PII Instances Detected', 
      value: '1,432', 
      icon: <ShieldAlert className="h-5 w-5 text-cyberPurple" />,
      trend: 'down' as const,
      trendValue: '8% from last month'
    },
    { 
      title: 'Last Scan', 
      value: '2 mins ago', 
      icon: <Clock className="h-5 w-5 text-softWhite" />,
      trend: 'neutral' as const,
      trendValue: 'Running on schedule'
    },
    { 
      title: 'Critical Alerts', 
      value: '3', 
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      trend: 'up' as const,
      trendValue: '2 new alerts'
    }
  ];

  const recentFiles = [
    {
      fileName: 'Financial_Report_2023.pdf',
      fileSize: '1.2 MB',
      uploadDate: 'Today at 10:45 AM',
      piiCount: 23,
      status: 'redacted' as const
    },
    {
      fileName: 'Employee_Directory.docx',
      fileSize: '458 KB',
      uploadDate: 'Today at 09:12 AM',
      piiCount: 47,
      status: 'flagged' as const
    },
    {
      fileName: 'Project_Proposal.pdf',
      fileSize: '682 KB',
      uploadDate: 'Yesterday at 3:30 PM',
      piiCount: 0,
      status: 'clean' as const
    },
    {
      fileName: 'Customer_Feedback.txt',
      fileSize: '124 KB',
      uploadDate: 'Yesterday at 1:15 PM',
      piiCount: 5,
      status: 'redacted' as const
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Security Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
              trend={item.trend}
              trendValue={item.trendValue}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Files</h2>
          <button className="text-sm text-neonGreen hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {recentFiles.map((file, index) => (
            <FileCard
              key={index}
              fileName={file.fileName}
              fileSize={file.fileSize}
              uploadDate={file.uploadDate}
              piiCount={file.piiCount}
              status={file.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
