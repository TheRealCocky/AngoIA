import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Link} from "react-router-dom"
import BackHome from "../components/BackHome.jsx";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const [loading, setLoadingg]= useState(false);


  const baseURL= window.location.hostname==='localhost'
      ? 'http://localhost:3000'
      : 'https://angoia-backend.onrender.com';
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingg(true);
    setErro('');

    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salva o token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redireciona para o chat
      navigate('/chat');

    } catch (err) {
      setErro(err.message);
    } finally {
    setLoadingg(false);
    }

  };

  return (
      <div className=" relative flex items-center justify-center h-screen ">
        {/* Botão de voltar para o chat */}
        <BackHome />
        <form
            onSubmit={handleLogin}
            className="
      w-full max-w-md px-8 py-10 rounded-2xl shadow-2xl
      border border-white/20 bg-white/10
      backdrop-blur-2xl ring-1 ring-white/30
      transition-all duration-300
    "
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-angoia-gold-yellow drop-shadow">
            Entrar Ango IA
          </h2>

          {erro && (
              <p className="text-red-400 text-sm mb-4 text-center">{erro}</p>
          )}

          <input
              type="email"
              placeholder="Email"
              className="
        w-full p-3 mb-4 rounded-xl bg-white/10 text-white
        placeholder-gray-300 border border-white/20
        focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/60 transition
      "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Senha"

              className="
        w-full p-3 mb-6 rounded-xl bg-white/10 text-white
        placeholder-gray-300 border border-white/20
        focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/60 transition
      "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />

          <button
              type="submit"
              className="
        w-full bg-angoia-gold-yellow hover:bg-yellow-500 text-black
        font-semibold py-3 rounded-xl transition duration-200
      "
          >
            {loading ? 'carregando...' : 'Entrar'}

          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-white">
              Não tem conta?{' '}
              <Link to="/registar" className="underline hover:text-angoia-gold-yellow transition">
                Crie uma aqui
              </Link>
            </p>
          </div>
        </form>
      </div>



  );
}

