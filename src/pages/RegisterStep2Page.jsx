import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import InputField from '../components/InputField';

const RegisterStep2Page = () => {
  const { register, tempCpf } = useUsuario();
  const navigate = useNavigate();

  // Redirect if CPF is not set in step 1
  useEffect(() => {
    if (!tempCpf) {
      navigate('/cadastro-passo1');
    }
  }, [tempCpf, navigate]);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [erros, setErros] = useState({});
  const [erroGlobal, setErroGlobal] = useState('');

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const validarForm = () => {
    const novosErros = {};
    if (!nome.trim()) {
      novosErros.nome = 'O nome completo é obrigatório.';
    }
    
    if (!email) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'Insira um e-mail válido.';
    }

    if (!senha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (senha.length < 3) {
      novosErros.senha = 'A senha deve conter pelo menos 3 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroGlobal('');

    if (validarForm()) {
      const res = register(nome, telefone, email, senha, githubUsername);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErroGlobal(res.message);
      }
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="hero">
        <p>
          "Educação não é o aprendizado de fatos, mas treinamento da mente para pensar."
          <span>Albert Einstein</span>
        </p>
      </div>

      <div className="formulario">
        <div>
          <h1>Cadastre-se</h1>
          <p>
            Passo 2 de 2. <br />
            Por favor insira seus dados para finalizar e prosseguir.
          </p>

          {erroGlobal && (
            <div className="form-alert-error">
              {erroGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Nome"
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (erros.nome) setErros({ ...erros, nome: '' });
              }}
              error={erros.nome}
            />

            <InputField
              label="Telefone"
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="(99) 99999-9999"
              value={telefone}
              onChange={handlePhoneChange}
            />

            <InputField
              label="E-mail"
              id="email"
              name="email"
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erros.email) setErros({ ...erros, email: '' });
              }}
              error={erros.email}
            />

            <InputField
              label="Nome de usuário do GitHub (opcional)"
              id="githubUsername"
              name="githubUsername"
              type="text"
              placeholder="ex: lucasbeskow"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
            />

            <InputField
              label="Senha"
              id="senha"
              name="senha"
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erros.senha) setErros({ ...erros, senha: '' });
              }}
              error={erros.senha}
            />

            <button type="submit">Cadastrar</button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/cadastro-passo1" className="link-btn-back">
              ← Voltar Passo 1
            </Link>
            <Link to="/login" className="link-action" style={{ fontSize: '14px' }}>
              Já tem conta? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2Page;
