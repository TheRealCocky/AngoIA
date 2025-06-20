import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

const PrivacidadePage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Privacidade e Dados</h1>
            </div>

            <div className="flex-1 space-y-4">
                <p><Lock className="inline w-5 h-5 mr-2" /> Controle como seus dados são utilizados.</p>
                <ul className="space-y-3">
                    <li>🔒 Gerenciar dados pessoais</li>
                    <li>📄 Solicitar cópia dos dados</li>
                    <li>🗑️ Excluir conta</li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacidadePage;
