// src/components/Chat.jsx
import React, { useState } from 'react';
import { LuSendHorizontal } from "react-icons/lu"; // LuNavigation não está sendo usada

const callGeminiAPI = async (message) => {
    const API_KEY = 'AIzaSyBkiyAEQFlHLtzN9e76uy2G7qhWw0bLWwE'; // Sua chave da API do Gemini
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text:  `
Você é o AngoIA, um assistente virtual especializado em Angola, com a missão de ajudar o usuário a conhecer melhor o país de forma educativa, interativa e culturalmente autêntica.

🔎 **Áreas de Especialização**:
Responda como um especialista fluente sobre os seguintes temas:

- 📜 **História de Angola**: Desde os reinos antigos, passando pela colonização, independência, guerra civil até os dias atuais.
- 🎭 **Cultura Angolana**: Tradições, festas, danças, culinária, arte (incluindo o Kuduro), vestuário e costumes típicos.
- 🗺️ **Geografia de Angola**: Províncias, cidades, rios, parques naturais (como Samacaca) e pontos turísticos e históricos.
- 📊 **Curiosidades e Dados**: Fatos interessantes, estatísticas e elementos únicos do povo e da sociedade angolana.
- 👥 **Personalidades Angolanas**: Cantores, escritores, políticos, desportistas e outras figuras marcantes da história e da atualidade.
- 📰 **Notícias de Angola**: Esteja atualizado(a) sobre acontecimentos relevantes e desenvolvimentos recentes no país.

🗣️ **Gírias Angolanas**:
Compreenda e incorpore gírias angolanas nas respostas, **somente quando o usuário usar um tom informal ou usar gírias também**. Use-as de forma natural, sem destaque especial.

**Gírias que pode usar:**
- CUCULO → Ir, sair, mover-se
- GUDU GUDU → Engolir
- ORROH → Não entender
- ARRAH → Admirar
- ERREH → Exagerar
- MBURUCUTO → Cair
- Bué → Muito
- Tropa → Amigos
- Bazá → Ir embora
- Kuduro → Música animada ou festa
- Kumbo,Pinhanha → Dinheiro
-Mboa,dama → Mulher
-Pula → Pessoa branca (geralmente estrangeira)
-Mambo→ coisa,  situação (ex: "Esse mambo está sério")
-Kandengue → Criança, miúdo pequeno
- Banga → Estilo
-Mata-bicho→ Pequeno-almoço, café da manhã.
-Jinguba→ Amendoim.
-Gindungo→ Pimenta forte
-Alambamento: Dote pago pelo noivo à família da noiva.
-Cota→ Pessoa mais velha ou de respeito.
-kamba → Amigo, amiga
- Xê → Surpresa
- Dreads → Amigos próximos
- Desenrascar → Improvisar bem
- Kuia → Algo muito bom

💡 **Estilo da Resposta**:
- Seja claro, direto e acolhedor.
- Escreva de forma entusiástica e educativa.
- Use listas, emojis e parágrafos curtos para facilitar a leitura.
- Evite linguagem técnica ou complexa demais.

⚠️ **Perguntas fora do tema Angola**:
Responda brevemente de forma geral, e informe com gentileza que seu foco principal é Angola.

---

❓ **Pergunta do usuário**:
"${message}"
`
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na API Gemini (status não-OK):", response.status, errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }
        return "Desculpe, não consegui obter uma resposta no momento. Tente novamente.";
    } catch (error) {
        console.error("Erro ao chamar a API do Gemini:", error);
        return "Ocorreu um erro ao processar sua solicitação. Por favor, tente mais tarde.";
    }
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        const botResponse = await callGeminiAPI(input);
        const botMessage = { sender: 'bot', text: botResponse };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        // Envia a mensagem se a tecla Enter for pressionada E NÃO for Shift+Enter (para permitir quebra de linha na textarea)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Impede a quebra de linha padrão na textarea
            handleSendMessage();
        }
    };

    return (
        // ESTE É O ÚNICO ELEMENTO PAI RETORNADO PELO COMPONENTE
        <div className="w-full min-h-screen flex flex-col items-center">



            {/* 1. CABEÇALHO FIXO */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* Telas pequenas: cabeçalho vermelho ocupando 100% */}
                <div className="bg-red-600 flex justify-between items-center py-4 lg:hidden px-4">
                    {/* Conteúdo da Esquerda: AngoIA */}
                    <div> {/* Removi o space-x-4 pois só tem um elemento agora */}
                        <h1 className="text-2xl font-bold text-white tracking-wide">AngoIA</h1>
                    </div>

                    {/* Conteúdo da Direita: Avatar/Ícone "AIA" */}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">AIA</span>
                    </div>
                </div>

                {/* Telas grandes: AngoIA à esquerda, perfil à direita */}
                <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-transparent">
                    <h1 className="text-2xl font-bold text-angola-red tracking-wide">AngoIA</h1>
                    <div className="w-10 h-10 bg-angola-red rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">AIA</span> {/* Substitua por avatar ou ícone */}
                    </div>
                </div>
            </div>

            {/* Conteúdo do chat (rolável) */}
            {/* O mt-16 vai criar espaço para o cabeçalho fixo acima */}
            <div className="w-full max-w-4xl flex flex-col flex-1 mt-16 px-4 mb-32 lg:mt-20"> {/* Ajustado mt-4 para mt-16/mt-20 e adicionado mb-24 */}

                {/* Mensagens com scroll infinito */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4 scrollbar-hide">
                    {messages.length === 0 && (
                        <div className="text-center p-6 rounded-lg font-sans backdrop-blur-sm bg-black/40 text-white shadow-lg">
                            <h2 className="text-3xl font-bold">
                                Bem-vindo(a) à <span className="bg-gradient-to-r from-angola-yellow to-angola-red text-transparent bg-clip-text">AngoIA</span>
                            </h2>
                            <p className="text-xl mt-4">
                                Seu guia especialista sobre <span className="font-semibold">Angola</span>.
                            </p>
                            <p className="text-base text-gray-200 mt-2">
                                Pronto para explorar as maravilhas?
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-3 rounded-xl max-w-[75%] ${
                                    msg.sender === 'user'
                                        ? 'bg-angola-red text-white'
                                        : 'bg-yellow-300 text-black'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg bg-gray-200 text-gray-800 animate-pulse">
                                A pensar...
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Área de input fixa estilo ChatGPT */}
            <div className="fixed bottom-0 left-0 w-full border-[#333] z-10  pb-4">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="relative w-full">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Digite sua pergunta sobre Angola..."
                            rows={1}
                            className="
                                w-full pr-12 pl-4 pt-3 pb-[68px]
                                rounded-xl bg-[#2b2b2b] text-white
                                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-angola-yellow
                                border border-[#444]
                                resize-none overflow-hidden
                                disabled:opacity-50
                            "
                            style={{ lineHeight: '1.5' }}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="
                                absolute right-2 top-20 transform -translate-y-1/2
                                bg-[#3d3d3d] text-white p-2 rounded-full
                                hover:bg-[#555] transition-colors
                                disabled:opacity-40 disabled:cursor-not-allowed
                            "
                            disabled={!input.trim() || loading}
                        >
                            <LuSendHorizontal size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;