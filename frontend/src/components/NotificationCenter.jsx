import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BellRing, CheckCircle } from 'lucide-react';

const NotificationCenter = () => {
    const [notificacoes, setNotificacoes] = useState([]);
    const [show, setShow] = useState(false);
    const [notiCount, setNotiCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const BaseURL =
        window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://angoia-backend.onrender.com';

    // Buscar notificações recentes (último minuto)
    const fetchNotificacoes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BaseURL}/api/conversations`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const now = new Date();
            const oneMinuteAgo = new Date(now.getTime() - 60000);

            const recentes = res.data.filter((conv) => {
                const created = new Date(conv.createdAt);
                return created >= oneMinuteAgo && created <= now;
            });

            setNotificacoes(recentes);
            setNotiCount(recentes.length);
        } catch (err) {
            console.error('Erro ao buscar notificações:', err);
        } finally {
            setLoading(false);
        }
    };

    // Atualiza automaticamente a cada 10 segundos
    useEffect(() => {
        fetchNotificacoes(); // inicial
        const interval = setInterval(fetchNotificacoes, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleClear = () => {
        setNotiCount(0);
        setShow(false);
        setNotificacoes([]);
    };

    return (
        <div className="relative">
            {/* Botão da sidebar ou topo */}
            <li
                onClick={() => {
                    setShow(!show);
                    setNotiCount(0);
                }}
                className="relative list-none hover:bg-gray-100 px-3 py-2 border rounded cursor-pointer flex items-center space-x-2"
            >
                <BellRing size={16} className="text-gray-700" />
                <span className="text-sm text-gray-800">Notificações</span>

                {notiCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notiCount}
          </span>
                )}
            </li>

            {/* Painel de notificações */}
            {show && (
                <div className="absolute z-50 mt-2 right-0 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg w-96 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-semibold dark:text-white flex items-center gap-2">
                            <BellRing size={18} /> Notificações recentes
                        </h3>
                        <button
                            onClick={handleClear}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Marcar como lidas
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-500">Carregando...</p>
                    ) : notificacoes.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhuma nova notificação.</p>
                    ) : (
                        <ul className="space-y-3 max-h-64 overflow-y-auto">
                            {notificacoes.map((n) => (
                                <li
                                    key={n._id}
                                    className="p-3 border rounded dark:border-gray-700 dark:text-white"
                                >
                                    <p className="text-sm mb-1">
                                        <strong>Pergunta:</strong> {n.question}
                                    </p>
                                    <p className="text-sm text-gray-800 dark:text-gray-300">
                                        <strong>Resposta:</strong> {n.response}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        <CheckCircle size={12} className="inline mr-1 text-green-500" />
                                        Recebido às {new Date(n.createdAt).toLocaleTimeString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
