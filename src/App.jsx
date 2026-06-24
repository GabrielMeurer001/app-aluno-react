import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UsuarioProvider } from './context/UsuarioContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas 
import LoginPage from './pages/LoginPage';
import RegisterStep1Page from './pages/RegisterStep1Page';
import RegisterStep2Page from './pages/RegisterStep2Page';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';

// Páginas Privadas 
import DashboardPage from './pages/DashboardPage';
import DisciplinasPage from './pages/DisciplinasPage';
import ProfilePage from './pages/ProfilePage';
import TutorIAPage from './pages/TutorIAPage';

const App = () => {
  return (
    <UsuarioProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas de Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro-passo1" element={<RegisterStep1Page />} />
          <Route path="/cadastro-passo2" element={<RegisterStep2Page />} />
          <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
          <Route path="/nova-senha" element={<NewPasswordPage />} />

          {/* Rotas Privadas do Aluno  */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplinas"
            element={
              <ProtectedRoute>
                <DisciplinasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor-ia"
            element={
              <ProtectedRoute>
                <TutorIAPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamentos */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </UsuarioProvider>
  );
};

export default App;
