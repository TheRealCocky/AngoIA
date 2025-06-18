import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();


  const baseURL= window.location.hostname==='localhost'
      ? 'http://localhost:3000'
      : 'https://angoia-backend.onrender.com';
  const handleLogin = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Login Ango IA</h2>

          {erro && (
              <p className="text-red-400 text-sm mb-4 text-center">{erro}</p>
          )}

          <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 mb-6 rounded bg-gray-700 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
  );
}

