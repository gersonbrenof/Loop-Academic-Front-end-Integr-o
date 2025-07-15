import { useState } from 'react';
import Material from '../data/MaterialItens';
import { FaArrowLeft } from 'react-icons/fa';
import pesquisa from '../../../public/img/pesquisa.png';
import cadeado from '../../../public/img/cadeado.png';

export function MaterialDeApoio() {
  const totalItems = 9;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(Material);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredItems(Material);
    } else {
      const query = searchQuery.toLowerCase();
      const results = Material.filter(item =>
        item.titulo.toLowerCase().includes(query)
      );
      setFilteredItems(results);
    }
  };

  const emptySlots = totalItems - filteredItems.length;

  return (
    <div className='mt-0 absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>MATERIAL DE APOIO</h1>

      <div className='flex pt-20'>
        <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </a>

        <div className='ml-8'>
          <div className='w-[920px] bg-white border-2 border-[#707070] shadow-lg flex items-center'>
            <img src={pesquisa} alt='pesquisa' className='w-10 ml-4'/>
            <input 
              className='w-[750px] h-[50px] px-4 mx-1 text-base text-black'
              type='text'
              placeholder='O que você quer estudar?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className='h-full w-32 py-3 bg-[#0E7886] text-white text-xl'
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>

          <div className='w-[920px] bg-white mt-5 border-2 border-[#707070] shadow-lg'>
            <div className='h-3 w-full bg-[#0E7886]'></div>
            <div className='px-4 py-2'>
              <p className='text-[#0000003F]'>Consulte nossos</p>
              <h1 className='text-2xl font-semibold'>Materiais de Apoio</h1>
            </div>
          </div>

          <div className='w-[920px] bg-white mt-5 border-2 border-[#707070] shadow-lg'>
            <div className='grid grid-cols-3 gap-5 px-5 py-8'>
              {filteredItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className='border-2 border-[#707070] bg-[#0E7886] text-white flex flex-col justify-between h-52'
                >
                  <h1 className='text-lg text-center pt-10'>{item.titulo}</h1>
                  <div className='border-t-2 border-[#707070] bg-white flex items-center justify-center p-4'>
                    <div className='border-2 border-[#707070] bg-[#0E7886] text-white w-36 h-9 rounded-full flex items-center justify-center'>
                      <p>{item.total} Conteúdos</p>
                    </div>
                  </div>
                </a>
              ))}

              {Array.from({ length: emptySlots }, (_, index) => (
                <div key={index} className='border-2 border-[#707070] bg-[#3A9AA0] flex flex-col items-center justify-between h-52'>
                  <img src={cadeado} alt='cadeado' className='h-16 w-auto my-auto'/>
                  <div className='border-t-2 border-[#707070] bg-white w-full h-16 flex items-center justify-center p-'>
                    <div className='border-2 border-[#707070] bg-[#3A9AA0] w-36 h-9 rounded-full flex items-center justify-center'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
