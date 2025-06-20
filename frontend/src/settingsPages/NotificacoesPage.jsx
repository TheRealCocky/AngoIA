import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

const NotificacoesPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Notificações</h1>
            </div>

            <div className="flex-1 space-y-4">
                <p><Bell className="inline w-5 h-5 mr-2" /> Gerencie suas preferências de notificações.</p>
                <ul className="space-y-3">
                    <li>🔔 Receber notificações por e-mail</li>
                    <li>📱 Notificações push no dispositivo</li>
                    <li>🔕 Modo silencioso</li>
                </ul>
            </div>
        </div>
    );
};

export default NotificacoesPage;
