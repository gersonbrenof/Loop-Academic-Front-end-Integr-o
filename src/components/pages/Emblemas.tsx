import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// --- INTERFACE PARA OS DADOS DA API ---
interface Emblema {
  id: number;
  tituloEmblema: string;
  subtituloEmblema: string;
  codigoEmblema: string;
  imagemEmblema: string | null; // Pode ser nulo
  criterio: string;
  status: 'desbloqueado' | 'nao_desbloqueado';
}

// --- COMPONENTE PRINCIPAL ---
export function Emblemas() {
  // Estados para os dados das APIs
  const [meusEmblemas, setMeusEmblemas] = useState<Emblema[]>([]);
  const [todosEmblemas, setTodosEmblemas] = useState<Emblema[]>([]);
  
  // Estado para controlar a aba ativa e o carregamento
  const [activeTab, setActiveTab] = useState<'meus' | 'todos'>('meus');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmblemas = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        
        const headers = { Authorization: `Bearer ${token}` };

        // Fazer as duas chamadas em paralelo para mais eficiência
        const [meusRes, todosRes] = await Promise.all([
          axios.get<Emblema[]>(`${apiUrl}/emblemas/lista-emblema/`, { headers }),
          axios.get<Emblema[]>(`${apiUrl}/emblemas/lista-todos-emblema/`, { headers }),
        ]);

        setMeusEmblemas(meusRes.data);
        setTodosEmblemas(todosRes.data);

      } catch (err) {
        setError("Não foi possível carregar os emblemas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmblemas();
  }, []);

  // Determina qual lista de emblemas mostrar com base na aba ativa
  const emblemasParaMostrar = activeTab === 'meus' ? meusEmblemas : todosEmblemas;

  // Renderização de loading e erro
  if (loading) return <div className="absolute top-40 left-1/2 -translate-x-1/2 text-xl">Carregando emblemas...</div>;
  if (error) return <div className="absolute top-40 left-1/2 -translate-x-1/2 text-xl text-red-500">{error}</div>;

  return (
    // SEU LAYOUT ORIGINAL COM POSICIONAMENTO ABSOLUTO
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[80px]'>EMBLEMAS</h1>

      <div className='flex pt-20'>
        <Link to='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </Link>

        {/* Abas para alternar a visualização */}
        <div className='flex ml-20'>
          <button 
            onClick={() => setActiveTab('meus')}
            className={`w-96 h-8 text-xl border-2 border-b-0 border-[#707070] flex justify-center items-center ${
              activeTab === 'meus' ? 'bg-[#0E7886] text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Meus Emblemas
          </button>
          <button 
            onClick={() => setActiveTab('todos')}
            className={`w-96 h-8 text-xl border-2 border-b-0 border-[#707070] flex justify-center items-center ${
              activeTab === 'todos' ? 'bg-[#0E7886] text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Todos os Emblemas
          </button>
        </div>
      </div>

      <div className='w-[1000px] h-full mt-[-2px] ml-40 bg-white border-2 border-[#707070] shadow-lg'>
        <div className='h-4 w-full bg-[#0E7886]'></div>
        <div className='flex justify-center items-center my-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {emblemasParaMostrar.map((item) => (
              <div 
                key={item.id} 
                className={`relative border-2 border-[#707070] w-[280px] h-full flex flex-col p-4 text-black ${
                  // Adiciona um efeito visual para emblemas bloqueados na aba "Todos"
                  activeTab === 'todos' && item.status === 'nao_desbloqueado' ? 'bg-gray-200 opacity-60' : 'bg-white'
                }`}
              >
                <h1 className='absolute -top-4 -right-4 bg-[#0E7886] p-2 text-white rounded-md text-sm'>
                  {item.codigoEmblema}
                </h1>
                <div className='flex items-center'>
                  {item.imagemEmblema ? (
                    <img src={item.imagemEmblema} alt={item.tituloEmblema} className='w-16 h-16 rounded-full object-cover border-2 border-gray-300' />
                  ) : (
                    // Placeholder para emblemas sem imagem
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-400">
                      <FaLock className="text-gray-500" />
                    </div>
                  )}
                  <div className='pl-4'>
                    <p className='w-40'>{item.subtituloEmblema}</p>
                    <h1 className='text-xl w-48 font-semibold'>{item.tituloEmblema}</h1>
                  </div>
                </div>
                <p className='h-16 mt-4 text-sm text-gray-700'>{item.criterio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}