import EmblemasItens from '../data/EmblemasItens';
import { FaArrowLeft } from 'react-icons/fa';

export function TodosOsEmblemas() {
    return (
        <div className='mt-[0px] absolute top-[-10px] left-[-550px]'>
            <h1 className='text-center text-3xl italic font-bold ml-[50px]'>EMBLEMAS</h1>

            <div className='flex pt-20'>
                <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
                    <FaArrowLeft className='w-10 h-auto' />
                    <p className='w-32 text-sm text-center'>Menu Principal</p>
                </a>

                <div className='flex ml-20'>
                    <a 
                        href='/Emblemas' 
                        className='w-96 h-8 text-black text-xl border-2 border-[#707070] flex justify-center items-center'>
                        Meus Emblemas
                    </a>
                    <a 
                        href='/Todos-os-Emblemas' 
                        className='w-96 h-8 bg-[#0E7886] text-white text-xl border-2 border-[#707070] flex justify-center items-center'>
                        Todos os Emblemas
                    </a>
                </div>
            </div>

            <div className='w-[1000px] h-full mt-8 ml-40 bg-white border-2 border-[#707070] shadow-lg'>
                <div className='h-4 w-full bg-[#0E7886]'></div>

                <div className='flex justify-center items-center my-8'>
                    <div className='grid grid-cols-3 gap-10'>
                        {EmblemasItens.map((item) => (
                            <div 
                                key={item.numero} 
                                className={`relative border-2 border-[rgb(112,112,112)] w-[280px] h-full flex flex-col p-4 text-black
                                    ${item.add === 'false' ? 'opacity-50 filter grayscale' : ''}`}>
                                <h1 className='absolute -top-2 -right-2 bg-[#0E7886] p-2 text-white'>
                                    {item.numero}
                                </h1>
                                <div className='flex'>
                                    <img 
                                        src={item.icone} 
                                        alt='icone' 
                                        className='w-auto h-16' />
                                    <div className='p-4'>
                                        <p className='w-40'>{item.tittle1}</p>
                                        <h1 className='text-xl w-48'>{item.tittle2}</h1>
                                    </div>
                                </div>
                                <p className='h-16'>{item.discricao}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
