import React from 'react';
import { Button } from "../components/button.jsx";
import { Card, CardContent } from "../components/card.jsx";
import { Check } from "lucide-react";
import BackHome from "../components/BackHome.jsx";

const planos = [

    {
        nome: "AngoIA Ubuntu",
        preco: "AOA 5.000/mês",
        limite: "150 perguntas/dia",
        funcionalidades: ["Histórico completo", "Favoritar respostas", "Modo escuro"],
        destaque: false,
        botao: "Assinar Ubuntu",
    },
    {
        nome: "AngoIA Soba",
        preco: "AOA 15.000/mês",
        limite: "300 perguntas/dia",
        funcionalidades: ["Exportar conversas", "Pins e Comentários", "Refazer resposta"],
        destaque: true,
        botao: "Assinar Soba",
    },
    {
        nome: "AngoIA Mukanda",
        preco: "AOA 50.000/mês",
        limite: "Ilimitado",
        funcionalidades: ["IA faz perguntas", "Widget incorporável", "Busca avançada"],
        destaque: false,
        botao: "Assinar Mukanda",
    },
];

const Planos = () => {
    return (

        <div className="min-h-screen  py-10 px-4">
            <BackHome/>
            <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10 sm:m-3">
                Escolha seu plano AngoIA
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {planos.map((plano) => (
                    <Card
                        key={plano.nome}
                        className={`rounded-2xl shadow-xl border border-gray-200 p-6 transition-transform hover:scale-105 ${
                            plano.destaque ? "bg-yellow-100 border-yellow-400" : "bg-white"
                        }`}
                    >
                        <CardContent className="flex flex-col gap-4">
                            <h2 className="text-2xl font-semibold text-gray-900">{plano.nome}</h2>
                            <p className="text-lg text-gray-600">{plano.limite}</p>
                            <p className="text-xl font-bold text-indigo-600">{plano.preco}</p>
                            <ul className="text-gray-700 space-y-1">
                                {plano.funcionalidades.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                            {plano.botao && (
                                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                                    {plano.botao}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Planos;


