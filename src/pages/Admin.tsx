import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { postsApi } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Post, PostsResponse } from '../types';

const AdminContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
`;

const AdminSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e9ecef;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const PostsTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const TableTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const TableContent = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeader2 = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: top;
`;

const PostTitle = styled(Link)`
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;

  &:hover {
    color: #667eea;
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'view' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'delete':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'view':
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const ActionLink = styled(Link)<{ variant?: 'edit' | 'view' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: #007bff;
          color: white;
          &:hover { 
            background: #0056b3; 
            text-decoration: none;
            color: white;
          }
        `;
      case 'view':
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { 
            background: #5a6268; 
            text-decoration: none;
            color: white;
          }
        `;
    }
  }}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#5a67d8' : '#f8f9fa'};
  }

  &:disabled {
    background: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

const ConfirmDialog = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ConfirmContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ConfirmButton = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${props => {
    if (props.variant === 'danger') {
      return `
        background: #dc3545;
        color: white;
        &:hover { background: #c82333; }
      `;
    }
    return `
      background: #6c757d;
      color: white;
      &:hover { background: #5a6268; }
    `;
  }}
`;

const Admin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = async (page = 1) => {
    try {
      setError(null);
      setLoading(true);

      const response: PostsResponse = await postsApi.getAllPosts(page, 10);

      if (response.sucesso) {
        setPosts(response.dados);
        setTotalPages(response.paginacao.totalPaginas);
        setTotalPosts(response.paginacao.totalPosts);
        setCurrentPage(page);
      } else {
        setError('Erro ao carregar posts');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o back-end está rodando.');
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    setIsDeleting(true);
    
    try {
      const response = await postsApi.deletePost(postId);
      
      if (response.sucesso) {
        // Recarregar a lista de posts
        await loadPosts(currentPage);
        setDeletePostId(null);
      } else {
        setError(response.mensagem || 'Erro ao deletar post');
      }
    } catch (err) {
      setError('Erro ao deletar post. Verifique se o back-end está rodando.');
      console.error('Erro ao deletar post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage > 1) {
      pages.push(
        <PaginationButton
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ← Anterior
        </PaginationButton>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationButton>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <PaginationButton
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Próximo →
        </PaginationButton>
      );
    }

    return pages;
  };

  if (loading && posts.length === 0) {
    return <Loading message="Carregando painel administrativo..." />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>🛠️ Painel Administrativo</AdminTitle>
        <AdminSubtitle>Gerencie todos os posts da plataforma</AdminSubtitle>
      </AdminHeader>

      <StatsSection>
        <StatCard>
          <StatNumber>{totalPosts}</StatNumber>
          <StatLabel>Total de Posts</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalPages}</StatNumber>
          <StatLabel>Páginas</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{Math.ceil(totalPosts / 10)}</StatNumber>
          <StatLabel>Posts por Página</StatLabel>
        </StatCard>
      </StatsSection>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadPosts(currentPage)}
        />
      )}

      <PostsTable>
        <TableHeader>
          <TableTitle>📝 Gerenciar Posts</TableTitle>
        </TableHeader>

        <TableContent>
          {posts.length === 0 ? (
            <EmptyState>
              <h3>📭 Nenhum post encontrado</h3>
              <p>Comece criando seu primeiro post!</p>
            </EmptyState>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader2>Post</TableHeader2>
                  <TableHeader2>Autor</TableHeader2>
                  <TableHeader2>Data</TableHeader2>
                  <TableHeader2>Ações</TableHeader2>
                </TableRow>
              </TableHead>
              <tbody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <PostTitle to={`/post/${post._id}`}>
                        {post.titulo}
                      </PostTitle>
                      <PostMeta>
                        {truncateText(post.conteudo)}
                        {post.disciplina && (
                          <div>📚 {post.disciplina}</div>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div>🏷️ {post.tags.join(', ')}</div>
                        )}
                      </PostMeta>
                    </TableCell>
                    <TableCell>
                      <strong>{post.autor}</strong>
                    </TableCell>
                    <TableCell>
                      {formatDate(post.dataCriacao)}
                      {post.dataAtualizacao !== post.dataCriacao && (
                        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                          Editado: {formatDate(post.dataAtualizacao)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ActionLink variant="view" to={`/post/${post._id}`}>
                          👁️ Ver
                        </ActionLink>
                        <ActionLink variant="edit" to={`/edit/${post._id}`}>
                          ✏️ Editar
                        </ActionLink>
                        <ActionButton
                          variant="delete"
                          onClick={() => setDeletePostId(post._id)}
                        >
                          🗑️ Excluir
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContent>
      </PostsTable>

      {totalPages > 1 && (
        <PaginationContainer>
          {renderPagination()}
        </PaginationContainer>
      )}

      <ConfirmDialog show={!!deletePostId}>
        <ConfirmContent>
          <ConfirmTitle>🗑️ Confirmar Exclusão</ConfirmTitle>
          <ConfirmMessage>
            Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
          </ConfirmMessage>
          <ConfirmButtons>
            <ConfirmButton
              variant="secondary"
              onClick={() => setDeletePostId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </ConfirmButton>
            <ConfirmButton
              variant="danger"
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </ConfirmButton>
          </ConfirmButtons>
        </ConfirmContent>
      </ConfirmDialog>
    </AdminContainer>
  );
};

export default Admin;
