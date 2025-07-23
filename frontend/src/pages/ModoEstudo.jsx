// ModoEstudo.jsx
import React, { useState, useEffect, useRef } from "react";
import { LuBookOpen, LuCheck, LuX, LuArrowRight, LuTimer } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import BackHome from "../components/BackHome.jsx";

const somAcerto = new Audio("/sons/correto.mp3");
const somErro = new Audio("/sons/erro.mp3");

function embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
const perguntasMock =embaralhar( [
    {
        pergunta: "Qual é a moeda oficial de Angola?",
        opcoes: ["Kwanza", "Euro", "Dólar", "Metical"],
        correta: 0,
        explicacao: "A moeda oficial de Angola é o Kwanza."
    },
    {
        pergunta: "Qual é o maior rio que atravessa Angola?",
        opcoes: ["Rio Congo", "Rio Zambeze", "Rio Kwanza", "Rio Cunene"],
        correta: 2,
        explicacao: "O Rio Kwanza é o maior rio que corre inteiramente em território angolano."
    },
    {
        pergunta: "Quem colonizou Angola antes da independência?",
        opcoes: ["França", "Inglaterra", "Portugal", "Espanha"],
        correta: 2,
        explicacao: "Angola foi uma colônia de Portugal até 1975."
    },
    {
        pergunta: "Em que ano ocorreu a independência de Angola?",
        opcoes: ["1975", "1961", "1980", "1990"],
        correta: 0,
        explicacao: "Angola conquistou sua independência em 11 de novembro de 1975."
    },
    {
        pergunta: "Qual é o prato típico mais conhecido de Angola?",
        opcoes: ["Feijoada", "Funge com muamba", "Moqueca", "Vatapá"],
        correta: 1,
        explicacao: "O funge com muamba é um prato tradicional da culinária angolana."
    },
    {
        pergunta: "Quem foi o segundo presidente de Angola?",
        opcoes: ["Agostinho Neto", "Jonas Savimbi", "José Eduardo dos Santos", "Manuel Vicente"],
        correta: 2,
        explicacao: "José Eduardo dos Santos sucedeu Agostinho Neto como presidente."
    },
    {
        pergunta: "Qual destes países faz fronteira com Angola?",
        opcoes: ["Zâmbia", "Quênia", "Sudão", "Gâmbia"],
        correta: 0,
        explicacao: "Angola faz fronteira com a Zâmbia, Namíbia, República Democrática do Congo e Congo."
    },
    {
        pergunta: "Qual é a língua oficial de Angola?",
        opcoes: ["Umbundu", "Inglês", "Francês", "Português"],
        correta: 3,
        explicacao: "A língua oficial de Angola é o Português."
    },
    {
        pergunta: "Qual cidade é conhecida como o 'berço da independência' em Angola?",
        opcoes: ["Huambo", "Luanda", "Benguela", "Moxico"],
        correta: 3,
        explicacao: "Moxico, por abrigar parte dos combates e ações do MPLA, é considerado um símbolo da luta."
    },
    {
        pergunta: "Quantas províncias tem Angola?",
        opcoes: ["12", "18", "20", "15"],
        correta: 1,
        explicacao: "Angola é dividida em 18 províncias."
    },
    {
        pergunta: "Qual o nome do principal aeroporto internacional de Angola?",
        opcoes: ["4 de Fevereiro", "Agostinho Neto", "Aeroporto do Futungo", "Zé Dú Air"],
        correta: 0,
        explicacao: "O Aeroporto Internacional 4 de Fevereiro está localizado em Luanda."
    },
    {
        pergunta: "Que recurso natural é uma das principais fontes de renda de Angola?",
        opcoes: ["Carvão", "Petróleo", "Soja", "Cobre"],
        correta: 1,
        explicacao: "O petróleo é uma das principais fontes de receita de Angola."
    },
    {
        pergunta: "Qual o nome da guerra civil que ocorreu após a independência?",
        opcoes: ["Guerra Popular", "Guerra Colonial", "Guerra Civil Angolana", "Revolução Vermelha"],
        correta: 2,
        explicacao: "A Guerra Civil Angolana começou logo após a independência e durou até 2002."
    },
    {
        pergunta: "Qual desses rios é fronteira natural entre Angola e Namíbia?",
        opcoes: ["Rio Kwanza", "Rio Cunene", "Rio Zambeze", "Rio Cuvo"],
        correta: 1,
        explicacao: "O Rio Cunene faz parte da fronteira entre Angola e Namíbia."
    },
    {
        pergunta: "Que estilo musical é originário de Angola?",
        opcoes: ["Semba", "Samba", "Marrabenta", "Kizomba"],
        correta: 0,
        explicacao: "O semba é um estilo musical angolano que deu origem ao samba brasileiro."
    },
    {
        pergunta: "Quem foi o primeiro presidente de Angola?",
        opcoes: [
            "José Eduardo dos Santos",
            "Agostinho Neto",
            "Jonas Savimbi",
            "Samora Machel"
        ],
        correta: 1,
        explicacao: "Agostinho Neto foi o primeiro presidente de Angola e também um importante poeta e médico."
    },
    {
        pergunta: "Qual é a capital de Angola?",
        opcoes: ["Luanda", "Benguela", "Lubango", "Huambo"],
        correta: 0,
        explicacao: "Luanda é a capital e a maior cidade de Angola."
    }
]);

export default function ModoEstudo() {
    const [modoRevisao, setModoRevisao] = useState(false);
    const [perguntasErradas, setPerguntasErradas] = useState([]);
    const perguntasErradasTemp = [];
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [pontuacao, setPontuacao] = useState(0);
    const [fimDaSessao, setFimDaSessao] = useState(false);
    const perguntaAtual = perguntasMock[indiceAtual];
    const progresso = ((indiceAtual + (mostrarFeedback ? 1 : 0)) / perguntasMock.length) * 100;
    const sintetizador = useRef(window.speechSynthesis);

    useEffect(() => {
        if (!mostrarFeedback && tempoRestante > 0) {
            const timer = setTimeout(() => setTempoRestante((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (tempoRestante === 0 && !mostrarFeedback) {
            setMostrarFeedback(true);
        }
    }, [tempoRestante, mostrarFeedback]);

    useEffect(() => {
        if (sintetizador.current && perguntaAtual?.pergunta) {
            const fala = new SpeechSynthesisUtterance(perguntaAtual.pergunta);
            fala.lang = "pt-PT";
            sintetizador.current.cancel();
            sintetizador.current.speak(fala);
        }
    }, [indiceAtual]);

    function verificarResposta() {
        setMostrarFeedback(true);
        if (respostaSelecionada === perguntaAtual.correta) {
            somAcerto.play();
            setPontuacao((prev) => prev + 1);
        } else {
            perguntasErradasTemp.push({ ...perguntaAtual, respondida: respostaSelecionada });
            somErro.play();
        }

        const falaFeedback = new SpeechSynthesisUtterance(perguntaAtual.explicacao);
        falaFeedback.lang = "pt-PT";
        sintetizador.current.cancel();
        sintetizador.current.speak(falaFeedback);
    }

    function proximaPergunta() {
        const ultima = indiceAtual + 1 >= perguntasMock.length;
        setRespostaSelecionada(null);
        setMostrarFeedback(false);
        setTempoRestante(30);
        if (ultima) {
            setFimDaSessao(true);
            setModoRevisao(true);
            setPerguntasErradas(perguntasErradasTemp);
        } else {
            setIndiceAtual((prev) => prev + 1);
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <BackHome/>
            <div className="flex justify-between items-center text-sm text-gray-600">
               <span className="text-sm font-semibold text-blue-700">
             Pergunta {indiceAtual + 1} de {perguntasMock.length}
              </span>
                <span className="text-base font-bold text-yellow-500">
                 {Math.round(progresso)}%
                  </span>

            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progresso}%` }}
                ></div>
            </div>

            {fimDaSessao && modoRevisao ? (
                <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-blue-800 text-center">📚 Revisão das Perguntas</h2>
                    {perguntasErradas.length === 0 ? (
                        <p className="text-center text-green-700">Você acertou todas as perguntas! 👏</p>
                    ) : (
                        perguntasErradas.map((pergunta, idx) => (
                            <div key={idx} className="border border-gray-300 rounded-xl p-4 space-y-2">
                                <p className="font-medium">❓ {pergunta.pergunta}</p>
                                <p className="text-sm text-red-600">Sua resposta: {pergunta.opcoes[pergunta.respondida]}</p>
                                <p className="text-sm text-green-700">Correta: {pergunta.opcoes[pergunta.correta]}</p>
                                <p className="text-xs italic text-gray-500">{pergunta.explicacao}</p>
                            </div>
                        ))
                    )}

                    <div className="mt-4 flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={
                                i < Math.round((pontuacao / perguntasMock.length) * 5)
                                    ? 'text-yellow-400 text-2xl'
                                    : 'text-gray-300 text-2xl'
                            }>
                                ★
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800"
                    >
                        Reiniciar Sessão
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-2 bg-gray-500 text-white py-2 px-5 rounded-xl hover:bg-gray-600 w-full"
                    >
                        Voltar ao Menu Inicial
                    </button>
                </div>
            ) : fimDaSessao ? (
                <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-green-700">🎉 Sessão concluída!</h2>
                    <p className="text-lg text-gray-800">
                        Você acertou <strong>{pontuacao}</strong> de {perguntasMock.length} perguntas.
                    </p>
                    <p className="text-sm text-gray-600">
                        Sua pontuação final: <strong>{Math.round((pontuacao / perguntasMock.length) * 100)}%</strong>
                    </p>

                    <div className="mt-4 flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={
                                i < Math.round((pontuacao / perguntasMock.length) * 5)
                                    ? 'text-yellow-400 text-2xl'
                                    : 'text-gray-300 text-2xl'
                            }>
                                ★
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-2 bg-gray-500 text-white py-2 px-5 rounded-xl hover:bg-gray-600"
                    >
                        Voltar ao Menu Inicial
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={indiceAtual}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white shadow-xl rounded-2xl p-6 space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-800">
                                <LuBookOpen className="text-2xl" /> {perguntaAtual.pergunta}
                            </h2>
                            {!mostrarFeedback && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <LuTimer /> <span className="font-medium">{tempoRestante}s</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {perguntaAtual.opcoes.map((opcao, index) => {
                                const isSelecionada = respostaSelecionada === index;
                                const isCorreta = mostrarFeedback && index === perguntaAtual.correta;
                                const isErrada = mostrarFeedback && isSelecionada && index !== perguntaAtual.correta;

                                return (
                                    <motion.button
                                        layout
                                        key={index}
                                        disabled={mostrarFeedback}
                                        onClick={() => setRespostaSelecionada(index)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between
                                            ${isCorreta ? "bg-green-100 border-green-500 text-green-700" : ""}
                                            ${isErrada ? "bg-red-100 border-red-500 text-red-700" : ""}
                                            ${isSelecionada && !mostrarFeedback ? "bg-blue-100 border-blue-500" : "bg-white"}
                                        `}
                                    >
                                        <span>{opcao}</span>
                                        {isCorreta && <LuCheck className="text-green-600" />}
                                        {isErrada && <LuX className="text-red-600" />}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {!mostrarFeedback ? (
                            <button
                                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                                onClick={verificarResposta}
                                disabled={respostaSelecionada === null}
                            >
                                Confirmar
                            </button>
                        ) : (
                            <div className="space-y-3 mt-4">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm italic text-gray-700"
                                >
                                    {perguntaAtual.explicacao}
                                </motion.p>
                                <button
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
                                    onClick={proximaPergunta}
                                >
                                    <LuArrowRight /> {indiceAtual + 1 === perguntasMock.length ? "Finalizar" : "Próxima Pergunta"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
