import React, { useState } from 'react';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    // Aqui você pode integrar com backend para salvar os dados
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Senha:', senha);
    alert('Cadastro simulado com sucesso!');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleCadastro} className="bg-gray-800 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Cadastro AngoIA</h2>
        <input
          type="text"
          placeholder="Nome Completo"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
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
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          className="w-full p-3 mb-6 rounded bg-gray-700 text-white placeholder-gray-400"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
