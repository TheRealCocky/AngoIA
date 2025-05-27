import React, { Suspense, lazy } from 'react';
import {BrowserRouter as Router, Routes, Route,  Navigate} from 'react-router-dom';
import samacaca from './imagens/samacaca.webp';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

const Chat = lazy(() => import('./pages/Chat.jsx'));

const App = () => {
    return (
        <Router>
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

                {/* Rotas */}
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center h-screen text-white animate-pulse">
                            <h1 className="text-4xl font-bold text-angola-red">AngoIA</h1>
                            <p className="mt-4 text-lg">Carregando inteligência...</p>
                        </div>
                    }
                >
                    <Routes>
                        <Routes>
                            <Route path="/" element={<Navigate to="/chat" replace />} />
                            <Route path="/chat" element={<Chat />} />
                        </Routes>
                    </Routes>
                </Suspense>

                <Analytics />
            </div>
        </Router>
    );
};

export default App;



