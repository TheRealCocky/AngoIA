import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X ,Star} from 'lucide-react';

const ModalFavoritos = ({ onClose,onSelect }) => {
    const [favoritas, setFavoritas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BaseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        const fetchFavoritosComPergunta = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${BaseURL}/api/chat-messages/favorites`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const mensagensFavoritas = await res.json();

                // Buscar apenas as perguntas relacionadas (replyTo)
                const completas = await Promise.all(
                    mensagensFavoritas.map(async (respostaBot) => {
                        let pergunta = null;
                        if (respostaBot.replyTo) {
                            const respPergunta = await fetch(`${BaseURL}/api/chat-messages/${respostaBot.replyTo}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (respPergunta.ok) {
                                const dadosPergunta = await respPergunta.json();
                                pergunta = dadosPergunta.text;
                            }
                        }
                        return {
                            respostaId: respostaBot._id, // usaremos este para o link do chat
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

        fetchFavoritosComPergunta();
    }, []);

    const handleClick = (respostaId) => {
        onSelect(respostaId); // deixa o componente pai decidir o que fazer
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Cabeçalho */}
                <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-200 z-10">
                    <div className="flex justify-between items-center mb-2">
                        <div className={`flex flex-row items-center`}>
                        <h2 className="text-xl font-bold">Mensagens Favoritos </h2>
                        <Star size={20} className="text-yellow-400 ml-2 " />
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Lista */}
                <div className="overflow-y-auto px-6 py-4 space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Carregando...</p>
                    ) : favoritas.length === 0 ? (
                        <p className="text-center text-gray-500">Nenhuma favorita encontrada.</p>
                    ) : (
                        favoritas.map((item) => (
                            <div
                                key={item.respostaId}
                                className="p-4 border rounded hover:bg-gray-100 cursor-pointer transition"
                                onClick={() => handleClick(item.respostaId)}
                            >
                                <p className="text-gray-900 font-medium">{item.pergunta}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalFavoritos;



