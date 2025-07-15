import MaterialDeApoioItems from '../data/MaterialDeApoioItens';
import Material from '../data/MaterialItens';
import { FaArrowLeft } from 'react-icons/fa';

import pesquisa from '../../../public/img/pesquisa.png';

export function MaterialDeApoio02() {
  const primeiroTitulo = Material[0].titulo;

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-10'>
      <h1 className='text-center text-3xl italic font-bold ml-32'>
        MATERIAL DE APOIO - {primeiroTitulo.toUpperCase()}
      </h1>
      
      <div className='flex pt-20'>
        <a href='/Material-De-Apoio' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar ao Material de Apoio</p>
        </a>

        <div>
          <div className='w-[920px] h-[55px] bg-white ml-8 flex items-center border-2 border-[#707070] shadow-lg'>
            <img src={pesquisa} alt='pesquisa' className='w-10 ml-4'/>
            <input 
              className='w-[750px] h-[50px] px-4 text-base text-black' 
              type='text' 
              placeholder='O que você quer estudar?'
            />
            <button className='h-full w-32 bg-[#0E7886] text-white text-xl'>Buscar</button>
          </div>
  
          <div className='w-[920px] h-alto bg-white mt-5 p-5 ml-8 flex flex-col items-center border-2 border-[#707070] shadow-lg'>

            <div className='w-[880px] h-[90px] bg-white items-center border-2 border-[#707070]'>
              <div className='h-3 w-full bg-[#0E7886] border-2 border-t-0 border-[#707070]'></div>
              <div className='px-4'>
                <p className='text-[#0000003F] mt-2'>Material de Apoio</p>
                <h1 className='text-2xl font-semibold'>{primeiroTitulo}</h1>
              </div>
            </div>

            {MaterialDeApoioItems.map((item, index) => (
              <div className='w-[880px] h-56 bg-white mt-5 items-center border-2 border-[#707070]'>
                <div className='h-6 w-full bg-[#0E862E] border-2 border-t-0 border-[#707070]'></div>
  
                <div key={index} className='flex'>
                  <img src={item.img} alt="Thumbnail do vídeo" className='w-2/3 h-[197px]'/>
  
                  <div className='flex flex-col justify-between mt-2'>
                    <div className='ml-4 flex items-end justify-between'>
                      <h1 className='text-xl'>{item.titulo}</h1>
                      <p className='text-black mr-4'>{item.tipo}</p>
                    </div>

                    <p className='text-black text-base mt-4 mx-4'>{item.introduca}</p>
                    
                    <div className='flex justify-end mt-4 mx-4 mb-4'>
                      <a 
                        href={item.link} 
                        className='bg-[#0E7886] text-white px-5 text-xl'>{item.button}</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div> 
  );
}
