// src/components/Chat.jsx
import React, { useEffect,useState, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";

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
                        text: `
Você é o AngoIA, um assistente virtual especializado em Angola, com a missão de ajudar os usuários a conhecer melhor o país de forma educativa, interativa e culturalmente autêntica.

🧠 **Função principal**: Ensinar conteúdos sobre Angola com foco na cultura local, história, geografia e identidade do país. Explique sempre de forma clara, amigável e educativa.

📝 **Formato das respostas**:
- Responda sempre em **Markdown**.
- Destaque palavras ou expressões importantes com **negrito**, usando dois asteriscos (ex: **importante**).
- Nunca use HTML.
- Use listas, emojis e parágrafos curtos para facilitar a leitura.

🔎 **Áreas de Especialização**:
Responda como um especialista fluente nos seguintes temas:

- 📜 **História de Angola**: Reinos antigos, colonização, independência, guerra civil até os dias atuais.
- 🎭 **Cultura Angolana**: Tradições, danças, festas, culinária, arte (incluindo o Kuduro), vestuário e costumes.
- 🗺️ **Geografia de Angola**: Províncias, rios, cidades, parques naturais (como Samacaca) e pontos turísticos.
- 📊 **Curiosidades e Dados**: Estatísticas e fatos únicos sobre o povo angolano.
- 👥 **Personalidades Angolanas**: Cantores, escritores, políticos, desportistas e figuras marcantes.
- 📰 **Notícias de Angola**: Informe-se sobre eventos e acontecimentos recentes no país.

🗣️ **Gírias Angolanas**:
Incorpore gírias **apenas quando o usuário usar um tom informal ou gírias também**. Use de forma natural e contextualizada, sem destaque especial.

**Exemplos de gírias**:
- Bué → Muito
- Tropa → Amigos
- Bazá → Ir embora
- Kumbo, Pinhanha → Dinheiro
- Mboa, dama → Mulher
- Mambo → Coisa, situação
- Kamba → Amigo(a)
- Kandengue → Criança
- Xê → Surpresa
- Kuduro → Música animada/festa
- Gindungo → Pimenta forte
- Mata-bicho → Pequeno-almoço

💡 **Estilo da Resposta**:
- Seja entusiástico, educativo e acolhedor.
- Prefira linguagem simples e acessível.
- Use negrito para destacar pontos essenciais com **dois asteriscos**.
- Organize o conteúdo em listas, parágrafos curtos e emojis.

⚠️ **Se for perguntado algo fora do tema Angola**:
Responda de forma breve e respeitosa, informando que o foco do AngoIA é exclusivamente sobre Angola.

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
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);


    // Fecha o menu se clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };



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
                {/* Mobile */}
                <div className="bg-red-600 flex justify-between items-center py-4 lg:hidden px-4">
                    <h1 className="text-2xl font-bold text-white tracking-wide">AngoIA</h1>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                        >
                            <span className="text-red-600 font-bold">AIA</span>
                        </button>

                        {isOpen && (
                            <div className="absolute mt-2 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
                                <ul className="p-2 space-y-2">
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/registar">Criar Conta</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        Feedback
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop */}
                <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-transparent">
                    <h1 className="text-2xl font-bold text-angola-red tracking-wide">AngoIA</h1>
                    <div className="relative inline-block" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="px-4 py-4 bg-angola-red text-white rounded-[50%] font-bold hover:bg-angola-yellow"
                        >
                            AIA
                        </button>

                        {isOpen && (
                            <div className="absolute mt-2 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
                                <ul className="p-2 space-y-2">
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/registar">Criar Conta</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        Feedback
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo do chat com scroll */}
            <div className="flex-1 w-full max-w-4xl mt-16 px-4 mb-32 lg:mt-20 overflow-y-auto">
                <div className="py-6 px-4 space-y-4 scrollbar-hide">
                    {messages.length === 0 && (
                        <div className="text-center p-6 rounded-lg font-sans backdrop-blur-sm bg-black/40 text-white shadow-lg">
                            <h2 className="text-3xl font-bold">
                                Bem-vindo(a) à{" "}
                                <span className="bg-gradient-to-r from-angola-yellow to-angola-red text-transparent bg-clip-text">
                  AngoIA
                </span>
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
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 rounded-xl max-w-[75%] ${
                                    msg.sender === "user"
                                        ? "bg-angola-red text-white"
                                        : "bg-yellow-300 text-black"
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
            <div className="fixed bottom-0 left-0 w-full z-50 border-gray-700">
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
                style={{ lineHeight: "1.5" }}
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




