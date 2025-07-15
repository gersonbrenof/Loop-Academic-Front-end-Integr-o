import React from 'react';
import ForumItens from '../data/ForumItens';
import { FaArrowLeft } from 'react-icons/fa';

export function Forum() {
  return (
    <div className='mt-0 absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>Forum</h1>


      <div className='flex pt-20'>
        <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </a>
      

      <div className='w-[900px] h-full ml-10 p-5 bg-white border-2 border-[#707070] shadow-lg'>
        <h1 className='text-black text-xl mb-4 border-b border-[#707070] pb-2'>
          Tópicos Recentes
        </h1>

        <div className='grid grid-cols-2 gap-8'>
        {ForumItens.map((item, index) => (
          <a 
            key={index}
            href={`/Topico0${index + 1}`} 
            className='flex items-start text-black bg-gray-200 mt-4 px-4 py-4 relative'
          >
            <h1 className='absolute -top-5 -right-4 text-white bg-[#0E7886] px-3 py-1.5'>
              {index + 1}
            </h1>
            <img 
              src={item.img} 
              alt="usuario" 
              className='w-28 rounded-full border-2 border-[#707070] shadow-lg'
            />
            <div className='ml-4 mt-3 flex flex-col justify-between h-full w-full relative'>
              <div className='flex flex-col'>
                <h1 className='text-lg'>{item.titulo}</h1>
                <p className='text-sm'>Por {item.autor}</p>
              </div>
              <div className='mb-2 text-xs text-right absolute bottom-2 right-2'>
                {item.data}, às {item.hora}
              </div>
            </div>
          </a>
        ))}
        </div>

        <div className='text-black text-lg border-t border-[#707070] mt-8 pt-4 pb-2'>
          <a href='/Criar-Topico' className='text-white bg-red-600 py-2 px-4'>
            Criar Tópico
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
