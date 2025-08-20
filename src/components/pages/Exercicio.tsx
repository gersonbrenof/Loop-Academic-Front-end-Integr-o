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
  dica?: string;
  codigo?: string;
}

interface ExercicioDaLista {
  id: number;
  titulo: string;
  numeroDoExercicio: number;
}

interface SubmissionResult {
  mensagem: string;
  resultado: 'Correto' | 'Incorreto' | string;
  pontuacao: number;
}

// ***** NOVA INTERFACE PARA OS DADOS DAS DICAS *****
interface DicasData {
    id: number;
    codigoApoio: string;
    discricaoDetalhada: {
        id: number;
        descricao: string;
    };
    sintaxe: {
        id: number;
        titulo: string;
        descricao: string;
    };
    problema: {
        id: number;
        numeroDica: number;
        conteudoDica: string;
        imagemExemplo: string | null; // Pode ser nulo
    };
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
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  
  // Estados para navegação
  const [exerciciosDaLista, setExerciciosDaLista] = useState<ExercicioDaLista[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [listaTitulo, setListaTitulo] = useState('Lista de Exercícios');

  // Estados dos modais
  const [showDicas, setShowDicas] = useState(false);
  const [showCodigoApoio, setShowCodigoApoio] = useState(false);
  
  // ***** NOVOS ESTADOS PARA O MODAL DE DICAS *****
  const [dicasData, setDicasData] = useState<DicasData | null>(null);
  const [dicasLoading, setDicasLoading] = useState(false);
  const [dicasError, setDicasError] = useState<string | null>(null);


  // --- LÓGICA DE BUSCA DE DADOS (ROBUSTA) ---
  useEffect(() => {
    // Reseta os estados ao carregar um novo exercício
    setSubmissionResult(null);
    setDicasData(null); // ***** NOVO: Reseta os dados das dicas *****

    const carregarDadosDoExercicio = async () => {
      // ... (sua lógica de busca de dados permanece a mesma)
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
  }, [exercicioId, location.state]); // Adicionado location.state como dependência

  // --- FUNÇÕES DE AÇÃO ---
  const navegarParaExercicio = (novoIndice: number) => {
    if (exerciciosDaLista && exerciciosDaLista[novoIndice]) {
      const proximoId = exerciciosDaLista[novoIndice].id;
      navigate(`/exercicio/responder/${proximoId}`, { state: { exerciciosDaLista, listaTitulo } });
    }
  };

  const handleEnviarCodigo = async () => {
    // ... (sua função de envio permanece a mesma)
    if (!code.trim()) {
      alert('Por favor, escreva seu código antes de enviar.');
      return;
    }
    setSubmissionResult(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }
      const url = `${apiUrl}/exercicio/exercicio/responder-exercicio/${exercicioId}/`;
      const response = await axios.post(
        url,
        { codigoDoExercicio: code },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const resultData: SubmissionResult = response.data;
      setSubmissionResult(resultData);
      if (resultData.resultado === 'Correto') {
        setTimeout(() => {
          if (indiceAtual < exerciciosDaLista.length - 1) {
            navegarParaExercicio(indiceAtual + 1);
          } else {
            alert('Parabéns! Você concluiu todos os exercícios da lista!');
            navigate('/listas');
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error('Erro ao enviar o exercício:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Ocorreu um erro ao enviar sua resposta.';
      setSubmissionResult({
          resultado: 'Incorreto',
          mensagem: errorMessage,
          pontuacao: 0
      });
    }
  };
  
  // ***** NOVA FUNÇÃO PARA CARREGAR E ABRIR O MODAL DE DICAS *****
  const handleAbrirDicas = async () => {
    setShowDicas(true); // Abre o modal imediatamente

    // Se os dados já foram carregados, não busca de novo
    if (dicasData) {
        return;
    }

    setDicasLoading(true);
    setDicasError(null);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DicasData>(`${apiUrl}/exercicio/dicas/${exercicioId}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setDicasData(response.data);
    } catch (err) {
        setDicasError('Não foi possível carregar as dicas para este exercício.');
        console.error("Erro ao buscar dicas:", err);
    } finally {
        setDicasLoading(false);
    }
  };

  const handleCloseModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter(false);
  const lineCount = code.split('\n').length;
  
  // ---- RENDERIZAÇÃO ----
  if (loading) return <p className="text-center text-xl mt-20">Carregando exercício...</p>;
  if (error) return <p className="text-center text-xl mt-20 text-red-600">{error}</p>;
  if (!exercicio) return <p className="text-center text-xl mt-20">Exercício não encontrado.</p>;

  return (
    <div>
      {/* ... seu cabeçalho e menu lateral ... */}
      <div>
        <div className='absolute top-[19px] left-[15px] text-[#0E7886] w-[135px] flex flex-col items-center'>
          <button onClick={() => navigate(-1)} className='flex flex-col items-center cursor-pointer'>
            <FaArrowLeft className='w-10 h-10' />
            <p>Retornar</p>
          </button>
        </div>

        <div className='absolute top-[115px] left-[61px]'>
          <div className='bg-[#FFFFFF] w-[1170px] h-[auto] min-h-[550px] flex shadow-md'>
            <div className='flex-grow p-5 max-w-[600px]'>
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
                  {/* ***** ALTERADO: onClick agora chama a nova função ***** */}
                  <button className='bg-[#0E7886] w-[170px] h-[41px] text-white' onClick={handleAbrirDicas}>Dicas</button>
                  <button className='bg-[#0E7886] w-[170px] h-[41px] text-white' onClick={() => setShowCodigoApoio(true)}>Código de Apoio</button>
                  <Link to='/material' className='inline-block bg-[#0E7886] w-[170px] h-[41px] text-white text-center leading-[41px]'>Material de Apoio</Link>
                </div>
              </div>
            </div>
            {/* ... o restante da sua UI para o editor de código e resultado da submissão ... */}
             <div className='relative flex flex-col h-full'>
                <div className="flex h-[550px]">
                    <div className='bg-gray-800 text-white p-4 text-right overflow-hidden'>
                        {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <textarea
                        className='bg-black text-white w-[550px] p-4 font-mono resize-none overflow-y-auto'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder='Escreva seu código aqui...'
                    />
                </div>
              
                {submissionResult && (
                    <div className={`w-[582px] p-4 text-white font-semibold ${submissionResult.resultado === 'Correto' ? 'bg-green-500' : 'bg-red-500'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg">Resultado: {submissionResult.resultado}</h3>
                            {submissionResult.resultado !== 'Correto' && (
                                <button onClick={() => setSubmissionResult(null)} className="font-bold text-xl">
                                    <IoCloseSharp />
                                </button>
                            )}
                        </div>
                        <p className="mt-1">{submissionResult.mensagem}</p>
                        <p>Pontuação Obtida: {submissionResult.pontuacao}</p>
                    </div>
                )}
              
                <div className='flex bg-[#302D2D] text-white w-[582px] justify-end'>
                    <button className='bg-[#0E7886] w-[150px] px-4 py-1'>Executar</button>
                    <button className='bg-[#C8952FC7] w-[150px] px-4 py-1'>Salvar</button>
                    <button onClick={handleEnviarCodigo} className='bg-[#0E862E] w-[150px] px-4 py-1'>Enviar</button>
                </div>
            </div>
          </div>
          {/* ... o restante da sua UI para navegação entre exercícios ... */}
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
      {/* ... sua lista lateral de exercícios ... */}
      <div className='ml-[1310px] bg-[#302D2DCC] w-[200px] h-full min-h-screen'>
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
      
      {/* ***** MODAL DE DICAS ATUALIZADO ***** */}
      {showDicas && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-4xl h-auto max-h-[90vh] bg-white shadow-lg text-black rounded-md'>
            <div className='sticky top-0 bg-[#0E7886] text-white h-[51px] flex items-center justify-between p-5 rounded-t-md'>
                <h1 className='text-2xl font-semibold'>Dicas & Dúvidas</h1>
                <button onClick={handleCloseModal(setShowDicas)} className='w-8 h-8 text-white flex items-center justify-center'><IoCloseSharp className='w-8 h-8' /></button>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 51px)' }}>
                {dicasLoading && <p className="text-center text-lg">Carregando dicas...</p>}
                {dicasError && <p className="text-center text-lg text-red-600">{dicasError}</p>}
                
                {dicasData && !dicasLoading && (
                    <div className="space-y-6">
                        {/* Seção de Descrição Detalhada */}
                        {dicasData.discricaoDetalhada?.descricao && (
                            <div>
                                <h2 className="text-xl font-bold text-[#0E7886] border-b-2 border-[#0E7886] pb-1 mb-2">Descrição Detalhada</h2>
                                <p>{dicasData.discricaoDetalhada.descricao}</p>
                            </div>
                        )}

                        {/* Seção de Sintaxe */}
                        {dicasData.sintaxe?.titulo && (
                             <div>
                                <h2 className="text-xl font-bold text-[#0E7886] border-b-2 border-[#0E7886] pb-1 mb-2">{dicasData.sintaxe.titulo}</h2>
                                <p className="whitespace-pre-wrap">{dicasData.sintaxe.descricao}</p>
                            </div>
                        )}

                        {/* Seção de Ajuda com o Problema */}
                        {dicasData.problema?.conteudoDica && (
                            <div>
                                <h2 className="text-xl font-bold text-[#0E7886] border-b-2 border-[#0E7886] pb-1 mb-2">Ajuda com o Problema (Dica #{dicasData.problema.numeroDica})</h2>
                                <p>{dicasData.problema.conteudoDica}</p>
                                {dicasData.problema.imagemExemplo && (
                                    <img src={dicasData.problema.imagemExemplo} alt="Exemplo visual" className="mt-3 border rounded shadow-md" />
                                )}
                            </div>
                        )}

                        {/* Seção de Código de Apoio da Dica */}
                        {dicasData.codigoApoio && (
                             <div>
                                <h2 className="text-xl font-bold text-[#0E7886] border-b-2 border-[#0E7886] pb-1 mb-2">Exemplo de Código</h2>
                                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                                    <code>{dicasData.codigoApoio}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Seu modal de Código de Apoio permanece o mesmo */}
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