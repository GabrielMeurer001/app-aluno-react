import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { 
  Clock, 
  ClipboardList, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';

const DashboardPage = () => {
  const { usuario, progressoAulas, concluirMateria } = useUsuario();
  const [dataAtual, setDataAtual] = useState('');

  // Função para formatar data e hora exatamente em pt-BR
  const formatarData = () => {
    const agora = new Date();
    
    // Formato: D de MMMM de YYYY
    const dia = agora.getDate();
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const mes = meses[agora.getMonth()];
    const ano = agora.getFullYear();

    // Hora: hh:mm:ss a
    let horas = agora.getHours();
    const ampm = horas >= 12 ? 'pm' : 'am';
    horas = horas % 12;
    horas = horas ? horas : 12; // hora '0' deve ser '12'
    
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    const horasStr = String(horas).padStart(2, '0');

    return `${dia} de ${mes} de ${ano} (${horasStr}:${minutos}:${segundos} ${ampm})`;
  };

  // Relógio atualizado em tempo real
  useEffect(() => {
    setDataAtual(formatarData());
    const interval = setInterval(() => {
      setDataAtual(formatarData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determina a saudação dinâmica baseada na hora
  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const primeNome = usuario?.nome ? usuario.nome.split(' ')[0] : 'Aluno';

  return (
    <Layout>
      <div className="welcome">
        <h2 id="greeting">
          {getGreeting()}, {primeNome}.
        </h2>
        <p className="date-text" id="dataHoje">
          {dataAtual}
        </p>
        <p className="desc">
          Bem-vindo de volta à sua sessão de estudo focado. Você tem 2 tarefas para esta semana e está atualmente adiantado em seu cronograma de leitura.
        </p>
      </div>

      {/* Cartões de Cursos */}
      <Card
        badge="Em progresso"
        title="Front-end"
        description="Aula 2: Conceitos do desenvolvimento Front-end e GIT + Github."
        progress={progressoAulas.front}
        buttonText="Retomar Estudo"
        onButtonClick={() => concluirMateria('front')}
      />

      <Card
        badge="Em progresso"
        title="UX Design"
        description="Aula 3: Usabilidade."
        progress={progressoAulas.design}
        buttonText="Retomar Estudo"
        onButtonClick={() => concluirMateria('design')}
      />

      {/* Seção de Indicadores Inferiores */}
      <div className="card__group">
        <Card className="card-indicator">
          <div className="card-indicator-header">
            <span className="card__badge">Tempo de Estudo</span>
            <Clock className="card-indicator-icon" size={18} />
          </div>
          <h3 className="card__title">12h 45m</h3>
          <p className="card__description">Esta semana</p>
        </Card>

        <Card className="card-indicator">
          <div className="card-indicator-header">
            <span className="card__badge">Tarefas Pendentes</span>
            <ClipboardList className="card-indicator-icon" size={18} />
          </div>
          <h3 className="card__title">2</h3>
          <p className="card__description">Próximo vencimento em 2 dias</p>
        </Card>

        <Card className="card-indicator">
          <div className="card-indicator-header">
            <span className="card__badge">Discussões com IA</span>
            <MessageSquare className="card-indicator-icon" size={18} />
          </div>
          <h3 className="card__title">8</h3>
          <p className="card__description">Tópicos ativos</p>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
