import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Cog,
    User,
    Bell,
    Shield,
    Lock,
    HelpCircle,
    Info,
    LogOut
} from "lucide-react";

const SettingsModalSm = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const settings = [
        { label: "Geral", icon: Cog, link: "/geral-mb" },
        { label: "Perfil", icon: User, link: "/perfil-mb" },
        { label: "Notificações", icon: Bell, link: "/notificacoes-mb" },
        { label: "Privacidade e Dados", icon: Lock, link: "/privacidade-mb" },
        { label: "Legal e Segurança", icon: Shield, link: "/seguranca-mb" },
        { label: "Ajuda e Suporte", icon: HelpCircle, link: "/ajuda-mb" },
        { label: "Sobre", icon: Info, link: "/angoia-mb" }
    ];

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 px-6 py-6 flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red dark:text-white">
                    Configurações
                </h1>
            </div>

            {/* Config Options */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {settings.map(({ label, icon: Icon, link }, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(link)}
                        className="w-full flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <Icon className="w-5 h-5 mr-4" />
                        <span className="text-md font-medium">{label}</span>
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="mt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition"
                >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span className="text-md font-semibold">Sair</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsModalSm;






