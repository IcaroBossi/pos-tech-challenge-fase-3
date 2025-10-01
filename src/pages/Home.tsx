import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Post, PostsResponse } from '../types';

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SearchSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchTitle = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a67d8;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #6c757d;
    color: white;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
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

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const loadPosts = async (page = 1, search = '') => {
    try {
      setError(null);
      setLoading(true);

      let response: PostsResponse;
      
      if (search.trim()) {
        response = await postsApi.searchPosts(search, page, 10);
        setIsSearching(true);
      } else {
        response = await postsApi.getAllPosts(page, 10);
        setIsSearching(false);
      }

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
    loadPosts(1, searchTerm);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page, searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadPosts(1, '');
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
    return <Loading message="Carregando posts..." />;
  }

  return (
    <HomeContainer>
      <SearchSection>
        <SearchTitle>🔍 Encontre o conteúdo que você procura</SearchTitle>
        
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Buscar por título, conteúdo ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </SearchButton>
        </SearchForm>

          {searchTerm && (
            <ClearFiltersButton onClick={clearFilters}>
              Limpar Busca
            </ClearFiltersButton>
          )}
      </SearchSection>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadPosts(currentPage, searchTerm)}
        />
      )}

      {!error && (
        <>
          <ResultsInfo>
            <span>
              {isSearching && searchTerm ? 
                `Resultados para "${searchTerm}": ${totalPosts} post(s) encontrado(s)` :
                `${totalPosts} post(s) encontrado(s)`
              }
            </span>
            <span>Página {currentPage} de {totalPages}</span>
          </ResultsInfo>

          {posts.length === 0 ? (
            <EmptyState>
              <h3>Nenhum post encontrado</h3>
              <p>Tente ajustar os filtros ou termos de busca.</p>
            </EmptyState>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}

              {totalPages > 1 && (
                <PaginationContainer>
                  {renderPagination()}
                </PaginationContainer>
              )}
            </>
          )}
        </>
      )}
    </HomeContainer>
  );
};

export default Home;
