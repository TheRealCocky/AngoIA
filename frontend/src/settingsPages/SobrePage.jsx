import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";

const SobrePage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Sobre</h1>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <h2 className="text-xl font-semibold">Sobre AngoIA</h2>
                <p>
                    AngoIA é uma plataforma de inteligência artificial desenvolvida para apoiar usuários de língua portuguesa com respostas, geração de texto e integração cultural africana.
                </p>
                <p>
                    Criado para oferecer uma experiência digital educativa e acessível — feita por jovens angolanos apaixonados pelo seu país.
                </p>
                <p>
                    Este projeto é liderado por <strong>Euclides Baltazar</strong>, estudante do 4º ano de Engenharia Informática.
                </p>
                <p>
                    Conta com o apoio de <strong>Filipe</strong>, estudante do 1º ano, que contribui com ideias, UI/UX e apoio técnico.
                </p>
                <p>
                    Nosso objetivo é fornecer respostas confiáveis e educativas sobre Angola — das províncias às tradições, passando por figuras históricas e curiosidades.
                </p>
                <blockquote className="italic border-l-4 border-angola-red pl-4 text-angola-red">
                    “Criar tecnologia com alma angolana — esse é o nosso propósito.”
                </blockquote>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">Versão 1.0.0</p>
            </div>
        </div>
    );
};

export default SobrePage;
