import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileUp, Shield, Database, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Upload Files', icon: FileUp, path: '/upload' },
  { name: 'Redaction Preview', icon: Shield, path: '/preview' },
  { name: 'Blockchain Logs', icon: Database, path: '/logs' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div 
      className={cn(
        "bg-darkGrey border-r border-neonGreen/20 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="px-4 py-6">
        {!collapsed && (
          <div className="flex items-center space-x-2 mb-6">
            <img src={logo} alt="SafeDocs Logo" className="h-8 w-8 rounded-md" />
            <h1 className="text-lg font-bold font-poppins">
              <span className="text-neonGreen">Safe</span>
              <span className="text-cyberPurple">Docs</span>
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-6">
            <img src={logo} alt="SafeDocs Logo" className="h-8 w-8 rounded-md" />
          </div>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-cyberBlue hover:text-neonGreen group",
                  location.pathname === item.path 
                    ? "bg-cyberBlue text-neonGreen border-l-2 border-neonGreen" 
                    : "text-softWhite/70"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3", collapsed ? "mr-0 mx-auto" : "")} />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="fixed left-16 hidden px-2 py-1 ml-6 text-sm font-medium text-white bg-darkGrey rounded-md group-hover:flex z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-softWhite border-neonGreen/50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
