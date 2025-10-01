import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Post } from '../types';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PostTitle = styled(Link)`
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 0.75rem;
  display: block;
  line-height: 1.3;

  &:hover {
    color: #667eea;
    text-decoration: none;
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PostPreview = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ReadMoreLink = styled(Link)`
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getPreview = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <CardContainer>
      <PostTitle to={`/post/${post._id}`}>
        {post.titulo}
      </PostTitle>
      
      <PostMeta>
        <MetaItem>
          👨‍🏫 <strong>{post.autor}</strong>
        </MetaItem>
        {post.disciplina && (
          <MetaItem>
            📚 {post.disciplina}
          </MetaItem>
        )}
        <MetaItem>
          📅 {formatDate(post.dataCriacao)}
        </MetaItem>
      </PostMeta>

      <PostPreview>
        {getPreview(post.conteudo)}
      </PostPreview>

      {post.tags && post.tags.length > 0 && (
        <TagsContainer>
          {post.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
      )}

      <ReadMoreLink to={`/post/${post._id}`}>
        Ler mais →
      </ReadMoreLink>
    </CardContainer>
  );
};

export default PostCard;
