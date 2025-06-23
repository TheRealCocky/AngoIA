import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaCopy, FaShareAlt } from 'react-icons/fa';

const LikeDislikeButtons = ({ messageId, text, onUpdate }) => {
    const token = localStorage.getItem('token');
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [copied, setCopied] = useState(false); // controle da notificação

    const handleReaction = async (reaction) => {
        const BaseURL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://angoia-backend.onrender.com';

        try {
            const res = await fetch(`${BaseURL}/api/chat-messages/${messageId}/${reaction}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao enviar reação');
            }

            const data = await res.json();
            console.log('Reação enviada com sucesso:', data);

            if (reaction === 'like') {
                setLiked(true);
                setDisliked(false);
            } else if (reaction === 'dislike') {
                setLiked(false);
                setDisliked(true);
            } else if (reaction === 'unlike') {
                setLiked(false);
            } else if (reaction === 'undislike') {
                setDisliked(false);
            }

            if (onUpdate) onUpdate(data);

        } catch (err) {
            console.error('Erro HTTP:', err.message);
        }
    };

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // esconde após 2s
        } catch (err) {
            console.error('Erro ao copiar:', err.message);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AngoIA',
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Erro ao partilhar:', err.message);
            }
        } else {
            alert('A partilha não é suportada neste navegador.');
        }
    };

    const iconStyle = {
        fontSize: '1.6rem',
        cursor: 'pointer',
        padding: '0.6rem',
        borderRadius: '12px',
        margin: '0 6px',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
        position: 'relative'
    };

    const activeStyle = {
        backgroundColor: 'white',
        color: 'rgb(250 204 21 / var(--tw-text-opacity, 1))',
        fontWeight: 'bold',
    };

    const activeDislikeStyle = {
        backgroundColor: 'white',
        color: '#dc3545',
        fontWeight: 'bold',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div
                style={{ ...iconStyle, ...(liked ? activeStyle : {}) }}
                title="Like"
                onClick={() => handleReaction(liked ? 'unlike' : 'like')}
            >
                <FaThumbsUp size={15} />
            </div>

            <div
                style={{ ...iconStyle, ...(disliked ? activeDislikeStyle : {}) }}
                title="Dislike"
                onClick={() => handleReaction(disliked ? 'undislike' : 'dislike')}
            >
                <FaThumbsDown size={15} />
            </div>

            <div style={iconStyle} title="Copiar" onClick={handleCopy}>
                <FaCopy size={15} />
                {copied && (
                    <span style={{
                        position: 'absolute',
                        top: '-24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#4ade80',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        Copiado ✓
                    </span>
                )}
            </div>

            <div style={iconStyle} title="Partilhar" onClick={handleShare}>
                <FaShareAlt size={15} />
            </div>
        </div>
    );
};

export default LikeDislikeButtons;

















