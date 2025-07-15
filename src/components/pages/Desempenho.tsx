import { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import ListaDeExerciciosItens from '../data/ListaDeExerciciosItens';
import ListaDeExercicios02Items from '../data/ListaDeExercicios02Itens';
import AtividadesItems from '../data/AtividadesItens';

const Dropdown = ({ options, selectedOption, toggleDropdown, handleOptionSelect, isOpen }) => (
  <div>
    <button
      onClick={toggleDropdown}
      className='text-white text-xl bg-[#0E7886] flex items-center justify-between px-4 py-2 w-[386px]'
    >
      <h2 className='text-white text-xl'>{selectedOption}</h2>
      <p className='flex items-center'>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </p>
    </button>

    {isOpen && (
      <div className='bg-white border-2 border-[#0E7886] w-[386px]'>
        {options.map((item, index) => (
          <div
            key={index}
            className='flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer'
            onClick={() => handleOptionSelect(item.titulo)}
          >
            <h2 className='text-[#0E7886] text-xl'>{item.titulo}</h2>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SectionHeader = ({ title }) => (
  <div className='w-full h-[60px] bg-[#0E7886] flex items-center pl-8'>
    <h1 className='text-white text-2xl'>{title}</h1>
  </div>
);

const PerformanceRating = ({ percentage }) => {
  let displayText = '';
  let colorClass = '';

  if (percentage === 100 || percentage > 50) {
    displayText = `${percentage}%`;
    colorClass = 'text-green-600 border-green-600';
  } else if (percentage === 50 || percentage > 25) {
    displayText = `${percentage}%`;
    colorClass = 'text-yellow-600 border-yellow-600';
  } else if (percentage === 25 || percentage < 25) {
    displayText = `${percentage}%`;
    colorClass = 'text-red-600 border-red-600';
  } else {
    displayText = `${percentage}%`;
    colorClass = 'text-red-600 border-red-600';
  }

  return (
    <div className={`flex items-center justify-center w-56 h-56 rounded-full border-8 ${colorClass} italic font-bold`}>
      <div>
        <h1 className='flex items-center justify-center text-6xl'>{displayText}</h1>
        <p className='text-xs w-40'>
          {percentage === 100 || percentage > 50
            ? 'DE APROVEITAMENTO DA LISTA 01'
            : 'DE APROVEITAMENTO DA LISTA 02'}
        </p>
      </div>
    </div>
  );
};

export function Desempenho() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(AtividadesItems[0].titulo);
  const [currentList, setCurrentList] = useState(ListaDeExerciciosItens);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);

    if (option === 'Introdução à Linguagem C') {
      setCurrentList(ListaDeExerciciosItens);
    } else if (option === 'Estrutura de Decisão') {
      setCurrentList(ListaDeExercicios02Items);
    }
  };

  const correctAnswers = currentList.filter(item => item.status === true).length;
  const totalItems = currentList.length;
  const percentage = Math.round((correctAnswers / totalItems) * 100);

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[100px]'>DESEMPENHO</h1>

      <div className='flex pt-20'>
        <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </a>

        <div className='ml-8'>
          <div className='w-[920px] h-auto bg-white border-2 border-[#707070] shadow-lg'>
            <SectionHeader title="Consultar Desempenho" />

            <div className='p-8'>
              <Dropdown
                options={AtividadesItems}
                selectedOption={selectedOption}
                toggleDropdown={toggleDropdown}
                handleOptionSelect={handleOptionSelect}
                isOpen={isDropdownOpen}
              />

              <div className='border-2 border-[#707070] mt-8'>
                <div className='bg-gray-400 text-black flex text-center px-2'>
                  <p className='w-24 mr-2'>Número</p>
                  <p className='w-[570px] text-left mr-2'>Título</p>
                  <p className='w-96 items-justify'>Status</p>
                </div>

                {currentList.map((item, index) => (
                  <div key={index} className='flex my-4 text-[#707070] text-center px-2'>
                    <p className='w-24 mr-2'>{item.numero}</p>
                    <p className='w-[540px] mr-2 flex items-start'>{item.titulo}</p>
                    <p className={`w-96 font-bold flex justify-center ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                      {item.status ? 'RESOLUÇÃO CORRETA' : 'NÃO RESPONDIDO E NÃO ENVIADO'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex w-[920px]'>
            <div className='w-1/2 h-auto m-5 ml-0 bg-white shadow-lg'>
              <SectionHeader title="Avaliar Desempenho" />

              <div className='flex justify-center mt-10'>
                <PerformanceRating percentage={percentage} />
              </div>

              <p className='text-black text-xl mx-4 mt-3 mb-7 leading-[1.5em]'>
                {percentage === 100 ? (
                  <>
                    Uau!<br />
                    De acordo com os nossos nerds, o seu desempenho foi classificado como EXCELENTE!<br />
                    Estamos felizes por sua dedicação.<br />
                    Parabéns!
                  </>
                ) : (
                  <>
                    Lamentamos informar que seu desempenho foi classificado como BAIXO.
                    Empenhe-se um pouco mais aos estudos.<br />
                    Acreditamos em você!
                  </>
                )}
              </p>
            </div>

            <div className='w-1/2 h-auto m-5 mr-0 bg-white shadow-lg'>
              {percentage === 100 || percentage > 50 ? (
                <div>
                  <SectionHeader title="Emblemas Obtidos" />

                  <div className='px-5'>
                    <p className='text-black pt-8'>A partir do seu desempenho, você obteve uma conquista \o/</p>

                    <div className='relative border-2 border-[#707070] w-[330px] flex flex-col p-4 text-black my-8'>
                      <h1 className='absolute -top-4 -right-4 bg-[#0E7886] p-2 text-white'>#0008</h1>
                      <div className='flex items-center'>
                        <img 
                          src='img/desempenho.png'
                          alt='Ícone' 
                          className='w-16 h-16' />
                        <div className='pl-2'>
                          <p className='w-40'>Uau,</p>
                          <h1 className='text-xl w-48'>Que Desempenho!</h1>
                        </div>
                      </div>
                      <p className='pt-4 h-auto'>
                        Obtenha desempenho bom ou maior ao responder uma lista de exercícios!
                      </p>
                    </div>

                    <a 
                      href='/Emblemas'
                      className='bg-[#0E7886] text-white text-xl p-2 mt-20  block text-center w-full'>
                      Acessar Emblemas
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <SectionHeader title="Recomendações" />

                  <div className='text-black px-5'>
                    <p  className='mt-8'>
                      Identificamos que o seu desempenho está baixo e que você tem dificuldades na temática de Estruturas de Decisão. Por isso, nós preparamos um Material de Apoio para te ajudar a estudar este conteúdo.
                    </p>
                    <p className='pt-4'>Vamos nessa?</p>
                    <img 
                          src='img/material.png'
                          alt='Ícone' 
                          className='w-16 h-16 mt-12 ml-40' 
                    />

                    <a 
                      href='/Material-de-Apoio'
                      className='bg-[#0E7886] text-white text-xl p-2 mt-16  block text-center w-full'>
                      Acessar Material de Apoio
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
