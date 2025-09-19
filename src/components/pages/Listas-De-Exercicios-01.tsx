import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

// --- INTERFACES CORRIGIDAS ---
interface ExercicioItem {
  id: number;
  titulo: string;
  numeroDoExercicio: number;
  // O campo 'status' pode ser ignorado, pois o campo 'respondido' é o correto para o status do usuário.
  respondido: 'Respondido' | 'Não Respondido'; 
}

interface ListaDetalhes {
  id: number;
  titulo: string;
  exercicios: ExercicioItem[];
}

export function ListasDeExercicios01() {
  const params = useParams<{ id: string }>();
  const id = params.id || '1'; 

  const [lista, setLista] = useState<ListaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalhesDaLista = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<ListaDetalhes>(`${apiUrl}/exercicio/status-da-lista-exercicio/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLista(response.data);
      } catch (err) {
        setError('Erro ao carregar os exercícios desta lista.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhesDaLista();
  }, [id]);

  const renderContent = (content: React.ReactNode) => (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20 w-full flex justify-center pt-40'>
      <div className='text-center text-xl'>{content}</div>
    </div>
  );

  if (loading) return renderContent(<p>Carregando exercícios...</p>);
  if (error) return renderContent(<p className="text-red-500">{error}</p>);
  if (!lista || !lista.exercicios) {
    return renderContent(<p>Nenhum exercício encontrado para esta lista.</p>);
  }

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
        <h1 className='text-center text-3xl italic font-bold ml-[190px] uppercase'>
            {lista.titulo}
        </h1>
        
        <div className='flex pt-20'>
          <Link to='/' className='flex flex-col items-center py-1 h-full ml-9'>
            <FaArrowLeft className='w-10 h-auto' />
            <p className='w-32 text-sm text-center'>Menu Principal</p>
          </Link>

          <div>
              <div className='w-[920px] h-[100px] bg-white ml-8 items-center border-2 border-[#707070] shadow-lg'>
                  <div className='h-3 w-full bg-[#0E7886]'></div>
                  <div className='px-4'>
                      <p className='text-[#0000003F] mt-2'>Escolha e responda</p>
                      <h1 className='text-2xl font-semibold'>Exercícios da Lista - {lista.titulo}</h1>
                  </div>
              </div>

              <div className='w-[920px] h-full bg-white ml-8 mt-5 border-2 border-[#707070] shadow-lg'>
                  <div className='border-2 border-b-0 border-[#707070] mt-3 mx-3 mb-1'>
                      <div className='px-2 bg-gray-400 text-black flex items-center text-center'>
                          <p className='w-2/12 mr-2'>Número</p>
                          <p className='w-7/12 text-left mr-2'>Título</p>
                          <p className='w-3/12 mr-2'>Status</p>
                      </div>
                      
                      {lista.exercicios.map((exercicio) => (
                          <div key={exercicio.id} className='px-2 flex items-center mt-4 text-[#707070] text-center border-t py-2'>
                              <p className='w-2/12 mr-2'>{exercicio.numeroDoExercicio}</p>
                              
                              <Link 
                                to={`/exercicio/responder/${exercicio.id}`}
                                state={{ exerciciosDaLista: lista.exercicios, listaTitulo: lista.titulo }}
                                className='w-7/12 text-left mr-2 hover:text-[#0E7886] transition-colors'
                              >
                                  <p>{exercicio.titulo}</p>
                              </Link>
                              
                              {/* ***** CORREÇÃO APLICADA AQUI ***** */}
                              <p className={`w-3/12 mr-2 font-bold ${exercicio.respondido === 'Respondido' ? 'text-green-500' : 'text-red-500'}`}>
                                {exercicio.respondido === 'Respondido' ? 'RESPONDIDO' : 'PENDENTE'}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>
    </div>
  );
}