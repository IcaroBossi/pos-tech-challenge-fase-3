import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalStyles from './styles/GlobalStyles';

// Pages
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Layout>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas - apenas professores */}
            <Route 
              path="/create" 
              element={
                <ProtectedRoute requireRole="professor">
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute requireRole="professor">
                  <EditPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireRole="professor">
                  <Admin />
                </ProtectedRoute>
              } 
            />

            {/* Rota 404 */}
            <Route 
              path="*" 
              element={
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <h1>🔍 Página não encontrada</h1>
                  <p>A página que você está procurando não existe.</p>
                  <a href="/">Voltar para o início</a>
                </div>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
