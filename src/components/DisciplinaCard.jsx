import React from 'react';

const DisciplinaCard = ({
  nome,
  professor,
  status, // 'EM CURSO' or 'PRÓXIMO SEMESTRE'
  progresso, // number
  onAcessar
}) => {
  const isEmCurso = status === 'EM CURSO';
  const badgeClass = isEmCurso ? '' : 'badge-blue';
  
  return (
    <div className="card animate-fade-in" style={{ flexDirection: 'column', alignItems: 'stretch', margin: 0 }}>
      <div className="disciplina-card-top">
        <div>
          <h3 className="card__title" style={{ paddingTop: 0 }}>{nome}</h3>
          <p className="disciplina-professor">{professor}</p>
        </div>
        <span className={`card__badge ${badgeClass}`}>
          {status}
        </span>
      </div>

      <div className="disciplina-card-progress-section">
        <div className="disciplina-card-progress-labels">
          <span>{isEmCurso ? 'Progresso' : 'Disponibilidade'}</span>
          <span>{progresso}%</span>
        </div>
        <div className="card__progress" style={{ width: '100%' }}>
          <div style={{ width: `${progresso}%` }}></div>
        </div>
      </div>

      <button onClick={onAcessar} className="card__button" style={{ width: '100%', margin: 0 }}>
        Acessar Disciplina
      </button>
    </div>
  );
};

export default DisciplinaCard;
