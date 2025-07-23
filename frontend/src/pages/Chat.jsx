// Importações de pacotes e componentes
import React, { useEffect, useState, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import axios from 'axios';
import { Mic, AppWindow, X,BellRing, Bell, Settings, House, Plus,History,Star,CalendarClock,GraduationCap,CreditCard,EyeOff,CalendarDays  } from 'lucide-react';
import { Link, useNavigate, useParams } from "react-router-dom"; // comunicação com o a url
import { jwtDecode } from 'jwt-decode';
import SettingsModalLg from "../components/SettingsModalLG.jsx";
import SettingsModalSm from "../components/SettingsModalSm.jsx";
import LikeDislikeButtons from "../components/LikeDislikeButtons";
import ModalHistories from '../components/ModalHistories.jsx';
import ModalFavoritos from '../components/ModalFavoritos.jsx';
import ModalScheudle from  '../components/ScheduleModal.jsx';
import ModalNotificacoes from '../components/NotificationModal.jsx';
import NotificationModal from '../components/NotificationModal';
import SessionCalendar from "../components/SessionCalendar.jsx";
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
    const [showHistories, setShowHistories] = useState(false);
    const messageRefs = useRef({});
    const [showFavoritos, setShowFavoritos] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [notiCount, setNotiCount] = useState(0);
    const [showNotificacoes, setShowNotificacoes] = useState(false);
    const [modalCalendar , setModalCalendar] = useState(false);
//histico de mensagem
    const scrollToMessage = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.warn('Mensagem não encontrada no DOM:', id);
        }
    };




    //fim do historico de mensagem


    const menuRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleNewChat = () => {
        setMessages([]);
        localStorage.removeItem("chatMessages");
        navigate("/");
    };


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

    //chamar a pagina planos
    const  handleplanos=()=>{
        navigate('/planos')
    }

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
        const fetchMessagesById = async () => {
            if (!id) return;

            const baseURL = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://angoia-backend.onrender.com';

            try {
                const res = await fetch(`${baseURL}/api/chat-messages/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const allMessages = await res.json();

                // 🚨 Verifica se é array antes de filtrar
                if (!Array.isArray(allMessages)) {
                    console.warn('Resposta inválida da API:', allMessages);
                    return;
                }

                const pergunta = allMessages.find(msg => msg._id === id);
                const resposta = allMessages.find(msg => msg.replyTo === id);

                const ordenado = [];

                if (pergunta) ordenado.push(pergunta);
                if (resposta) ordenado.push(resposta);

                setMessages(ordenado);

            } catch (err) {
                console.error("Erro ao buscar mensagens:", err);
            }
        };


        fetchMessagesById();
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
    const handleFavoritos = () => setShowFavoritos(!showFavoritos);

    useEffect(() => {
        const fetchContador = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/conversations', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const now = new Date();
                const oneMinuteAgo = new Date(now.getTime() - 60000);

                const recentes = res.data.filter((conv) => {
                    const created = new Date(conv.createdAt);
                    return created >= oneMinuteAgo && created <= now;
                });

                setNotiCount(recentes.length);
            } catch (err) {
                console.error('Erro ao contar notificações:', err);
            }
        };

        fetchContador();
        const interval = setInterval(fetchContador, 10000);
        return () => clearInterval(interval);
    }, []);






//Enviar mensagem por audio
    const handleAudio = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Reconhecimento de voz não suportado neste navegador. Use o Google Chrome.");
            return;
        }

        if (!recording) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'pt-PT';
            recognition.maxResults = 10;

            recognition.onresult = (event) => {
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



    const handleNotificacoesClick = () => {
        if (window.innerWidth < 768) {
            // Se for tela pequena (mobile)
            navigate('/notificacao-mobile');
        } else {
            // Em telas grandes, mostra o modal
            setShowNotificacoes(true);
            setNotiCount(0); // zera o contador
        }
    };


    if (fullScreen) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-white p-4 overflow-y-auto z-50">
                <button onClick={handleFullScreen} className="absolute top-2 right-4 text-gray-500 p-2 rounded-full"><X /></button>
                <div className="mt-2"><Link to="/mobile"><Settings /></Link></div>
                <div className="flex flex-col justify-start items-start mt-5 space-y-4 text-lg font-semibold">
                    <ul className="w-full space-y-2 text-sm">
                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                        onClick={handleNewChat}
                        >
                            <Plus size={14} className="text-gray-700" />
                            <span className="text-gray-800">Novo chat</span>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <History size={14} className="text-gray-700" />
                            <Link to="/historico-mobile" className="text-gray-800">Histórico</Link>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <EyeOff size={14} className="text-gray-700" />
                            <Link to="/anonimo" className="text-gray-800">Anônimo</Link>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <CreditCard size={14} className="text-gray-700" />
                            <Link to="/planos" className="text-gray-800">Planos</Link>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <CalendarClock size={14} className="text-gray-700" />
                            <Link to="/agendar" className="text-gray-800">Agendar pergunta</Link>
                        </li>

                        <li
                            onClick={handleNotificacoesClick}
                            className="relative hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                        >
                            <BellRing size={16} className="text-gray-700" />
                            <span className="text-sm text-gray-800">Notificações</span>

                            {notiCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
      {notiCount}
    </span>
                            )}
                        </li>

                        {showNotificacoes && (
                            <ModalNotificacoes onClose={() => setShowNotificacoes(false)} />
                        )}

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <Star size={14} className="text-gray-700" />
                            <Link to="/favoritos" className="text-gray-800">Favoritos</Link>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <CalendarDays size={14} className="text-gray-700" />
                            <Link to="/calendario" className="text-gray-800">Calendário de sessões</Link>
                        </li>

                        <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2">
                            <GraduationCap size={14} className="text-gray-700" />
                            <Link to="/modoestudo" className="text-gray-800">Modo Estudo</Link>
                        </li>
                    </ul>

                    <footer className="w-full text-center mt-10">
    <span className="text-xs text-gray-400">
      © {new Date().getFullYear()} AngoIA
    </span>
                    </footer>
                </div>


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
                                <button onClick={handleSettingsLG} className="text-black p-2 rounded-full hover:bg-gray-200 "><Settings size={20} /></button>
                                <button className="text-gray-700 p-2 rounded-full hover:text-black" onClick={abrirSidebar}><X size={20} /></button>
                                {/*Menu sidebar desktop*/}
                            </div>
                            <ul className="space-y-2">
                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                                    onClick={handleNewChat}
                                >
                                    <Plus size={14} className="text-gray-700" />
                                    <span className="text-sm text-gray-800">Novo chat</span>
                                </li>

                                <li
                                    className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                                    onClick={() => setShowHistories(true)}
                                >
                                    <History size={14} className="text-gray-700" />
                                    <span className="text-sm text-gray-800">Histórico</span>
                                </li>

                                {/* Modal do Histórico */}
                                {showHistories && (
                                    <ModalHistories
                                        onClose={() => setShowHistories(false)}
                                        onSelect={(messageId) => {
                                            navigate(`/chat/${messageId}`);       // <- MUITO IMPORTANTE: muda a URL
                                            setShowHistories(false);              // Fecha o modal
                                            setTimeout(() => scrollToMessage(messageId), 300); // Scroll suave após render
                                        }}
                                    />
                                )}



                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2 ">
                                    <EyeOff size={14} className="text-gray-700" />
                                    <Link to="/pagina3" className="text-sm text-gray-800">Anônimo</Link>
                                </li>

                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2 " onClick={handleplanos}>
                                    <CreditCard size={14} className="text-gray-700" />
                                    <span  className="text-sm text-gray-800">Planos</span>

                                </li>
                                <li
                                    className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                                    onClick={() => setShowSchedule(true)}
                                >
                                    <CalendarClock size={14} className="text-gray-700" />
                                    <span className="text-sm text-gray-800">Agendar pergunta</span>
                                </li>
                                {showSchedule &&(
                                <ModalScheudle
                                    isOpen={showSchedule}
                                    onClose={() => setShowSchedule(false)}
                                />
                                )}


                                <li
                                    onClick={() => {
                                        setShowNotificacoes(true);
                                        setNotiCount(0); // zera o contador ao abrir
                                    }}
                                    className="relative hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
                                >
                                    <BellRing size={16} className="text-gray-700" />
                                    <span className="text-sm text-gray-800">Notificações</span>

                                    {notiCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
      {notiCount}
    </span>
                                    )}
                                </li>

                                {showNotificacoes && (
                                    <ModalNotificacoes onClose={() => setShowNotificacoes(false)} />
                                )}




                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2 "
                                onClick={()=>setShowFavoritos(true)}
                                >
                                    <Star size={14} className="text-gray-700" />
                                    <span  className="text-sm text-gray-800">Favoritos</span>
                                </li>

                                {/* Modal Favoritos */}
                                {showFavoritos && (
                                    <ModalFavoritos
                                        onClose={() => setShowFavoritos(false)}
                                        onSelect={(messageId) => {
                                            navigate(`/chat/${messageId}`);
                                            setShowFavoritos(false);
                                            setTimeout(() => scrollToMessage(messageId), 300); // opcional
                                        }}
                                    />
                                )}






                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2 "
                                    //onClick={() => setModalCalendar(true)}

                                >
                                    < CalendarDays size={14} className="text-gray-700" />
                                    <Link to={"/calendario"} className="text-sm text-gray-800">Calendário de sessões</Link>
                                </li>
                                {/*{modalCalendar &&
                                    (
                                        <SessionCalendar
                                        onClose={() => setModalCalendar(false)}
                                        />
                                    )}*/}
                                <li className="hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2 ">
                                    <GraduationCap size={14} className="text-gray-700" />
                                    <Link to="/modoestudo" className="text-sm text-gray-800">Modo Estudo</Link>
                                </li>


                            </ul>


                            <footer className="w-full text-center mt-[100px]">
  <span className="text-xs text-gray-400">
    © {new Date().getFullYear()} AngoIA
  </span>
                            </footer>

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
                                <div className="mt-4">
                                <LikeDislikeButtons

                                    messageId={msg._id}
                                    initialLikes={msg.likes}
                                    initialDislikes={msg.dislikes}
                                    initialFavorites={msg.favorites} // ← ADICIONEI O FAVORITO
                                    isFromVisitor={!user}
                                    text={msg.text}

                                />
                                    </div>

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
                            className="w-full pr-12 pl-4 pt-3 pb-[68px] rounded-xl bg-[#2b2b2b] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-angola-yellow border border-[#444] resize-none overflow-hidden disabled:opacity-50 "
                        />
                        {input.trim() ? (
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-20 transform -translate-y-1/2 bg-[#3d3d3d] text-white p-2 rounded-full hover:bg-[#555]"
                                disabled={loading}
                                aria-label="Enviar mensagem"
                            >
                                <LuSendHorizontal size={26} />
                            </button>
                        ) : (
                            <button
                                onClick={handleAudio}
                                className="absolute right-2 top-20 transform -translate-y-1/2 bg-[#3d3d3d] text-white p-2 rounded-full hover:bg-[#555]"
                                disabled={loading}
                                aria-label="Enviar mensagem de áudio"
                            >
                                <Mic size={26} />
                            </button>
                        )}

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









