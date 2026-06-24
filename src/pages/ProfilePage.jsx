import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../components/Layout';
import { getGithubProfile } from '../services/githubService';
import { Loader2, Save, Key, UserCheck } from 'lucide-react';

const GithubIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProfilePage = () => {
  const { usuario, register } = useUsuario();
  const [activeTab, setActiveTab] = useState('dados'); // 'dados', 'config', 'seguranca'

  // Estados de integração com o GitHub
  const [githubData, setGithubData] = useState(null);
  const [loadingGit, setLoadingGit] = useState(false);
  const [errorGit, setErrorGit] = useState('');

  // Estados de configuração editável
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [githubUsername, setGithubUsername] = useState(usuario?.githubUsername || '');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Estados de mudança de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [senhaSuccess, setSenhaSuccess] = useState('');
  const [senhaErro, setSenhaErro] = useState('');

  // Busca o perfil do GitHub ao montar o componente ou quando o githubUsername muda
  useEffect(() => {
    let active = true;
    if (!usuario?.githubUsername) {
      setGithubData(null);
      setErrorGit('');
      return;
    }

    const fetchGit = async () => {
      setLoadingGit(true);
      setErrorGit('');
      try {
        const data = await getGithubProfile(usuario.githubUsername);
        if (active) {
          setGithubData(data);
        }
      } catch (err) {
        if (active) {
          setErrorGit(err.message || 'Erro ao carregar dados do GitHub.');
          setGithubData(null);
        }
      } finally {
        if (active) {
          setLoadingGit(false);
        }
      }
    };

    fetchGit();
    return () => { active = false; };
  }, [usuario?.githubUsername]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSaveSuccess('');

    // Atualiza os campos na lista do localStorage
    const registered = localStorage.getItem('app_aluno_registered_users');
    if (registered) {
      const users = JSON.parse(registered);
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === usuario.email.toLowerCase());

      if (userIndex !== -1) {
        users[userIndex].telefone = telefone;
        users[userIndex].githubUsername = githubUsername;
        localStorage.setItem('app_aluno_registered_users', JSON.stringify(users));

        // Atualiza a sessão atual do contexto
        usuario.telefone = telefone;
        usuario.githubUsername = githubUsername;
        localStorage.setItem('app_aluno_user', JSON.stringify(usuario));

        setSaveSuccess('Configurações atualizadas com sucesso!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setSenhaSuccess('');
    setSenhaErro('');

    if (!senhaAtual || !novaSenha) {
      setSenhaErro('Preencha todos os campos de senha.');
      return;
    }

    const registered = localStorage.getItem('app_aluno_registered_users');
    if (registered) {
      const users = JSON.parse(registered);
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === usuario.email.toLowerCase());

      if (userIndex !== -1) {
        if (users[userIndex].senha !== senhaAtual) {
          setSenhaErro('Senha atual incorreta.');
          return;
        }

        users[userIndex].senha = novaSenha;
        localStorage.setItem('app_aluno_registered_users', JSON.stringify(users));

        setSenhaSuccess('Senha alterada com sucesso!');
        setSenhaAtual('');
        setNovaSenha('');
      }
    }
  };

  // Gera iniciais para o avatar
  const getInitials = (nome) => {
    if (!nome) return 'A';
    const split = nome.split(' ');
    if (split.length > 1) {
      return (split[0][0] + split[split.length - 1][0]).toUpperCase();
    }
    return split[0].slice(0, 2).toUpperCase();
  };

  const formatCpfMask = (cpfStr) => {
    if (!cpfStr) return '***.***.***-**';
    // Retorna CPF mascarado: ***.***.***-89
    const clean = cpfStr.replace(/\D/g, '');
    if (clean.length === 11) {
      return `***.***.***-${clean.slice(9)}`;
    }
    return cpfStr;
  };

  const userInitials = getInitials(usuario?.nome);
  const preferredName = githubData?.name ? githubData.name.split(' ')[0] : (usuario?.nome ? usuario.nome.split(' ')[0] : 'Jonh');

  return (
    <Layout>
      <div className="profile-card">
        {/* Cabeçalho do Perfil */}
        <div className="profile-header">
          {githubData?.avatarUrl ? (
            <img
              src={githubData.avatarUrl}
              alt={usuario?.nome}
              className="profile-avatar-circle"
            />
          ) : (
            <div className="profile-avatar-circle">
              {userInitials}
            </div>
          )}
          <div className="profile-header-info">
            <h2>{usuario?.nome || 'Nome do Aluno'}</h2>
            <p>Engenharia de Software • 3º Ano</p>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="profile-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'dados'}
            className={`profile-tab ${activeTab === 'dados' ? 'active' : ''}`}
            onClick={() => setActiveTab('dados')}
          >
            Dados Pessoais
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'config'}
            className={`profile-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Configurações
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'seguranca'}
            className={`profile-tab ${activeTab === 'seguranca' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguranca')}
          >
            Segurança
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="profile-details">
          {activeTab === 'dados' && (
            <div className="animate-fade-in">
              <div className="profile-row">
                <div className="profile-row-label">Nome Completo</div>
                <div className="profile-row-value">{usuario?.nome}</div>
              </div>
              <div className="profile-row">
                <div className="profile-row-label">Nome de Preferência</div>
                <div className="profile-row-value">{preferredName}</div>
              </div>
              <div className="profile-row">
                <div className="profile-row-label">Endereço de E-mail</div>
                <div className="profile-row-value">{usuario?.email}</div>
              </div>
              <div className="profile-row">
                <div className="profile-row-label">Matrícula / CPF</div>
                <div className="profile-row-value">{formatCpfMask(usuario?.cpf)}</div>
              </div>
              <div className="profile-row">
                <div className="profile-row-label">Número de Telefone</div>
                <div className="profile-row-value">{usuario?.telefone || 'Não fornecido'}</div>
              </div>

              {/* Detalhes da integração com o GitHub com base em três estados */}
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border-light)', paddingTop: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '12px' }}>
                  <GithubIcon size={18} /> Integração GitHub (API Externa)
                </h4>

                {usuario?.githubUsername ? (
                  <>
                    {/* Estado de Carregamento */}
                    {loadingGit && (
                      <div className="tutor-loading-bubble" style={{ marginLeft: 0 }}>
                        <Loader2 className="animate-spin" size={16} />
                        Carregando informações do perfil do GitHub...
                      </div>
                    )}

                    {/* Estado de Erro */}
                    {errorGit && (
                      <div className="tutor-error-bubble" style={{ marginLeft: 0 }}>
                        Erro ao carregar informações do GitHub:{errorGit}
                      </div>
                    )}

                    {/* Estado de Sucesso/Dados */}
                    {githubData && !loadingGit && (
                      <div className="animate-fade-in" style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '4px', border: '1px solid var(--color-border-light)' }}>
                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                          <strong>Login:</strong> <a href={githubData.htmlUrl} target="_blank" rel="noopener noreferrer">{githubData.login}</a>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                          <strong>Biografia:</strong> {githubData.bio}
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                          <strong>Localização:</strong> {githubData.location}
                        </p>
                        <p style={{ fontSize: '14px' }}>
                          <strong>Repositórios Públicos:</strong> {githubData.publicRepos}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Nenhuma conta do GitHub conectada. Vá em <strong>Configurações</strong> para integrar.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="animate-fade-in" style={{ maxWidth: '400px', padding: '10px' }}>
              {saveSuccess && (
                <div style={{ backgroundColor: '#e8f5ed', color: '#2e7d32', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #2e7d32', marginBottom: '16px', fontSize: '14px' }}>
                  {saveSuccess}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="telefone_edit" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Número de Telefone
                </label>
                <input
                  id="telefone_edit"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="github_edit" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Usuário do GitHub
                </label>
                <input
                  id="github_edit"
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="Ex: lucasbeskow"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                />
              </div>

              <button type="submit" className="card__button" style={{ margin: 0, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> Salvar Alterações
              </button>
            </form>
          )}

          {activeTab === 'seguranca' && (
            <form onSubmit={handleChangePassword} className="animate-fade-in" style={{ maxWidth: '400px', padding: '10px' }}>
              {senhaSuccess && (
                <div style={{ backgroundColor: '#e8f5ed', color: '#2e7d32', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #2e7d32', marginBottom: '16px', fontSize: '14px' }}>
                  {senhaSuccess}
                </div>
              )}

              {senhaErro && (
                <div style={{ backgroundColor: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #d32f2f', marginBottom: '16px', fontSize: '14px' }}>
                  {senhaErro}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="senha_atual" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Senha Atual
                </label>
                <input
                  id="senha_atual"
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="nova_senha" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Nova Senha
                </label>
                <input
                  id="nova_senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                />
              </div>

              <button type="submit" className="card__button" style={{ margin: 0, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} /> Alterar Senha
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
