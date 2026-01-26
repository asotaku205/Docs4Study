import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          setLocation('/auth');
          return;
        }

        const user = JSON.parse(userStr);
        
        if (requireAdmin && user.role !== 'admin') {
          setLocation('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setLocation('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
