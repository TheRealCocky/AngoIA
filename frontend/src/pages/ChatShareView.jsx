import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LikeDislikeButtons from '../components/LikeDislikeButtons';

const ChatShareView = () => {
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessageById = async () => {
            if (!id) return;

            const baseURL = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : 'https://angoia-backend-5ic1.onrender.com';

            try {
                const response = await fetch(`${baseURL}/api/chat-messages/${id}`);
                const data = await response.json();

                if (response.ok && data && data.resposta) {
                    setMessage(data);
                } else {
                    setMessage({ text: '❌ Mensagem não encontrada ou inválida.', _id: null });
                }
            } catch (error) {
                console.error("Erro ao buscar mensagem por ID:", error);
                setMessage({ text: '❌ Erro ao carregar a mensagem.', _id: null });
            } finally {
                setLoading(false);
            }
        };

        fetchMessageById();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                Carregando mensagem...
            </div>
        );
    }

    return (
        <div className="max-w-2xl w-full mx-auto p-4 mt-16 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 text-yellow-400">📌 Mensagem compartilhada</h2>
                <p className="whitespace-pre-line text-base text-white">{message?.text}</p>

                {message?._id && (
                    <div className="mt-6">
                        <LikeDislikeButtons
                            messageId={message._id}
                            text={message.text}
                            onUpdate={(updated) => setMessage(prev => ({ ...prev, ...updated }))}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatShareView;






