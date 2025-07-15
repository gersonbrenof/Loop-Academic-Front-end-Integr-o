import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import DuvidasItens from '../data/DuvidasItens';

export function Duvidas() {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className='mt-[0px] absolute top-[-10px] left-[-550px] '>
            <h1 className='text-center text-3xl italic font-bold ml-[60px]'>DÚVIDAS</h1>

            <div className='flex pt-20'>
                <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
                    <FaArrowLeft className='w-10 h-auto' />
                    <p className='w-32 text-sm text-center'>Menu Principal</p>
                </a>

                <div className='flex ml-20'>
                    <a 
                        href='/Duvidas' 
                        className='w-96 h-8 bg-[#0E7886] text-white text-xl border-2 border-[#707070] flex justify-center items-center'>
                        Dúvidas Enviadas e Respondidas
                    </a>
                    <a 
                        href='/Enviar-Duvidas'
                        className='w-96 h-8 text-black text-xl border-2 border-[#707070] flex justify-center items-center'>
                        Enviar Dúvidas
                    </a>
                </div>
            </div>

            <div className='w-[1000px] h-full mt-8 ml-40 bg-white border-2 border-[#707070] shadow-lg'>
                <div className='h-4 w-full bg-[#0E7886]'></div>
                <div className='px-4 py-6 text-black'>
                    {DuvidasItens.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleExpand(index)}
                            className='border-black border-2 flex flex-col items-start rounded-3xl w-full text-left focus:outline-none mb-5'
                        >
                            <div className='flex items-end'>
                                <img 
                                    src={item.status ? 'img/questao.png' : 'img/pergunta.png'} 
                                    alt='ícone dúvida'
                                    className='w-16 ml-2'
                                />
                                <div className='flex items-end space-x-2 ml-2 mb-2'>
                                    <h1 className='w-[440px]'>{item.titulo}</h1>
                                    <h1>Data:</h1>
                                    <p className='text-[#707070] w-24'>{item.date}</p>
                                    <h1>Status:</h1>
                                    <p className={item.status ? 'text-green-500' : 'text-yellow-500'}>
                                        {item.status ? 'RESPONDIDA' : 'AGUARDANDO RESPOSTA'}
                                    </p>
                                </div>
                            </div>

                            {expandedIndex === index && (
                                <div>
                                    <div className='my-4 ml-16 p-4 border border-[#707070] rounded-lg bg-gray-100 w-[500px]'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex items-start'>
                                            <div className='ml-4 text-xs'>
                                                <p>{item.pergunta}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {item.status && (
                                    <div className='my-4 ml-[410px] p-4 border border-[#707070] rounded-lg bg-gray-300 w-[500px]'>
                                        <div className='flex flex-col space-y-4'>
                                            <div className='flex items-start'>
                                                <div className='ml-4 text-xs'>
                                                    <p>{item.resposta}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>
                                
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
