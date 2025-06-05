import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com autenticação real
    console.log('Email:', email);
    console.log('Senha:', password);
    alert('Login simulado com sucesso!');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Login Ango IA</h2>
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
