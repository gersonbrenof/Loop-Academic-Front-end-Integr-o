import React, { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPaperclip } from 'react-icons/fa';

export function EnviarDuvidas() {
    const [anexos, setAnexos] = useState([]);
    const [isTematicaOpen, setIsTematicaOpen] = useState(false);
    const [selectedTematica, setSelectedTematica] = useState('');
    const [isIdentificacaoOpen, setIsIdentificacaoOpen] = useState(false);
    const [selectedIdentificacao, setSelectedIdentificacao] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAnexos((prev) => [...prev, ...files]);
    };

    const handleTematicaClick = () => {
        setIsTematicaOpen(!isTematicaOpen);
    };

    const handleTematicaSelect = (tematica) => {
        setSelectedTematica(tematica);
        setIsTematicaOpen(false);
    };

    const handleIdentificacaoClick = () => {
        setIsIdentificacaoOpen(!isIdentificacaoOpen);
    };

    const handleIdentificacaoSelect = (identificacao) => {
        setSelectedIdentificacao(identificacao);
        setIsIdentificacaoOpen(false);
    };

    const handleSubmit = () => {
        if (!titulo || !selectedTematica || !selectedIdentificacao || !descricao) {
            setError('Todos os campos devem ser preenchidos.');
            setSuccessMessage(''); // Limpar a mensagem de sucesso se houver um erro
            return;
        }

        // Simulação de envio bem-sucedido (substitua isso com sua lógica real de envio)
        console.log('Enviando dúvida:', {
            titulo,
            tematica: selectedTematica,
            identificacao: selectedIdentificacao,
            descricao,
            anexos
        });

        // Atualizar o estado com a mensagem de sucesso
        setSuccessMessage('Sua dúvida foi enviada com sucesso.');
        setError('');

        // Resetar formulário após o envio
        setTitulo('');
        setSelectedTematica('');
        setSelectedIdentificacao('');
        setDescricao('');
        setAnexos([]);
    };

    const renderAnexos = () => {
        return anexos.map((file, index) => {
            if (file.type === 'application/pdf') {
                return (
                    <div key={index} className="flex items-center mt-2">
                        <img 
                            src="img/pdf.png" 
                            alt="PDF"
                            className="h-10 w-10 mr-2 cursor-pointer"
                            onClick={() => window.open(URL.createObjectURL(file))}
                        />
                        <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                );
            } else if (file.type.startsWith('image/')) {
                return (
                    <div key={index} className="flex items-center mt-2">
                        <img 
                            src={URL.createObjectURL(file)} 
                            alt={file.name}
                            className="h-10 w-10 mr-2 cursor-pointer"
                            onClick={() => window.open(URL.createObjectURL(file))}
                        />
                        <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="mt-2">
                        <p className="text-sm text-gray-700">{file.name}</p>
                    </div>
                );
            }
        });
    };

    return (
        <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-20'>
            <h1 className='text-center text-3xl italic font-bold ml-[60px]'>DÚVIDAS</h1>

            <div className='flex pt-20'>
                <a href='/' className='flex flex-col items-center py-1 h-full ml-9'>
                    <FaArrowLeft className='w-10 h-auto' />
                    <p className='w-32 text-sm text-center'>Menu Principal</p>
                </a>

                <div className='flex ml-20'>
                    <a 
                        href='/Duvidas' 
                        className='w-96 h-8 text-black text-xl border-2 border-[#707070] flex justify-center items-center py-5'>
                        Dúvidas Enviadas e Respondidas
                    </a>
                    <a 
                        href='/Enviar-Duvidas' 
                        className='w-96 h-8 bg-[#0E7886] text-white text-xl border-2 border-[#707070] flex justify-center items-center py-5'>
                        Enviar Dúvidas
                    </a>
                </div>
            </div>

            <div className='w-[1000px] h-full mt-8 ml-40 bg-white border-2 border-[#707070] shadow-lg'>
                <div className='h-4 w-full bg-[#0E7886]'></div>
                <div className='m-4'>
                    <div className='flex text-[#707070]'>
                        <input 
                            type="text"
                            placeholder="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className='w-1/2 h-10 border-2 border-[#707070] p-2'
                         />
                        <div className='w-1/4 ml-4'>
                            <button 
                                className='w-full h-10 border-2 border-[#707070] relative flex justify-between items-center px-2'
                                onClick={handleTematicaClick}
                            >
                                <span className="text-left">
                                    {selectedTematica || 'Temática'}
                                </span>
                                <div className="text-right">
                                    {isTematicaOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </button>

                        {isTematicaOpen && (
                            <ul className="bg-white border border-[#707070] text-black">
                                <li 
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleTematicaSelect('Linguagem C')}
                                >
                                    Linguagem C
                                </li>
                                <li 
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleTematicaSelect('Estrutura de Decisão')}
                                >
                                    Estrutura de Decisão
                                </li>
                            </ul>
                        )}
                        </div>
                        
                        <div className='w-1/4 ml-4'>
                            <button 
                                className='w-full h-10 border-2 border-[#707070] relative flex justify-between items-center px-2'
                                onClick={handleIdentificacaoClick}
                            >
                                <span className="text-left">
                                    {selectedIdentificacao || 'Identificação'}
                                </span>
                                <div className="text-right">
                                    {isIdentificacaoOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </button>

                        {isIdentificacaoOpen && (
                            <ul className="bg-white border border-[#707070] text-black">
                                <li 
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleIdentificacaoSelect('Anônimo')}
                                >
                                    Anônimo
                                </li>
                                <li 
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleIdentificacaoSelect('Não Anônimo')}
                                >
                                    Não Anônimo
                                </li>
                            </ul>
                        )}
                        </div>
                    </div>

                    <div className='mt-4'>
                         <textarea
                            className='w-full h-96 text-black border-2 border-[#707070] p-2 font-mono resize-none overflow-y-auto'
                            placeholder='Escreva aqui a sua dúvida.'
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className='mt-4'>
                        {renderAnexos()}
                    </div>

                    <div className='flex justify-end mt-4'>
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="hidden" 
                            id="fileInput"
                            multiple
                        />
                        <label htmlFor="fileInput" className='flex items-center'>
                            <FaPaperclip 
                                className='w-10 h-10 pr-4 cursor-pointer text-black'
                            />
                        </label>
                        <button 
                            onClick={handleSubmit}
                            className='w-40 h-full p-1 bg-[#0E7886] text-white text-xl'>
                            Enviar
                        </button>
                    </div>

                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
}
