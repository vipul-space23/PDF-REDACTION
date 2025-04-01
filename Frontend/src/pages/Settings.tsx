
import { useState } from 'react';
import { Shield, Database, AlertTriangle, Lock, ToggleLeft, ToggleRight, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoRedact, setAutoRedact] = useState(true);
  const [blockchainVerification, setBlockchainVerification] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState(75);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataSharingConsent, setDataSharingConsent] = useState(false);
  const [aiModel, setAiModel] = useState("Enhanced NER");
  const { toast } = useToast();
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your privacy preferences have been updated successfully.",
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-softWhite/70">
          Configure your privacy preferences and application settings.
        </p>
      </div>
      
      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="bg-darkGrey/50 border border-neonGreen/20">
          <TabsTrigger value="privacy" className="data-[state=active]:bg-neonGreen/20 data-[state=active]:text-neonGreen">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-neonGreen/20 data-[state=active]:text-neonGreen">
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-neonGreen/20 data-[state=active]:text-neonGreen">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="privacy" className="glass-card rounded-lg p-6 border border-neonGreen/20 space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-cyberBlue/30">
            <div>
              <h3 className="font-medium text-softWhite">Offline Mode</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Process all files locally without any internet connection
              </p>
            </div>
            <Switch 
              checked={offlineMode} 
              onCheckedChange={setOfflineMode}
              className="data-[state=checked]:bg-neonGreen"
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-cyberBlue/30">
            <div>
              <h3 className="font-medium text-softWhite">Automatic Redaction</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Automatically redact detected PII without confirmation
              </p>
            </div>
            <Switch 
              checked={autoRedact} 
              onCheckedChange={setAutoRedact}
              className="data-[state=checked]:bg-neonGreen"
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-cyberBlue/30">
            <div>
              <h3 className="font-medium text-softWhite">Blockchain Verification</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Record all file operations on the private blockchain
              </p>
            </div>
            <Switch 
              checked={blockchainVerification} 
              onCheckedChange={setBlockchainVerification}
              className="data-[state=checked]:bg-neonGreen"
            />
          </div>
          
          <div className="py-3 border-b border-cyberBlue/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-softWhite">Detection Sensitivity</h3>
                <p className="text-sm text-softWhite/70 mt-1">
                  Adjust how aggressively the AI identifies potential PII
                </p>
              </div>
              <span className="text-sm font-medium text-neonGreen">{sensitivityLevel}%</span>
            </div>
            <Slider 
              value={[sensitivityLevel]} 
              onValueChange={(value) => setSensitivityLevel(value[0])} 
              max={100} 
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-softWhite/50 mt-1">
              <span>Minimal</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-softWhite">AI Model Selection</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Choose which AI model powers the PII detection
              </p>
            </div>
            <div className="flex rounded-md overflow-hidden border border-neonGreen/50">
              <button 
                className={`px-3 py-1.5 text-xs ${aiModel === 'Standard NER' ? 'bg-neonGreen/20 text-neonGreen' : 'text-softWhite/70'}`}
                onClick={() => setAiModel('Standard NER')}
              >
                Standard
              </button>
              <button 
                className={`px-3 py-1.5 text-xs ${aiModel === 'Enhanced NER' ? 'bg-neonGreen/20 text-neonGreen' : 'text-softWhite/70'}`}
                onClick={() => setAiModel('Enhanced NER')}
              >
                Enhanced
              </button>
              <button 
                className={`px-3 py-1.5 text-xs ${aiModel === 'Custom NER' ? 'bg-neonGreen/20 text-neonGreen' : 'text-softWhite/70'}`}
                onClick={() => setAiModel('Custom NER')}
              >
                Custom
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="glass-card rounded-lg p-6 border border-neonGreen/20 space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-cyberBlue/30">
            <div>
              <h3 className="font-medium text-softWhite">Email Notifications</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Receive alerts when sensitive data is detected
              </p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-neonGreen"
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-cyberBlue/30">
            <div>
              <h3 className="font-medium text-softWhite">Data Sharing Consent</h3>
              <p className="text-sm text-softWhite/70 mt-1">
                Allow anonymous data to improve AI detection (no PII shared)
              </p>
            </div>
            <Switch 
              checked={dataSharingConsent} 
              onCheckedChange={setDataSharingConsent}
              className="data-[state=checked]:bg-neonGreen"
            />
          </div>
          
          <div className="py-3 space-y-4">
            <h3 className="font-medium text-softWhite">Data Retention</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-darkGrey/30 rounded-lg p-4 border border-neonGreen/20">
                <p className="text-sm font-medium mb-2">Local Storage</p>
                <div className="flex justify-between text-xs text-softWhite/70 mb-2">
                  <span>Used</span>
                  <span>245 MB / 5 GB</span>
                </div>
                <div className="h-1.5 bg-cyberBlue/50 rounded-full overflow-hidden">
                  <div className="h-full bg-neonGreen" style={{ width: '5%' }}></div>
                </div>
              </div>
              
              <div className="bg-darkGrey/30 rounded-lg p-4 border border-neonGreen/20">
                <p className="text-sm font-medium mb-2">Cache</p>
                <div className="flex justify-between text-xs text-softWhite/70 mb-1">
                  <span>Temporary files</span>
                  <span>124 MB</span>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-8 border-neonGreen/20 hover:border-neonGreen hover:text-neonGreen">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="glass-card rounded-lg p-6 border border-neonGreen/20 space-y-6">
          <div className="flex items-center bg-darkGrey/50 rounded-lg p-4 border border-cyberPurple/30">
            <AlertTriangle className="h-5 w-5 text-cyberPurple mr-3" />
            <div>
              <h3 className="text-sm font-medium">Security Status</h3>
              <p className="text-xs text-softWhite/70 mt-1">
                Your system is secure and up to date with the latest privacy protocols.
              </p>
            </div>
          </div>
          
          <div className="py-3 border-b border-cyberBlue/30">
            <h3 className="font-medium text-softWhite mb-3">PII Types to Detect</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Names', 'Addresses', 'Phone Numbers', 'Email Addresses', 
                'SSN/National ID', 'Credit Card Numbers', 'Dates of Birth', 'IP Addresses'
              ].map((type) => (
                <div key={type} className="flex items-center">
                  <Switch 
                    defaultChecked={true}
                    className="data-[state=checked]:bg-neonGreen"
                  />
                  <span className="ml-2 text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="py-3">
            <h3 className="font-medium text-softWhite mb-3">Authentication Method</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="standard" 
                  name="auth" 
                  className="h-4 w-4 text-neonGreen border-neonGreen/50 focus:ring-neonGreen/30" 
                  defaultChecked
                />
                <label htmlFor="standard" className="ml-2 text-sm">Standard (Username & Password)</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="twoFactor" 
                  name="auth" 
                  className="h-4 w-4 text-neonGreen border-neonGreen/50 focus:ring-neonGreen/30" 
                />
                <label htmlFor="twoFactor" className="ml-2 text-sm">Two-Factor Authentication</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="biometric" 
                  name="auth" 
                  className="h-4 w-4 text-neonGreen border-neonGreen/50 focus:ring-neonGreen/30" 
                />
                <label htmlFor="biometric" className="ml-2 text-sm">Biometric Authentication</label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" className="mr-4 border-neonGreen/20 text-softWhite hover:border-neonGreen hover:text-neonGreen">
          Reset to Defaults
        </Button>
        <Button 
          className="bg-neonGreen text-cyberBlue hover:bg-neonGreen/90"
          onClick={saveSettings}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
