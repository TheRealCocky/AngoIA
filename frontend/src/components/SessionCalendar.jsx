import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { X } from 'lucide-react';

const SessionCalendar = ({ onClose }) => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        thema: 'livre',
        date: '',
        time: ''
    });

    const BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend.onrender.com';

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded = jwtDecode(token);

        try {
            const res = await axios.get(`${BASE_URL}/api/session/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const transformed = res.data.map(sessao => ({
                title: sessao.thema,
                date: sessao.scheduledAt,
                backgroundColor: getColor(sessao.thema),
            }));

            setEvents(transformed);
        } catch (err) {
            console.error('Erro ao buscar sessões:', err.message);
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.post(`${BASE_URL}/api/session`, {
                thema: form.thema,
                scheduledAt: new Date(`${form.date}T${form.time}:00Z`)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowForm(false);
            setForm({ thema: 'livre', date: '', time: '' });
            fetchSessions();
        } catch (err) {
            console.error('Erro ao agendar sessão:', err.message);
        }
    };

    const getColor = (thema) => {
        switch (thema) {
            case 'autoconhecimento': return '#4ade80';
            case 'estudo': return '#60a5fa';
            case 'carreira': return '#facc15';
            case 'reflexão': return '#f472b6';
            case 'livre': return '#a3a3a3';
            default: return '#ccc';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white px-6 pt-4 pb-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">📅 Calendário de Sessões</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={20} />
                    </button>
                </div>

                {/* Calendário + Formulário */}
                <div className="overflow-y-auto px-6 py-4 space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                        >
                            + Agendar nova sessão
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleFormSubmit} className="bg-gray-50 p-4 rounded border space-y-3">
                            <div className="flex flex-col">
                                <label className="text-sm mb-1">Tema</label>
                                <select
                                    name="thema"
                                    value={form.thema}
                                    onChange={handleInputChange}
                                    className="border rounded p-2"
                                >
                                    <option value="autoconhecimento">Autoconhecimento</option>
                                    <option value="estudo">Estudo</option>
                                    <option value="carreira">Carreira</option>
                                    <option value="reflexão">Reflexão</option>
                                    <option value="livre">Livre</option>
                                </select>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col flex-1">
                                    <label className="text-sm mb-1">Data</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleInputChange}
                                        className="border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label className="text-sm mb-1">Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={form.time}
                                        onChange={handleInputChange}
                                        className="border rounded p-2"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Agendar
                            </button>
                        </form>
                    )}

                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locale="pt"
                        height="auto"
                        contentHeight="auto"
                        dayMaxEventRows={3}
                        dayCellClassNames="py-5 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default SessionCalendar;



