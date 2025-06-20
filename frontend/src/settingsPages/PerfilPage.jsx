import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PerfilPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Erro ao carregar o usuário:", error);
        }
    }, []);

    return (
        <div className="w-screen h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red">Perfil</h1>
            </div>

            <div className="flex-1">
                {user ? (
                    <div className="space-y-4 text-base">
                        <p><strong>Nome:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Função:</strong> Usuário padrão</p>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                        Nenhum utilizador autenticado.
                    </p>
                )}
            </div>
        </div>
    );
};

export default PerfilPage;

