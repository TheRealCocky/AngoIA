import React from "react";
import {
    Settings, Bell, Shield, Gavel, LifeBuoy, X, Sun, Moon, SunMoon,
    Info, LogOut, LogIn, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsModalLg = ({ isOpen, onClose, selectedOption, onOptionChange }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!isOpen) return null;

    const options = [
        { key: "general", label: "Geral", icon: <Settings size={18} /> },
        { key: "profile", label: "Perfil", icon: <User size={18} /> },
        { key: "notifications", label: "Notificações", icon: <Bell size={18} /> },
        { key: "privacy", label: "Privacidade e Dados", icon: <Shield size={18} /> },
        { key: "legal", label: "Legal e Segurança", icon: <Gavel size={18} /> },
        { key: "help", label: "Ajuda e Suporte", icon: <LifeBuoy size={18} /> },
        { key: "about", label: "Sobre", icon: <Info size={18} /> },
        !user
            ? { key: "login", label: "Entrar", icon: <LogIn size={18} /> }
            : { key: "logout", label: "Sair", icon: <LogOut size={18} /> },
    ];

    const handleLogin = () => {
        navigate("/login");
        onClose();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        onClose();
    };

    const changeTheme = (mode) => {
        if (mode === "auto") localStorage.removeItem("theme");
        else localStorage.setItem("theme", mode);

        const darkMode = mode === "dark" || (mode === "auto" && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle("dark", darkMode);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-[#1c1c1c] text-black dark:text-white rounded-xl w-full max-w-4xl h-[600px] flex shadow-xl overflow-hidden">

                {/* Sidebar */}
                <div className="w-1/3 bg-[#f2f2f2] dark:bg-[#262626] p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 px-2">Configurações</h2>
                        <div className="space-y-1">
                            {options.map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => {
                                        if (opt.key === "login") handleLogin();
                                        else if (opt.key === "logout") handleLogout();
                                        else onOptionChange(opt.key);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                                        selectedOption === opt.key
                                            ? "bg-white dark:bg-[#1c1c1c] shadow border-l-4 border-blue-500 font-medium"
                                            : "hover:bg-gray-200 dark:hover:bg-[#333]"
                                    }`}
                                >
                                    <span className="text-gray-600 dark:text-gray-400">{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 text-center mt-6">

                    </div>
                </div>

                {/* Conteúdo */}
                <div className="w-2/3 p-6 relative overflow-y-auto">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white">
                        <X size={20} />
                    </button>

                    {selectedOption === "general" && (
                        <>
                            <h3 className="text-lg font-semibold mb-2">Sua conta</h3>
                            <div className="p-4 border rounded-lg dark:border-[#444] dark:hover:bg-[#2c2c2c]">
                                <p className="font-medium">Central de Contas</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Senha, segurança, dados pessoais, anúncios</p>
                            </div>

                            <h3 className="text-lg font-semibold mt-8 mb-2">Aparência</h3>
                            <div className="flex space-x-2">
                                <AppearanceButton icon={<Sun size={16} />} label="Claro" onClick={() => changeTheme("light")} />
                                <AppearanceButton icon={<Moon size={16} />} label="Escuro" onClick={() => changeTheme("dark")} />
                                <AppearanceButton icon={<SunMoon size={16} />} label="Automático" onClick={() => changeTheme("auto")} />
                            </div>
                        </>
                    )}

                    {selectedOption === "profile" && (
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold mb-2">Perfil</h3>
                            {user ? (
                                <div>
                                    <p><strong>Nome:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Função:</strong> Usuário padrão</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">Nenhum utilizador autenticado.</p>
                            )}
                        </div>
                    )}

                    {selectedOption === "notifications" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Notificações</h3>
                            <p className="text-gray-500">Em breve poderá ativar alertas sobre atualizações de IA, cultura e Angola.</p>
                        </div>
                    )}

                    {selectedOption === "privacy" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Privacidade e Dados</h3>
                            <p className="text-gray-500">Seus dados são criptografados e nunca serão vendidos ou compartilhados.</p>
                        </div>
                    )}

                    {selectedOption === "legal" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Legal e Segurança</h3>
                            <p className="text-gray-500">Estamos em conformidade com a legislação angolana e medidas internacionais de segurança de dados.</p>
                        </div>
                    )}

                    {selectedOption === "help" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Ajuda e Suporte</h3>
                            <p className="text-gray-500">
                                Para suporte técnico ou dúvidas, contacte-nos através do email: <a href="mailto:suporte@angoia.co.ao" className="underline">suporte@angoia.co.ao</a>
                            </p>
                        </div>
                    )}

                    {selectedOption === "about" && (
                        <div className="space-y-3 text-base">
                            <h3 className="text-xl font-bold mb-2">Sobre AngoIA</h3>
                            <p className="text-gray-500">AngoIA é uma plataforma de inteligência artificial desenvolvida para apoiar usuários de língua portuguesa com respostas, geração de texto e integração cultural africana.</p>
                            <p className="text-gray-500">Criado para oferecer uma experiência digital educativa e acessível — feita por jovens angolanos apaixonados pelo seu país.</p>
                            <p className="text-gray-500">
                                Este projeto é liderado por <a href="https://euclidesbaltazar.vercel.app" target="_blank" rel="noopener noreferrer" className="underline text-black font-semibold">Euclides Baltazar</a>, estudante do <strong>4º ano de Engenharia Informática</strong>.
                            </p>
                            <p className="text-gray-500">Conta com o apoio de <strong>Filipe</strong>, estudante do <strong>1º ano</strong>, que contribui com ideias, UI/UX e apoio técnico.</p>
                            <p className="text-gray-500 font-medium">Nosso objetivo é fornecer respostas confiáveis e educativas sobre Angola — das províncias às tradições, passando por figuras históricas e curiosidades.</p>
                            <p className="italic text-gray-500">“Criar tecnologia com alma angolana — esse é o nosso propósito.”</p>
                            <p className="text-xs text-gray-500 mt-4">Versão 1.0.0</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Botão de aparência
const AppearanceButton = ({ icon, label, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 border p-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium ${
            selected ? "bg-gray-100 dark:bg-[#333]" : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
        }`}
    >
        {icon}
        {label}
    </button>
);

export default SettingsModalLg;






