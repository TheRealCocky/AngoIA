// src/components/Chat.jsx
import React, { useEffect,useState, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';





const callBackendAPI = async (message) => {
const baseURL= window.location.hostname==='localhost'
    ? 'http://localhost:3000'
    : 'https://angoia-backend.onrender.com';
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${baseURL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok) {
            return data.message || 'Erro ao processar sua mensagem.';
        }

        return data.resposta || 'Resposta não encontrada.';
    } catch (error) {
        console.error('Erro ao chamar a API do backend:', error);
        return 'Erro ao processar a solicitação.';
    }
};


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const menuRef = useRef(null);

    const navigate = useNavigate();

// 2. CRIE A FUNÇÃO DE NAVEGAÇÃO
    const handleNavigation = (path) => {
        navigate(path);
        setTimeout(()=>setIsOpen(false),100); // Fecha o menu após definir a navegação
    };

    // Fecha o menu se clicar fora dele
    // Carrega o username do localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded.username); // precisa estar dentro do token

                if (decoded.username) setUsername(decoded.username);
// <-- Corrige aqui conforme o payload
            } catch (error) {
                console.error("Erro ao decodificar JWT:", error);
            }
        }
    }, []);




// Fecha menu se clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);



    const toggleMenu = (e) => {
       e.stopPropagation();// <-- impede que o clique feche o menu imediatamente
        setIsOpen((prev) => !prev);
    };



    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        const botResponse = await callBackendAPI(input);
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

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o JWT
        navigate('/');              // Redireciona para o login (ou use "/")
        setIsOpen(false);                // Fecha o menu
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
                            onClick={(e)=>toggleMenu(e)}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                        >
                            <span className="text-red-600 font-bold">AIA</span>
                        </button>

                        {isOpen && (
                            <div className="absolute mt-2 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-[9999]">
                                <ul className="p-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => handleNavigation('/login')}
                                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                                        >
                                            Entrar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleNavigation('/registar')}
                                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                                        >
                                            Criar Conta
                                        </button>
                                    </li>
                                    <li

                                        className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                    >
                                        <Link to="/angoia"> Sobre AngoIA</Link>
                                    </li>

                                    <li
                                        onClick={handleLogout}
                                        className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                    >
                                        Sair
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
                            className="px-4 py-4 bg-angola-red text-black rounded-[50%] font-bold hover:bg-angola-yellow"
                        >
                            AIA
                        </button>

                        {isOpen && (
                            <div className="absolute mt-2 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
                                <ul className="p-2 space-y-2">
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/login">Entrar</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/registar">Criar Conta</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        <Link to="/angoia"> Sobre AngoIA</Link>
                                    </li>
                                    <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                        onClick={handleLogout}>
                                        Sair
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
                                Bem-vindo(a){username && ` ${username}`} à{" "}
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




