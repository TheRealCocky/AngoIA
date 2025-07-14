import React, {useEffect, useState} from 'react';
import {X} from "lucide-react";
import { useNavigate,Link } from 'react-router-dom';
const HistoricoMobile = () => {
    const [search, setSearch]=useState("");
   const [loading, setLoading]=useState(true);
   const [mensagens, setMensagens]=useState([]);
  const navigate= useNavigate();

  const baseURL= window.location.hostname==='localhost'
      ? 'http://localhost:3000'
      :'https://angoia-backend.onrender.com'

    useEffect(()=>{
    const fetchAllMessages = async () => {
       const token=localStorage.getItem('token');
           if(!token)return;

           try{
               const res= await fetch(`${baseURL}/api/chat-messages/all`,{
                   headers:{
                       Authorization: `Bearer ${token}`,
                       'Content-Type': 'application/json',
                   },

               });
               const data= res.json();
               setMensagens(data);
           }catch (err){
               console.error('Erro ao carregar históricos:',err.message);

           }finally {
              setLoading(false);
           }

       }
    fetchAllMessages();
    },
    []);

    const mensagensFiltradas= mensagens
        .filter(msg=>msg.sender==='user')
        .filter(msg=>
        msg.text?.toLocaleLowerCase().includes(search.toLowerCase())
        )

   const handleClick=(messageId)=>{
       onclose();
       navigate(`/chat/${messageId}`);
    }

    return (
        <div className={`min-h-screen bg-gray-700 w-full  mx-auto `}>
            <div className={`text-gray-200 hover:text-white flex justify-end items-end mt-2 mr-3npm `}><Link to={`/chat`} >{<X size={28}/>}</Link></div>
            <div className={`mt-6 space-y-5 flex justify-center items-center flex-col `}>
                <h2 className={`text-white font-bold text-2xl `}>Histórico de Conversas</h2>
                <input type="search"
                       value={search}
                       onChange={(e)=>{setSearch(e.target.value)}}
                       placeholder={'Pesquisar pergunta...'}
                       className={` px-14 md:px-52 lg:px-60 py-3 rounded-md max-w-[1000px]`}
                />
            </div>
            <div className={`space-y-6`}>
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : mensagensFiltradas.length === 0 ? (
                    <p className="text-center text-gray-100">Nenhuma conversa encontrada.</p>
                ) : (
                    mensagensFiltradas.map((msg) => (
                        <div
                            key={msg._id}
                            className="p-3 border rounded hover:bg-gray-100 cursor-pointer transition"
                            onClick={() => handleClick(msg._id)}
                        >
                            <p>🧍 <strong>{msg.text}</strong></p>
                        </div>
                    ))
                )}


            </div>

        </div>
    );
};

export default HistoricoMobile;