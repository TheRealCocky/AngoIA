import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import samacaca from './imagens/samacaca.webp';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import AboutUs from "./pages/AbouUs.jsx";
import Planos from "./pages/Planos.jsx";
import SettingsModalSm from "./components/SettingsModalSm.jsx";
import GeralSM from "./settingsPages/GeralSM.jsx";
import PerfilPage from "./settingsPages/PerfilPage.jsx";
import NotificacoesPage from "./settingsPages/NotificacoesPage.jsx";
import PrivacidadePage from "./settingsPages/PrivacidadePage.jsx";
import LegalPage from "./settingsPages/LegalPage.jsx";
import AjudaSuportePage from "./settingsPages/AjudaSuportePage.jsx";
import SobrePage from "./settingsPages/SobrePage.jsx";
import ChatShareView from "./pages/ChatShareView.jsx";
import HistoricoMobile from "./components/HistoricoMobile.jsx";

const Chat = lazy(() => import('./pages/Chat.jsx'));

const App = () => {

    // 🌓 Define o tema baseado no localStorage ao carregar o app
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <Router>
            <div
                className="min-h-screen w-full flex flex-col items-center justify-center relative bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${samacaca})`,
                    filter: 'brightness(0.6)',
                }}
            >
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-screen text-white animate-pulse">
                        <h1 className="text-4xl font-bold text-angola-red">AngoIA</h1>
                        <p className="mt-4 text-lg">Carregando inteligência...</p>
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Navigate to="/chat" replace />} />
                         <Route path="/chat" element={<Chat />} />
                        <Route path="/chat/:id" element={<Chat />} />
                        <Route path="/chat/:messageId" element={<Chat />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registar" element={<Register />} />
                        <Route path="/angoia" element={<AboutUs />} />
                        <Route path="/planos" element={<Planos />} />
                        <Route path="/mobile" element={<SettingsModalSm />} />
                        <Route path="/geral-mb" element={<GeralSM/>}/>
                        <Route path="perfil-mb" element={<PerfilPage/>}/>
                        <Route path="notificacoes-mb" element={<NotificacoesPage/>} />
                        <Route path="privacidade-mb" element={<PrivacidadePage/>}/>
                        <Route path="/seguranca-mb" element={<LegalPage/>}/>
                        <Route path="/ajuda-mb" element={<AjudaSuportePage/>}/>
                        <Route path="/angoia-mb" element={<SobrePage/>}/>
                        <Route path="/chat/:id" element={<ChatShareView />} />
                        <Route path="/historico-mobile" element={<HistoricoMobile/>}/>
                        {/* outras rotas aqui */}
                    </Routes>
                </Suspense>
                <Analytics />
            </div>
        </Router>
    );
};

export default App;






