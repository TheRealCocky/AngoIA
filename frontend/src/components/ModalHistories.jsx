import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalHistories = ({ onClose }) => {
    const [mensagens, setMensagens] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BaseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        const fetchAllMessages = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${BaseURL}/api/chat-messages/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                setMensagens(data);
            } catch (err) {
                console.error('Erro ao carregar históricos:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMessages();
    }, []);

    const mensagensFiltradas = mensagens
        .filter(msg => msg.sender === 'user')
        .filter(msg =>
            msg.text?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleClick = (messageId) => {
        onClose(); // fecha o modal
        navigate(`/chat/${messageId}`); // redireciona para o chat
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Histórico de Conversas</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg font-bold">×</button>
                </div>

                <input
                    type="text"
                    placeholder="Pesquisar pergunta..."
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Carregando...</p>
                    ) : mensagensFiltradas.length === 0 ? (
                        <p className="text-center text-gray-500">Nenhuma conversa encontrada.</p>
                    ) : (
                        mensagensFiltradas.map((msg) => (
                            <div
                                key={msg._id}
                                className="p-3 border rounded hover:bg-gray-100 cursor-pointer transition"
                                onClick={() => handleClick(msg._id)}
                            >
                                <p>🧍 <strong>{msg.text}</strong></p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalHistories;

















