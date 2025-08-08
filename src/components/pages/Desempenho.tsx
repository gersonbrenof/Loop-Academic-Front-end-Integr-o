import { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Importação dos seus dados
import ListaDeExerciciosItens from '../data/ListaDeExerciciosItens';
import ListaDeExercicios02Items from '../data/ListaDeExercicios02Itens';
import AtividadesItems from '../data/AtividadesItens';

// --- DEFINIÇÃO DAS INTERFACES (Contratos dos seus dados e componentes) ---

// Interface para as opções do Dropdown (Ex: { titulo: 'Introdução à Linguagem C' })
interface ActivityOption {
  titulo: string;
}

// Interface para as props do componente Dropdown
interface DropdownProps {
  options: ActivityOption[];
  selectedOption: string;
  toggleDropdown: () => void;
  handleOptionSelect: (option: string) => void;
  isOpen: boolean;
}

// Interface para as props do componente SectionHeader
interface SectionHeaderProps {
  title: string;
}

// Interface para as props do componente PerformanceRating
interface PerformanceRatingProps {
  percentage: number;
}

// Interface unificada para um item de lista de exercícios.
// Propriedades que não existem em todas as listas são marcadas como opcionais com '?'.
// Isso resolve o erro principal de incompatibilidade de tipos.
interface ListItem {
  numero: string;
  titulo: string;
  link: string;
  status: boolean;
  resolucao: string;
  introducao?: string;
  dica?: string;
  explicacao?: string;
  solucao?: string;
  // Adicione aqui qualquer outra propriedade que possa ser opcional
}

// --- COMPONENTES FILHO TIPADOS ---

const Dropdown = ({ options, selectedOption, toggleDropdown, handleOptionSelect, isOpen }: DropdownProps) => (
  <div className='relative'>
    <button
      onClick={toggleDropdown}
      className='text-white text-xl bg-[#0E7886] flex items-center justify-between px-4 py-2 w-[386px] rounded-md'
    >
      <h2 className='text-white text-xl'>{selectedOption}</h2>
      <p className='flex items-center'>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </p>
    </button>

    {isOpen && (
      <div className='absolute top-full left-0 bg-white border-2 border-[#0E7886] w-[386px] rounded-b-md shadow-lg z-10'>
        {options.map((item) => (
          <div
            key={item.titulo} // É melhor usar um valor único do item como chave
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

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className='w-full h-[60px] bg-[#0E7886] flex items-center pl-8 rounded-t-md'>
    <h1 className='text-white text-2xl'>{title}</h1>
  </div>
);

const PerformanceRating = ({ percentage }: PerformanceRatingProps) => {
  let displayText = `${percentage}%`;
  let colorClass = 'text-red-600 border-red-600';

  if (percentage > 50) {
    colorClass = 'text-green-600 border-green-600';
  } else if (percentage > 25) {
    colorClass = 'text-yellow-600 border-yellow-600';
  }

  return (
    <div className={`flex items-center justify-center w-56 h-56 rounded-full border-8 ${colorClass} italic font-bold`}>
      <div className='text-center'>
        <h1 className='flex items-center justify-center text-6xl'>{displayText}</h1>
        <p className='text-xs w-40'>DE APROVEITAMENTO</p>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export function Desempenho() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(AtividadesItems[0].titulo);
  // O estado agora é tipado para aceitar um array de ListItem
  const [currentList, setCurrentList] = useState<ListItem[]>(ListaDeExerciciosItens);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);

    if (option === 'Introdução à Linguagem C') {
      setCurrentList(ListaDeExerciciosItens);
    } else if (option === 'Estrutura de Decisão') {
      setCurrentList(ListaDeExercicios02Items);
    }
  };

  const correctAnswers = currentList.filter(item => item.status).length;
  const totalItems = currentList.length;
  // Prevenção de divisão por zero
  const percentage = totalItems > 0 ? Math.round((correctAnswers / totalItems) * 100) : 0;

  return (
    <div className='mt-[-10px] absolute top-0 left-[-550px] pb-10'>
      <h1 className='text-center text-3xl italic font-bold ml-[100px]'>DESEMPENHO</h1>

      <div className='flex pt-20'>
        <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </a>

        <div className='ml-8'>
          <div className='w-[920px] h-auto bg-white border-2 border-[#707070] shadow-lg rounded-lg'>
            <SectionHeader title="Consultar Desempenho" />
            <div className='p-8'>
              <Dropdown
                options={AtividadesItems}
                selectedOption={selectedOption}
                toggleDropdown={toggleDropdown}
                handleOptionSelect={handleOptionSelect}
                isOpen={isDropdownOpen}
              />

              <div className='border-2 border-[#707070] mt-8 rounded-md overflow-hidden'>
                <div className='bg-gray-400 text-black flex text-center px-2 py-2 font-bold'>
                  <p className='w-24 mr-2'>Número</p>
                  <p className='w-[570px] text-left mr-2'>Título</p>
                  <p className='w-96 items-justify'>Status</p>
                </div>

                {currentList.map((item) => (
                  <div key={item.numero} className='flex my-4 text-[#707070] text-center px-2 items-center border-b last:border-b-0 py-2'>
                    <p className='w-24 mr-2'>{item.numero}</p>
                    <p className='w-[540px] mr-2 text-left'>{item.titulo}</p>
                    <p className={`w-96 font-bold flex justify-center ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                      {item.status ? 'RESOLUÇÃO CORRETA' : 'NÃO RESPONDIDO'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row w-[920px] gap-8 mt-8'>
            <div className='w-full md:w-1/2 h-auto bg-white shadow-lg rounded-lg'>
              <SectionHeader title="Avaliar Desempenho" />
              <div className='flex justify-center p-8'>
                <PerformanceRating percentage={percentage} />
              </div>
              <p className='text-black text-xl mx-4 mt-3 mb-7 leading-normal'>
                {percentage > 50 ? (
                  <>
                    Uau!<br />
                    De acordo com os nossos nerds, o seu desempenho foi classificado como <strong>EXCELENTE!</strong><br />
                    Estamos felizes por sua dedicação.<br />
                    Parabéns!
                  </>
                ) : (
                  <>
                    Lamentamos informar que seu desempenho foi classificado como <strong>BAIXO.</strong>
                    Empenhe-se um pouco mais aos estudos.<br />
                    Acreditamos em você!
                  </>
                )}
              </p>
            </div>

            <div className='w-full md:w-1/2 h-auto bg-white shadow-lg rounded-lg'>
              {percentage > 50 ? (
                <div>
                  <SectionHeader title="Emblemas Obtidos" />
                  <div className='p-8'>
                    <p className='text-black'>A partir do seu desempenho, você obteve uma conquista \o/</p>
                    <div className='relative border-2 border-[#707070] w-full max-w-[330px] flex flex-col p-4 text-black my-8'>
                      <h1 className='absolute -top-4 -right-4 bg-[#0E7886] p-2 text-white rounded-md'>#0008</h1>
                      <div className='flex items-center'>
                        <img 
                          src='/img/desempenho.png'
                          alt='Ícone de Desempenho' 
                          className='w-16 h-16' />
                        <div className='pl-2'>
                          <p className='w-40'>Uau,</p>
                          <h1 className='text-xl w-48 font-bold'>Que Desempenho!</h1>
                        </div>
                      </div>
                      <p className='pt-4 h-auto'>
                        Obtenha desempenho bom ou maior ao responder uma lista de exercícios!
                      </p>
                    </div>
                    <a 
                      href='/Emblemas'
                      className='bg-[#0E7886] text-white text-xl p-2 mt-4 block text-center w-full rounded-md hover:bg-[#0b5a66]'>
                      Acessar Emblemas
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <SectionHeader title="Recomendações" />
                  <div className='text-black p-8'>
                    <p>
                      Identificamos que o seu desempenho está baixo e que você tem dificuldades na temática de Estruturas de Decisão. Por isso, preparamos um Material de Apoio para te ajudar a estudar este conteúdo.
                    </p>
                    <p className='pt-4'>Vamos nessa?</p>
                    <div className='flex justify-center'>
                        <img 
                            src='/img/material.png'
                            alt='Ícone de Material de Apoio' 
                            className='w-16 h-16 mt-12' 
                        />
                    </div>
                    <a 
                      href='/Material-de-Apoio'
                      className='bg-[#0E7886] text-white text-xl p-2 mt-8 block text-center w-full rounded-md hover:bg-[#0b5a66]'>
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