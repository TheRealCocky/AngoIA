import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ onClose }) => {
    const [notificacoes, setNotificacoes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const decoded = jwtDecode(token);
                const userId = decoded?.id;

                const res = await axios.get('http://localhost:3000/api/chat-messages/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const now = new Date();
                const oneMinuteAgo = new Date(now.getTime() - 60000); // últimos 60 segundos

                const recentes = res.data.filter(msg =>
                    msg.sender === 'user' &&
                    msg.user === userId &&
                    new Date(msg.createdAt) >= oneMinuteAgo &&
                    new Date(msg.createdAt) <= now
                );

                setNotificacoes(recentes);
            } catch (err) {
                console.error('Erro ao buscar notificações:', err);
            }
        };

        fetchNotificacoes();
    }, []);

    const handleAbrirChat = (id) => {
        onClose();                     // Fecha o modal
        navigate(`/chat/${id}`);      // Navega para o chat com a pergunta/resposta
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
                    <X size={20} />
                </button>

                <h2 className="text-lg font-semibold mb-4">🔔 Notificações</h2>

                {notificacoes.length === 0 ? (
                    <p className="text-sm text-gray-600">Nenhuma notificação recente.</p>
                ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {notificacoes.map((msg) => (
                            <li
                                key={msg._id}
                                onClick={() => handleAbrirChat(msg._id)}
                                className="cursor-pointer border p-3 rounded hover:bg-gray-100 transition-all"
                            >
                                <p className="text-sm text-gray-800"><strong>Pergunta:</strong> {msg.text}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Recebido em: {new Date(msg.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;




