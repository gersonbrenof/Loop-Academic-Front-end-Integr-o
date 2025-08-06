import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Usar Link em vez de <a> para navegação SPA
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

// Importe as URLs do seu arquivo .env
const apiUrl = import.meta.env.VITE_API_URL;
const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

// Interface para definir a "forma" de um tópico vindo da API
interface ForumTopico {
  id: number;
  titulo: string;
  data_inico: string;
  nome_do_aluno: string;
  foto_perfil: string | null;
}

export function Forum() {
  // 1. ESTADOS: Exatamente como no Perfil.jsx
  const [topicos, setTopicos] = useState<ForumTopico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. BUSCA DE DADOS: A lógica dentro do useEffect segue o mesmo padrão
  useEffect(() => {
    const fetchTopicos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // No caso da lista do fórum, em vez de redirecionar, podemos apenas mostrar um erro.
          throw new Error('Você precisa estar logado para ver os tópicos.');
        }
        
        const response = await axios.get<ForumTopico[]>(`${apiUrl}/ForumExibirForum/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ordena os tópicos pelos mais recentes primeiro
        const sortedTopicos = response.data.sort((a, b) => new Date(b.data_inico).getTime() - new Date(a.data_inico).getTime());
        setTopicos(sortedTopicos);

      } catch (err: any) {
        console.error("Erro ao buscar os tópicos do fórum:", err);
        // Define uma mensagem de erro amigável para o usuário
        setError(err.message || 'Não foi possível carregar os tópicos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicos();
  }, []); // O array vazio [] garante que a busca aconteça apenas uma vez

  // --- Funções Auxiliares ---
  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dataFormatada}, às ${horaFormatada}`;
  };

  const getImageUrl = (path: string | null) => {
    // Garante que a foto padrão venha da pasta /public
    return path ? `${backendBaseUrl}${path}` : '/media/fotos_perfil/';
  }

  // 3. RENDERIZAÇÃO CONDICIONAL: Idêntica ao padrão do Perfil.jsx
  if (isLoading) {
    return <div className="p-8 text-center text-xl">Carregando tópicos...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-xl text-red-500">{error}</div>;
  }

  // --- Renderização Principal (quando tudo deu certo) ---
  return (
    <div className='mt-0 absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>Fórum</h1>

      <div className='flex pt-20'>
        <Link to='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </Link>

        <div className='w-[900px] min-h-[400px] h-full ml-10 p-5 bg-white border-2 border-[#707070] shadow-lg'>
          <h1 className='text-black text-xl mb-4 border-b border-[#707070] pb-2'>
            Tópicos Recentes
          </h1>
          
          {topicos.length > 0 ? (
            <div className='grid grid-cols-2 gap-8'>
              {topicos.map((item) => (
                <Link
                  key={item.id}
                  to={`/topico/${item.id}`} // Link para a página de detalhes
                  className='flex items-start text-black bg-gray-200 mt-4 px-4 py-4 rounded-lg shadow hover:shadow-md transition-shadow'
                >
                  <img
                    src={getImageUrl(item.foto_perfil)}
                    alt={`Foto de ${item.nome_do_aluno}`}
                    className='w-28 h-28 object-cover rounded-full border-2 border-[#707070]'
                  />
                  <div className='ml-4 mt-3 flex flex-col justify-between h-full w-full'>
                    <div>
                      <h2 className='text-lg font-semibold break-words'>{item.titulo}</h2>
                      <p className='text-sm'>Por {item.nome_do_aluno}</p>
                    </div>
                    <div className='mt-4 text-xs text-right text-gray-600'>
                      {formatarDataHora(item.data_inico)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-gray-500">Nenhum tópico encontrado.</p>
          )}

          <div className='text-black text-lg border-t border-[#707070] mt-8 pt-4 pb-2'>
            <Link to='/Criar-Topico' className='text-white bg-red-600 py-2 px-4 rounded hover:bg-red-700 transition-colors'>
              Criar Tópico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}