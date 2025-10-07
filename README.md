# 📚 Blog de Aulas - Front-End

Interface desenvolvida para a disciplina de Front-End da Pós-Tech FIAP. Esta aplicação permite que professores da rede pública criem, editem e gerenciem conteúdo de aulas de forma centralizada e tecnológica.

## 🎯 Objetivo

Desenvolver uma interface gráfica para a aplicação de blogging, proporcionando uma boa experiência de usuário tanto para professores(as) quanto para estudantes.

## 🚀 Funcionalidades

### 🔍 Para Todos os Usuários
- ✅ **Visualização de posts**: Lista paginada de todos os posts disponíveis
- ✅ **Busca textual**: Busca por palavra-chave no título, conteúdo e autor
- ✅ **Leitura completa**: Visualização detalhada de posts individuais
- ✅ **Interface responsiva**: Funciona em dispositivos móveis e desktops

### 👨‍🏫 Para Professores (Autenticados)
- ✅ **Criação de posts**: Formulário simplificado para criação de novas postagens
- ✅ **Edição de posts**: Modificação de postagens existentes
- ✅ **Painel administrativo**: Gerenciamento completo de todos os posts
- ✅ **Exclusão de posts**: Remoção de postagens

### 🔐 Sistema de Autenticação
- ✅ **Login seguro**: Sistema de autenticação com roles (professor/aluno)
- ✅ **Proteção de rotas**: Acesso controlado às funcionalidades administrativas

## � Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Styled Components** - CSS-in-JS para estilização
- **React Router DOM** - Roteamento do lado do cliente
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP para integração com API


## �📋 Pré-requisitos
- Back-end da aplicação rodando (pos-tech-challenge-fase-2)

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/IcaroBossi/pos-tech-challenge-fase-3.git
cd pos-tech-challenge-fase-3
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
VITE_API_URL=http://localhost:3000
```

### 4. Inicie o back-end
Certifique-se de que o back-end (pos-tech-challenge-fase-2) está rodando em `http://localhost:3000`

### 5. Inicie a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🎨 Estrutura do Projeto

```
src/
├── assets/             # Recursos estáticos (imagens, ícones)
├── components/         # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout base da aplicação
│   ├── PostCard.tsx    # Card de post para listagem
│   ├── Loading.tsx     # Componente de carregamento
│   ├── ErrorMessage.tsx # Componente de erro
│   └── ProtectedRoute.tsx # Proteção de rotas
├── context/            # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página principal (lista de posts)
│   ├── PostDetail.tsx  # Página de visualização de post
│   ├── Login.tsx       # Página de login
│   ├── CreatePost.tsx  # Página de criação de posts
│   ├── EditPost.tsx    # Página de edição de posts
│   └── Admin.tsx       # Painel administrativo
├── services/           # Serviços e APIs
│   └── api.ts          # Cliente da API REST
├── styles/             # Estilos globais
│   └── GlobalStyles.ts # Estilos globais com Styled Components
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Tipos da aplicação
├── App.css             # Estilos do componente App
├── App.tsx             # Componente principal
├── index.css           # Estilos globais base
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔑 Sistema de Autenticação

A aplicação possui um sistema de autenticação simulado com dois tipos de usuários:

### 👨‍🏫 Professor (Acesso Completo)
- **Email**: `professor@blog.com`
- **Senha**: `professor123`
- **Permissões**: Criar, editar, excluir e visualizar posts

### 👨‍🎓 Aluno (Somente Leitura)
- **Email**: `aluno@blog.com`
- **Senha**: `aluno123`
- **Permissões**: Apenas visualizar posts

## 🖥️ Páginas e Funcionalidades

### 🏠 Página Principal (`/`)
- Lista paginada de todos os posts
- Campo de busca por palavra-chave
- Cards informativos com preview do conteúdo
- Navegação com paginação

### 📖 Página de Post (`/post/:id`)
- Visualização completa do post
- Navegação de volta para a lista

### 🔐 Página de Login (`/login`)
- Formulário de autenticação
- Botões de preenchimento automático para demo
- Redirecionamento após login

### ✍️ Página de Criação (`/create`) - *Apenas Professores*
- Formulário simplificado para novos posts

### ✏️ Página de Edição (`/edit/:id`) - *Apenas Professores*
- Carregamento automático dos dados existentes
- Formulário pré-preenchido
- Indicadores de última modificação

### 🛠️ Painel Administrativo (`/admin`) - *Apenas Professores*
- Lista de todos os posts
- Estatísticas gerais
- Ações de visualizar, editar e excluir

## 🔗 Integração com Back-End

A aplicação consome a API REST desenvolvida na fase anterior:

### Endpoints Utilizados
- `GET /posts` - Listar posts com paginação
- `GET /posts/:id` - Buscar post específico
- `POST /posts` - Criar novo post
- `PUT /posts/:id` - Atualizar post existente
- `DELETE /posts/:id` - Excluir post
- `GET /posts/search` - Buscar posts por palavra-chave
- `GET /health` - Verificar status da API

### Tratamento de Erros
- Interceptadores Axios para respostas
- Componentes de erro amigáveis
- Feedback visual para o usuário
- Validação de formulários em tempo real

## 🎨 Design System

### Cores Principais
- **Primária**: `#667eea` (Azul)
- **Secundária**: `#764ba2` (Roxo)
- **Sucesso**: `#28a745` (Verde)
- **Erro**: `#dc3545` (Vermelho)
- **Warning**: `#ffc107` (Amarelo)

### Tipografia
- **Fonte**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Tamanhos**: Escala responsiva (14px-16px base)

## 🚧 Desafios Enfrentados

- **Integração com API**: Implementação de interceptadores Axios e tratamento de erros
- **TypeScript + React**: Tipagem adequada de componentes, props e respostas da API
- **Autenticação e Proteção de Rotas**: Sistema de roles e controle de acesso por página
- **Design Responsivo**: Layout adaptável para diferentes dispositivos e tamanhos de tela
- **Gerenciamento de Estado**: Context API para compartilhamento de dados entre componentes
- **Validação de Formulários**: React Hook Form com validações customizadas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ícaro Bossi**
- GitHub: [@IcaroBossi](https://github.com/IcaroBossi)
- Projeto: Pós-Tech FIAP - Tech Challenge Fase 3 - Front-End

## 🔗 Links Relacionados

- [Back-End (Fase 2)](https://github.com/IcaroBossi/pos-tech-challenge-fase-2)
