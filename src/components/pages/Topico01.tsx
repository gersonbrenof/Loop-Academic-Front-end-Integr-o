import React, { useState, useRef } from 'react';
import TopicoItens from '../data/TopicoItens';
import UsuarioItens from '../data/UsuarioItens';
import EmblemasItens from '../data/EmblemasItens';
import { FaArrowLeft, FaPaperclip } from 'react-icons/fa';

export function Topico01() {
  const [respostas, setRespostas] = useState([]);
  const [textoResposta, setTextoResposta] = useState('');
  const [image, setImage] = useState(null);

  const respostaRef = useRef(null);

  const handleResponder = () => {
    if (textoResposta.trim() || image) {
      setRespostas([...respostas, { texto: textoResposta, image }]);
      setTextoResposta('');
      setImage(null);
    }
  };

  const scrollToResposta = () => {
    if (respostaRef.current) {
      respostaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[200px]'>FÓRUM</h1>

      <div className='flex pt-20'>
        <a href='/Forum' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar</p>
        </a>
        <div className='m-3 text-lg text-white '>
          <a href='/Criar-Topico' className='bg-red-700 py-2 px-4'>
            Criar Tópico
          </a>
          <button 
            className='bg-green-700 py-1 px-4 ml-2' 
            onClick={() => window.location.reload()}
          >
            Atualizar
          </button>
          <button 
            className='bg-[#0E7886] py-1 px-4 ml-2'
            onClick={scrollToResposta}
          >
            Responder
          </button>
        </div>
      </div>

      <div className='w-[900px] h-full mt-4 ml-44 py-2 '>
        <div className='text-white text-lg bg-[#0E7886] border-2 border-[#707070] shadow-lg flex items-center px-2'>
          <h1 className='w-4/5'>Como pegar o valor máximo/mínimo de um inteiro na linguagem C?</h1>
          <h1 className='text-sm font-light'>Categoria: Linguagem C</h1>
        </div>

        {TopicoItens.map((item, index) => (
          <div key={index} className='h-full mt-1 bg-white border-2 border-[#707070] shadow-lg flex'>
            <div className='w-1/4 bg-[#0E7886] text-white p-2 border-r-2 border-[#707070]'>
              <h1 className='text-2xl'>{item.nome}</h1>
              <p className='text-base font-light'>{item.matricula}</p>
              <p className='text-sm font-light'>{item.turma}</p>
              <div className='flex justify-center'>
                <img 
                  src={item.img} 
                  alt='usuario'
                  className='bg-white w-28 my-2 rounded-full shadow-lg' 
                />
              </div>
              <h1 className='text-base bg-green-700 text-center py-1.5 border-2 border-[#707070]'>{item.nivel}</h1>
              
              <div className='border-2 border-[#707070] mt-4'>
                <div className='text-black text-center bg-neutral-300 border-b-2 border-[#707070]'>4 Emblemas</div>
                <div className='bg-white grid grid-cols-3 gap-4 p-2'>
                  <img src='img/Vip.png' alt='' className='w-10' />
                  <img src='img/linux.png' alt='' className='w-10' />
                  <img src='img/desempenho.png' alt='' className='w-10' />
                  <img src='img/NovoProgramador.png' alt='' className='w-10' />
                </div>
              </div>

            </div>
            <div className='w-3/4 text-black text-sm px-4 py-2 flex flex-col'>
              <div className='flex-grow'>
                <p className='text-sm font-light'>{item.data}, às {item.hora}</p>
                <p className='text-base mt-8'>{item.resposta}</p>
              </div>
              <div className='h-1/2 mt-4'>
                <p className='border-b-2 border-black'>Assinatura</p>
                <div className='flex justify-center py-2'>
                  <img src='img/user.png' alt='' className='w-32 h-auto'/>
                </div>
              </div>

            </div>
          </div>
        ))}

        {respostas.map((resposta, index) => (
          <div key={index} className='h-full mt-1 bg-white border-2 border-[#707070] shadow-lg flex'>
            <div className='w-1/4 bg-[#0E7886] text-white p-2 border-r-2 border-[#707070]'>
              <h1 className='text-2xl'>Tiago Return</h1>
              <p className='text-base font-light'>201901004</p>
              <p className='text-sm font-light'>Turma: A4</p>
              <div className='flex justify-center'>
                <img 
                  src='img/user.png'  
                  alt='usuario'
                  className='bg-white w-28 my-2 rounded-full shadow-lg' 
                />
              </div>
              <h1 className='text-base bg-green-700 text-center py-1 border-2 border-[#707070]'>Iniciante</h1>
              
              <div className='border-2 border-[#707070] mt-4'>
                <div className='text-black text-center bg-neutral-300 border-b-2 border-[#707070]'>
                  {EmblemasItens.filter(item => item.add === 'true').length} Emblemas
                </div>
                <div className='bg-white grid grid-cols-3 gap-4 p-2'>
                  {EmblemasItens.filter(item => item.add === 'true').map((emblema, index) => (
                    <img key={index} src={emblema.icone} alt='' className='w-10' />
                  ))}
                </div>
              </div>
            </div>
            <div className='w-3/4 text-black text-sm px-4 py-2 flex flex-col'>
              <div className='flex-grow'>
                <p className='text-sm font-light'>{new Date().toLocaleDateString()}, às {new Date().toLocaleTimeString()}</p>
                <p className='text-base mt-8'>{resposta.texto}</p>
                {resposta.image && (
                  <img src={resposta.image} alt='Anexo' className='mt-4' />
                )}
              </div>
              <div className='h-1/2'>
                <p className='border-b-2 border-black'>Assinatura</p>
              </div>
            </div>
          </div>
        ))}

        <div className='bg-[#0E7886] h-8 mt-1 border-2 border-[#707070] shadow-lg'></div>
        
        <div ref={respostaRef} className='w-[900px] h-auto mt-16 bg-white border-2 border-[#707070] shadow-lg'>
          <div className='w-full bg-[#0E7886] flex items-center'>
            <h1 className='text-white text-xl ml-4'>Responder tópico</h1>
          </div>
          <div className='pt-6 p-4'>
            <textarea
              className='w-full h-48 text-black border-2 border-[#707070] p-2 font-mono resize-none overflow-y-auto'
              placeholder='Digite sua resposta aqui'
              value={textoResposta}
              onChange={(e) => setTextoResposta(e.target.value)}
             />
            <div className='flex items-center mt-6'>
              <button
                className='text-xl text-white bg-[#0E7886] py-1 px-7'
                onClick={handleResponder}
              >
                Responder
              </button>
              <input
                type='file'
                className='hidden'
                id='file-input'
                onChange={handleImageChange}
              />
              <label htmlFor='file-input'>
                <FaPaperclip className='w-10 h-10 pl-4 cursor-pointer text-black' />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
