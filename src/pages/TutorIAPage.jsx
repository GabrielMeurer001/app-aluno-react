import React, { useState, useRef, useEffect } from 'react';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../components/Layout';
import { getTutorResponse } from '../services/tutorService';
import {
  Bot,
  Send,
  Paperclip,
  Volume2,
  Copy,
  RefreshCw,
  ThumbsDown,
  Loader2,
  AlertCircle
} from 'lucide-react';

const TutorIAPage = () => {
  const { usuario } = useUsuario();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preenche as mensagens para corresponder exatamente ao print de referência tutor
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: usuario?.nome || 'João Silva',
      text: 'Explique computação quântica',
      isUser: true
    },
    {
      id: 2,
      sender: 'Tutor IA',
      text: 'Computação quântica é uma forma avançada de computação que usa as leis da mecânica quântica. Em vez de usar bits tradicionais, que podem ser 0 ou 1, ela utiliza qubits, que podem ser ambos ao mesmo tempo. Isso permite que os computadores quânticos realizem cálculos muito mais rapidamente do que os computadores comuns, resolvendo problemas complexos que seriam impossíveis para a tecnologia atual.',
      isUser: false
    }
  ]);

  // Rola para a parte inferior nas novas mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, error]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    setInput('');
    setError('');

    // Adiciona a mensagem do usuário
    const userMsg = {
      id: Date.now(),
      sender: usuario?.nome || 'Aluno',
      text: userMsgText,
      isUser: true
    };
    setMessages((prev) => [...prev, userMsg]);

    // busca 
    setLoading(true);

    try {
      // Consome a API do tutorService
      const aiResponseText = await getTutorResponse(userMsgText);

      //  Adiciona a mensagem da IA 
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'Tutor IA',
        text: aiResponseText,
        isUser: false
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Estado de erro
      setError(err.message || 'Ocorreu um erro ao obter resposta do Tutor.');
    } finally {

      setLoading(false);
    }
  };

  // Fala a mensagem usando SpeechSynthesis
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancela a fala ativa 
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não suporta síntese de voz.');
    }
  };

  // Copia o texto para a área de transferência
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Mensagem copiada para a área de transferência!');
  };

  // Tenta gerar a resposta novamente
  const handleRegenerate = async (lastUserText) => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const aiResponseText = await getTutorResponse(lastUserText);
      const aiMsg = {
        id: Date.now(),
        sender: 'Tutor IA',
        text: aiResponseText,
        isUser: false
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || 'Erro ao regenerar resposta.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (nome) => {
    if (!nome) return 'A';
    return nome.split(' ')[0][0].toUpperCase();
  };

  // Encontra o texto da última mensagem do usuário para tentar novamente se necessário
  const getLastUserMessageText = () => {
    const userMsgs = messages.filter((m) => m.isUser);
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : '';
  };

  return (
    <Layout>
      <div className="tutor-container">
        {/* Área do Histórico de Chat */}
        <div className="tutor-messages">
          {messages.map((m) => (
            <div key={m.id} className="message-bubble" style={{ alignSelf: m.isUser ? 'flex-end' : 'flex-start' }}>

              {/* Coluna do Avatar */}
              <div className={`message-avatar ${m.isUser ? 'user' : 'ai'}`}>
                {m.isUser ? (
                  getInitials(m.sender)
                ) : (
                  <Bot size={20} />
                )}
              </div>

              {/* Coluna de Conteúdo da Mensagem */}
              <div className="message-content">
                <span className="message-sender">{m.sender}</span>
                <p className="message-text">{m.text}</p>

                {/* Ações (Apenas para respostas da IA) */}
                {!m.isUser && (
                  <div className="message-actions">
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="message-action-btn"
                      title="Ouvir Resposta"
                      aria-label="Ouvir Resposta"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(m.text)}
                      className="message-action-btn"
                      title="Copiar Texto"
                      aria-label="Copiar Texto"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleRegenerate(getLastUserMessageText() || 'computação')}
                      className="message-action-btn"
                      title="Regenerar Resposta"
                      aria-label="Regenerar Resposta"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={() => alert('Feedback negativo registrado.')}
                      className="message-action-btn"
                      title="Feedback Ruim"
                      aria-label="Feedback Ruim"
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Renderiza o Balão de Estado de Carregamento */}
          {loading && (
            <div className="tutor-loading-bubble animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              Tutor IA está buscando uma resposta...
            </div>
          )}

          {/* Renderiza o Balão de Estado de Erro */}
          {error && (
            <div className="tutor-error-bubble animate-fade-in">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button
                onClick={() => handleRegenerate(getLastUserMessageText() || 'computação')}
                style={{
                  marginLeft: '12px',
                  background: 'none',
                  border: 'underline',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Seção da Barra de Entrada */}
        <div className="tutor-input-container">
          <form onSubmit={handleSend} className="tutor-input-form">
            <button
              type="button"
              className="tutor-input-btn-attach"
              onClick={() => alert('Anexo de arquivos indisponível no ambiente de demonstração.')}
              title="Anexar Arquivo"
              aria-label="Anexar Arquivo"
            >
              <Paperclip size={20} />
            </button>

            <input
              type="text"
              className="tutor-input-field"
              placeholder="Pergunte alguma coisa"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              className="tutor-input-btn-send"
              disabled={!input.trim() || loading}
              title="Enviar Pergunta"
              aria-label="Enviar Pergunta"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="tutor-disclaimer">
            O Tutor pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TutorIAPage;
