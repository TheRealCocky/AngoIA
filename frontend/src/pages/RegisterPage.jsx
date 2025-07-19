import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHome from "../components/BackHome.jsx";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [idioma, setIdioma] = useState('pt'); // default: português
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate();

const baseURL= window.location.hostname==='localhost'
  ?'http://localhost:3000'
  :'https://angoia-backend.onrender.com';


  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/auth/register`, {
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
    }finally {
      setLoading(false);
    }
  };

  return (
      <div className=" relative flex items-center justify-center h-screen">
        {/* Botão de voltar para o chat */}
        <BackHome />
        <form
            onSubmit={handleCadastro}
            className="w-full max-w-md p-8 rounded-2xl
               bg-white/30 backdrop-blur-xl border border-white/30
               shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
               transition duration-300"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-angoia-gold-yellow drop-shadow-sm">
            Cadastro AngoIA
          </h2>

          {erro && <p className="text-red-400 mb-4 text-center">{erro}</p>}
          {sucesso && <p className="text-green-400 mb-4 text-center">{sucesso}</p>}

          <input
              type="text"
              placeholder="Nome Completo"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/50"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
          />
          <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/50"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Confirmar Senha"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/50"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
          />
          <label htmlFor="" className="mt-1 text-white mb-1 text-[13px]">Idioma padrão</label>
          <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-angoia-gold-yellow/50"
          >
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="fr">Francês</option>
          </select>

          <button
              type="submit"
              className="w-full bg-angoia-gold-yellow hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition shadow-md"
          >
            {loading ?'Carregando...':'Cadastrar'}
          </button>
        </form>
      </div>

  );
}


