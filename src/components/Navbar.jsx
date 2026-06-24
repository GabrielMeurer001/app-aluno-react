import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  User, 
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const { logout, usuario } = useUsuario();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Painel', icon: <LayoutDashboard size={18} /> },
    { to: '/disciplinas', label: 'Disciplinas', icon: <BookOpen size={18} /> },
    { to: '/tutor-ia', label: 'Tutor IA', icon: <Bot size={18} /> },
    { to: '/perfil', label: 'Perfil', icon: <User size={18} /> }
  ];

  return (
    <>
      {/* Navegação superior para Desktop */}
      <header className="menu">
        <div className="menu__body">
          <NavLink to="/dashboard" className="menu__title" style={{ textDecoration: 'none' }}>
            Academia <span>Portal do aluno</span>
          </NavLink>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <nav className="menu__links">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `menu__item ${isActive ? 'menu__item--active' : ''}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {usuario && (
              <button 
                onClick={handleLogout} 
                className="btn-logout" 
                title="Sair da Conta"
                aria-label="Sair da Conta"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navegação inferior para Mobile */}
      <nav className="mobile-nav-bar" aria-label="Navegação móvel">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        {usuario && (
          <button 
            onClick={handleLogout} 
            className="mobile-nav-item" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            title="Sair"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;
