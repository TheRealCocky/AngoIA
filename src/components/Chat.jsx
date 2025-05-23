// src/components/Chat.jsx
import React, { useState } from 'react';

const callGeminiAPI = async (message) => {

    const API_KEY = 'AIzaSyBkiyAEQFlHLtzN9e76uy2G7qhWw0bLWwE'; // minha chave da api do gemini
    // ATUALIZADO: Agora usando 'gemini-2.0-flash' e a URL conforme o meu curl command
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
                        text: `Responda como um especialista em Angola. Considere informações sobre história, cultura, geografia e curiosidades. Se a pergunta for sobre outro tema, responda de forma geral e informe que seu foco é Angola. Pergunta: ${message}`
                    }]
                }]
            }),
        });

        // Verifique se a resposta da rede foi OK (status 200)
        if (!response.ok) {
            const errorText = await response.text(); // Tenta ler o corpo do erro para mais detalhes
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
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        // Container principal do chatbot
        <div className="
            w-full max-w-md  /* Padrão para telas pequenas: largura total, max-width médio */
            md:max-w-xl   /* Em telas médias: um pouco maior */
            lg:max-w-3xl  /* Em telas grandes: bem mais largo */
            xl:max-w-4xl  /* Em telas extra-grandes: ainda mais largo */
            bg-white rounded-xl shadow-2xl flex flex-col
            h-[600px]    /* Altura fixa para todos os tamanhos, ou você pode usar um( h-full) em vez de um px fixo */
            md:h-[700px]  /* Opcional: Aumentar a altura em telas médias */
            lg:h-[700px]  /* Opcional: Aumentar a altura em telas grandes */
            border-4 border-angola-yellow overflow-hidden
        ">
            {/* Cabeçalho do Chatbot */}
            <div className="bg-angola-red p-4 flex items-center justify-between shadow-md">
                <h1 className="text-2xl font-bold text-white tracking-wide">AngoIA</h1>
                {/*Aqui abaixo vai o icon da angoia*/}
                {/*<img src="/palanca.png" alt="Palanca Negra Gigante" className="h-8 w-8 object-contain" />*/}
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-600 mt-10 font-sans">
                        Olá! Pergunte-me algo sobre <span className="font-semibold text-angola-black">Angola</span>.
                        <p className="text-sm text-gray-500 mt-2">Pronto para explorar?</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`p-3 rounded-xl max-w-[75%] shadow-sm ${
                                msg.sender === 'user'
                                    ? 'bg-angola-green text-white'
                                    : 'bg-angola-yellow bg-opacity-20 text-text-dark'
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

            {/* Área de Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Faça sua pergunta sobre Angola..."
                    className="
                        flex-1 p-3 border border-gray-300 rounded-full
                        focus:outline-none focus:ring-2 focus:ring-angola-red
                        placeholder-gray-500
                    "
                    disabled={loading}
                />
                <button
                    onClick={handleSendMessage}
                    className="
                        px-4 py-3 /* Padding padrão para telas pequenas: um pouco menor */
                        md:px-6 md:py-3 /* Aumenta o padding em telas médias e maiores */
                        ml-1 /* Margem menor para telas pequenas */
                        md:ml-2 /* Margem normal para telas médias e maiores */
                        bg-secondary-brand text-white rounded-full
                        hover:bg-red-700 transition-colors
                        shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={loading}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Chat;