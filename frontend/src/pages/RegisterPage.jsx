import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [idioma, setIdioma] = useState('pt'); // default: português
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nome,
          email,
          password: senha,
          languagePreference: idioma
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário.');
      }

      setSucesso('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setErro(err.message);
    }
  };

  return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <form onSubmit={handleCadastro} className="bg-gray-800 p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Cadastro AngoIA</h2>

          {erro && <p className="text-red-400 mb-4 text-center">{erro}</p>}
          {sucesso && <p className="text-green-400 mb-4 text-center">{sucesso}</p>}

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
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
          />

          <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full p-3 mb-6 rounded bg-gray-700 text-white"
          >
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="fr">Francês</option>
          </select>

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


