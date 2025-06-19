import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; //

const BackHome = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/chat')}
            className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full shadow-md hover:bg-white/20 transition"
        >
            <ArrowLeft size={18} />
            <span className="font-medium">Voltar</span>
        </button>
    );
};

export default BackHome;
