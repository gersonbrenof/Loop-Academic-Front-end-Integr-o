import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export function CriarTopico() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleCriarTopico = async () => {
    if (isLoading) return;

    // 1. CORREÇÃO: Obter o token de autenticação com a chave correta 'token'.
    const token = localStorage.getItem('token'); 

    // 2. Verificar se o usuário está autenticado
    if (!token) {
      alert('Você precisa estar logado para criar um tópico.');
      navigate('/login'); 
      return;
    }

    if (!titulo || !categoria || !conteudo) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);

    try {
      const requestBody = {
        titulo: titulo,
        descricao: conteudo, 
        categoria: categoria,
      };

      // 3. Realizar a chamada POST para a API com o cabeçalho de autorização
      const response = await fetch(`${apiUrl}/ForumForum/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(requestBody),
      });

      // 4. Tratamento específico para erro de autenticação (token expirado/inválido)
      if (response.status === 401 || response.status === 403) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        // CORREÇÃO: Remover o token inválido usando a chave correta 'token'.
        localStorage.removeItem('token'); 
        navigate('/login');
        return;
      }

      if (!response.ok) {
        // Tenta ler a mensagem de erro do corpo da resposta, se houver
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || response.statusText;
        throw new Error(`Erro na API: ${errorMessage}`);
      }
      
      alert('Tópico criado com sucesso!');
      navigate('/Forum');

    } catch (error) {
  console.error('Falha ao criar o tópico:', error);

  if (error instanceof Error) {
    alert(`Ocorreu um erro ao criar o tópico: ${error.message}`);
  } else {
    alert(`Ocorreu um erro ao criar o tópico: ${String(error)}`);
  }
} finally {
  setIsLoading(false);
}
  };


  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[200px]'>CRIAR TÓPICO</h1>

      <div className='flex pt-20'>
        <Link to='/Forum' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar</p>
        </Link>
      </div>

      <div className='w-[900px] h-full mt-4 ml-44 py-2 '>
        <div className='bg-[#0E7886] border-2 border-[#707070] shadow-lg rounded-t-lg'>
          <h1 className='text-white text-2xl ml-8 p-2'>Criar tópico</h1>
        </div>

        <div className='h-full mt-1 p-6 bg-white border-2 border-[#707070] shadow-lg rounded-b-lg'>
         <div className='flex flex-col md:flex-row gap-4'>
          <input 
            type="text"
            placeholder="Título do Tópico"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className='w-full md:w-1/2 h-10 border-2 border-gray-300 p-2 rounded-md focus:border-[#0E7886] focus:outline-none'
          />
          <input 
            type="text"
            placeholder="Categoria (Ex: Linguagem C)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className='w-full md:w-1/2 h-10 border-2 border-gray-300 p-2 rounded-md focus:border-[#0E7886] focus:outline-none'
          />
        </div>

          <div className='pt-6'>
            <textarea
              className='w-full h-96 text-black border-2 border-gray-300 p-2 font-mono resize-none overflow-y-auto rounded-md focus:border-[#0E7886] focus:outline-none'
              placeholder='Digite o conteúdo do seu tópico aqui.'
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
             />
          </div>
          <button 
            onClick={handleCriarTopico}
            disabled={isLoading} 
            className='text-xl text-white bg-[#0E7886] py-2 px-14 mt-6 rounded-md hover:bg-[#0b5a66] disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}