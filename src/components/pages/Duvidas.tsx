import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// A interface agora reflete que 'duvidaAluno' e 'resposta' são opcionais no estado inicial
interface Duvida {
    id: number;
    titulo: string;
    data_criacao: string;
    status_resposta: 'RESPONDIDA' | 'AGUARDANDO RESPOSTA' | string;
    duvidaAluno?: string; // Tornou-se opcional para o estado inicial
    resposta?: string;
}

// Interface para a resposta do endpoint de detalhe
interface DuvidaDetalhe {
    duvidaAluno: string;
    respostaProfessor?: string;
}

export function Duvidas() {
    const [activeView, setActiveView] = useState<'lista' | 'formulario'>('lista');
    const [duvidas, setDuvidas] = useState<Duvida[]>([]);
    const [expandedState, setExpandedState] = useState<{ index: number; isLoading: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState({
        titulo: '',
        duvidaAluno: '',
        tematica: '',
        anonimo: false,
    });
    const [submitStatus, setSubmitStatus] = useState({
        loading: false,
        error: null as string | null,
        success: false,
    });

    const fetchDuvidas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado.');

            const response = await axios.get<Duvida[]>(`${apiUrl}/duvidas/ExibirDuvidas/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDuvidas(response.data.sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()));
        } catch (err) {
            setError('Erro ao carregar as dúvidas.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpand = async (index: number) => {
        if (expandedState?.index === index) {
            setExpandedState(null);
            return;
        }

        const duvidaSelecionada = duvidas[index];
        setExpandedState({ index, isLoading: true });

        try {
            // Se já tivermos os detalhes (duvidaAluno já existe), não busca de novo.
            if (duvidaSelecionada.duvidaAluno) {
                setExpandedState({ index, isLoading: false });
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado.');

            const response = await axios.get<DuvidaDetalhe>(`${apiUrl}/duvidas/duvida/${duvidaSelecionada.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Atualiza o item específico no array de dúvidas com os novos detalhes
            const updatedDuvidas = [...duvidas];
            updatedDuvidas[index].duvidaAluno = response.data.duvidaAluno;
            updatedDuvidas[index].resposta = response.data.respostaProfessor;
            setDuvidas(updatedDuvidas);

        } catch (err) {
            const updatedDuvidas = [...duvidas];
            updatedDuvidas[index].duvidaAluno = "Não foi possível carregar os detalhes da pergunta.";
            setDuvidas(updatedDuvidas);
            console.error("Erro ao buscar detalhe da dúvida:", err);
        } finally {
            setExpandedState({ index, isLoading: false });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus({ loading: true, error: null, success: false });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado.');

            const response = await axios.post<Duvida>(`${apiUrl}/duvidas/duvidas/`, formState, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setDuvidas(prev => [response.data, ...prev]);
            setSubmitStatus({ loading: false, error: null, success: true });

            setTimeout(() => {
                setFormState({ titulo: '', duvidaAluno: '', tematica: '', anonimo: false });
                setActiveView('lista');
                setSubmitStatus({ loading: false, error: null, success: false });
            }, 1500);

        } catch (err: any) {
            let errorMessage = 'Ocorreu um erro ao enviar a dúvida.';
            if (err.response?.status === 401) {
                errorMessage = 'Sua sessão expirou.';
            } else if (err.response?.status === 404) {
                errorMessage = 'Serviço de envio não encontrado.';
            }
            setSubmitStatus({ loading: false, error: errorMessage, success: false });
        }
    };

    useEffect(() => {
        if (activeView === 'lista') {
            fetchDuvidas();
        }
    }, [activeView]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    };

    return (
        <div className='mt-[0px] absolute top-[-10px] left-[-550px]'>
            <h1 className='text-center text-3xl italic font-bold ml-[60px]'>DÚVIDAS</h1>

            <div className='flex pt-20'>
                <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
                    <FaArrowLeft className='w-10 h-auto' />
                    <p className='w-32 text-sm text-center'>Menu Principal</p>
                </a>
                <div className='flex ml-20'>
                    <button onClick={() => setActiveView('lista')} className={`w-96 h-8 text-xl border-2 border-[#707070] flex justify-center items-center ${activeView === 'lista' ? 'bg-[#0E7886] text-white' : 'bg-white text-black'}`}>
                        Dúvidas Enviadas e Respondidas
                    </button>
                    <button onClick={() => setActiveView('formulario')} className={`w-96 h-8 text-xl border-2 border-[#707070] flex justify-center items-center ${activeView === 'formulario' ? 'bg-[#0E7886] text-white' : 'bg-white text-black'}`}>
                        Enviar Dúvidas
                    </button>
                </div>
            </div>

            <div className='w-[1000px] min-h-[500px] mt-8 ml-40 bg-white border-2 border-[#707070] shadow-lg'>
                <div className='h-4 w-full bg-[#0E7886]'></div>
                <div className='px-4 py-6 text-black'>

                    {activeView === 'lista' && (
                        <>
                            {isLoading && <p className="text-center py-10">Carregando...</p>}
                            {error && <p className="text-center py-10 text-red-500">{error}</p>}
                            {!isLoading && !error && duvidas.map((item, index) => {
                                const isAnswered = item.status_resposta === 'RESPONDIDA';
                                const isExpanded = expandedState?.index === index;

                                return (
                                    <button key={item.id} onClick={() => handleExpand(index)} className='border-black border-2 flex flex-col items-start rounded-3xl w-full text-left focus:outline-none mb-5'>
                                        <div className='flex items-end p-2'>
                                            <img src={isAnswered ? 'img/questao.png' : 'img/pergunta.png'} alt='ícone dúvida' className='w-16 ml-2' />
                                            <div className='flex items-end space-x-2 ml-2 mb-2'>
                                                <h1 className='w-[440px] font-semibold'>{item.titulo}</h1>
                                                <h1>Data:</h1>
                                                <p className='text-[#707070] w-24'>{new Date(item.data_criacao).toLocaleDateString('pt-BR')}</p>
                                                <h1>Status:</h1>
                                                <p className={isAnswered ? 'text-green-500 font-bold' : 'text-yellow-500 font-bold'}>{item.status_resposta}</p>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="w-full px-4 pb-2">
                                                {expandedState.isLoading ? (
                                                    <div className='my-2 ml-16 p-4'>Carregando detalhes...</div>
                                                ) : (
                                                    <>
                                                        <div className='my-2 ml-16 p-4 border border-[#707070] rounded-lg bg-gray-100 max-w-[800px]'>
                                                            <p className='text-sm font-bold mb-1'>Pergunta:</p>
                                                            {/* ----- CORREÇÃO APLICADA AQUI ----- */}
                                                            <p className='text-xs whitespace-pre-wrap'>{item.duvidaAluno}</p>
                                                        </div>
                                                        {isAnswered && item.resposta && (
                                                            <div className='my-2 ml-16 p-4 border border-[#707070] rounded-lg bg-gray-300 max-w-[800px]'>
                                                                <p className='text-sm font-bold mb-1'>Resposta:</p>
                                                                <p className='text-xs whitespace-pre-wrap'>{item.resposta}</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </>
                    )}

                    {activeView === 'formulario' && (
                        <div className="px-8 py-4">
                            {submitStatus.success ? (
                                <div className="text-center p-10 bg-green-100 text-green-800 rounded-lg">
                                    <h2 className="text-2xl font-bold">Dúvida enviada com sucesso!</h2>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-2xl font-bold text-center mb-6">Envie sua Dúvida</h2>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">Título</label>
                                        <input type="text" name="titulo" value={formState.titulo} onChange={handleInputChange} className="w-full p-2 border border-gray-400 rounded" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">Temática/Assunto</label>
                                        <input type="text" name="tematica" value={formState.tematica} onChange={handleInputChange} className="w-full p-2 border border-gray-400 rounded" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">Sua Pergunta</label>
                                        <textarea name="duvidaAluno" rows={5} value={formState.duvidaAluno} onChange={handleInputChange} className="w-full p-2 border border-gray-400 rounded" required />
                                    </div>
                                    <div className="mb-6 flex items-center">
                                        <input type="checkbox" name="anonimo" id="anonimo" checked={formState.anonimo} onChange={handleInputChange} className="h-4 w-4" />
                                        <label htmlFor="anonimo" className="ml-2">Enviar como anônimo</label>
                                    </div>
                                    {submitStatus.error && <p className="text-red-500 text-center mb-4 font-bold">{submitStatus.error}</p>}
                                    <div className="text-center">
                                        <button type="submit" disabled={submitStatus.loading} className="w-1/2 py-2 px-4 rounded text-white bg-[#0E7886] hover:bg-[#0b5f6a] disabled:bg-gray-400">
                                            {submitStatus.loading ? 'Enviando...' : 'Enviar Dúvida'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}