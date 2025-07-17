import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';

const FavoritoMobile = () => {
    const [favoritas, setFavoritas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BaseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        const fetchFavoritas = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${BaseURL}/api/chat-messages/favorites`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const mensagens = await res.json();

                const completas = await Promise.all(
                    mensagens.map(async (respostaBot) => {
                        let pergunta = null;
                        if (respostaBot.replyTo) {
                            const resp = await fetch(`${BaseURL}/api/chat-messages/${respostaBot.replyTo}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });

                            if (resp.ok) {
                                const dados = await resp.json();
                                pergunta = dados.text;
                            }
                        }
                        return {
                            respostaId: respostaBot._id,
                            pergunta: pergunta || '(pergunta não encontrada)',
                        };
                    })
                );

                setFavoritas(completas);
            } catch (err) {
                console.error('Erro ao buscar favoritos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritas();
    }, []);

    const handleSelect = (respostaId) => {
        navigate(`/chat/${respostaId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-white to-red-50">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow-md px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Star className="text-yellow-500" size={20} />
                    Favoritos
                </h1>
                <div className="w-6" /> {/* espaçamento */}
            </header>

            {/* Conteúdo */}
            <main className="flex-1 px-4 md:px-6 lg:px-12 py-6 max-w-5xl mx-auto w-full">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : favoritas.length === 0 ? (
                    <p className="text-center text-gray-400">Nenhuma mensagem favorita encontrada.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoritas.map((item) => (
                            <div
                                key={item.respostaId}
                                onClick={() => handleSelect(item.respostaId)}
                                className="bg-white p-4 rounded-xl shadow hover:bg-yellow-50 hover:shadow-md cursor-pointer transition-transform duration-150 active:scale-[0.98]"
                            >
                                <p className="text-gray-800">{item.pergunta}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritoMobile;



