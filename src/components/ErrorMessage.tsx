import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorTitle = styled.h3`
  color: #721c24;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const ErrorText = styled.p`
  color: #721c24;
  margin: 0.5rem 0;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #c82333;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Ops! Algo deu errado',
  message,
  onRetry,
  showRetry = true
}) => {
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      {showRetry && onRetry && (
        <RetryButton onClick={onRetry}>
          Tentar Novamente
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;
