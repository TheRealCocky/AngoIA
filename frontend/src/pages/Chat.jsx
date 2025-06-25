// Importações de pacotes e componentes
import React, { useEffect, useState, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import { Mic, AppWindow, X, Bell, Settings, House } from 'lucide-react';
import { Link, useNavigate, useParams } from "react-router-dom"; // Adicionado useParams
import { jwtDecode } from 'jwt-decode';
import SettingsModalLg from "../components/SettingsModalLG.jsx";
import SettingsModalSm from "../components/SettingsModalSm.jsx";
import LikeDislikeButtons from "../components/LikeDislikeButtons";

// Função que faz requisição ao backend para mensagem nova
const callBackendAPI = async (message) => {
    const baseURL = window.location.hostname === 'localhost'
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
            return { resposta: data.message || 'Erro ao processar sua mensagem.' };
        }

        return {
            _id: data._id,
            resposta: data.resposta || 'Resposta não encontrada.',
            likes: data.likes || [],
            dislikes: data.dislikes || []
        };

    } catch (error) {
        console.error('Erro ao chamar a API do backend:', error);
        return {
            resposta: 'Erro ao processar a solicitação.'
        };
    }
};

// Componente principal do chat
const Chat = () => {
    const { id } = useParams(); // Captura o ID da URL
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [recording, setRecording] = useState(false);
    const [sidebarAberto, setSidebarAberto] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [settingsLG, setSettingsLG] = useState(false);
    const [selectedOption, setSelectedOption] = useState("opcao1");
    const [showLoginModal, setShowLoginModal] = useState(false);

    const menuRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        setTimeout(() => setIsOpen(false), 100);
    };

    // Decodifica o token para pegar o nome do usuário
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.username) setUsername(decoded.username);
            } catch (error) {
                console.error("Erro ao decodificar JWT:", error);
            }
        }
    }, []);

    // Mostra modal de login se evento for emitido
    useEffect(() => {
        const openLogin = () => setShowLoginModal(true);
        window.addEventListener("open-login-modal", openLogin);
        return () => window.removeEventListener("open-login-modal", openLogin);
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
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    // Função de envio de mensagem
    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const botResponse = await callBackendAPI(input);

            const botMessage = {
                sender: 'bot',
                text: botResponse.resposta || '⚠️ Erro ao gerar resposta.',
                _id: botResponse._id ?? null,
                likes: botResponse.likes ?? [],
                dislikes: botResponse.dislikes ?? []
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Erro ao chamar a API:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: 'bot',
                    text: '❌ Ocorreu um erro ao buscar a resposta.',
                    _id: null,
                    likes: [],
                    dislikes: []
                }
            ]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Carrega mensagens anteriores do localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages && !id) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [id]);

    // Salva mensagens no localStorage
    useEffect(() => {
        if (messages.length > 0 && !id) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages, id]);

    // Busca mensagem pelo ID da URL
    useEffect(() => {
        const fetchMessageById = async () => {
            if (!id) return;

            const baseURL = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://angoia-backend.onrender.com';

            try {
                const response = await fetch(`${baseURL}/api/chat-messages/${id}`);
                const data = await response.json();

                if (response.ok && data && data.text) {
                    const botMessage = {
                        sender: 'bot',
                        text: data.text, // ← agora usa text
                        _id: data._id,
                        likes: data.likes || [],
                        dislikes: data.dislikes || [],
                        favorites: data.favorites || []
                    };


                    setMessages([botMessage]);
                } else {
                    setMessages([{
                        sender: 'bot',
                        text: '❌ Mensagem não encontrada ou inválida.',
                        _id: null,
                        likes: [],
                        dislikes: []
                    }]);
                }
            } catch (error) {
                console.error("Erro ao buscar mensagem por ID:", error);
                setMessages([{
                    sender: 'bot',
                    text: '❌ Erro ao carregar a mensagem.',
                    _id: null,
                    likes: [],
                    dislikes: []
                }]);
            }
        };

        fetchMessageById();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setIsOpen(false);
    };

    const abrirSidebar = () => setSidebarAberto(!sidebarAberto);
    const handleFullScreen = () => setFullScreen(!fullScreen);
    const handleSettingsLG = () => setSettingsLG(!settingsLG);
    const toggleSettings = () => setSettingsLG(prev => !prev);
    const handleOptionChange = (option) => setSelectedOption(option);

    const handleAudio = () => {
        if (!recording) {
            const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
            recognition.lang = 'pt-PT';
            recognition.maxResults = 10;

            recognition.onresult = event => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };

            recognition.start();
            setRecording(true);

            recognition.onend = () => {
                setRecording(false);
            };
        }
    };

    if (fullScreen) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-white p-4 overflow-y-auto z-50">
                <button onClick={handleFullScreen} className="absolute top-2 right-4 text-gray-500 p-2 rounded-full"><X /></button>
                <div className="mt-2"><Link to="/mobile"><Settings /></Link></div>
                <div className="flex flex-col justify-start items-start mt-5 space-y-4 text-lg font-semibold">
                    <div className="flex items-center space-x-2"><House /><p>Home</p></div>
                    <div className="flex items-center space-x-2"><Bell /><Link to="/planos">Planos</Link></div>
                    <div className="flex items-center space-x-2"><Bell /><p>Anónimos</p></div>
                </div>
                <div className="border-t-2 mt-4"><p className="font-semibold mt-2">Histórico</p></div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <div className="fixed top-0 left-0 w-full z-50">
                {/* MOBILE */}
                <div className="flex justify-between items-center py-4 lg:hidden px-4">
                    <div className="bg-white p-2 rounded-full" onClick={handleFullScreen}><AppWindow /></div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">AngoIA</h1>
                    <div className="relative" ref={menuRef}>
                        {!user && (
                            <button className="py-2 px-2 bg-white rounded-[10%] flex items-center justify-center">
                                <Link to="/login" className="text-red-600 font-bold">Entrar</Link>
                            </button>
                        )}
                    </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-transparent">
                    <div className="bg-white p-2 rounded-full cursor-pointer" onClick={abrirSidebar}><AppWindow /></div>
                    {sidebarAberto && (
                        <div className="fixed top-0 left-0 h-screen w-60 bg-white shadow-lg p-4 transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl p-2 rounded-md hover:bg-gray-200 cursor-pointer font-semibold">AngoIA</h2>
                                <button onClick={handleSettingsLG} className="text-black p-2 rounded-full"><Settings size={20} /></button>
                                <button className="text-black p-2 rounded-full" onClick={abrirSidebar}><X size={20} /></button>
                            </div>
                            <ul className="space-y-2">
                                <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer font-semibold"><Link to="/">Home</Link></li>
                                <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer font-semibold"><Link to="/planos">Planos</Link></li>
                                <li className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer font-semibold"><Link to="/pagina3">Anónimo</Link></li>
                            </ul>
                        </div>
                    )}
                    <div className="relative inline-block" ref={menuRef}>
                        {!user && (
                            <button onClick={toggleMenu} className="px-4 py-2 bg-angola-red text-black rounded-[10%] font-bold hover:bg-angola-yellow">
                                <Link to="/login">Entrar</Link>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full max-w-4xl mt-16 px-4 mb-32 lg:mt-20 overflow-y-auto">
                <div className="py-6 px-4 space-y-4 scrollbar-hide">
                    {messages.length === 0 && (
                        <div className="text-center p-6 rounded-lg font-sans backdrop-blur-sm bg-black/40 text-white shadow-lg">
                            <h2 className="text-3xl font-bold">Bem-vindo(a){username && ` ${username}`} à{" "}
                                <span className="bg-gradient-to-r from-angola-yellow to-angola-red text-transparent bg-clip-text">AngoIA</span>
                            </h2>
                            <p className="text-xl mt-4">Seu guia especialista sobre <span className="font-semibold">Angola</span>.</p>
                            <p className="text-base text-gray-200 mt-2">Pronto para explorar as maravilhas?</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                            <div className={`p-3 rounded-xl max-w-[75%] ${msg.sender === "user" ? "bg-angola-red text-white" : "bg-yellow-300 text-black"}`}>
                                {msg.text}
                            </div>
                            {msg.sender === 'bot' && msg._id && (
                                <LikeDislikeButtons
                                    messageId={msg._id}
                                    initialLikes={msg.likes}
                                    initialDislikes={msg.dislikes}
                                    initialFavorites={msg.favorites} // ← ADICIONEI O FAVORITO
                                    isFromVisitor={!user}
                                    text={msg.text}
                                />

                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg bg-gray-200 text-gray-800 animate-pulse">A pensar...</div>
                        </div>
                    )}
                </div>
            </div>

            {/* INPUT */}
            <div className="fixed bottom-0 left-0 w-full z-50 border-gray-700">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="relative w-full">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Digite sua pergunta sobre Angola..."
                            rows={1}
                            className="w-full pr-12 pl-4 pt-3 pb-[68px] rounded-xl bg-[#2b2b2b] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-angola-yellow border border-[#444] resize-none overflow-hidden disabled:opacity-50"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="absolute right-2 top-20 transform -translate-y-1/2 bg-[#3d3d3d] text-white p-2 rounded-full hover:bg-[#555]"
                            disabled={!input.trim() || loading}
                            aria-label="Enviar mensagem"
                        >
                            <LuSendHorizontal size={26} />
                        </button>
                        <button
                            onClick={handleAudio}
                            className="absolute right-20 top-[2.3rem] transform translate-y-1/2 bg-[#3d3d3d] text-white p-2 rounded-full hover:bg-[#555]"
                            disabled={loading}
                            aria-label="Enviar mensagem de áudio"
                        >
                            <Mic size={26} />
                        </button>
                    </div>
                </div>
            </div>

            <SettingsModalLg
                isOpen={settingsLG}
                onClose={toggleSettings}
                selectedOption={selectedOption}
                onOptionChange={setSelectedOption}
            />
        </div>
    );
};

export default Chat;









