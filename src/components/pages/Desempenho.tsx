import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- INTERFACES (sem alterações) ---
interface ExercicioItem {
  id: number;
  titulo: string;
  numeroDoExercicio: number;
  status: string;
}
interface DesempenhoLista {
  id: number;
  titulo: string;
  numeroExercicio: number;
  dificuldade: string;
  exercicios: ExercicioItem[];
}
interface DesempenhoGeral {
    id: number;
    aluno: number;
    turma: number;
    pontuacaoAluno: number;
    data_criacao: string;
    tentativas: number;
    status: string;
    observacao: string | null;
    avaliacao: string | null;
    total_respostas: number;
    respostas_corretas: number;
    porcentagem_desempenho: number;
    status_avaliacao: string;
}
interface ActivityOption {
  titulo: string;
}
interface DropdownProps {
  options: ActivityOption[];
  selectedOption: string;
  toggleDropdown: () => void;
  handleOptionSelect: (option: string) => void;
  isOpen: boolean;
}
interface SectionHeaderProps {
  title: string;
}
interface PerformanceRatingProps {
  percentage: number; // Alterado para number para consistência
}

const apiUrl = import.meta.env.VITE_API_URL;

// --- COMPONENTES FILHO (sem alterações) ---

const Dropdown = ({ options, selectedOption, toggleDropdown, handleOptionSelect, isOpen }: DropdownProps) => (
  <div className='relative'>
    <button onClick={toggleDropdown} className='text-white text-xl bg-[#0E7886] flex items-center justify-between px-4 py-2 w-[386px] rounded-md'>
      <h2 className='text-white text-xl'>{selectedOption}</h2>
      <p className='flex items-center'>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</p>
    </button>
    {isOpen && (
      <div className='absolute top-full left-0 bg-white border-2 border-[#0E7886] w-[386px] rounded-b-md shadow-lg z-10'>
        {options.map((item) => (
          <div key={item.titulo} className='flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer' onClick={() => handleOptionSelect(item.titulo)}>
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
  const roundedPercentage = Math.round(percentage); // Arredonda para o inteiro mais próximo
  let displayText = `${roundedPercentage}%`;
  let colorClass = 'text-red-600 border-red-600';

  if (roundedPercentage > 50) {
    colorClass = 'text-green-600 border-green-600';
  } else if (roundedPercentage > 25) {
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
  const navigate = useNavigate();

  const [desempenhoListas, setDesempenhoListas] = useState<DesempenhoLista[]>([]);
  const [desempenhoGeral, setDesempenhoGeral] = useState<DesempenhoGeral | null>(null);
  const [selectedList, setSelectedList] = useState<DesempenhoLista | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDesempenhoData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const [listasResponse, geralResponse] = await Promise.all([
          fetch(`${apiUrl}/desempenho/desempenho-lista/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/desempenho/desempenho/`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (listasResponse.status === 401 || geralResponse.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!listasResponse.ok) throw new Error(`Erro ao buscar listas: ${listasResponse.statusText}`);
        if (!geralResponse.ok) throw new Error(`Erro ao buscar desempenho geral: ${geralResponse.statusText}`);
        const listasData: DesempenhoLista[] = await listasResponse.json();
        const geralData: DesempenhoGeral = await geralResponse.json();
        setDesempenhoListas(listasData);
        setDesempenhoGeral(geralData);
        if (listasData && listasData.length > 0) {
          setSelectedList(listasData[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDesempenhoData();
  }, [navigate]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (titulo: string) => {
    const newList = desempenhoListas.find(lista => lista.titulo === titulo);
    if (newList) setSelectedList(newList);
    setIsDropdownOpen(false);
  };
  
  const percentage = desempenhoGeral?.porcentagem_desempenho || 0;
  
  // ***** FUNÇÃO CORRIGIDA PARA EXIBIR O STATUS "INCORRETO" *****
  const getStatusDisplay = (status: string) => {
    const lowerStatus = status.toLowerCase(); // Normaliza o status para minúsculas

    if (lowerStatus === 'correto') {
      return <p className="w-96 font-bold flex justify-center text-green-500">RESOLUÇÃO CORRETA</p>;
    }
    // Adicionada a verificação para "Incorreto"
    if (lowerStatus === 'incorreto') {
      return <p className="w-96 font-bold flex justify-center text-yellow-500">RESOLUÇÃO INCORRETA</p>;
    }
    // O padrão continua sendo "Não Respondido"
    return <p className="w-96 font-bold flex justify-center text-red-500">NÃO RESPONDIDO</p>;
  };

  if (loading) return <div className="p-8 text-center text-xl absolute top-10 left-[-400px]">Carregando desempenho...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-500 absolute top-10 left-[-400px]">Falha ao carregar dados: {error}</div>;
  
  return (
    <div className='mt-[-10px] absolute top-0 left-[-550px] pb-10'>
      <h1 className='text-center text-3xl italic font-bold ml-[100px]'>DESEMPENHO</h1>
      <div className='flex pt-20'>
        <Link to='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </Link>
        <div className='ml-8'>
          <div className='w-[920px] h-auto bg-white border-2 border-[#707070] shadow-lg rounded-lg'>
            <SectionHeader title="Consultar Desempenho" />
            <div className='p-8'>
              <Dropdown
                options={desempenhoListas.map(lista => ({ titulo: lista.titulo }))}
                selectedOption={selectedList?.titulo || 'Nenhuma lista encontrada'}
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
                {selectedList?.exercicios.map((item) => (
                  <div key={item.id} className='flex my-4 text-[#707070] text-center px-2 items-center border-b last:border-b-0 py-2'>
                    <p className='w-24 mr-2'>{String(item.numeroDoExercicio).padStart(2, '0')}</p>
                    <p className='w-[540px] mr-2 text-left'>{item.titulo}</p>
                    {getStatusDisplay(item.status)}
                  </div>
                ))}
                {(!selectedList || selectedList.exercicios.length === 0) && (
                    <p className="text-center text-gray-500 p-4">Nenhum exercício encontrado para esta lista.</p>
                )}
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
                  <>Uau!<br />De acordo com os nossos nerds, o seu desempenho foi classificado como <strong>EXCELENTE!</strong><br />Estamos felizes por sua dedicação.<br />Parabéns!</>
                ) : (
                  <>Lamentamos informar que seu desempenho foi classificado como <strong>BAIXO.</strong> Empenhe-se um pouco mais aos estudos.<br />Acreditamos em você!</>
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
                        <img src='/img/desempenho.png' alt='Ícone de Desempenho' className='w-16 h-16' />
                        <div className='pl-2'><p className='w-40'>Uau,</p><h1 className='text-xl w-48 font-bold'>Que Desempenho!</h1></div>
                      </div>
                      <p className='pt-4 h-auto'>Obtenha desempenho bom ou maior ao responder uma lista de exercícios!</p>
                    </div>
                    <Link to='/Emblemas' className='bg-[#0E7886] text-white text-xl p-2 mt-4 block text-center w-full rounded-md hover:bg-[#0b5a66]'>Acessar Emblemas</Link>
                  </div>
                </div>
              ) : (
                <div>
                  <SectionHeader title="Recomendações" />
                  <div className='text-black p-8'>
                    <p>Identificamos que o seu desempenho está baixo e que você tem dificuldades na temática de Estruturas de Decisão. Por isso, preparamos um Material de Apoio para te ajudar a estudar este conteúdo.</p>
                    <p className='pt-4'>Vamos nessa?</p>
                    <div className='flex justify-center'><img src='/img/material.png' alt='Ícone de Material de Apoio' className='w-16 h-16 mt-12' /></div>
                    <Link to='/Material-de-Apoio' className='bg-[#0E7886] text-white text-xl p-2 mt-8 block text-center w-full rounded-md hover:bg-[#0b5a66]'>Acessar Material de Apoio</Link>
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