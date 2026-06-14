# Portal do Aluno (App Aluno) - React SPA

Este projeto é a portabilidade da aplicação **App Aluno** (desenvolvida originalmente em HTML, CSS e JS puros) para uma Single Page Application (SPA) em **React**.

O trabalho foi realizado como projeto final para a disciplina de **Front-end** do curso de **Engenharia de Software** no **Centro Universitário SATC**.

---

##  Como Executar o Projeto

Para rodar a aplicação localmente, certifique-se de que você possui o [Node.js](https://nodejs.org/) instalado em sua máquina e siga os passos abaixo:

### 1. Clonar ou Acessar a Pasta do Projeto
Navegue até a pasta onde o projeto está localizado:
```bash
cd app-aluno-react
```

### 2. Instalar as Dependências
Instale todos os pacotes necessários especificados no `package.json`:
```bash
npm install
```

### 3. Executar o Servidor de Desenvolvimento
Inicie o servidor local do Vite em modo de desenvolvimento:
```bash
npm run dev
```
Após o comando, a aplicação estará disponível no endereço indicado no terminal (geralmente [http://localhost:5173](http://localhost:5173)). Abra-o no navegador.

### 4. Gerar o Build de Produção (Opcional)
Para validar ou gerar a versão otimizada para publicação:
```bash
npm run build
```

---

## Credenciais para Demonstração (Login Rápido)

Para facilitar a correção e avaliação, a aplicação vem pré-semeada com um usuário de teste padrão em seu banco de dados local (`localStorage`):

*   **E-mail:** `joao.silva@satc.edu.br`
*   **Senha:** `123`
*   **Nome Completo:** João Silva
*   **Nome do GitHub Integrado:** `lucasbeskow`

> **Nota:** Você também pode utilizar a tela **Cadastre-se** para criar uma conta nova e personalizada informando CPF, Nome, E-mail, Senha e Usuário do GitHub. O fluxo efetuará login automático após o cadastro.

---

##  Tecnologias e Conceitos Aplicados

A aplicação foi estruturada seguindo rigorosamente os padrões modernos de React, cobrindo todos os requisitos avaliativos da disciplina:

1.  **Vite**: Plataforma de desenvolvimento ultrarrápida.
2.  **Componentização Reutilizável**: UI dividida em componentes independentes como `InputField` controlado, `Navbar` responsiva, layout estrutural `Layout` e contêineres flexíveis `Card`/`DisciplinaCard`.
3.  **Hooks (`useState`, `useEffect`)**:
    *   `useState` para controle de formulários, controle de abas de perfil, mensagens do chat, carregamento e controle de progresso.
    *   `useEffect` para efeito de relógio ao vivo na Dashboard, salvamento de sessões no `localStorage` e carregamento de requisições assíncronas.
4.  **Formulários Controlados & Validação**: Formulários com inputs vinculados ao estado, validação contra campos vazios ou formatos inválidos e exibição condicional de mensagens de erro na tela.
5.  **Roteamento SPA (`react-router-dom`)**:
    *   Utilização de `BrowserRouter`, `Routes` e `Route` para controle de telas.
    *   Páginas protegidas via componente de segurança `ProtectedRoute` (guarda de rotas que redireciona usuários não logados para o `/login`).
    *   Uso de `NavLink` para indicação visual estilizada da aba ativa de navegação e `useNavigate` para redirecionamento pós-login.
6.  **Context API**: Compartilhamento global de estados (sessão do usuário logado e progresso das matérias) sem necessidade de *prop drilling*.
7.  **Consumo de API Externa com Fetch**:
    *   **Tela Perfil**: Consome dados reais de biografia, foto de perfil, repositórios públicos e localização a partir da API oficial do GitHub (`https://api.github.com/users/{username}`) com base no username informado no cadastro ou nas configurações de perfil.
    *   **Tela Tutor IA**: Simula uma inteligência artificial acadêmica integrada que fornece explicações e respostas em português consumindo dinamicamente posts conceituais da API do JSONPlaceholder (`https://jsonplaceholder.typicode.com`).
    *   **Tratamento de 3 Estados**: Carregamento (*loading* com spinners/esqueleto visual), Erro (*error* com alertas tratáveis) e Sucesso (*data* exibindo o conteúdo carregado) utilizando a estrutura `try/catch/finally` e checagem de `res.ok`.
8.  **Responsividade Premium**:
    *   Estilização puramente em arquivos `.css` dedicados com variáveis HSL modernas, cantos arredondados, sombras dinâmicas e transições fluidas.
    *   Layout adaptativo que oculta a barra lateral no mobile, empilha os cartões de progresso em coluna única e adiciona uma barra de navegação inferior (*bottom navigation bar*), proporcionando uma experiência de aplicativo nativo em celulares.

---

##  Estrutura de Pastas do Projeto

A organização interna do código segue o padrão profissional de escalabilidade:

```text
app-aluno-react/
├── public/                  # Arquivos estáticos
├── src/
│   ├── components/          # Componentes visuais e estruturais (Layout, Card, InputField, Navbar, ProtectedRoute)
│   ├── pages/               # Páginas completas correspondentes às rotas da SPA
│   │   ├── LoginPage.jsx
│   │   ├── RegisterStep1Page.jsx
│   │   ├── RegisterStep2Page.jsx
│   │   ├── RecoverPasswordPage.jsx
│   │   ├── NewPasswordPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DisciplinasPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── TutorIAPage.jsx
│   ├── context/             # Provedor de contexto global (UsuarioContext.jsx)
│   ├── services/            # Serviços de requisições de API (githubService.js, tutorService.js)
│   ├── App.jsx              # Gerenciador de rotas e injeção de contexto
│   ├── main.jsx             # Ponto de entrada do React
│   └── index.css            # Estilos CSS globais e variáveis de design
├── index.html               # Estrutura HTML base com fontes e SEO
├── package.json             # Dependências e scripts
└── README.md                # Instruções e documentação (este arquivo)
```
