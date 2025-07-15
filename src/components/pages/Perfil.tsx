import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';
import axios from 'axios'; // É uma boa prática usar axios para consistência

import user from '../../../public/img/user.png'; // Caminho padrão para a imagem
const apiUrl = import.meta.env.VITE_API_URL;

export function Perfil() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Segurança: se não há token, vai para login
          return;
        }
        const response = await axios.get(`${apiUrl}/Perfil-aluno/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserInfo(response.data[0]); // Pega o primeiro usuário do array retornado
      } catch (err) {
        setError('Não foi possível carregar os dados do perfil.');
        console.error('Erro ao buscar dados do perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // Adicione navigate às dependências

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('fotoPerfil', file);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${apiUrl}/perfil/atualizar-foto-perfil/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        // Atualiza as informações do usuário com os novos dados retornados pela API
        setUserInfo(prevInfo => ({ ...prevInfo, fotoPerfil: response.data.fotoPerfil }));
      } catch (error) {
        console.error('Erro ao enviar foto de perfil:', error);
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Volta para a página anterior no histórico
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">Carregando perfil...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-xl text-red-500">{error}</div>;
  }
  if (!userInfo) {
    return <div className="p-8 text-center text-xl">Nenhum dado de perfil encontrado.</div>;
  }

  // **** O CÓDIGO VISUAL CORRIGIDO ESTÁ AQUI ****
  return (
    // Removido o container com largura fixa. O componente agora é flexível.
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center mb-8">
        <button onClick={handleBackClick} className='flex items-center text-[#0E7886] hover:underline'>
          <FaArrowLeft className='mr-2' />
          <span>Retornar</span>
        </button>
        <h1 className='text-3xl font-bold text-center flex-grow'>MEU PERFIL</h1>
      </div>

      <div className='flex flex-col items-center'>
        {/* Seção da Foto e Informações do Usuário */}
        <div className='relative flex flex-col items-center mb-8'>
          <img 
            src={userInfo.fotoPerfil || user} 
            alt="Foto do usuário"
            className='w-44 h-44 rounded-full shadow-lg object-cover' // object-cover para evitar distorção
          />
          <input 
            type="file" 
            id="upload" 
            accept="image/*" // Aceita apenas imagens
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

        {/* Seção de Estatísticas */}
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

        {/* Seção de Informações Adicionais */}
        <div className='w-full max-w-4xl bg-white mb-5 border-2 border-gray-200 rounded-lg shadow-md flex text-center divide-x divide-gray-200'>
          <p className='py-4 w-1/3 text-gray-600'>Entrou em: {new Date(userInfo.data_entrada).toLocaleDateString()}</p>
          <p className='py-4 w-1/3 text-gray-600'>Nível no Fórum: {userInfo.nivel || 'Iniciante'}</p>
          <p className='py-4 w-1/3 text-gray-600'>Última Atividade: {new Date(userInfo.ultima_codificacao).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}