import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react'; // usa ícone de fechar (instale lucide-react se necessário)

const ScheduleModal = ({ isOpen, onClose }) => {
    const [question, setQuestion] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [repeat, setRepeat] = useState('none');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const BaseURL =
        window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://angoia-backend.onrender.com';
    const handleSubmit = async () => {
        if (!question || !scheduledAt) {
            setFeedback('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        setFeedback('');



        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${BaseURL}/api/schedule`,
                { question, scheduledAt, repeat },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setFeedback('✅ Pergunta agendada com sucesso!');
            setQuestion('');
            setScheduledAt('');
            setRepeat('none');
        } catch (err) {
            console.error(err);
            setFeedback('❌ Erro ao agendar pergunta.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="relative bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    📅 Agendar Pergunta
                </h2>

                <textarea
                    className="w-full border rounded p-2 mb-3 dark:bg-gray-800 dark:text-white"
                    rows="3"
                    placeholder="Digite sua pergunta..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <label className="block text-sm mb-1 dark:text-white">Data e hora:</label>
                <input
                    type="datetime-local"
                    className="w-full border rounded p-2 mb-3 dark:bg-gray-800 dark:text-white"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                />

                <label className="block text-sm mb-1 dark:text-white">Repetição:</label>
                <select
                    className="w-full border rounded p-2 mb-4 dark:bg-gray-800 dark:text-white"
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                >
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                </select>

                {feedback && <p className="text-sm mb-2">{feedback}</p>}

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default ScheduleModal;

