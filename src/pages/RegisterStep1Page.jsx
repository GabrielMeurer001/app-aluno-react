import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import InputField from '../components/InputField';

const RegisterStep1Page = () => {
  const { saveStep1Cpf, tempCpf } = useUsuario();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState(tempCpf || '');
  const [erro, setErro] = useState('');

  const formatCpf = (value) => {
    // Formatador básico de máscara de CPF: 000.000.000-00
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const handleChange = (e) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    if (erro) setErro('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cpf.trim()) {
      setErro('Por favor, informe seu CPF para prosseguir.');
      return;
    }
    
    saveStep1Cpf(cpf);
    navigate('/cadastro-passo2');
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
            Passo 1 de 2. <br />
            Por favor insira seu CPF para prosseguir.
          </p>

          <form onSubmit={handleSubmit}>
            <InputField
              label="CPF"
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleChange}
              error={erro}
            />

            <button type="submit" style={{ marginTop: '20px' }}>
              Prosseguir
            </button>
          </form>

          <p className="registre-se" style={{ marginTop: '20px' }}>
            Já tem uma conta? <Link to="/login">Faça login.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1Page;
