// src/App.jsx
import React from 'react';
import Chat from './components/Chat'; //
import './index.css'; //
import { Analytics } from "@vercel/analytics/react"
import samacacaImage from '../src/imagens/samacaca.webp'; //

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
             style={{

                 backgroundImage: `url(${samacacaImage})`,
                 backgroundSize: 'cover',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center',
                 // Opcional: Adicione um overlay para o texto ficar mais legível
                 // 'backgroundBlendMode': 'overlay',
                 // 'backgroundColor': 'rgba(0, 0, 0, 0.5)' // Ajuste a opacidade para escurecer a imagem
             }}
        >
            {/* O componente Chat agora contém toda a lógica e UI do chatbot */}
            <Chat />
        </div>
    );
};

export default App;
