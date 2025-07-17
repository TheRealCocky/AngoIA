import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ScheduleMobile = () => {
    const [question, setQuestion] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [repeat, setRepeat] = useState('none');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    const BaseURL= window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';
const handleSubmit = async ()=>{
    if(!question || !scheduledAt){
        setFeedback('Por favor, preencha todos os campos.');
        return;
    }
    setLoading(true);
    setFeedback('');



    try{
        const token = localStorage.getItem('token');
        await axios.post(
            `${BaseURL}/api/schedule`,
            {question, scheduledAt, repeat},
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },

            });
        setFeedback('✅ Pergunta agendada com sucesso!');
        setQuestion('');
        setScheduledAt('');
        setRepeat('none');
    }
    catch (err){
        console.error(err);
        setFeedback('❌ Erro ao agendar pergunta.');
    }finally {
        setLoading(false);
    }
}
const onClose=()=>{
    navigate(-1);
    }
    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6 flex flex-col items-center">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mt-6">
                {/* Botão de fechar */}
                <button
                    onClick={onClose}
                    className=" absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-center">📅 Agendar Pergunta</h2>

                {/* Pergunta */}
                <label className="block text-sm font-medium mb-1">Pergunta:</label>
                <textarea
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-4 resize-none dark:bg-gray-800 dark:text-white"
                    rows="3"
                    placeholder="Digite sua pergunta..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                {/* Data e Hora */}
                <label className="block text-sm font-medium mb-1">Data e hora:</label>
                <input
                    type="datetime-local"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-4 dark:bg-gray-800 dark:text-white"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                />

                {/* Repetição */}
                <label className="block text-sm font-medium mb-1">Repetição:</label>
                <select
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-4 dark:bg-gray-800 dark:text-white"
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                >
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                </select>

                {/* Feedback */}
                {feedback && (
                    <p className="text-sm text-center text-blue-600 dark:text-blue-400 mb-4">
                        {feedback}
                    </p>
                )}

                {/* Ações */}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Agendando...' : 'Agendar'}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default ScheduleMobile;