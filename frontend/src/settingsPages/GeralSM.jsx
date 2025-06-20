import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GeralSM = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "auto");

    const handleThemeChange = (value) => {
        setTheme(value);
        localStorage.setItem("theme", value);

        if (value === "dark") {
            document.documentElement.classList.add("dark");
        } else if (value === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            prefersDark
                ? document.documentElement.classList.add("dark")
                : document.documentElement.classList.remove("dark");
        }
    };

    return (
        <div className="w-screen h-screen px-6 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Header com botão voltar */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-700 dark:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-angola-red dark:text-white">Geral</h1>
            </div>

            {/* Sua Conta / Central */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Sua conta</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Central de Contas
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Senha, segurança, dados pessoais, anúncios
                </p>
            </div>

            {/* Tema / Aparência */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Aparência</h2>
                <div className="space-y-3">
                    {["light", "dark", "auto"].map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <input
                                type="radio"
                                name="theme"
                                value={option}
                                checked={theme === option}
                                onChange={() => handleThemeChange(option)}
                                className="form-radio text-angola-red"
                            />
                            <span className="capitalize">
                {option === "auto" ? "Automático" : option === "light" ? "Claro" : "Escuro"}
              </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeralSM;
