import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { postsApi } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import type { CreatePostRequest } from '../types';

const CreateContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CreateHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const CreateTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
`;

const CreateForm = styled.form`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
`;

const RequiredIndicator = styled.span`
  color: #dc3545;
  margin-left: 0.25rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#667eea'};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const SubmitButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #6c757d;
    color: white;
  }
`;

interface CreatePostForm extends CreatePostRequest {
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostForm>();

  const onSubmit = async (data: CreatePostForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const postData: CreatePostRequest = {
        titulo: data.titulo,
        conteudo: data.conteudo,
        autor: data.autor,
        disciplina: data.disciplina || undefined,
      };

      const response = await postsApi.createPost(postData);

      if (response.sucesso && response.dados) {
        navigate(`/post/${response.dados._id}`);
      } else {
        setSubmitError(response.mensagem || 'Erro ao criar post');
      }
    } catch (error: any) {
      if (error.response?.data?.erros) {
        setSubmitError(error.response.data.erros.join(', '));
      } else {
        setSubmitError('Erro ao criar post. Verifique se o back-end está rodando.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <CreateContainer>
      <CreateHeader>
        <CreateTitle>✍️ Criar Novo Post</CreateTitle>
      </CreateHeader>

      <CreateForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <ErrorMessage
            title="Erro ao criar post"
            message={submitError}
            showRetry={false}
          />
        )}

        <FormGroup>
          <Label htmlFor="titulo">
            Título<RequiredIndicator>*</RequiredIndicator>
          </Label>
          <Input
            id="titulo"
            type="text"
            placeholder="Digite o título do post..."
            hasError={!!errors.titulo}
            {...register('titulo', {
              required: 'Título é obrigatório',
              minLength: {
                value: 3,
                message: 'Título deve ter pelo menos 3 caracteres',
              },
              maxLength: {
                value: 200,
                message: 'Título deve ter no máximo 200 caracteres',
              },
            })}
          />
          {errors.titulo && <ErrorText>{errors.titulo.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="autor">
            Autor<RequiredIndicator>*</RequiredIndicator>
          </Label>
          <Input
            id="autor"
            type="text"
            placeholder="Digite o nome do autor..."
            hasError={!!errors.autor}
            {...register('autor', {
              required: 'Autor é obrigatório',
              minLength: {
                value: 2,
                message: 'Nome do autor deve ter pelo menos 2 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'Nome do autor deve ter no máximo 100 caracteres',
              },
            })}
          />
          {errors.autor && <ErrorText>{errors.autor.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="disciplina">Disciplina</Label>
          <Input
            id="disciplina"
            type="text"
            placeholder="Digite o nome da disciplina..."
            hasError={!!errors.disciplina}
            {...register('disciplina', {
              maxLength: {
                value: 100,
                message: 'Disciplina deve ter no máximo 100 caracteres',
              },
            })}
          />
          {errors.disciplina && <ErrorText>{errors.disciplina.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="conteudo">
            Conteúdo<RequiredIndicator>*</RequiredIndicator>
          </Label>
          <TextArea
            id="conteudo"
            placeholder="Digite o conteúdo do post..."
            hasError={!!errors.conteudo}
            {...register('conteudo', {
              required: 'Conteúdo é obrigatório',
              minLength: {
                value: 10,
                message: 'Conteúdo deve ter pelo menos 10 caracteres',
              },
            })}
          />
          {errors.conteudo && <ErrorText>{errors.conteudo.message}</ErrorText>}
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            Cancelar
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Post'}
          </SubmitButton>
        </ButtonGroup>
      </CreateForm>
    </CreateContainer>
  );
};

export default CreatePost;
