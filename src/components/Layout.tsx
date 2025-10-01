import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: #f0f0f0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
    color: white;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    color: #667eea;
  }
`;

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  min-height: calc(100vh - 200px);
`;

const Footer = styled.footer`
  background: #f8f9fa;
  padding: 2rem 0;
  margin-top: 4rem;
  border-top: 1px solid #e9ecef;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  color: #6c757d;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <HeaderContainer>
        <Nav>
          <Logo to="/">📚 Blog de Aulas</Logo>
          <NavLinks>
            <NavLink to="/">Início</NavLink>
            
            {isAuthenticated && user?.role === 'professor' && (
              <>
                <NavLink to="/create">Criar Post</NavLink>
                <NavLink to="/admin">Administração</NavLink>
              </>
            )}
            
            {isAuthenticated ? (
              <UserInfo>
                <span>Olá, {user?.name}</span>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </UserInfo>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </NavLinks>
        </Nav>
      </HeaderContainer>

      <MainContainer>
        {children}
      </MainContainer>

      <Footer>
        <FooterContent>
          <p>&copy; 2025 Blog de Aulas - Pós-Tech FIAP. Desenvolvido para democratizar o ensino.</p>
        </FooterContent>
      </Footer>
    </>
  );
};

export default Layout;
