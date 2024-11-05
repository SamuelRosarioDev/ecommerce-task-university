import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token');

  // Redireciona para /login se não houver token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Permite acesso ao conteúdo se o token existir
  return children; 
};

const AuthGuardPublic = ({ children }) => {
  const token = localStorage.getItem('token');

  // Redireciona para / se houver token (usuário já logado)
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Permite acesso ao conteúdo se não houver token
  return children; 
}

export { AuthGuard, AuthGuardPublic };
