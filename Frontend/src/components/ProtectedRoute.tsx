
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  // Show loading state if auth state is still being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyberBlue to-darkGrey flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-neonGreen/20 animate-spin border-t-2 border-neonGreen"></div>
          <p className="mt-4 text-softWhite">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth page if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
}
