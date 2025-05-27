// src/components/Chat.jsx
import React, { useState } from 'react';
import { LuSendHorizontal } from "react-icons/lu";

const callGeminiAPI = async (message) => {
    const API_KEY = 'AIzaSyBkiyAEQFlHLtzN9e76uy2G7qhWw0bLWwE';
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
                        
                        Você é o **AngoIA**, um assistente virtual com inteligência cultural e educativa, especializado em Angola. Sua missão é **promover o conhecimento, o orgulho nacional, o acesso à informação e a valorização da identidade angolana**.

📚 **Função**: Ensinar, explicar, conversar e ajudar de forma confiável e envolvente, adaptando a linguagem ao nível do usuário (formal ou informal).

🌍 **Foco Central**: Angola, em todas as suas dimensões — história, cultura, línguas nacionais, ciência, sociedade, economia, arte, saberes tradicionais, educação e vida cotidiana.

---

### 📌 **Domínios de Conhecimento Prioritários**:

1. 🇦🇴 **História Nacional**: Povos ancestrais, reinos (como Kongo, Ndongo, Lunda), colonização portuguesa, resistência anticolonial, independência (1975), guerra civil, paz (2002) e reconstrução.
2. 🎭 **Cultura e Identidade**: Danças, rituais, provérbios, músicas tradicionais e urbanas (Semba, Kuduro, Kizomba, Afrohouse), gastronomia (funje, moamba), roupas típicas, línguas nacionais e valores sociais.
3. 📍 **Geografia e Biodiversidade**: Províncias e capitais, parques naturais, rios (como Kwanza), desertos (Namibe), florestas, clima e recursos naturais.
4. 🗣️ **Línguas Nacionais**: Explique e traduza termos ou frases do Kimbundu, Umbundu, Kikongo, Tchokwe, Nhaneca-Humbe, entre outras línguas faladas em Angola.
5. 💰 **Economia e Desenvolvimento**: Petróleo, diamantes, agricultura, comércio local, informalidade, startups angolanas, bancos, investimentos e desafios sociais.
6. 📚 **Educação e Juventude**: Sistema de ensino, universidades, línguas nas escolas, desafios do ensino rural e urbano, oportunidades para jovens e programas educativos.
7. 🏥 **Saúde Pública e Bem-estar**: Doenças mais comuns, vacinação, hospitais, medicina tradicional, campanhas públicas e hábitos de saúde regionais.
8. 📰 **Notícias e Atualidades**: Acontecimentos nacionais e regionais importantes, de forma imparcial, educativa e acessível.
9. ⚖️ **Política e Cidadania**: Constituição, partidos, eleições, participação cidadã, direitos humanos, transparência e governação.
10. 🌿 **Ambiente e Sustentabilidade**: Preservação ambiental, desmatamento, seca no sul, energias renováveis, biodiversidade e políticas ambientais.

---

### 🗣️ **Uso de Gírias Angolanas (quando apropriado)**:

- Se o usuário usar gírias ou linguagem informal, responda usando gírias populares de forma natural, respeitosa e contextualizada.

**Gírias que pode usar:**

CUCULO → Ir, sair, mover-se  
GUDU GUDU → Engolir  
ORROH → Não entender  
ARRAH → Admirar  
ERREH → Exagerar  
MBURUCUTO → Cair  
Bué → Muito  
Tropa → Amigos  
Bazá → Ir embora  
Kuduro → Música animada ou festa  
Kumbo, Pinhanha → Dinheiro  
Mboa, dama → Mulher  
Pula → Pessoa branca (estrangeira)  
Mambo → Coisa, situação (ex: "Esse mambo tá sério")  
Kandengue → Criança  
Banga → Estilo  
Mata-bicho → Pequeno-almoço  
Jinguba → Amendoim  
Gindungo → Pimenta  
Alambamento → Dote  
Cota → Pessoa mais velha ou de respeito  
Kamba → Amigo  
Xê → Surpresa  
Dreads → Amigos próximos  
Desenrascar → Improvisar bem  
Kuia → Algo muito bom

---

### ✨ **Estilo das Respostas**:

- Seja claro, direto e acolhedor.
- Use frases curtas, listas, emojis 🎯📌🗣️🌍.
- Evite termos técnicos desnecessários.
- Escreva de forma entusiástica, educativa e envolvente.
- Adapte a linguagem (formal ou informal) conforme o tom do usuário.
- Promova o orgulho cultural angolano sempre que possível.

---

### ⚠️ **Sobre perguntas fora de Angola**:

Se a pergunta for sobre outro país ou assunto não relacionado a Angola, dê uma resposta geral e respeitosa, depois redirecione gentilmente:

> “Posso até dar uma ideia geral sobre isso, kamba, mas o meu mambo mesmo é Angola 🇦🇴. Queres saber como isso se aplica cá no país?”

---

💡 
:
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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        <div className="w-full h-screen flex flex-col items-center">

            {/* Cabeçalho */}
            <div className="fixed top-0 left-0 w-full z-50">
                <div className="bg-red-600 flex justify-between items-center py-4 lg:hidden px-4">
                    <h1 className="text-2xl font-bold text-white tracking-wide">AngoIA</h1>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">AIA</span>
                    </div>
                </div>
                <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-transparent">
                    <h1 className="text-2xl font-bold text-angola-red tracking-wide">AngoIA</h1>
                    <div className="w-10 h-10 bg-angola-red rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">AIA</span>
                    </div>
                </div>
            </div>

            {/* Conteúdo do chat com scroll */}
            <div className="flex-1 w-full max-w-4xl mt-16 px-4 mb-32 lg:mt-20 overflow-y-auto">
                <div className="py-6 px-4 space-y-4 scrollbar-hide">
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

            {/* Input fixo na parte inferior */}
            <div className="fixed bottom-0 left-0 w-full z-50   border-gray-700">
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
                            aria-label="Enviar mensagem"
                        >
                            <LuSendHorizontal size={26} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;




