import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from 'react-icons/fa';
import { LiaBookReaderSolid } from 'react-icons/lia';
import { IoIosInfinite } from 'react-icons/io';

export const Footer: React.FC = () => {
  return (
    <footer className='flex  items-end p-5 pt-0 bg-[#0E7886] text-white w-[1510px]'>
      <div className='flex flex-col items-center mr-10'>
        <LiaBookReaderSolid className='w-[134px] h-auto mt-[4px]' />
        <h1 className='text-2xl w-[120px] flex items-center'>
          L<IoIosInfinite className='align-middle w-[35px] h-auto' />P
        </h1>
        <h1 className='text-2xl w-[120px]'>
            Academic
        </h1>
      </div>

      <ul className='flex flex-col items-center'>
        <li className='mb-2 text-left w-full'><p>Conheça-nos</p></li>
        <li className='mb-2 text-left w-full'><p>Tenho dúvidas</p></li>
        <li className='mb-2 text-left w-full'><p>Como apoiar?</p></li>
        <li className='text-left w-full'><p>&copy; Loop Academic</p></li>
      </ul>

      <div className='flex flex-col items-center ml-auto'>
        <p className='mb-2'>Redes Sociais:</p>
        <ul className='flex p-0 list-none ml-20'>
          <li className='mr-2'><FaFacebookSquare className='w-[50px] h-auto' /></li>
          <li className='mr-2'><FaInstagramSquare className='w-[50px] h-auto' /></li>
          <li><FaTwitterSquare className='w-[50px] h-auto' /></li>
        </ul>
      </div>
    </footer>
  );
};

