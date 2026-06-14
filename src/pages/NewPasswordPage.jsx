import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [repitaSenha, setRepitaSenha] = useState('');
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState(false);

  const validarForm = () => {
    const novosErros = {};
    if (!senha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (senha.length < 3) {
      novosErros.senha = 'A senha deve conter pelo menos 3 caracteres.';
    }

    if (!repitaSenha) {
      novosErros.repitaSenha = 'Confirmar a senha é obrigatório.';
    } else if (senha !== repitaSenha) {
      novosErros.repitaSenha = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarForm()) {
      // In a real application, we would call an API or context function to change the password
      setSucesso(true);
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
          <h1>Nova Senha</h1>
          <p>Informe abaixo sua nova senha.</p>

          {sucesso ? (
            <div className="animate-fade-in">
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
                ✓ Senha redefinida com sucesso!
              </div>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '30px' }}>
                Sua senha foi atualizada no sistema acadêmico. Clique abaixo para fazer login com a nova credencial.
              </p>
              
              <button 
                onClick={() => navigate('/login')}
                className="form-btn-submit"
              >
                Fazer Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
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

              <InputField
                label="Repita a Senha"
                id="repitasenha"
                name="repitaSenha"
                type="password"
                value={repitaSenha}
                onChange={(e) => {
                  setRepitaSenha(e.target.value);
                  if (erros.repitaSenha) setErros({ ...erros, repitaSenha: '' });
                }}
                error={erros.repitaSenha}
              />

              <button type="submit" style={{ marginTop: '20px' }}>
                Salvar
              </button>
            </form>
          )}

          {!sucesso && (
            <div style={{ marginTop: '20px' }}>
              <Link to="/login" className="link-btn-back">
                ← Cancelar e Voltar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
