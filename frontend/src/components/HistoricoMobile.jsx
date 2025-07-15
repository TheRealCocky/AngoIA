import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const HistoricoMobile = ({ onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [mensagens, setMensagens] = useState([]);
    const navigate = useNavigate();

    const baseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        const fetchAllMessages = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${baseURL}/api/chat-messages/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                setMensagens(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao carregar históricos:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMessages();
    }, []);

    const mensagensFiltradas = mensagens
        .filter((msg) => msg.sender === 'user')
        .filter((msg) =>
            msg.text?.toLowerCase().includes(search.toLowerCase())
        );

    const handleClick = (messageId) => {
        navigate(`/chat/${messageId}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
            {/* Header Fixo */}
            <div className="sticky top-0 bg-gray-900 z-20 px-4 py-3 border-b border-gray-700 shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Histórico de Conversas</h2>
                    <Link to="/chat" className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </Link>
                </div>
                <input
                    type="search"
                    placeholder="Pesquisar pergunta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Lista Scrollável */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-400">Carregando...</p>
                ) : mensagensFiltradas.length === 0 ? (
                    <p className="text-center text-gray-400">Nenhuma conversa encontrada.</p>
                ) : (
                    mensagensFiltradas.map((msg) => (
                        <div
                            key={msg._id}
                            onClick={() => handleClick(msg._id)}
                            className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition p-4 rounded-md border border-gray-600"
                        >
                            <p><strong>{msg.text}</strong></p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoricoMobile;
