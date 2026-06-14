import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const validarForm = () => {
    if (!email) {
      setErro('O endereço de e-mail é obrigatório.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro('Insira um e-mail válido.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarForm()) {
      setSucesso(true);
      setErro('');
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
          <h1>Esqueci minha senha</h1>
          <p>Informe seu e-mail para enviarmos o link para redefinir sua senha.</p>

          {sucesso ? (
            <div style={{ textAlign: 'left' }} className="animate-fade-in">
              <div style={{
                backgroundColor: '#e8f5ed',
                color: '#2e7d32',
                padding: '16px',
                borderRadius: '4px',
                borderLeft: '4px solid #2e7d32',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✓ Link de redefinição enviado com sucesso para: <strong>{email}</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '30px' }}>
                Simulando o fluxo de envio acadêmico. Clique abaixo para prosseguir e criar a sua nova senha.
              </p>
              
              <button 
                onClick={() => navigate('/nova-senha')}
                className="form-btn-submit"
                style={{ marginBottom: '20px' }}
              >
                Definir Nova Senha
              </button>
            </div>
          ) : (
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
                  if (erro) setErro('');
                }}
                error={erro}
              />

              <button type="submit">Enviar</button>
            </form>
          )}

          <div style={{ marginTop: '20px' }}>
            <Link to="/login" className="link-btn-back">
              ← Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
