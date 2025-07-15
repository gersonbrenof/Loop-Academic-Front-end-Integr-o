import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// --- INTERFACES PARA OS DADOS DA API ---
interface ListaInfo {
  id: number;
  titulo: string;
}

interface ExercicioDetalhado {
  id: number;
  titulo: string;
  descricao: string;
  numeroDoExercicio: number;
  lista: ListaInfo;
  // AVISO: Os campos abaixo (dica, explicacao, etc.) não vêm da API.
  // Você precisará adicioná-los à sua API e a esta interface no futuro.
  dica?: string;
  explicacao?: string;
  note?: string;
  ExImg?: string;
  funcao?: string;
  explixacao?: string; // Verifique o nome deste campo
  expm?: string;
  text?: string;
  passos?: string;
  int?: string;
  operacao?: string;
  int2?: string;
  codigo?: string;
}

interface ExercicioDaLista {
  id: number;
  titulo: string;
  numeroDoExercicio: number;
}

export function Exercicio() {
  const { exercicioId } = useParams<{ exercicioId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // --- ESTADOS DINÂMICOS ---
  const [exercicio, setExercicio] = useState<ExercicioDetalhado | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para navegação
  const [exerciciosDaLista, setExerciciosDaLista] = useState<ExercicioDaLista[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [listaTitulo, setListaTitulo] = useState('Lista de Exercícios');

  // Estados dos modais (mantidos do seu código original)
  const [showDicas, setShowDicas] = useState(false);
  const [showCodigoApoio, setShowCodigoApoio] = useState(false);
  const [showSimplificarProblema, setShowSimplificarProblema] = useState(false);
  const [showSintaxe, setShowSintaxe] = useState(false);
  const [showDescricaoDetalhada, setShowDescricaoDetalhada] = useState(false);

  // --- LÓGICA DE BUSCA DE DADOS (ROBUSTA) ---
  useEffect(() => {
    const carregarDadosDoExercicio = async () => {
      if (!exercicioId) return;
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        let listaParaNavegacao: ExercicioDaLista[] = [];
        let tituloDaLista = 'Lista de Exercícios';

        const exercicioResponse = await axios.get<ExercicioDetalhado>(`${apiUrl}/exercicio/exercicios/${exercicioId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const exercicioAtual = exercicioResponse.data;
        setExercicio(exercicioAtual);
        
        if (location.state?.exerciciosDaLista) {
          listaParaNavegacao = location.state.exerciciosDaLista;
          tituloDaLista = location.state.listaTitulo;
        } else {
          const listaId = exercicioAtual.lista.id;
          if (listaId) {
            const listaResponse = await axios.get<{ exercicios: ExercicioDaLista[] }>(`${apiUrl}/exercicio/status-da-lista-exercicio/${listaId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            listaParaNavegacao = listaResponse.data.exercicios;
            tituloDaLista = exercicioAtual.lista.titulo;
          }
        }
        
        setExerciciosDaLista(listaParaNavegacao);
        setListaTitulo(tituloDaLista);
        const currentIndex = listaParaNavegacao.findIndex(ex => ex.id.toString() === exercicioId);
        setIndiceAtual(currentIndex > -1 ? currentIndex : 0);

      } catch (err) {
        setError('Não foi possível carregar os dados do exercício.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoExercicio();
  }, [exercicioId]);

  // --- FUNÇÕES DE AÇÃO ---
  const navegarParaExercicio = (novoIndice: number) => {
    if (exerciciosDaLista && exerciciosDaLista[novoIndice]) {
      const proximoId = exerciciosDaLista[novoIndice].id;
      navigate(`/exercicio/responder/${proximoId}`, { state: { exerciciosDaLista, listaTitulo } });
    }
  };
  
  const handleEnviarCodigo = async () => { /* ... sua função de envio ... */ };
  const handleCloseModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter(false);
  const lineCount = code.split('\n').length;
  
  // ---- RENDERIZAÇÃO ----
  if (loading) return <p className="text-center text-xl mt-20">Carregando exercício...</p>;
  if (error) return <p className="text-center text-xl mt-20 text-red-600">{error}</p>;
  if (!exercicio) return <p className="text-center text-xl mt-20">Exercício não encontrado.</p>;

  return (
    <div>
      <div>
        {/* ***** A CORREÇÃO ESTÁ AQUI ***** */}
        <div className='absolute top-[19px] left-[15px] text-[#0E7886] w-[135px] flex flex-col items-center'>
          {/* Trocamos a tag <a> por <button> */}
          <button onClick={() => navigate(-1)} className='flex flex-col items-center cursor-pointer'>
            <FaArrowLeft className='w-10 h-10' />
            <p>Retornar</p>
          </button>
        </div>

        <div className='absolute top-[115px] left-[61px]'>
          <div className='bg-[#FFFFFF] w-[1170px] h-[550px] flex shadow-md'>
            <div className='flex-grow p-5'>
              <div className='mb-5'>
                <h1 className='text-[#0E7886] text-2xl font-semibold mb-5'>
                  Exercício {exercicio.numeroDoExercicio} - {exercicio.titulo}
                </h1>
                <p className='w-[585px]'>{exercicio.descricao}</p>
              </div>
              <div className='space-y-5'>
                <div className='mb-5'>
                  <h1 className='text-[#0E7886] text-2xl font-semibold mb-5'>Precisa de Ajuda?</h1>
                  <p className='w-[600px]'>Consulte abaixo o conteúdo auxiliar preparado especialmente para você =]</p>
                </div>
                <div className='space-x-6'>
                  <button className='bg-[#0E7886] w-[170px] h-[41px] text-white' onClick={() => setShowDicas(true)}>Dicas</button>
                  <button className='bg-[#0E7886] w-[170px] h-[41px] text-white' onClick={() => setShowCodigoApoio(true)}>Código de Apoio</button>
                  <Link to='/material' className='inline-block bg-[#0E7886] w-[170px] h-[41px] text-white text-center leading-[41px]'>Material de Apoio</Link>
                </div>
              </div>
            </div>
            <div className='relative flex h-[550px]'>
              <div className='bg-gray-800 text-white p-4 text-right overflow-hidden'>
                {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                className='bg-black text-white w-[550px] p-4 font-mono resize-none overflow-y-auto'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Escreva seu código aqui...'
              />
              <div className='absolute bottom-0 right-0 flex bg-[#302D2D] text-white w-[560px] justify-end'>
                <button className='bg-[#0E7886] w-[150px] px-4 py-1'>Executar</button>
                <button className='bg-[#C8952FC7] w-[150px] px-4 py-1'>Salvar</button>
                <button onClick={handleEnviarCodigo} className='bg-[#0E862E] w-[150px] px-4 py-1'>Enviar</button>
              </div>
            </div>
          </div>
          <div className='mt-10 flex justify-center'>
            <div className='flex text-white shadow-md'>
              <button
                className={`w-[400px] h-[60px] flex items-center justify-center ${indiceAtual === 0 ? 'bg-gray-400' : 'bg-red-600'}`}
                onClick={() => navegarParaExercicio(indiceAtual - 1)}
                disabled={indiceAtual === 0}
              ><h2 className='flex items-center space-x-2'><FaAngleLeft /><span>Anterior</span></h2></button>
              <button
                className={`w-[400px] h-[60px] flex items-center justify-center ${!exerciciosDaLista || indiceAtual >= exerciciosDaLista.length - 1 ? 'bg-gray-400' : 'bg-green-600'}`}
                onClick={() => navegarParaExercicio(indiceAtual + 1)}
                disabled={!exerciciosDaLista || indiceAtual >= exerciciosDaLista.length - 1}
              ><h2 className='flex items-center space-x-2'><span>Próximo</span><FaAngleRight /></h2></button>
            </div>
          </div>
        </div>
      </div>
      <div className='ml-[1310px] bg-[#302D2DCC] w-[200px] h-[800px]'>
        <div className='text-white p-4'>
          <p>{listaTitulo}</p>
        </div>
        {exerciciosDaLista.map((item, index) => (
          <button
            key={item.id}
            className={`h-[115px] w-[200px] border-2 border-[#707070] relative ${index === indiceAtual ? 'bg-white text-black' : 'bg-[#302D2D] text-white'}`}
            onClick={() => navegarParaExercicio(index)}
          >
            {index === indiceAtual && <div className='absolute top-0 left-0 w-full bg-[#0E7886] text-white text-center py-1'>Atual</div>}
            <div className='p-2 pt-8'>
              <p className='text-gray-400 text-sm'>Exercício {item.numeroDoExercicio}</p>
              <h1 className='text-lg'>{item.titulo}</h1>
            </div>
          </button>
        ))}
      </div>
      
      {/* Seus modais aqui... */}
      {showDicas && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='relative w-[1000px] h-auto bg-white shadow-lg text-black'>
            <h1 className='text-2xl font-semibold bg-[#0E7886] text-white h-[51px] flex items-center p-5'>Dicas</h1>
            <p className='p-5'>Consulte aqui as dicas especialmente preparadas para auxiliar-lhe na resolução do exercício.</p>
            <div className='p-5 flex justify-around'>
              {/* Botões do modal de dicas */}
            </div>
            <div className="p-5">
              <p>O conteúdo detalhado das dicas para este exercício não está disponível no momento.</p>
              <p className="mt-2"><b>Sugestão:</b> Revise a descrição do problema e o material de apoio.</p>
            </div>
            <button onClick={handleCloseModal(setShowDicas)} className='absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full'><IoCloseSharp className='w-6 h-6' /></button>
          </div>
        </div>
      )}
      {showCodigoApoio && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='relative w-full max-w-4xl h-auto bg-white shadow-lg z-50 text-black'>
            <h1 className='text-xl bg-[#0E7886] text-white h-[51px] flex items-center p-5'>Código de Apoio</h1>
            <div className='p-5'>
              <p>O código de apoio para este exercício não está disponível no momento.</p>
            </div>
            <button onClick={handleCloseModal(setShowCodigoApoio)} className='absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full'><IoCloseSharp className='w-6 h-6' /></button>
          </div>
        </div>
      )}
    </div>
  );
}