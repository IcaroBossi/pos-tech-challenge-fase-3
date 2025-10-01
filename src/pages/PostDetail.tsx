import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { postsApi } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Post } from '../types';

const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PostHeader = styled.header`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  font-size: 1rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostContent = styled.div`
  padding: 2rem;
`;

const ContentText = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 2rem 0 1rem 0;
    color: #333;
  }
  
  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #666;
  }
  
  code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
  
  pre {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
    }
  }
`;

const TagsSection = styled.section`
  padding: 0 2rem 2rem 2rem;
`;

const TagsTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const NavigationSection = styled.section`
  padding: 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    text-decoration: none;
  }
`;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setPost(response.dados);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading message="Carregando post..." />;
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
        message="O post que você está procurando não foi encontrado."
        showRetry={false}
      />
    );
  }

  return (
    <PostContainer>
      <PostHeader>
        <PostTitle>{post.titulo}</PostTitle>
        <PostMeta>
          <MetaItem>
            <span>👨‍🏫</span>
            <strong>{post.autor}</strong>
          </MetaItem>
          
          {post.disciplina && (
            <MetaItem>
              <span>📚</span>
              <span>{post.disciplina}</span>
            </MetaItem>
          )}
          
          <MetaItem>
            <span>📅</span>
            <span>{formatDate(post.dataCriacao)}</span>
          </MetaItem>
          
          {post.dataAtualizacao !== post.dataCriacao && (
            <MetaItem>
              <span>✏️</span>
              <span>Atualizado em {formatDate(post.dataAtualizacao)}</span>
            </MetaItem>
          )}
        </PostMeta>
      </PostHeader>

      <PostContent>
        <ContentText>
          {post.conteudo.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </ContentText>
      </PostContent>

      {post.tags && post.tags.length > 0 && (
        <TagsSection>
          <TagsTitle>🏷️ Tags</TagsTitle>
          <TagsContainer>
            {post.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </TagsSection>
      )}

      <NavigationSection>
        <BackButton to="/">
          ← Voltar para lista de posts
        </BackButton>
      </NavigationSection>
    </PostContainer>
  );
};

export default PostDetail;
