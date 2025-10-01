import axios from 'axios';
import type { Post, CreatePostRequest, UpdatePostRequest, PostsResponse, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log do erro para debug
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

export const postsApi = {
  // Listar todos os posts
  getAllPosts: async (page = 1, limit = 10, autor?: string, disciplina?: string): Promise<PostsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (autor) params.append('autor', autor);
    if (disciplina) params.append('disciplina', disciplina);
    
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  // Buscar post por ID
  getPostById: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Criar novo post
  createPost: async (post: CreatePostRequest): Promise<ApiResponse<Post>> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  // Atualizar post
  updatePost: async (id: string, post: UpdatePostRequest): Promise<ApiResponse<Post>> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  // Deletar post
  deletePost: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Buscar posts
  searchPosts: async (query: string, page = 1, limit = 10): Promise<PostsResponse> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get(`/posts/search?${params.toString()}`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
