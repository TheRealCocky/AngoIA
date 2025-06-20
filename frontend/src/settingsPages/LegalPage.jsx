import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const LegalPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Legal e Segurança</h1>
            </div>

            <div className="flex-1 space-y-4">
                <p><Shield className="inline w-5 h-5 mr-2" /> Informações legais e medidas de segurança.</p>
                <ul className="space-y-3">
                    <li>📜 Termos de Serviço</li>
                    <li>🔐 Política de Privacidade</li>
                    <li>🛡️ Segurança da Conta</li>
                </ul>
            </div>
        </div>
    );
};

export default LegalPage;
