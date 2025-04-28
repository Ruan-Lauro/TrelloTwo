import { Outlet, Navigate } from 'react-router-dom';
import { useAuthToken } from '../hooks/useAuthToken';
import { useEffect, useState } from 'react';

export const ProtectedLayout = () => {
  const { authenticationT } = useAuthToken();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const value = await authenticationT(token);
        if (typeof value === "boolean" && value) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, []);


  if (isLoading) {
    return <div>Carregando...</div>;
  }

  
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};