import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const rapidApiHost = import.meta.env.VITE_RAPIDAPI_HOST;

interface ListaInfo { id: number; titulo: string; }
interface ExercicioDetalhado { id: number; titulo: string; descricao: string; numeroDoExercicio: number; lista: ListaInfo; }
interface ExercicioDaLista { id: number; titulo: string; numeroDoExercicio: number; }
interface SubmissionResult { mensagem: string; resultado: 'Correto' | 'Incorreto' | string; pontuacao: number; }
interface DicasData {
    id: number;
    codigoApoio: string;
    sintaxe: { id: number; titulo: string; descricao: string; };
    problema: { id: number; numeroDica: number; conteudoDica: string; imagemExemplo: string | null; };
    exercicio: { id: number; titulo: string; }
}

interface ExecutionOutput {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: { description: string };
}

export function Exercicio() {
  const { exercicioId } = useParams<{ exercicioId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [exercicio, setExercicio] = useState<ExercicioDetalhado | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [exerciciosDaLista, setExerciciosDaLista] = useState<ExercicioDaLista[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [listaTitulo, setListaTitulo] = useState('Lista de Exercícios');
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<ExecutionOutput | null>(null);
  
  const [showDicas, setShowDicas] = useState(false);
  const [dicasData, setDicasData] = useState<DicasData | null>(null);
  const [dicasLoading, setDicasLoading] = useState(false);
  const [dicasError, setDicasError] = useState<string | null>(null);
  const [activeDicaTab, setActiveDicaTab] = useState<'problema' | 'sintaxe' | 'codigo'>('problema');
  
  useEffect(() => {
    setDicasData(null); 
    setSubmissionResult(null);
    setExecutionOutput(null);

    const carregarDadosDoExercicio = async () => {
      if (!exercicioId) return;
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const exercicioResponse = await axios.get<ExercicioDetalhado>(`${apiUrl}/exercicio/exercicios/${exercicioId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const exercicioAtual = exercicioResponse.data;
        setExercicio(exercicioAtual);
        
        let listaParaNavegacao: ExercicioDaLista[] = location.state?.exerciciosDaLista;
        let tituloDaLista = location.state?.listaTitulo || 'Lista de Exercícios';

        if (!listaParaNavegacao && exercicioAtual.lista.id) {
            const listaResponse = await axios.get<{ exercicios: ExercicioDaLista[] }>(`${apiUrl}/exercicio/status-da-lista-exercicio/${exercicioAtual.lista.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            listaParaNavegacao = listaResponse.data.exercicios;
            tituloDaLista = exercicioAtual.lista.titulo;
        }
        
        setExerciciosDaLista(listaParaNavegacao || []);
        setListaTitulo(tituloDaLista);
        const currentIndex = (listaParaNavegacao || []).findIndex(ex => ex.id.toString() === exercicioId);
        setIndiceAtual(currentIndex > -1 ? currentIndex : 0);

      } catch (err) {
        setError('Não foi possível carregar os dados do exercício.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosDoExercicio();
  }, [exercicioId, location.state, navigate]);
  
  const navegarParaExercicio = (novoIndice: number) => {
    if (exerciciosDaLista && exerciciosDaLista[novoIndice]) {
      const proximoId = exerciciosDaLista[novoIndice].id;
      navigate(`/exercicio/responder/${proximoId}`, { state: { exerciciosDaLista, listaTitulo } });
    }
  };

  const handleEnviarCodigo = async () => {
    if (!code.trim()) { alert('Por favor, escreva seu código antes de enviar.'); return; }
    setSubmissionResult(null);
    setExecutionOutput(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const url = `${apiUrl}/exercicio/exercicio/responder-exercicio/${exercicioId}/`;
      const response = await axios.post(url, { codigoDoExercicio: code }, { headers: { 'Authorization': `Bearer ${token}` }});
      const resultData: SubmissionResult = response.data;
      setSubmissionResult(resultData);
      if (resultData.resultado === 'Correto') {
        setTimeout(() => {
          if (indiceAtual < exerciciosDaLista.length - 1) {
            navegarParaExercicio(indiceAtual + 1);
          } else {
            alert('Parabéns! Você concluiu todos os exercícios da lista!');
            navigate('/listas-de-exercicios');
          }
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Ocorreu um erro ao enviar sua resposta.';
      setSubmissionResult({ resultado: 'Incorreto', mensagem: errorMessage, pontuacao: 0 });
    }
  };

  const handleAbrirDicas = async () => {
    setShowDicas(true);
    setActiveDicaTab('problema');
    if (dicasData) return;

    setDicasLoading(true);
    setDicasError(null);
    try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        
        const response = await axios.get<DicasData[]>(`${apiUrl}/exercicio/dicas/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        const dicaCorreta = response.data.find(dica => dica.exercicio.id.toString() === exercicioId);
        if (dicaCorreta) {
            setDicasData(dicaCorreta);
        } else {
            throw new Error('Nenhuma dica foi encontrada para este exercício.');
        }
    } catch (err) {
        setDicasError('Não foi possível carregar as dicas.');
        console.error("Erro ao buscar dicas:", err);
    } finally {
        setDicasLoading(false);
    }
  };

  const handleAbrirCodigoApoio = () => {
    handleAbrirDicas();
    setActiveDicaTab('codigo');
  };

  const handleSalvarCodigo = () => {
    if (!code.trim()) {
      alert('Não há código para salvar.');
      return;
    }
    
    const sanitizedTitle = exercicio?.titulo.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'exercicio';
    const filename = `exercicio_${exercicio?.numeroDoExercicio}_${sanitizedTitle}.c`;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleExecutarCodigo = async () => {
    if (!rapidApiKey || !rapidApiHost) {
      alert('A chave da API de execução não está configurada. Verifique o arquivo .env e reinicie o servidor.');
      return;
    }
    if (!code.trim()) {
      alert('Não há código para executar.');
      return;
    }

    setIsExecuting(true);
    setExecutionOutput(null);
    setSubmissionResult(null);

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: 'false', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
      },
      data: {
        language_id: 52,
        source_code: code,
      }
    };

    try {
      const submissionResponse = await axios.request(options);
      const token = submissionResponse.data.token;

      let resultResponse;
      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`, {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost,
          }
        });
      } while (resultResponse.data.status.id <= 2);

      setExecutionOutput(resultResponse.data);

    } catch (err) {
      console.error(err);
      setExecutionOutput({
        status: { description: 'Erro de API' },
        stderr: 'Não foi possível se comunicar com o servidor de execução. Verifique sua conexão ou a chave de API.',
        stdout: null, compile_output: null, message: null,
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleCloseModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter(false);
  const lineCount = code.split('\n').length;
  
  if (loading) return <div className="text-center text-xl mt-20">Carregando exercício...</div>;
  if (error) return <div className="text-center text-xl mt-20 text-red-600">{error}</div>;
  if (!exercicio) return <div className="text-center text-xl mt-20">Exercício não encontrado.</div>;

  return (
    <div className="flex w-full">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-[#0E7886] font-semibold mb-6 hover:underline'>
                <FaArrowLeft />
                <span>Retornar</span>
            </button>
            
            <div className='bg-white shadow-xl rounded-lg flex flex-col lg:flex-row'>
                <div className='lg:w-1/2 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-200'>
                    <div>
                        <h1 className='text-[#0E7886] text-2xl font-bold mb-2'>Exercício {exercicio.numeroDoExercicio} - {exercicio.titulo}</h1>
                        <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{exercicio.descricao}</p>
                    </div>
                    <div className='space-y-4 pt-4 border-t border-gray-200'>
                        <h2 className='text-[#0E7886] text-xl font-bold'>Precisa de Ajuda?</h2>
                        <p className='text-gray-600'>Consulte o conteúdo auxiliar preparado especialmente para você.</p>
                        <div className='flex flex-wrap gap-4'>
                            <button className='bg-[#0E7886] hover:bg-[#0b5a66] text-white font-semibold py-2 px-4 rounded-md transition-colors' onClick={handleAbrirDicas}>Dicas</button>
                            <button className='bg-[#0E7886] hover:bg-[#0b5a66] text-white font-semibold py-2 px-4 rounded-md transition-colors' onClick={handleAbrirCodigoApoio}>Código de Apoio</button>
                            <Link to='/material-de-apoio' className='bg-[#0E7886] hover:bg-[#0b5a66] text-white font-semibold py-2 px-4 rounded-md transition-colors'>Material de Apoio</Link>
                        </div>
                    </div>
                </div>

                <div className='lg:w-1/2 flex flex-col'>
                    <div className="flex flex-grow min-h-[500px]">
                        <div className='bg-gray-800 text-gray-400 p-4 text-right select-none font-mono text-sm overflow-y-auto'>
                          {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                        <textarea 
                          className='bg-[#1E1E1E] text-white w-full p-4 font-mono resize-none focus:outline-none' 
                          value={code} 
                          onChange={(e) => setCode(e.target.value)} 
                          placeholder='Escreva seu código aqui...' 
                          spellCheck="false"
                        />
                    </div>
                    
                    {isExecuting && (
                      <div className="p-4 bg-gray-700 text-white flex items-center gap-4">
                        <FaSpinner className="animate-spin" />
                        <span>Compilando e executando...</span>
                      </div>
                    )}
                    {executionOutput && (
                      <div className={`p-4 ${executionOutput.stderr || executionOutput.compile_output ? 'bg-red-900' : 'bg-gray-900'} text-white`}>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-lg">Saída do Terminal: <span className="font-normal text-sm">({executionOutput.status.description})</span></h3>
                          <button onClick={() => setExecutionOutput(null)} className="text-xl hover:text-gray-300"><IoCloseSharp /></button>
                        </div>
                        <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-40">
                          <code>
                            {executionOutput.compile_output && `ERRO DE COMPILAÇÃO:\n${executionOutput.compile_output}`}
                            {executionOutput.stderr && `ERRO DE EXECUÇÃO:\n${executionOutput.stderr}`}
                            {executionOutput.stdout}
                            {!(executionOutput.compile_output || executionOutput.stderr || executionOutput.stdout) && (executionOutput.message || 'Execução concluída sem saída.')}
                          </code>
                        </pre>
                      </div>
                    )}
                    
                    {submissionResult && (
                      <div className={`p-4 text-white font-semibold ${submissionResult.resultado === 'Correto' ? 'bg-green-600' : 'bg-red-600'}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg">Resultado: {submissionResult.resultado}</h3>
                          {submissionResult.resultado !== 'Correto' && (<button onClick={() => setSubmissionResult(null)} className="font-bold text-xl"><IoCloseSharp /></button>)}
                        </div>
                        <p className="mt-1">{submissionResult.mensagem}</p>
                        <p>Pontuação Obtida: {submissionResult.pontuacao}</p>
                      </div>
                    )}

                    <div className='flex bg-[#302D2D] text-white justify-end p-2 rounded-b-lg'>
                        <button onClick={handleExecutarCodigo} disabled={isExecuting} className='bg-[#0E7886] hover:bg-[#0b5a66] font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                          {isExecuting && <FaSpinner className="animate-spin" />}
                          {isExecuting ? 'Executando' : 'Executar'}
                        </button>
                        <button onClick={handleSalvarCodigo} className='bg-[#C8952F] hover:bg-[#a17726] font-semibold py-2 px-4 rounded-md transition-colors ml-2'>Salvar</button>
                        <button onClick={handleEnviarCodigo} className='bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded-md transition-colors ml-2'>Enviar</button>
                    </div>
                </div>
            </div>

            <div className='mt-8 flex justify-between'>
                <button 
                  className='bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed' 
                  onClick={() => navegarParaExercicio(indiceAtual - 1)} 
                  disabled={indiceAtual === 0}
                >
                  <FaAngleLeft /><span>Anterior</span>
                </button>
                <button 
                  className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed' 
                  onClick={() => navegarParaExercicio(indiceAtual + 1)} 
                  disabled={!exerciciosDaLista || indiceAtual >= exerciciosDaLista.length - 1}
                >
                  <span>Próximo</span><FaAngleRight />
                </button>
            </div>
        </div>
      </div>
      <aside className='hidden xl:block bg-[#302D2DCC] w-64 h-screen sticky top-0 p-4'>
          <div className='text-white font-bold text-lg mb-4'>{listaTitulo}</div>
          <div className="space-y-2">
            {exerciciosDaLista.map((item, index) => (
              <button 
                key={item.id} 
                className={`w-full text-left p-3 rounded-md transition-colors relative ${index === indiceAtual ? 'bg-white text-black font-bold' : 'bg-[#3A3A3A] text-white hover:bg-[#4A4A4A]'}`} 
                onClick={() => navegarParaExercicio(index)}
              >
                {index === indiceAtual && <div className='absolute top-1 right-2 text-xs font-normal text-[#0E7886]'>Atual</div>}
                <p className='text-sm opacity-70'>Exercício {item.numeroDoExercicio}</p>
                <h2 className='text-md'>{item.titulo}</h2>
              </button>
            ))}
          </div>
      </aside>
      
      {showDicas && (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-4xl bg-white shadow-lg text-black rounded-lg overflow-hidden'>
            <div className='bg-[#0E7886] text-white p-3 flex items-center justify-between px-5 rounded-t-lg'>
                <h1 className='text-2xl font-bold'>Dicas</h1>
                <button onClick={handleCloseModal(setShowDicas)} className='text-white text-3xl hover:opacity-80'><IoCloseSharp /></button>
            </div>
            
            <div className="p-6">
                {dicasLoading && <div className="text-center text-lg py-20">Carregando dicas...</div>}
                {dicasError && <div className="text-center text-lg text-red-600 py-20">{dicasError}</div>}
                
                {dicasData && !dicasLoading && (
                    <>
                        <p className="mb-6 text-gray-600">Consulte aqui as dicas preparadas para auxiliar na resolução do exercício.</p>
                        <div className="flex border-b mb-6 text-center">
                            <button onClick={() => setActiveDicaTab('problema')} className={`flex-1 py-2 text-lg font-semibold transition-colors duration-200 ${activeDicaTab === 'problema' ? 'text-[#0E7886] border-b-4 border-[#0E7886]' : 'text-gray-500 hover:text-[#0E7886]'}`}>Simplificando o Problema</button>
                            <button onClick={() => setActiveDicaTab('sintaxe')} className={`flex-1 py-2 text-lg font-semibold transition-colors duration-200 ${activeDicaTab === 'sintaxe' ? 'text-[#0E7886] border-b-4 border-[#0E7886]' : 'text-gray-500 hover:text-[#0E7886]'}`}>Entendendo a Sintaxe</button>
                            <button onClick={() => setActiveDicaTab('codigo')} className={`flex-1 py-2 text-lg font-semibold transition-colors duration-200 ${activeDicaTab === 'codigo' ? 'text-[#0E7886] border-b-4 border-[#0E7886]' : 'text-gray-500 hover:text-[#0E7886]'}`}>Código de Apoio</button>
                        </div>

                        <div className="min-h-[250px] overflow-y-auto max-h-[50vh] p-1">
                            {activeDicaTab === 'problema' && dicasData.problema && ( <div className="space-y-3 animate-fade-in"><h2 className="text-xl font-bold text-[#0E7886]">Dica #{dicasData.problema.numeroDica}</h2><p className="whitespace-pre-wrap">{dicasData.problema.conteudoDica}</p>{dicasData.problema.imagemExemplo && (<img src={dicasData.problema.imagemExemplo} alt="Exemplo visual" className="mt-3 border rounded shadow-md max-w-full" />)}</div>)}
                            {activeDicaTab === 'sintaxe' && dicasData.sintaxe && ( <div className="space-y-3 animate-fade-in"><h2 className="text-xl font-bold text-[#0E7886]">{dicasData.sintaxe.titulo}</h2><p className="whitespace-pre-wrap">{dicasData.sintaxe.descricao}</p></div>)}
                            {activeDicaTab === 'codigo' && dicasData.codigoApoio && ( <div className="animate-fade-in"><h2 className="text-xl font-bold text-[#0E7886] mb-3">Exemplo de Código</h2><pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto"><code>{dicasData.codigoApoio}</code></pre></div>)}
                        </div>
                    </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}