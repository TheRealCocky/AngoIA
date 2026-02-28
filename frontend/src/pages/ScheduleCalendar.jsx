import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ScheduleCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        thema: 'livre',
        date: '',
        time: ''
    });

    const BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://angoia-backend-5ic1.onrender.com';

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
            case 'autoconhecimento': return '#dc2626'; // vermelho
            case 'estudo': return '#1e293b'; // preto azulado
            case 'carreira': return '#eab308'; // amarelo
            case 'reflexão': return '#7c3aed'; // roxo
            case 'livre': return '#6b7280'; // cinza
            default: return '#9ca3af';
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-6 px-4 sm:px-6 lg:px-24">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#dc2626]">📅 Calendário de Sessões</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Bem-vindo ao AngoIA — organize o seu crescimento pessoal.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#dc2626] hover:bg-red-700 transition text-white text-sm sm:text-base px-4 py-2 rounded-lg shadow-md"
                    >
                        {showForm ? 'Fechar Formulário' : '+ Nova Sessão'}
                    </button>
                    <button
                        onClick={() => window.location.href = '/chat'} // ajuste a rota se for diferente
                        className="bg-[#1e293b] hover:bg-gray-800 transition text-white text-sm sm:text-base px-4 py-2 rounded-lg shadow-md"
                    >
                      voltar
                    </button>
                </div>
            </header>
            {showForm && (
                <form
                    onSubmit={handleFormSubmit}
                    className="bg-white rounded-xl shadow-md p-5 sm:p-6 space-y-6 mb-10"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Tema</label>
                            <select
                                name="thema"
                                value={form.thema}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                <option value="autoconhecimento">Autoconhecimento</option>
                                <option value="estudo">Estudo</option>
                                <option value="carreira">Carreira</option>
                                <option value="reflexão">Reflexão</option>
                                <option value="livre">Livre</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Data</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Hora</label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#eab308] hover:bg-yellow-500 transition text-black text-sm sm:text-base px-4 py-2 rounded-lg"
                        >
                            Agendar Sessão
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow p-3 sm:p-6 min-h-[650px] sm:min-h-0">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    locale="pt"
                    expandRows={true}
                    fixedWeekCount={false}
                    height="auto"
                    contentHeight="auto"
                    dayMaxEventRows={3}
                    dayCellClassNames="py-5 text-sm"
                />
            </div>



        </div>

    );
};

export default ScheduleCalendar;
