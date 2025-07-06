import React, { useState } from 'react';
import { Button } from "../components/button.jsx";
import { Card, CardContent } from "../components/card.jsx";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import BackHome from "../components/BackHome.jsx";

const planos = [
    {
        nome: "AngoIA Ubuntu",
        preco: "AOA 5.000/mês",
        limite: "50 perguntas/dia",
        funcionalidades: ["Histórico completo", "Favoritar respostas", "Modo escuro"],
        destaque: false,
        botao: "Assinar Ubuntu",
    },
    {
        nome: "AngoIA Soba",
        preco: "AOA 15.000/mês",
        limite: "200 perguntas/dia",
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

const faqs = [
    {
        pergunta: "Qual a diferença entre os planos Ubuntu, Soba e Mukanda?",
        resposta: "Cada plano oferece um conjunto diferente de funcionalidades e limites. O Ubuntu é ideal para uso casual, o Soba para usuários frequentes e o Mukanda para quem busca o máximo desempenho e recursos premium.",
    },
    {
        pergunta: "Como funciona o pagamento?",
        resposta: "O pagamento é mensal e feito em Kwanzas, por métodos locais. A cobrança é renovada automaticamente a cada mês, mas você pode cancelar quando quiser.",
    },
    {
        pergunta: "O que acontece se eu não pagar?",
        resposta: "Você será automaticamente migrado para o plano gratuito com acesso limitado até regularizar o pagamento.",
    },
    {
        pergunta: "Posso trocar de plano depois?",
        resposta: "Sim! É possível fazer upgrade ou downgrade de plano a qualquer momento através do seu painel de usuário.",
    },
    {
        pergunta: "Minhas conversas ficam salvas?",
        resposta: "Sim, seu histórico fica salvo com segurança e pode ser consultado a qualquer momento no painel.",
    },
    {
        pergunta: "AngoIA é segura?",
        resposta: "Sim. Suas informações são criptografadas e protegidas. Não compartilhamos seus dados com terceiros.",
    },
    {
        pergunta: "A IA entende português de Angola?",
        resposta: "Sim! A AngoIA foi desenvolvida para compreender o português falado em Angola, incluindo gírias e expressões locais.",
    },
    {
        pergunta: "Tem plano gratuito?",
        resposta: "Sim. Existe um plano gratuito com um número limitado de perguntas por dia e acesso básico às funcionalidades.",
    },
    {
        pergunta: "Consigo testar antes de pagar?",
        resposta: "Claro! O plano gratuito serve justamente para você testar a AngoIA antes de decidir assinar.",
    },
    {
        pergunta: "Funciona em telemóvel e computador?",
        resposta: "Sim, a AngoIA é compatível com todos os dispositivos modernos — seja PC, tablet ou telemóvel.",
    },
    {
        pergunta: "Posso usar para fins educacionais ou trabalho?",
        resposta: "Sim! A AngoIA é ótima para estudos, pesquisas acadêmicas, brainstormings criativos e tarefas profissionais.",
    },
];

const Planos = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen w-full px-4 py-10 bg-g">
            <BackHome />
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-500 mb-10 mt-10">
                Escolha seu plano AngoIA
            </h1>

            {/* Cards dos planos */}
            <div className="overflow-x-auto lg:overflow-visible">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full mx-auto">
                    {planos.map((plano) => (
                        <Card
                            key={plano.nome}
                            className={`rounded-2xl shadow-lg border p-6 transition-transform duration-300 hover:scale-105 ${
                                plano.destaque
                                    ? "bg-yellow-50 border-yellow-400"
                                    : "bg-white border-gray-200"
                            }`}
                        >
                            <CardContent className="flex flex-col gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{plano.nome}</h2>
                                <p className="text-base text-gray-600">{plano.limite}</p>
                                <p className="text-xl font-bold text-indigo-600">{plano.preco}</p>
                                <ul className="text-gray-700 space-y-2">
                                    {plano.funcionalidades.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-lg py-2 text-sm sm:text-base">
                                    {plano.botao}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recursos detalhados */}
            <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl mt-20 px-6 py-12 max-w-7xl w-full mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
                    Recursos disponíveis em cada plano
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {/* Ubuntu */}
                    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                        <h3 className="text-lg sm:text-xl font-bold text-indigo-600 mb-4">AngoIA Ubuntu – AOA 5.000/mês</h3>
                        <ul className="space-y-3">
                            {[
                                "Limite: 50 perguntas por dia",
                                "Histórico de conversas",
                                "Favoritar respostas",
                                "Compartilhamento de respostas",
                                "Feedback nas respostas",
                                "Temas (claro/escuro)",
                                "Tags automáticas",
                                "Busca básica no histórico",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Soba */}
                    <div className="w-full bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-400 hover:shadow-lg transition">
                        <h3 className="text-lg sm:text-xl font-bold text-yellow-700 mb-4">AngoIA Soba – AOA 15.000/mês</h3>
                        <ul className="space-y-3">
                            {[
                                "Limite: 200 perguntas por dia",
                                "Todas funcionalidades do plano Ubuntu, mais:",
                                "Sessões temáticas",
                                "Exportar conversas (PDF/TXT/MD)",
                                "Bookmarks (Pins)",
                                "Comentários/notas nas respostas",
                                "Conquistas e níveis",
                                "Resumo semanal automático",
                                "Refazer resposta",
                                "Filtros avançados (por tag, tipo, etc.)",
                                "Comentários em respostas públicas",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Mukanda */}
                    <div className="w-full bg-indigo-50 rounded-xl shadow-md p-6 border border-indigo-400 hover:shadow-lg transition">
                        <h3 className="text-lg sm:text-xl font-bold text-indigo-700 mb-4">AngoIA Mukanda – AOA 50.000/mês</h3>
                        <ul className="space-y-3">
                            {[
                                "Limite: Ilimitado",
                                "Todas funcionalidades do plano Soba, mais:",
                                "Agendamento de perguntas",
                                "Análises pessoais detalhadas",
                                "Notificações por email",
                                "Modo estudo (IA faz perguntas)",
                                "Widget de resposta incorporável",
                                "Calendário de sessões (timeline)",
                                "Leitura em voz alta (Web Speech API)",
                                "Busca avançada com tags e contexto",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="mt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-white mb-10">
                    Perguntas Frequentes
                </h2>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
                            onClick={() => toggleOpen(index)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-indigo-700">
                                    {faq.pergunta}
                                </h3>
                                {openIndex === index ? (
                                    <ChevronUp className="text-indigo-700 w-5 h-5" />
                                ) : (
                                    <ChevronDown className="text-indigo-700 w-5 h-5" />
                                )}
                            </div>
                            {openIndex === index && (
                                <p className="mt-3 text-gray-700 leading-relaxed">{faq.resposta}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Planos;


