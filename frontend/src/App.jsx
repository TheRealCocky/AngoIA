import React, { Suspense, lazy } from 'react';
import samacaca from './imagens/samacaca.webp';
const Chat = lazy(() => import('./pages/Chat.jsx'));
//import Chat from './pages/Chat.jsx';

import './index.css';
import { Analytics } from "@vercel/analytics/react";

const App = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
            {/* Fundo fixo */}
            <div
                className="fixed inset-0 -z-10"
                style={{

                    backgroundImage: `url(${samacaca})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    filter: 'brightness(0.6)',
                }}
            />

             <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center h-screen text-white animate-pulse">
                        <h1 className="text-4xl font-bold text-angola-red">AngoIA</h1>
                        <p className="mt-4 text-lg">Carregando inteligência...</p>
                    </div>
                }
            >
                <Chat />
                </Suspense>

                <Analytics />
        </div>
    );
};

export default App;


