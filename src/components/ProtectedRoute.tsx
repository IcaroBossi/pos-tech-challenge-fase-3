import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'professor' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        margin: '2rem 0'
      }}>
        <h2>🚫 Acesso Negado</h2>
        <p>
          Você não tem permissão para acessar esta página. 
          {requireRole === 'professor' && ' Apenas professores podem acessar esta área.'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
