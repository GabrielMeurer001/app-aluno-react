import React, { createContext, useState, useContext, useEffect } from 'react';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  // Try to load user session from localStorage on init
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('app_aluno_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Temporary CPF stored during Step 1 of registration
  const [tempCpf, setTempCpf] = useState(() => {
    return localStorage.getItem('app_aluno_temp_cpf') || '';
  });

  // Track progress of the dashboard subjects statefully
  const [progressoAulas, setProgressoAulas] = useState(() => {
    const stored = localStorage.getItem('app_aluno_progress');
    return stored ? JSON.parse(stored) : { front: 65, design: 25 };
  });

  // Save progress changes to localStorage
  useEffect(() => {
    localStorage.setItem('app_aluno_progress', JSON.stringify(progressoAulas));
  }, [progressoAulas]);

  // Save session changes to localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('app_aluno_user', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('app_aluno_user');
    }
  }, [usuario]);

  // Seed default user if none exists in registration databases
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('app_aluno_registered_users');
    if (!users) {
      const defaultUsers = [
        {
          nome: 'João Silva',
          email: 'joao.silva@satc.edu.br',
          telefone: '(48) 99999-9999',
          cpf: '123.456.789-00',
          githubUsername: 'lucasbeskow', // Seed default GitHub user to demo API
          senha: '123'
        }
      ];
      localStorage.setItem('app_aluno_registered_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(users);
  };

  const login = (email, senha) => {
    const users = getRegisteredUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (foundUser) {
      setUsuario({
        nome: foundUser.nome,
        email: foundUser.email,
        telefone: foundUser.telefone,
        cpf: foundUser.cpf,
        githubUsername: foundUser.githubUsername
      });
      return { success: true };
    } else {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }
  };

  const saveStep1Cpf = (cpf) => {
    setTempCpf(cpf);
    localStorage.setItem('app_aluno_temp_cpf', cpf);
  };

  const register = (nome, telefone, email, senha, githubUsername) => {
    const users = getRegisteredUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser = {
      nome,
      telefone: telefone || 'Não fornecido',
      email,
      senha,
      cpf: tempCpf || '000.000.000-00',
      githubUsername: githubUsername || ''
    };

    // Save to registered users list
    users.push(newUser);
    localStorage.setItem('app_aluno_registered_users', JSON.stringify(users));

    // Clear temp CPF
    setTempCpf('');
    localStorage.removeItem('app_aluno_temp_cpf');

    // Auto-login registered user
    setUsuario({
      nome: newUser.nome,
      email: newUser.email,
      telefone: newUser.telefone,
      cpf: newUser.cpf,
      githubUsername: newUser.githubUsername
    });

    // Reset courses progress upon new user registration to show starting values
    setProgressoAulas({ front: 65, design: 25 });

    return { success: true };
  };

  const logout = () => {
    setUsuario(null);
  };

  const concluirMateria = (materia) => {
    setProgressoAulas((prev) => ({
      ...prev,
      [materia]: 100
    }));
  };

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        tempCpf,
        progressoAulas,
        login,
        saveStep1Cpf,
        register,
        logout,
        concluirMateria
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
};
