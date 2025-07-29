import React, { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPaperclip } from 'react-icons/fa';
import axios from 'axios'; // Importar axios

const apiUrl = import.meta.env.VITE_API_URL;

// Interface para os arquivos, para garantir tipagem
interface FileWithPreview extends File {
    preview: string;
}

export function EnviarDuvidas() {
    // --- ESTADOS EXISTENTES ---
    const [anexos, setAnexos] = useState<FileWithPreview[]>([]);
    const [isTematicaOpen, setIsTematicaOpen] = useState(false);
    const [selectedTematica, setSelectedTematica] = useState('');
    const [isIdentificacaoOpen, setIsIdentificacaoOpen] = useState(false);
    const [selectedIdentificacao, setSelectedIdentificacao] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    // --- ESTADO DE SUBMISSÃO MELHORADO ---
    const [submitStatus, setSubmitStatus] = useState({
        loading: false,
        error: '',
        success: ''
    });

    // --- LÓGICA DO COMPONENTE ---
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).map(file => Object.assign(file, {
                preview: URL.createObjectURL(file) // Adiciona um preview para imagens
            }));
            setAnexos((prev) => [...prev, ...files]);
        }
    };

    const handleTematicaClick = () => setIsTematicaOpen(!isTematicaOpen);
    const handleIdentificacaoClick = () => setIsIdentificacaoOpen(!isIdentificacaoOpen);

    const handleTematicaSelect = (tematica: string) => {
        setSelectedTematica(tematica);
        setIsTematicaOpen(false);
    };

    const handleIdentificacaoSelect = (identificacao: string) => {
        setSelectedIdentificacao(identificacao);
        setIsIdentificacaoOpen(false);
    };

    // --- FUNÇÃO DE SUBMISSÃO (handleSubmit) INTEGRADA COM API ---
    const handleSubmit = async () => {
        // Validação
        if (!titulo || !selectedTematica || !selectedIdentificacao || !descricao) {
            setSubmitStatus({ loading: false, error: 'Todos os campos devem ser preenchidos.', success: '' });
            return;
        }

        setSubmitStatus({ loading: true, error: '', success: '' });

        // 1. Construir o FormData
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('tematica', selectedTematica);
        // A API provavelmente espera um booleano, não uma string
        formData.append('anonimo', String(selectedIdentificacao === 'Anônimo'));
        formData.append('duvidaAluno', descricao);

        // Anexar todos os arquivos
        anexos.forEach((file) => {
            formData.append('anexos', file); // A chave 'anexos' deve ser o que sua API espera para múltiplos arquivos
        });

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token de autenticação não encontrado.');

            // 2. Fazer a requisição POST com FormData
            // **ATENÇÃO:** O endpoint pode precisar de ajuste (ex: `/duvidas/enviar/`)
            await axios.post(`${apiUrl}/duvidas/`, formData, {
                headers: {
                    // Ao usar FormData, NÃO defina 'Content-Type'. O navegador fará isso por você.
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // 3. Lidar com o sucesso
            setSubmitStatus({ loading: false, error: '', success: 'Sua dúvida foi enviada com sucesso!' });

            // Resetar formulário após um tempo para o usuário ver a mensagem
            setTimeout(() => {
                setTitulo('');
                setSelectedTematica('');
                setSelectedIdentificacao('');
                setDescricao('');
                setAnexos([]);
                setSubmitStatus({ loading: false, error: '', success: '' });
            }, 3000);

        } catch (err: any) {
            // 4. Lidar com erros
            let errorMessage = 'Falha ao enviar a dúvida. Tente novamente.';
            if (err.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça o login novamente.';
            } else if (err.message === 'Token de autenticação não encontrado.') {
                errorMessage = err.message;
            }
            setSubmitStatus({ loading: false, error: errorMessage, success: '' });
            console.error(err);
        }
    };

    const renderAnexos = () => {
        // ... (seu código renderAnexos está ótimo e não precisa de alteração)
        return anexos.map((file, index) => {
            if (file.type === 'application/pdf') {
                return (
                    <div key={index} className="flex items-center mt-2">
                        <img src="/img/pdf.png" alt="PDF" className="h-10 w-10 mr-2 cursor-pointer" onClick={() => window.open(file.preview)} />
                        <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                );
            } else if (file.type.startsWith('image/')) {
                return (
                    <div key={index} className="flex items-center mt-2">
                        <img src={file.preview} alt={file.name} className="h-10 w-10 mr-2 object-cover cursor-pointer" onClick={() => window.open(file.preview)} />
                        <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="flex items-center mt-2">
                         <FaPaperclip className="h-8 w-8 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-700">{file.name}</p>
                    </div>
                );
            }
        });
    };

    return (
        // --- SEU JSX (sem alterações) ---
        <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
            <h1 className='text-center text-3xl italic font-bold ml-[60px]'>DÚVIDAS</h1>

            <div className='flex pt-20'>
                <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
                    <FaArrowLeft className='w-10 h-auto' />
                    <p className='w-32 text-sm text-center'>Menu Principal</p>
                </a>
                <div className='flex ml-20'>
                    <a href='/Duvidas' className='w-96 h-8 text-black text-xl border-2 border-[#707070] flex justify-center items-center py-5'>
                        Dúvidas Enviadas e Respondidas
                    </a>
                    <a href='/Enviar-Duvidas' className='w-96 h-8 bg-[#0E7886] text-white text-xl border-2 border-[#707070] flex justify-center items-center py-5'>
                        Enviar Dúvidas
                    </a>
                </div>
            </div>

            <div className='w-[1000px] h-full mt-8 ml-40 bg-white border-2 border-[#707070] shadow-lg'>
                <div className='h-4 w-full bg-[#0E7886]'></div>
                <div className='m-4'>
                    <div className='flex text-[#707070]'>
                        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className='w-1/2 h-10 border-2 border-[#707070] p-2' />
                        <div className='w-1/4 ml-4'>
                            <button className='w-full h-10 border-2 border-[#707070] relative flex justify-between items-center px-2' onClick={handleTematicaClick}>
                                <span>{selectedTematica || 'Temática'}</span>
                                {isTematicaOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {isTematicaOpen && (
                                <ul className="bg-white border border-[#707070] text-black absolute w-[230px] z-10">
                                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleTematicaSelect('Linguagem C')}>Linguagem C</li>
                                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleTematicaSelect('Estrutura de Decisão')}>Estrutura de Decisão</li>
                                </ul>
                            )}
                        </div>
                        <div className='w-1/4 ml-4'>
                            <button className='w-full h-10 border-2 border-[#707070] relative flex justify-between items-center px-2' onClick={handleIdentificacaoClick}>
                                <span>{selectedIdentificacao || 'Identificação'}</span>
                                {isIdentificacaoOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {isIdentificacaoOpen && (
                                <ul className="bg-white border border-[#707070] text-black absolute w-[230px] z-10">
                                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleIdentificacaoSelect('Anônimo')}>Anônimo</li>
                                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleIdentificacaoSelect('Não Anônimo')}>Não Anônimo</li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className='mt-4'>
                        <textarea className='w-full h-96 text-black border-2 border-[#707070] p-2 font-mono resize-none' placeholder='Escreva aqui a sua dúvida.' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    </div>

                    <div className='mt-4'>{renderAnexos()}</div>

                    <div className='flex justify-end mt-4'>
                        <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" multiple />
                        <label htmlFor="fileInput" className='flex items-center cursor-pointer'>
                            <FaPaperclip className='w-10 h-10 pr-4 text-black' />
                        </label>
                        <button onClick={handleSubmit} disabled={submitStatus.loading} className='w-40 h-full p-1 bg-[#0E7886] text-white text-xl disabled:bg-gray-400'>
                            {submitStatus.loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>

                    {submitStatus.error && <p className="text-red-600 mt-2">{submitStatus.error}</p>}
                    {submitStatus.success && <p className="text-green-600 mt-2">{submitStatus.success}</p>}
                </div>
            </div>
        </div>
    );
}