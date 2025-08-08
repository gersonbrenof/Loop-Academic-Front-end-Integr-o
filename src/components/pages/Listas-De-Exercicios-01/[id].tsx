import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

interface ExercicioDetalhes {
  titulo: string;
  numeroDoExercicio: number;
  status: string;
}

export function ListasDeExercicios01() {
  const { id } = useParams<{ id: string }>(); // Obtém o id da URL
  const [exercicio, setExercicio] = useState<ExercicioDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercicio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/exercicio/status-da-lista-exercicio/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExercicio(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os detalhes do exercício.');
        setLoading(false);
      }
    };

    if (id) {
      fetchExercicio();
    }
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>
        LISTAS DE EXERCÍCIOS 01 - INTRODUÇÃO À LINGUAGEM C
      </h1>

      <div className='flex pt-20'>
        <a href='/Lista-De-Exercicios' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar a Lista</p>
        </a>

        <div>
          <div className='w-[920px] h-[100px] bg-white ml-8 items-center border-2 border-[#707070] shadow-lg'>
            <div className='h-3 w-full bg-[#0E7886]'></div>
            <div className='px-4'>
              <p className='text-[#0000003F] mt-2'>Escolha e responda</p>
              <h1 className='text-2xl font-semibold'>Exercícios da Listas 01 - Introdução à Linguagem C</h1>
            </div>
          </div>

          <div className='w-[920px] h-full bg-white ml-8 mt-5 border-2 border-[#707070] shadow-lg'>
            <div className='border-2 border-b-0 border-[#707070] mt-3 mx-3 mb-1'>
              <div className='px-2 bg-gray-400 text-black flex items-center text-center'>
                <p className='w-2/12 mr-2'>Número</p>
                <p className='w-6/12 text-left mr-2'>Título</p>
                <p className='w-6/12 mr-2'>Status</p>
              </div>

              {exercicio && (
                <div className='px-2 flex items-center mt-4 text-[#707070] text-center'>
                  <p className='w-2/12 mr-2'>{exercicio.numeroDoExercicio}</p>
                  <p className='w-6/12 text-left mr-2'>{exercicio.titulo}</p>
                  <p className={`w-6/12 mr-2 ${exercicio.status === 'Respondido' ? 'text-green-500' : 'text-red-500'}`}>
                    {exercicio.status === 'Respondido' ? 'RESPONDIDO' : 'NÃO RESPONDIDO E NÃO ENVIADO'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
