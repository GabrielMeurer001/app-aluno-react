/**
 * Servico para simular as respostas do Tutor IA consumindo a API JSONPlaceholder
 */
export const getTutorResponse = async (pergunta) => {
  if (!pergunta) {
    throw new Error('A pergunta não pode ser vazia.');
  }

  // Obter um post aleatório ID de 1 a 100
  const randomId = Math.floor(Math.random() * 100) + 1;
  const url = `https://jsonplaceholder.typicode.com/posts/${randomId}`;

  try {
    const response = await fetch(url);


    if (!response.ok) {
      throw new Error(`Erro no servidor da IA: Status ${response.status}`);
    }

    const data = await response.json();

    // Formatar como resposta em português
    const respostaFormatada = `Olá! Analisando sua dúvida sobre "${pergunta}", aqui está uma explicação conceitual baseada em nosso repositório acadêmico:

"${data.body.replace(/\n/g, ' ')}"

Este tópico está intimamente associado com: "${data.title.toUpperCase()}".

Espero que essa explicação ajude no seu aprendizado! Tem mais alguma dúvida sobre este assunto?`;

    return respostaFormatada;
  } catch (error) {
    console.error('Erro ao chamar o Tutor IA:', error);
    throw error;
  }
};
