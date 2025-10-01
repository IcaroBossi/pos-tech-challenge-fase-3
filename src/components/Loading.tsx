import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  flex-direction: column;
  gap: 1rem;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
