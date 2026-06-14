import React from 'react';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../components/Layout';
import DisciplinaCard from '../components/DisciplinaCard';

const DisciplinasPage = () => {
  const { progressoAulas } = useUsuario();

  // Custom data list for disciplines
  const disciplinas = [
    {
      id: 'front',
      nome: 'Front-end',
      professor: 'PROF. MARCO SILVA',
      status: 'EM CURSO',
      // If completed on dashboard (100%), show 100%, else show 75% default from image
      progresso: progressoAulas.front === 100 ? 100 : 75
    },
    {
      id: 'design',
      nome: 'UX Design',
      professor: 'DRA. ANA LUCIA',
      status: 'PRÓXIMO SEMESTRE',
      // If completed on dashboard (100%), show 100%, else show 0% default from image
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

      {/* Grid container with list rendering */}
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
