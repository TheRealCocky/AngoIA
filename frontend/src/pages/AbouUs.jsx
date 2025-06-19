import React from 'react';
import BackHome from "../components/BackHome.jsx";

const AboutUs = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
            {/* Botão de voltar para o chat */}
            <BackHome />

            <div className="max-w-3xl w-full rounded-2xl p-10 text-white
        bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">

                <h2 className="text-3xl font-bold mb-6 text-angoia-gold-yellow drop-shadow">
                    Sobre o AngoIA
                </h2>

                <p className="mb-4 text-lg leading-relaxed text-white/90 drop-shadow-sm">
                    O <strong className="text-white">AngoIA</strong> é um assistente virtual dedicado à cultura, história e identidade de Angola 🇦🇴.
                    Criado para oferecer uma experiência digital educativa e acessível — feita por jovens angolanos apaixonados pelo seu país.
                </p>

                <p className="mb-4 text-lg leading-relaxed text-white/90 drop-shadow-sm">
                    Este projeto é liderado por <a href="https://euclidesbaltazar.vercel.app" target="_blank" rel="noopener noreferrer" className="underline text-angoia-gold-yellow font-semibold hover:text-yellow-300">Euclides Baltazar</a>,
                    estudante do <strong className="text-white">4º ano de Engenharia Informática</strong>, entusiasta de IA, design e inovação digital.
                </p>

                <p className="mb-4 text-lg leading-relaxed text-white/90 drop-shadow-sm">
                    Conta com o apoio de <strong className="text-white">Filipe</strong>, estudante do <strong className="text-white">1º ano</strong> da mesma área, que contribui com ideias, testes e apoio técnico.
                </p>

                <p className="mb-4 text-lg leading-relaxed text-white/90 drop-shadow-sm">
                    Nosso objetivo é fornecer respostas confiáveis, educativas e envolventes sobre Angola — das províncias às tradições, passando por figuras históricas e curiosidades que representam a identidade do nosso país.
                </p>

                <p className="text-lg italic text-gray-300 mt-6">
                    “Criar tecnologia com alma angolana — esse é o nosso propósito.”
                </p>
            </div>
        </div>
    );
};

export default AboutUs;


