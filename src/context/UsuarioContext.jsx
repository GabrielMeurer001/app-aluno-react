import React, { createContext, useState, useContext, useEffect } from 'react';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  // Tenta carregar a sessão do usuário do localStorage na inicialização
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('app_aluno_user');
    return stored ? JSON.parse(stored) : null;
  });

  // CPF temporário armazenado durante o Passo 1 do cadastro
  const [tempCpf, setTempCpf] = useState(() => {
    return localStorage.getItem('app_aluno_temp_cpf') || '';
  });

  // Acompanha o progresso das matérias do painel com estado
  const [progressoAulas, setProgressoAulas] = useState(() => {
    const stored = localStorage.getItem('app_aluno_progress');
    return stored ? JSON.parse(stored) : { front: 65, design: 25 };
  });

  // Salva as alterações de progresso no localStorage
  useEffect(() => {
    localStorage.setItem('app_aluno_progress', JSON.stringify(progressoAulas));
  }, [progressoAulas]);

  // Salva as alterações de sessão no localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('app_aluno_user', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('app_aluno_user');
    }
  }, [usuario]);

  // Semeia usuário padrão se não existir no banco de dados de cadastro
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('app_aluno_registered_users');
    if (!users) {
      const defaultUsers = [
        {
          nome: 'Gabriel Meurer',
          email: 'gabrielmeurer2007@gmail.com',
          telefone: '(48) 99999-9999',
          cpf: '123.456.789-00',
          githubUsername: 'lucasbeskow', // Semeia usuário padrão do GitHub para demonstrar a API
          senha: '123456'
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

    // Salva na lista de usuários cadastrados
    users.push(newUser);
    localStorage.setItem('app_aluno_registered_users', JSON.stringify(users));

    // Limpa o CPF temporário
    setTempCpf('');
    localStorage.removeItem('app_aluno_temp_cpf');

    // Login automático do usuário cadastrado
    setUsuario({
      nome: newUser.nome,
      email: newUser.email,
      telefone: newUser.telefone,
      cpf: newUser.cpf,
      githubUsername: newUser.githubUsername
    });

    // Redefine o progresso dos cursos no cadastro de novo usuário para mostrar valores iniciais
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
