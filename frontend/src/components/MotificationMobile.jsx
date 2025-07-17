import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const  NotificationMobile = () => {
    const [notificacoes, setNotificacoes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotificacoes = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const decoded = jwtDecode(token);
                const userId = decoded?.id;
                const BASE_URL = window.location.hostname === 'localhost'
                    ? 'http://localhost:3000'
                    : 'https://angoia-backend.onrender.com';

                const res = await axios.get(`${BASE_URL}/api/chat-messages/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const now = new Date();
                const oneMinuteAgo = new Date(now.getTime() - 60000);

                const recentes = res.data.filter(msg =>
                    msg.sender === 'user' &&
                    msg.user === userId &&
                    new Date(msg.createdAt) >= oneMinuteAgo &&
                    new Date(msg.createdAt) <= now
                );

                setNotificacoes(recentes);
            } catch (err) {
                console.log('Erro ao buscar notificações', err);
            }
        };

        fetchNotificacoes();
    }, []);

    const handleAbrirChat = (id) => {
        navigate(`/chat/${id}`);
    };

    const handleVoltar = () => {
        navigate(-1); // Volta para a página anterior
    };

    return (
        <div className="min-h-screen bg-white w-full px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
            {/* Cabeçalho */}
            <header className="flex items-center gap-3 mb-6">
                <button onClick={handleVoltar} className="text-gray-700 hover:text-black">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Notificações Recentes
                </h1>
            </header>

            {/* Corpo */}
            {notificacoes.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma notificação recente.</p>
            ) : (
                <ul className="space-y-4">
                    {notificacoes.map((msg, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleAbrirChat(msg._id)}
                            className="bg-gray-100 p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-200 transition"
                        >
                            <p className="text-gray-800 text-sm sm:text-base line-clamp-2">{msg.text}</p>
                            <p className="text-gray-500 text-xs mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

};

export default  NotificationMobile;


