# AngoIA

## 🇦🇴 O que é o AngoIA?

AngoIA é um projeto inovador que visa criar um chatbot interativo focado em fornecer informações e responder a perguntas relacionadas à Angola. Utilizando tecnologia de Inteligência Artificial da Google, este chatbot será um recurso valioso para explorar a rica história, cultura, geografia e curiosidades de Angola, tornando o conhecimento sobre o país mais acessível e envolvente.

## ✨ Funcionalidades Principais

* **Respostas Especializadas:** O chatbot é configurado para atuar como um "especialista em Angola", priorizando informações relevantes sobre o país.
* **Interface Intuitiva:** Um design limpo e responsivo, construído com React e Tailwind CSS.
* **Estilo Angolano:** Paleta de cores e elementos visuais inspirados na cultura e na bandeira de Angola, proporcionando uma experiência visualmente rica. Inclui uma imagem de fundo personalizada para imersão.
* **Responsividade:** Adapta-se a diferentes tamanhos de tela, oferecendo uma experiência otimizada tanto em dispositivos móveis quanto em desktops.

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * [**React**](https://react.dev/): Biblioteca JavaScript para construção de interfaces de usuário.
    * [**Vite**](https://vitejs.dev/): Ferramenta de build rápida para desenvolvimento frontend.
    * [**Tailwind CSS**](https://tailwindcss.com/): Framework CSS utilitário para estilização rápida e responsiva.
* **Inteligência Artificial:**
    * [**Google Gemini API (Modelo Gemini 2.0 Flash)**](https://ai.google.dev/): API de modelo de linguagem grande (LLM) utilizada para processar as perguntas e gerar as respostas.
* **Ambiente de Desenvolvimento:**
    * [**WebStorm**](https://www.jetbrains.com/webstorm/): IDE (Ambiente de Desenvolvimento Integrado) para desenvolvimento web.

## 🚀 Como Executar o Projeto Localmente

Siga estas instruções para configurar e executar o projeto AngoIA em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em seu sistema.

* [Node.js (LTS recomendado)](https://nodejs.org/en/download/)
* npm (vem com o Node.js) ou [Yarn](https://yarnpkg.com/)

### Instalação

1.  **Clone o repositório (se estiver em um):**
    ```bash
    git clone <https://github.com/TheRealCocky/AngoIA>
    cd angoia
    ```
    Se você criou o projeto usando `npm create vite@latest angoia -- --template react`, você já estará na pasta `angoia` e pode pular o `git clone` e `cd angoia`.

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configurar Tailwind CSS:**
    * Após a instalação das dependências, o Tailwind CSS já deve ter sido inicializado (se você seguiu os passos anteriores). Verifique se os arquivos `tailwind.config.js` e `postcss.config.js` estão na raiz do projeto.
    * Confirme se o `tailwind.config.js` está configurado para escanear seus arquivos React e possui as cores angolanas:
        ```javascript
        // tailwind.config.js
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {
              colors: {
                'angola-red': '#EF4444',
                'angola-black': '#1A202C',
                'angola-yellow': '#FBBF24',
                'angola-green': '#10B981',
                'angola-brown': '#7C2D12',
                'primary-brand': '#FFD700',
                'secondary-brand': '#DC2626',
                'text-dark': '#2D3748',
                'bg-light': '#F3F4F6',
              },
            },
          },
          plugins: [],
        }
        ```
    * Certifique-se de que `src/index.css` contém as diretivas Tailwind:
        ```css
        /* src/index.css */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```
    * E que `src/main.jsx` importa este CSS:
        ```jsx
        // src/main.jsx
        import './index.css';
        // ...
        ```

### Configuração da API do Google Gemini

Para que o AngoIA possa responder às perguntas, ele precisa de uma chave de API do Google Gemini.

1.  **Obtenha sua Chave de API:**
    * Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
    * Faça login com sua conta Google.
    * Crie ou selecione um projeto existente.
    * Na seção "Get API key", clique em **"Create API key"** para gerar uma nova chave.
    * **Copie a chave gerada. Ela será exibida apenas uma vez!**

2.  **Adicione a Chave ao Projeto:**
    * Abra o arquivo `src/components/Chat.jsx`.
    * Localize a linha que define `API_KEY` e substitua `'SUA_CHAVE_DE_API_RECEM_GERADA_AQUI'` pela chave que você acabou de gerar. Garanta que o modelo também esteja correto (`gemini-2.0-flash`):
        ```javascript
        // src/components/Chat.jsx
        // ...
        const callGeminiAPI = async (message) => {
            const API_KEY = 'SUA_CHAVE_DE_API_RECEM_GERADA_AQUI'; // Cole sua chave real aqui
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            // ...
        };
        // ...
        ```
    * **Atenção de Segurança:** Para fins de prototipagem e desenvolvimento local, a chave está diretamente no frontend. **Para implantação em produção, é CRUCIAL mover esta chave para um backend seguro (como um servidor Node.js) para evitar que seja exposta publicamente.**

### Personalização Visual (Estilo Angolano)

O projeto AngoIA vem com uma paleta de cores e estilo visual inspirado em Angola.

1.  **Cores Personalizadas:**
    * As cores são definidas em `tailwind.config.js` (ver secção de configuração do Tailwind acima).
2.  **Imagem de Fundo:**
    * Uma imagem de fundo (`samacaca.webp`) é utilizada em `src/App.jsx`.
    * Certifique-se de que o arquivo da imagem (`samacaca.webp`) está localizado em `src/imagens/` (ou ajuste o caminho de importação em `App.jsx` se for diferente).
    * O código em `App.jsx` para o fundo deve ser:
        ```jsx
        // src/App.jsx
        import React from 'react';
        import Chat from './components/Chat';
        import './index.css';
        import samacacaImage from '../src/imagens/samacaca.webp'; // Caminho relativo ajustado

        const App = () => {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
                     style={{
                         backgroundImage: `url(${samacacaImage})`,
                         backgroundSize: 'cover',
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center',
                     }}
                >
                    <Chat />
                </div>
            );
        };

        export default App;
        ```
    * Você pode trocar esta imagem por qualquer outra que desejar, atualizando o caminho no `import` de `App.jsx`.

### Executando o Servidor de Desenvolvimento

Após todas as configurações, inicie o aplicativo:

```bash
npm run dev
# ou
yarn dev