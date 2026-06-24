/**
 * Servico para consumir a API do GitHub
 */
export const getGithubProfile = async (username) => {
  if (!username) {
    throw new Error('Nome de usuário do GitHub não fornecido.');
  }

  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url);


    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Usuário do GitHub não encontrado.');
      }
      throw new Error(`Erro na API do GitHub: Status ${response.status}`);
    }

    const data = await response.json();
    return {
      avatarUrl: data.avatar_url,
      bio: data.bio || 'Sem biografia disponível.',
      location: data.location || 'Não informada',
      publicRepos: data.public_repos,
      htmlUrl: data.html_url,
      login: data.login,
      name: data.name || data.login
    };
  } catch (error) {
    console.error('Erro ao buscar perfil do GitHub:', error);
    throw error;
  }
};
