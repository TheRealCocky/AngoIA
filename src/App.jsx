// src/App.jsx
import React from 'react';
import Chat from './components/Chat';
import './index.css';
import { Analytics } from "@vercel/analytics/react";
import samacacaImage from '../src/imagens/samacaca.webp';

const App = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center" // Removido p-4
             style={{
                 backgroundImage: `url(${samacacaImage})`,
                 backgroundSize: 'cover',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center',
                 backgroundAttachment: 'fixed', // <-- Esta é a propriedade chave
                 // Opcional: Adicione um overlay para o texto ficar mais legível
                 // 'backgroundBlendMode': 'overlay',
                 // 'backgroundColor': 'rgba(0, 0, 0, 0.5)' // Ajuste a opacidade para escurecer a imagem
             }}
        >
            {/* O componente Chat agora contém toda a lógica e UI do chatbot */}
            <Chat />
            <Analytics /> {/* Mantido aqui para garantir que esteja no DOM */}
        </div>
    );
};

export default App;

