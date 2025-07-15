import AtividadesItems from '../data/AtividadesItens';
import { FaArrowLeft } from 'react-icons/fa';

export function CriarTopico() {
  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
      <h1 className='text-center text-3xl italic font-bold ml-[200px]'>CRIAR TÓPICO</h1>

      <div className='flex pt-20'>
        <a href='/Forum' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar</p>
        </a>

        <a href='/Topico01' className='text-lg text-white bg-[#0E7886] py-2 px-4 m-3'>
          Retornar ao Fórum
        </a>
      </div>

      <div className='w-[900px] h-full mt-4 ml-44 py-2 '>
        <div className='bg-[#0E7886] border-2 border-[#707070] shadow-lg'>
          <h1 className='text-white text-2xl ml-8'>Criar tópico</h1>
        </div>

        <div className='h-full mt-1 p-6 bg-white border-2 border-[#707070] shadow-lg'>
         <div className='flex'>
          <input 
            type="text"
            placeholder="Título do Tópico"
            className='w-1/2 h-10 border-2 border-[#707070] p-2 mr-4'
          />
          <input 
            type="text"
            placeholder="Categoria"
            className='w-1/2 h-10 border-2 border-[#707070] p-2'
          />
        </div>

          <div className='pt-6'>
            <textarea
              className='w-full h-96 text-black border-2 border-[#707070] p-2 font-mono resize-none overflow-y-auto'
              placeholder='Digite sua resposta aqui.'
             />
          </div>
          <button className='text-xl text-white bg-[#0E7886] py-2 px-14 mt-6'>
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}