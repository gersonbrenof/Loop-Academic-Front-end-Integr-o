import menuItems from '../data/MenuItens';
import { LiaBookReaderSolid } from 'react-icons/lia';
import { IoIosInfinite } from 'react-icons/io';

export function MenuLateral() {
  return (
    <nav className='w-[235px] h-[1200px] bg-[#0E7886] p-2 flex flex-col justify-between'>
      <ul className='list-none mt-8 text-sm italic text-[17px] text-[#0E7886] m-0 text-center font-bold'>
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className='flex items-center bg-white p-2 mb-1 shadow-lg h-12 text-decoration-none'
          >
            <img src={item.imgSrc} className='w-7 mr-2' />
            <p>{item.title.toUpperCase()}</p>
          </a>
        ))}
      </ul>

      <div className='flex flex-col items-center text-white mr-10'>
        <LiaBookReaderSolid className='w-[170px] h-auto mt-[4px]' />
        <div className='text-3xl w-[120px] items-center mt-[-10px]'>
          <h1 className='flex'>
            L<IoIosInfinite className='align-middle w-[35px] h-auto' />P
          </h1>
          <h1>Academic</h1>
        </div>
      </div>
    </nav>
  );
}
