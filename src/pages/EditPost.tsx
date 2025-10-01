import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { postsApi } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Post, UpdatePostRequest } from '../types';

const EditContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const EditHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const EditTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
`;

const EditForm = styled.form`
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

const SaveButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: #0056b3;
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

const LastModified = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #6c757d;
`;

interface EditPostForm extends UpdatePostRequest {
}

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditPostForm>();

  const loadPost = async () => {
    if (!id) {
      setError('ID do post não fornecido');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const response = await postsApi.getPostById(id);
      
      if (response.sucesso && response.dados) {
        const postData = response.dados;
        setPost(postData);
        
        // Preencher formulário
        setValue('titulo', postData.titulo);
        setValue('conteudo', postData.conteudo);
        setValue('autor', postData.autor);
        setValue('disciplina', postData.disciplina || '');
      } else {
        setError('Post não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar o post. Verifique se o back-end está rodando.');
      console.error('Erro ao carregar post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const onSubmit = async (data: EditPostForm) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updateData: UpdatePostRequest = {
        titulo: data.titulo,
        conteudo: data.conteudo,
        autor: data.autor,
        disciplina: data.disciplina || undefined,
      };

      const response = await postsApi.updatePost(id, updateData);

      if (response.sucesso && response.dados) {
        navigate(`/post/${response.dados._id}`);
      } else {
        setSubmitError(response.mensagem || 'Erro ao atualizar post');
      }
    } catch (error: any) {
      if (error.response?.data?.erros) {
        setSubmitError(error.response.data.erros.join(', '));
      } else {
        setSubmitError('Erro ao atualizar post. Verifique se o back-end está rodando.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/post/${id}`);
    } else {
      navigate('/');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return <Loading message="Carregando post para edição..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar post"
        message={error}
        onRetry={loadPost}
      />
    );
  }

  if (!post) {
    return (
      <ErrorMessage
        title="Post não encontrado"
        message="O post que você está tentando editar não foi encontrado."
        showRetry={false}
      />
    );
  }

  return (
    <EditContainer>
      <EditHeader>
        <EditTitle>✏️ Editar Post</EditTitle>
      </EditHeader>

      <EditForm onSubmit={handleSubmit(onSubmit)}>
        <LastModified>
          📅 <strong>Criado em:</strong> {formatDate(post.dataCriacao)}
          {post.dataAtualizacao !== post.dataCriacao && (
            <> • <strong>Última modificação:</strong> {formatDate(post.dataAtualizacao)}</>
          )}
        </LastModified>

        {submitError && (
          <ErrorMessage
            title="Erro ao atualizar post"
            message={submitError}
            showRetry={false}
          />
        )}

        <FormGroup>
          <Label htmlFor="titulo">Título</Label>
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
          <Label htmlFor="autor">Autor</Label>
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
          <Label htmlFor="conteudo">Conteúdo</Label>
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
          <SaveButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </SaveButton>
        </ButtonGroup>
      </EditForm>
    </EditContainer>
  );
};

export default EditPost;
