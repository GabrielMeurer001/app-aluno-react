import React from 'react';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../components/Layout';
import DisciplinaCard from '../components/DisciplinaCard';

const DisciplinasPage = () => {
  const { progressoAulas } = useUsuario();

  // Lista de dados personalizados para disciplinas
  const disciplinas = [
    {
      id: 'front',
      nome: 'Front-end',
      professor: 'PROF. MARCO SILVA',
      status: 'EM CURSO',
      // Se concluído no dashboard , mostra 100%, senão mostra o padrão de 75% da imagem
      progresso: progressoAulas.front === 100 ? 100 : 75
    },
    {
      id: 'design',
      nome: 'UX Design',
      professor: 'DRA. ANA LUCIA',
      status: 'PRÓXIMO SEMESTRE',
      // Se concluído no dashboard (100%), mostra 100%, senão mostra o padrão de 0% da imagem
      progresso: progressoAulas.design === 100 ? 100 : 0
    }
  ];

  const handleAcessar = (nome) => {
    alert(`Acessando a disciplina: ${nome}.\nConteúdo acadêmico em desenvolvimento.`);
  };

  return (
    <Layout>
      <div className="disciplinas-header">
        <h1>Minhas Disciplinas</h1>
      </div>

      {/* Container grid com renderização de lista */}
      <div className="disciplinas-grid">
        {disciplinas.map((d) => (
          <DisciplinaCard
            key={d.id}
            nome={d.nome}
            professor={d.professor}
            status={d.status}
            progresso={d.progresso}
            onAcessar={() => handleAcessar(d.nome)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default DisciplinasPage;
