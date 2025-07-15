import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
const apiUrl = import.meta.env.VITE_API_URL;
interface Exercicios {
  id: number;
  titulo: string;
  numeroDoExercicio: number;
  status: string;
  respondido: string;
}

interface AtividadeItem {
  id: number;
  titulo: string;
  numeroExercicio: number;
  dataCriacao: string;
  dificuldade: string;
  total_exercicios: number;
  status: string;
  exercicios: Exercicios[];
}

export function ListasDeExercicios() {
  const [atividades, setAtividades] = useState<AtividadeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtividades = async () => {
      try { 
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/exercicio/status-da-lista-exercicio/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Verifique a estrutura dos dados recebidos
        console.log(response.data); // Adicione isto para depurar

        setAtividades(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar atividades.');
        setLoading(false);
      }
    };

    fetchAtividades();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>LISTAS DE EXERCÍCIOS</h1>

      <div className='flex pt-20'>
        <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </a>

        <div>
          <div className='w-[920px] h-[100px] bg-white ml-8 items-center border-2 border-[#707070] shadow-lg'>
            <div className='h-3 w-full bg-[#0E7886]'></div>
            <div className='px-4'>
              <p className='text-[#0000003F] mt-2'>Escolha entre as</p>
              <h1 className='text-2xl font-semibold'>Listas de Exercícios</h1>
            </div>
          </div>

          <div className='w-[920px] h-[300px] bg-white ml-8 mt-5 py-1 border-2 border-[#707070] shadow-lg'>
            <div className='text-base border-t-2 border-l-2 border-r-2 border-[#707070] mt-3 mx-3'>
              <div className='bg-gray-400 text-black flex text-center px-3'>
                <p className='w-1/12 mr-3'>Número</p>
                <p className='w-2/12 mr-3'>Data</p>
                <p className='w-5/12 text-left mr-3'>Título</p>
                <p className='w-2/12 mr-3'>Questões</p>
                <p className='w-2/12 mr-3'>Dificuldade</p>
                <p className='w-2/12'>Status</p>
              </div>

              {atividades.map((item, index) => (
                <div key={item.numeroExercicio} className='mt-4 text-[#707070] flex text-center px-3'>
                  <p className='w-1/12 mr-3'>{item.numeroExercicio}</p>
                  <p className='w-2/12 mr-3'>{new Date(item.dataCriacao).toLocaleDateString()}</p>
                  <a
                    href={`/Listas-De-Exercicios-01/${item.id}`}
                    className='w-5/12 text-left mr-3'
                  >
                    <p>{item.titulo}</p>
                  </a>
                  <p className='w-2/12 mr-3'>{item.total_exercicios}</p>
                  <p className='w-2/12 mr-3'>{item.dificuldade}</p>
                  <p className={`w-2/12 ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                    {item.status ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
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
