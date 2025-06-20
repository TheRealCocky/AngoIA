import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";

const AjudaSuportePage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Ajuda e Suporte</h1>
            </div>

            <div className="flex-1 space-y-4">
                <p><HelpCircle className="inline w-5 h-5 mr-2" /> Encontre respostas e entre em contato com o suporte.</p>
                <ul className="space-y-3">
                    <li>📘 Perguntas Frequentes (FAQ)</li>
                    <li>📨 Suporte por Email</li>
                    <li>💬 Chat com um atendente</li>
                </ul>
            </div>
        </div>
    );
};

export default AjudaSuportePage;
