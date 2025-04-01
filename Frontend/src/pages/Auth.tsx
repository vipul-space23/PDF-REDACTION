
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Mail, KeyRound, UserPlus, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (authMethod === 'password') {
        await signIn(email, password);
      } else {
        await signIn(email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!password && authMethod === 'password') {
        throw new Error('Password is required for signup');
      }
      await signUp(email, password);
    } catch (error: any) {
      console.error('Signup error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyberBlue to-darkGrey flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-10 bg-darkGrey/60 backdrop-blur-lg rounded-xl border border-neonGreen/20 shadow-xl relative overflow-hidden">
        {/* Cybersecurity background effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Glowing orb effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-cyberPurple/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-neonGreen/20 blur-3xl"></div>

        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="bg-cyberPurple/20 p-4 rounded-full border border-cyberPurple/30">
            <Shield className="h-10 w-10 text-cyberPurple" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-softWhite">
              <span className="text-neonGreen">Safe</span>
              <span className="text-cyberPurple">Docs</span>
            </h1>
            <p className="text-softWhite/70 max-w-sm">
              Secure authentication with password or magic links.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-darkGrey/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-neonGreen/10 data-[state=active]:text-neonGreen">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-cyberPurple/10 data-[state=active]:text-cyberPurple">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-softWhite/40" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-darkGrey/50 border-neonGreen/30 focus:border-neonGreen text-softWhite"
                  />
                </div>
                
                {authMethod === 'password' && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-softWhite/40" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 bg-darkGrey/50 border-neonGreen/30 focus:border-neonGreen text-softWhite"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setAuthMethod(authMethod === 'password' ? 'magic' : 'password')}
                    className="text-xs text-cyberPurple hover:text-neonGreen"
                  >
                    {authMethod === 'password' ? 'Use magic link instead' : 'Use password instead'}
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-neonGreen to-cyberPurple hover:opacity-90 text-softWhite transition-all duration-300 shadow-glow"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      {authMethod === 'password' ? 'Signing In...' : 'Sending Magic Link...'}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {authMethod === 'password' ? (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" /> 
                          Sign In
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" /> 
                          Send Magic Link
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-softWhite/40" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-darkGrey/50 border-cyberPurple/30 focus:border-cyberPurple text-softWhite"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-softWhite/40" />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-darkGrey/50 border-cyberPurple/30 focus:border-cyberPurple text-softWhite"
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-cyberPurple to-neonGreen hover:opacity-90 text-softWhite transition-all duration-300 shadow-glow"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" /> 
                      Create Account
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="text-xs text-softWhite/50 pt-4 text-center">
            By signing in, you agree to our 
            <a href="#" className="text-cyberPurple hover:text-neonGreen mx-1">Terms of Service</a>
            and
            <a href="#" className="text-cyberPurple hover:text-neonGreen mx-1">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
