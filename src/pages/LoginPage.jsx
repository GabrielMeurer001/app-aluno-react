import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import InputField from '../components/InputField';

const LoginPage = () => {
  const { login } = useUsuario();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroGlobal, setErroGlobal] = useState('');

  const validarForm = () => {
    const novosErros = {};
    if (!email) {
      novosErros.email = 'O endereço de e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'Insira um e-mail válido.';
    }
    
    if (!senha) {
      novosErros.senha = 'A senha é obrigatória.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroGlobal('');

    if (validarForm()) {
      const res = login(email, senha);
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
          <h1>Bem-vindo de volta</h1>
          <p>Por favor, insira suas credenciais para acessar seu painel acadêmico</p>

          {erroGlobal && (
            <div className="form-alert-error">
              {erroGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Endereço de e-mail"
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
              labelLink={{
                text: 'Esqueceu?',
                to: '/recuperar-senha',
                onClick: () => navigate('/recuperar-senha')
              }}
            />

            <button type="submit">Entrar</button>
          </form>

          <p className="registre-se">
            Não tem uma conta?{' '}
            <Link to="/cadastro-passo1">Registre-se agora.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
