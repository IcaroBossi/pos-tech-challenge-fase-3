import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoginHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const LoginTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
`;

const LoginSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
`;

const LoginForm = styled.form`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#667eea'};
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const LoginButton = styled.button`
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    background: #5a67d8;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const DemoSection = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
`;

const DemoTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 1rem 0;
  color: #333;
  text-align: center;
`;

const DemoCredentials = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const DemoLabel = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const DemoButton = styled.button`
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: #218838;
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Se já estiver autenticado, redirecionar para home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        navigate('/', { replace: true });
      } else {
        setLoginError('Email ou senha incorretos. Tente novamente.');
      }
    } catch (error) {
      setLoginError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillProfessorDemo = () => {
    setValue('email', 'professor@blog.com');
    setValue('password', 'professor123');
  };

  const fillStudentDemo = () => {
    setValue('email', 'aluno@blog.com');
    setValue('password', 'aluno123');
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <LoginTitle>🔐 Entrar</LoginTitle>
        <LoginSubtitle>Acesse sua conta do Blog de Aulas</LoginSubtitle>
      </LoginHeader>

      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        {loginError && (
          <ErrorText style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {loginError}
          </ErrorText>
        )}

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            hasError={!!errors.email}
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            hasError={!!errors.password}
            {...register('password', {
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Senha deve ter pelo menos 6 caracteres',
              },
            })}
          />
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </FormGroup>

        <LoginButton 
          type="submit" 
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </LoginButton>
      </LoginForm>

      <DemoSection>
        <DemoTitle>🧪 Contas de Demonstração</DemoTitle>
        
        <DemoCredentials>
          <DemoLabel>👨‍🏫 Professor (Acesso Completo)</DemoLabel>
          <div>Email: professor@blog.com</div>
          <div>Senha: professor123</div>
          <DemoButton type="button" onClick={fillProfessorDemo}>
            Preencher dados do Professor
          </DemoButton>
        </DemoCredentials>

        <DemoCredentials>
          <DemoLabel>👨‍🎓 Aluno (Somente Leitura)</DemoLabel>
          <div>Email: aluno@blog.com</div>
          <div>Senha: aluno123</div>
          <DemoButton type="button" onClick={fillStudentDemo}>
            Preencher dados do Aluno
          </DemoButton>
        </DemoCredentials>
      </DemoSection>
    </LoginContainer>
  );
};

export default Login;
