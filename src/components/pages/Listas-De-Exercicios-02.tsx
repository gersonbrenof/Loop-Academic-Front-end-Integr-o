import ListaDeExercicios02Items from '../data/ListaDeExercicios02Itens';
import { FaArrowLeft } from 'react-icons/fa';

export function ListasDeExercicios02() {
  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
        <h1 className='text-center text-3xl italic font-bold ml-[190px]'>
            LISTAS DE EXERCÍCIOS 02 - ESTRUTURA DE DECISÃO
        </h1>
        
        <div className='flex pt-20'>
          <a href='/Lista-De-Exercicios' className='flex flex-col items-center py-1 h-full ml-9'>
            <FaArrowLeft className='w-10 h-auto' />
            <p className='w-32 text-sm text-center'>Menu Principal</p>
          </a>

            <div>
                <div className='w-[920px] h-[100px] bg-white ml-8 items-center border-2 border-[#707070] shadow-lg'>
                    <div className='h-3 w-full bg-[#0E7886]'></div>
                    <div className='px-4'>
                        <p className='text-[#0000003F] mt-2'>Escolha e responda</p>
                        <h1 className='text-2xl font-semibold'>Exercícios da Listas 02 - Estrutura de Decisão</h1>
                    </div>
                </div>

                <div className='w-[920px] h-full bg-white ml-8 mt-5 border-2 border-[#707070] shadow-lg'>
                    <div className='border-2 border-b-0 border-[#707070] mt-3 mx-3 mb-1'>
                        <div className='px-2 bg-gray-400 text-black flex items-center text-center'>
                            <p className='w-2/12 mr-2'>Número</p>
                            <p className='w-6/12 text-left mr-2'>Titulo</p>
                            <p className='w-6/12 mr-2'>Status</p>
                        </div>
                            
                        {ListaDeExercicios02Items.map((item, index) => (
                            <div key={index} className='px-2 flex items-center mt-4 text-[#707070] text-center'>
                                <p className='w-2/12 mr-2'>{item.numero}</p>
                                <a href={item.link} className='w-6/12 text-left mr-2'>
                                    <p>{item.titulo}</p>
                                </a>
                                <p className={`w-6/12 mr-2 ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                                  {item.status ? 'RESPONDIDO' : 'NÃO RESPONDIDO E NÃO ENVIADO'}
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
