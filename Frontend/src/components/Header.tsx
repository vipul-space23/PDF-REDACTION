
import { Bell, Settings, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-darkGrey/50 backdrop-blur-md border-b border-neonGreen/20 text-softWhite py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-poppins font-bold text-neonGreen">Safe<span className="text-cyberPurple">Docs</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full text-softWhite hover:bg-cyberBlue hover:text-neonGreen">
            <Moon size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-softWhite hover:bg-cyberBlue hover:text-neonGreen">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-softWhite hover:bg-cyberBlue hover:text-neonGreen">
            <Settings size={20} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <div className="relative cursor-pointer">
                  <Avatar className="bg-cyberPurple/20 border border-cyberPurple/50 hover:bg-cyberPurple/30">
                    <AvatarFallback className="text-cyberPurple">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-neonGreen rounded-full border-2 border-darkGrey"></span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="bg-darkGrey/90 backdrop-blur-md border-neonGreen/20 text-softWhite">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neonGreen/20" />
              
              {user?.email && (
                <DropdownMenuItem className="text-xs opacity-70">{user.email}</DropdownMenuItem>
              )}
              
              <DropdownMenuItem className="cursor-pointer hover:bg-cyberBlue/30 hover:text-neonGreen">
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-neonGreen/20" />
              
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
