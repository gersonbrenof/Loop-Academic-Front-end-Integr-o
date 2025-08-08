import { useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react'; // Importar ChangeEvent
import { FaArrowLeft, FaCamera } from 'react-icons/fa';
import axios from 'axios';

import user from '../../../public/img/user.png';
const apiUrl = import.meta.env.VITE_API_URL;

// 1. CORREÇÃO: Definir uma interface para o perfil do usuário.
// Isso informa ao TypeScript a "forma" dos seus dados.
interface UserProfile {
  fotoPerfil: string | null;
  nome_do_aluno: string;
  matricula_aluno: string;
  turma_aluno: string;
  respostas_corretas: number;
  total_emblemas_desbloqueados: number;
  data_entrada: string; // A API retorna a data como string
  nivel: string;
  ultima_codificacao: string; // A API retorna a data como string
}

export function Perfil() {
  const navigate = useNavigate();
  // 2. CORREÇÃO: Tipar o estado para aceitar UserProfile ou null.
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // É uma boa prática tipar o erro também

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get<{ data: UserProfile[] }>(`${apiUrl}/Perfil-aluno/`, { // Tipando a resposta do axios
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Supondo que a API retorna { data: [ { ...perfil... } ] }
        if (response.data && response.data.data && response.data.data.length > 0) {
            setUserInfo(response.data.data[0]);
        } else {
             // Se a API retorna diretamente [ { ...perfil... } ]
            setUserInfo((response.data as unknown as UserProfile[])[0]);
        }

      } catch (err) {
        setError('Não foi possível carregar os dados do perfil.');
        console.error('Erro ao buscar dados do perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Adicionada a tipagem do evento
    const file = event.target.files?.[0]; // Uso de optional chaining para segurança
    if (file) {
      const formData = new FormData();
      formData.append('fotoPerfil', file);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.patch<{ fotoPerfil: string }>(`${apiUrl}/perfil/atualizar-foto-perfil/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        // Atualiza as informações do usuário com segurança
        setUserInfo(prevInfo => (prevInfo ? { ...prevInfo, fotoPerfil: response.data.fotoPerfil } : null));
      } catch (error) {
        console.error('Erro ao enviar foto de perfil:', error);
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">Carregando perfil...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-xl text-red-500">{error}</div>;
  }
  // Agora, após essa verificação, o TypeScript sabe que userInfo é do tipo UserProfile
  if (!userInfo) {
    return <div className="p-8 text-center text-xl">Nenhum dado de perfil encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center mb-8">
        <button onClick={handleBackClick} className='flex items-center text-[#0E7886] hover:underline'>
          <FaArrowLeft className='mr-2' />
          <span>Retornar</span>
        </button>
        <h1 className='text-3xl font-bold text-center flex-grow'>MEU PERFIL</h1>
      </div>

      <div className='flex flex-col items-center'>
        <div className='relative flex flex-col items-center mb-8'>
          <img 
            src={userInfo.fotoPerfil || user} 
            alt="Foto do usuário"
            className='w-44 h-44 rounded-full shadow-lg object-cover'
          />
          <input 
            type="file" 
            id="upload" 
            accept="image/*"
            onChange={handleImageChange} 
            className='hidden' 
          />
          <label 
            htmlFor="upload" 
            className='absolute bottom-2 right-2 bg-[#0E7886] p-4 rounded-full cursor-pointer hover:bg-[#0b5a66] transition-colors'
          >
            <FaCamera className='text-white w-6 h-6' />
          </label>
        </div>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold'>{userInfo.nome_do_aluno}</h2>
          <p className='text-gray-600'><strong>Matrícula:</strong> {userInfo.matricula_aluno}</p>
          <p className='text-gray-600'><strong>Turma:</strong> {userInfo.turma_aluno}</p>
        </div>

        <div className='w-full max-w-4xl text-[#0E7886] bg-white mb-5 border-2 border-gray-200 rounded-lg shadow-md flex text-center divide-x divide-gray-200'>
          <div className='p-6 w-1/2'>
            <h3 className='text-4xl font-bold'>{userInfo.respostas_corretas || 0}</h3>
            <p className="text-gray-500">Questões Respondidas</p>
          </div>
          <div className='p-6 w-1/2'>
            <h3 className='text-4xl font-bold'>{userInfo.total_emblemas_desbloqueados || 0}</h3>
            <p className="text-gray-500">Emblemas</p>
          </div>
        </div>
        
        <div className='w-full max-w-4xl bg-white mb-5 border-2 border-gray-200 rounded-lg shadow-md flex text-center divide-x divide-gray-200'>
          {/* O acesso agora é seguro e não dará mais erro */}
          <p className='py-4 w-1/3 text-gray-600'>Entrou em: {new Date(userInfo.data_entrada).toLocaleDateString()}</p>
          <p className='py-4 w-1/3 text-gray-600'>Nível no Fórum: {userInfo.nivel || 'Iniciante'}</p>
          <p className='py-4 w-1/3 text-gray-600'>Última Atividade: {new Date(userInfo.ultima_codificacao).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}