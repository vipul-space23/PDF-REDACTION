
import { useState } from 'react';
import { Eye, Download, RefreshCw, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Preview() {
  const [redactionLevel, setRedactionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  const originalText = `
    Hello, my name is John Smith. I live at 123 Main Street, New York, NY 10001.
    My phone number is (555) 123-4567 and my email is john.smith@example.com.
    My credit card number is 4111-1111-1111-1111 and my social security number is 123-45-6789.
    I was born on January 15, 1980 and my employee ID is EMP-12345.
  `;
  
  const getRedactedText = () => {
    if (redactionLevel === 'low') {
      return originalText
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****'); // Credit Card
    } else if (redactionLevel === 'medium') {
      return originalText
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****') // Credit Card
        .replace(/\(\d{3}\) \d{3}-\d{4}/g, '(***) ***-****') // Phone
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]'); // Email
    } else {
      return originalText
        .replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****') // SSN
        .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, '****-****-****-****') // Credit Card
        .replace(/\(\d{3}\) \d{3}-\d{4}/g, '(***) ***-****') // Phone
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]') // Email
        .replace(/John Smith/g, '[REDACTED_NAME]') // Name
        .replace(/123 Main Street, New York, NY 10001/g, '[REDACTED_ADDRESS]') // Address
        .replace(/January 15, 1980/g, '[REDACTED_DOB]') // DOB
        .replace(/EMP-\d{5}/g, '[REDACTED_ID]'); // Employee ID
    }
  };
  
  const getRedactionStats = () => {
    const redactedText = getRedactedText();
    
    return {
      total: originalText.split(/\s+/).length,
      redacted: (originalText.match(/\d{3}-\d{2}-\d{4}|\d{4}-\d{4}-\d{4}-\d{4}|\(\d{3}\) \d{3}-\d{4}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|John Smith|123 Main Street, New York, NY 10001|January 15, 1980|EMP-\d{5}/g) || []).length,
      privacy: redactionLevel === 'low' ? 'Basic' : redactionLevel === 'medium' ? 'Standard' : 'Maximum',
      instances: redactionLevel === 'low' ? 2 : redactionLevel === 'medium' ? 4 : 8
    };
  };
  
  const stats = getRedactionStats();
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#00F6FF]/10 to-[#A74FFF]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-[#A74FFF]/10 to-[#00F6FF]/10 rounded-full blur-3xl -z-10" />
        
        <h1 className="text-3xl font-bold mb-2 text-gradient">Redaction Preview</h1>
        <p className="text-[#A3A3A3] max-w-xl">
          Preview how your document will look after PII redaction with different security levels.
          Your data never leaves your device during this process.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-6">
        <span className="text-sm font-medium bg-[#00F6FF]/10 px-3 py-1 rounded-full text-[#00F6FF] w-full md:w-auto">Redaction Level:</span>
        <div className="flex rounded-full overflow-hidden border border-[#00F6FF]/20 bg-[rgba(255,255,255,0.04)] backdrop-blur-md shadow-[0_0_15px_rgba(0,246,255,0.15)]">
          <button 
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${
              redactionLevel === 'low' 
                ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' 
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            onClick={() => setRedactionLevel('low')}
          >
            Low
          </button>
          <button 
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${
              redactionLevel === 'medium' 
                ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' 
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            onClick={() => setRedactionLevel('medium')}
          >
            Medium
          </button>
          <button 
            className={`px-5 py-2 text-sm font-medium transition-all duration-300 ${
              redactionLevel === 'high' 
                ? 'bg-gradient-to-r from-[#00F6FF]/20 to-[#007BFF]/20 text-[#00F6FF]' 
                : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            onClick={() => setRedactionLevel('high')}
          >
            High
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="neo-blur rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="bg-[rgba(10,25,47,0.8)] backdrop-blur-md border-b border-[#00F6FF]/20 py-3 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-[#00F6FF] mr-2" />
              <h3 className="font-medium text-[#F5F5F5]">Original Document</h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#00F6FF]/10 hover:text-[#00F6FF] transition-colors">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#00F6FF]/10 hover:text-[#00F6FF] transition-colors">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-[rgba(10,25,47,0.4)] h-80 overflow-auto text-left">
            <pre className="whitespace-pre-wrap font-inter text-sm text-[#F5F5F5]/90">
              {originalText}
            </pre>
          </div>
        </div>
        
        <div className="neo-blur rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="bg-[rgba(10,25,47,0.8)] backdrop-blur-md border-b border-[#A74FFF]/20 py-3 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-[#A74FFF] mr-2" />
              <h3 className="font-medium text-[#F5F5F5]">Redacted Document</h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#A74FFF]/10 hover:text-[#A74FFF] transition-colors">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#A74FFF]/10 hover:text-[#A74FFF] transition-colors">
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
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,246,255,0.1)]">
          <p className="text-[#A3A3A3] text-sm">Total Words</p>
          <p className="text-2xl font-bold text-[#F5F5F5] mt-1">{stats.total}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,246,255,0.1)]">
          <p className="text-[#A3A3A3] text-sm">Redacted Items</p>
          <p className="text-2xl font-bold text-[#00FF9F] mt-1">{stats.instances}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,246,255,0.1)]">
          <p className="text-[#A3A3A3] text-sm">Privacy Level</p>
          <p className="text-2xl font-bold text-[#A74FFF] mt-1">{stats.privacy}</p>
        </div>
        <div className="neo-blur rounded-xl p-4 text-center border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,246,255,0.1)]">
          <p className="text-[#A3A3A3] text-sm">PII Types</p>
          <p className="text-2xl font-bold text-[#F5F5F5] mt-1">
            {redactionLevel === 'low' ? '2' : redactionLevel === 'medium' ? '4' : '8'}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button className="relative overflow-hidden bg-gradient-to-r from-[#00F6FF] to-[#007BFF] text-black font-medium shadow-[0_0_15px_rgba(0,246,255,0.4)] hover:shadow-[0_0_25px_rgba(0,246,255,0.6)] transition-all duration-300 group">
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
          <Shield className="mr-2 h-4 w-4" />
          Apply Redaction
        </Button>
      </div>
    </div>
  );
}
