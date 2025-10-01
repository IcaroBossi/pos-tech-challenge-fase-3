export interface Post {
  _id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  disciplina?: string;
  tags?: string[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CreatePostRequest {
  titulo: string;
  conteudo: string;
  autor: string;
  disciplina?: string;
  tags?: string[];
}

export interface UpdatePostRequest {
  titulo?: string;
  conteudo?: string;
  autor?: string;
  disciplina?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
  erros?: string[];
}

export interface PaginationInfo {
  paginaAtual: number;
  totalPaginas: number;
  totalPosts: number;
  postsPorPagina: number;
}

export interface PostsResponse {
  sucesso: boolean;
  dados: Post[];
  paginacao: PaginationInfo;
  termoBusca?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'student';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
