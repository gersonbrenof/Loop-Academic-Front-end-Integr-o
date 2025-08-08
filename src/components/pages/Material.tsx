import { useState } from 'react';
import { FaArrowLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import MaterialDeApoioItems from '../data/MaterialDeApoioItens';

// CORREÇÃO: A propriedade 'tipo' foi alterada para 'string' para corresponder
// à inferência de tipo que o TypeScript faz a partir do seu arquivo de dados.
interface MaterialItem {
  pagina: string; 
  tipo: string; // <-- A CORREÇÃO ESTÁ AQUI
  titulo: string;
  material: string;
  introduao02?: string;
  recomendado?: string;
  arquivo?: string;
  imgArquivo?: string;
  tituloArquivo?: string;
  similar?: string;
}

export function Material() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const handleSelectExercise = (index: number) => {
    setSelectedIndex(index);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < MaterialDeApoioItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Esta linha agora funciona, pois a interface é compatível com os dados.
  const selectedExercise: MaterialItem = MaterialDeApoioItems[selectedIndex];

  const getEmbedLink = (link: string) => {
    return link.includes("embed")
      ? link
      : link.replace("watch?v=", "embed/");
  };

  const handlePdfClick = (pdf: string) => {
    setSelectedPdf(pdf);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPdf(null);
  };

  const renderMaterial = () => {
    if (selectedExercise.tipo === 'Video-Aula') {
      return (
        <iframe
          className='w-full h-[433px]'
          src={getEmbedLink(selectedExercise.material)}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      );
    } else if (selectedExercise.tipo === 'Mapa-Mental') {
      return (
        <img
          className='w-full h-[433px] object-contain'
          src={selectedExercise.material}
          alt={selectedExercise.titulo}
        />
      );
    } else if (selectedExercise.tipo === 'Arquivos') {
      return (
        <div className='p-5'>
          <p className='-mt-12 mb-8'>{selectedExercise.introduao02}</p>
          <div className='flex flex-col items-start'>
            <h2 className='text-[#0E7886] text-2xl font-semibold mb-4'>{selectedExercise.recomendado}</h2>
            <div className='w-full h-px bg-black mb-4 -mt-4'></div>
            <div className='flex flex-col items-center'>
              <button onClick={() => selectedExercise.arquivo && handlePdfClick(selectedExercise.arquivo)} disabled={!selectedExercise.arquivo}>
                <img 
                  className='w-24'
                  src={selectedExercise.imgArquivo} 
                  alt='PDF' 
                />
              </button>
              <p className='text-xs w-40 text-center mt-2'>{selectedExercise.tituloArquivo}</p>
            </div>
          </div>
    
          <div className='flex flex-col items-start mt-4'>
            <h2 className='text-[#0E7886] text-2xl font-semibold mb-4'>{selectedExercise.similar}</h2>
            <div className='w-full h-px bg-black mb-4 -mt-4'></div>
            <div className='flex flex-col items-center'>
              <button onClick={() => selectedExercise.arquivo && handlePdfClick(selectedExercise.arquivo)} disabled={!selectedExercise.arquivo}>
                <img 
                  className='w-24'
                  src={selectedExercise.imgArquivo} 
                  alt='PDF' 
                />
              </button>
              <p className='text-xs w-40 text-center mt-2'>{selectedExercise.tituloArquivo}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <div className='absolute top-[19px] left-[15px] text-[#0E7886] w-[135px] flex flex-col items-center'>
          <a href='/Material-De-Apoio-02' className='flex flex-col items-center'>
            <FaArrowLeft className='w-10 h-10' />
            <p>Retornar ao Início</p>
          </a>
        </div>

        <div className='absolute top-[115px] left-[61px]'>
          <div className='bg-[#FFFFFF] w-[1170px] h-[550px] shadow-md'>
            <div className='flex-grow p-5'>
              <div className='mb-5'>
                <p className='w-[585px]'>Página {selectedExercise.pagina}</p>
                <h1 className='text-[#0E7886] text-2xl font-semibold mb-5'>
                  {selectedExercise.tipo}: {selectedExercise.titulo}
                </h1>
              </div>
            </div>
            <div className='w-full h-[433px]'>
              {renderMaterial()}
            </div>
          </div>

          <div className='mt-10 flex justify-center'>
            <div className='flex text-white shadow-md'>
              <button
                className={`w-[400px] h-[60px] flex items-center justify-center ${selectedIndex === 0 ? 'bg-white text-gray-400' : 'bg-red-600'}`}
                onClick={handlePrevious}
                disabled={selectedIndex === 0}
              >
                <h2 className='flex items-center space-x-2'>
                  <FaAngleLeft />
                  <span>Anterior</span>
                </h2>
              </button>

              <button
                className={`w-[400px] h-[60px] flex items-center justify-center ${selectedIndex === MaterialDeApoioItems.length - 1 ? 'bg-white text-gray-400' : 'bg-green-600'}`}
                onClick={handleNext}
                disabled={selectedIndex === MaterialDeApoioItems.length - 1}
              >
                <h2 className='flex items-center space-x-2'>
                  <span>Próximo</span>
                  <FaAngleRight />
                </h2>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='ml-[1310px] bg-[#302D2DCC] w-[200px] h-[800px]'>
        <div className='text-white p-4'>
          <p>Lista de Exercícios 01</p>
          <h1 className='text-lg'>Introdução à Linguagem C</h1>
        </div>

        {(MaterialDeApoioItems as MaterialItem[]).map((item, index) => (
          <button
            key={item.tipo + item.titulo + index} 
            className={`h-[115px] w-[200px] border-2 border-[#707070] relative ${index === selectedIndex ? 'bg-white text-black' : 'bg-[#302D2D] text-white'}`}
            onClick={() => handleSelectExercise(index)}
          >
            {index === selectedIndex && (
              <div className='absolute top-0 left-0 w-full bg-[#0E7886] text-white text-center py-1'>
                Atual
              </div>
            )}
            <div className='p-2 pt-8'>
              <p className='text-gray-400 text-sm'>{item.tipo}</p>
              <h1 className='text-base'>{item.titulo}</h1>
            </div>
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='relative w-[900px] h-[350px] bg-white shadow-lg text-black'>
            <h1 className='text-xl bg-[#0E7886] text-white h-[51px] flex items-center p-5'>Apostila</h1>
            <div className='p-5'>
              <p>Consulte aqui as apostilas destinadas a te auxiliar em seus estudos.</p>
              <h2 className='relative bg-[#0E7886] text-white w-96 px-4 mt-4 text-xl'>Apostila 01 - Int. à Linguagem C</h2>
              <div className='flex p-5'>
                <img 
                  className='w-24'
                  src={selectedExercise.imgArquivo} 
                  alt='PDF' 
                />
                <p className='w-full pl-4'>Esta apostila apresenta uma revisão teórica acerca da temática da Introdução à Linguagem C, demonstrando as principais bibliotecas, suas funções e as funções de entrada e saída que são utilizadas com grande frequência. É altamente recomendada a sua leitura!</p>
              </div>
              <div className='flex justify-end mt-4'>
                <a
                  href={selectedPdf ?? undefined}
                  download
                  className='bg-[#0E7886] text-white py-2 px-4 text-xl w-[200px] flex justify-center'
                >
                  Baixar Apostila
                </a>
              </div>
            </div>
            
            <button
              onClick={closeModal}
              className='absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full'
            >
              <IoCloseSharp className='w-7 h-7' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}