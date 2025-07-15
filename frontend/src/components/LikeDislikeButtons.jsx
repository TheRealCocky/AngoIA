import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaCopy, FaShareAlt, FaStar } from 'react-icons/fa';

const LikeDislikeButtons = ({ messageId, text, onUpdate }) => {
    const token = localStorage.getItem('token');
    const [favorited, setFavorited] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);

    const BaseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        const fetchReactionStatus = async () => {
            try {
                const res = await fetch(`${BaseURL}/api/chat-messages/${messageId}/status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Erro ao obter status da mensagem');

                const { liked, disliked, favorited } = await res.json();
                setLiked(liked);
                setDisliked(disliked);
                setFavorited(favorited);
            } catch (err) {
                console.error('Erro ao buscar status da mensagem:', err.message);
            }
        };

        if (messageId && token) {
            fetchReactionStatus();
        }
    }, [messageId, token]);

    const handleReaction = async (reaction) => {
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

    const handleFavorite = async () => {
        try {
            const res = await fetch(`${BaseURL}/api/chat-messages/${messageId}/${favorited ? 'unfavorite' : 'favorite'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao favoritar');
            }

            const data = await res.json();
            setFavorited(!favorited);
            if (onUpdate) onUpdate(data);
        } catch (err) {
            console.error('Erro ao favoritar:', err.message);
        }
    };

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar:', err.message);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/chat/${messageId}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'AngoIA',
                    text: text,
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            }
        } catch (err) {
            console.error('Erro ao partilhar:', err.message);
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
        position: 'relative',
    };

    const activeStyle = {
        backgroundColor: 'white',
        color: 'rgb(250 204 21)',
        fontWeight: 'bold',
    };

    const activeDislikeStyle = {
        backgroundColor: 'white',
        color: '#dc3545',
        fontWeight: 'bold',
    };

    const badgeStyle = {
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
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div
                style={{ ...iconStyle, ...(liked ? activeStyle : {}) }}
                title="Like"
                onClick={() => handleReaction(liked ? 'unlike' : 'like')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleReaction(liked ? 'unlike' : 'like')}
            >
                <FaThumbsUp size={15} />
            </div>

            <div
                style={{ ...iconStyle, ...(disliked ? activeDislikeStyle : {}) }}
                title="Dislike"
                onClick={() => handleReaction(disliked ? 'undislike' : 'dislike')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleReaction(disliked ? 'undislike' : 'dislike')}
            >
                <FaThumbsDown size={15} />
            </div>

            <div
                style={{ ...iconStyle, ...(favorited ? activeStyle : {}) }}
                title="Favoritar"
                onClick={handleFavorite}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFavorite()}
            >
                <FaStar size={15} />
                {favorited && <span style={{ ...badgeStyle, background: '#facc15' }}>Favoritado ✓</span>}
            </div>

            <div
                style={iconStyle}
                title="Copiar texto"
                onClick={handleCopy}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
            >
                <FaCopy size={15} />
                {copied && <span style={badgeStyle}>Copiado ✓</span>}
            </div>

            <div
                style={iconStyle}
                title="Partilhar"
                onClick={handleShare}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
            >
                <FaShareAlt size={15} />
                {shared && <span style={{ ...badgeStyle, background: '#60a5fa' }}>Link copiado ✓</span>}
            </div>
        </div>
    );
};

export default LikeDislikeButtons;



















