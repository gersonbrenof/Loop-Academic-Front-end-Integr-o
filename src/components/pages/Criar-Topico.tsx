import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export function CriarTopico() {
  // 3. ADIÇÃO: Estados para controlar os valores dos campos do formulário.
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conteudo, setConteudo] = useState('');
  const navigate = useNavigate();

  // 4. ADIÇÃO: Função para lidar com a submissão do formulário.
  const handleCriarTopico = () => {
    // Aqui você adicionaria a lógica para enviar os dados para a sua API.
    console.log({
      titulo,
      categoria,
      conteudo,
    });
    // Exemplo: após criar o tópico, redirecionar para o fórum.
    alert('Tópico criado com sucesso! (Simulação)');
    navigate('/Forum');
  };


  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[200px]'>CRIAR TÓPICO</h1>

      <div className='flex pt-20'>
        {/* 5. SUGESTÃO: Usar o componente <Link> para navegação sem recarregar a página. */}
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
            className='text-xl text-white bg-[#0E7886] py-2 px-14 mt-6 rounded-md hover:bg-[#0b5a66]'
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}