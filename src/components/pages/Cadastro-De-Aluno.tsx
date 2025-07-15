import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
export function CadastroDeAluno() {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        nomeAluno: '',
        instituicao: '',
        matricula: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
    });

    const handleBack = () => {
        navigate(-1); // Volta para a página anterior
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCadastro = async () => {
        setErrorMessage(''); // Limpa mensagem de erro ao tentar cadastrar

        if (formData.email !== formData.confirmEmail) {
            setErrorMessage("Os emails não coincidem.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        const payload = {
            nomeAluno: formData.nomeAluno,
            instituicao: formData.instituicao,
            matricula: formData.matricula,
            email: formData.email,
            is_active: true,
            is_staff: false,
            password: formData.password,
        };

        try {
            const response = await fetch(`${apiUrl}/api/cadastrar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                const data = await response.json();
                console.error('Erro no cadastro:', data);
                setErrorMessage('Erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setErrorMessage('Erro ao realizar o cadastro.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className='bg-[#0E7886] w-[1520px] h-[500px] min-h-screen flex items-start justify-center py-36 relative'>
            <button onClick={handleBack} className='mr-5 mt-5'>
                <FaArrowLeft className='text-white text-2xl w-10 h-auto' />
            </button>
            <div className='bg-white px-5 py-6 shadow-lg w-[889px] h-auto'>
                <h1 className='text-[#0E7886] text-2xl mb-4'>Dados Cadastrais - Aluno</h1>

                <div className='flex flex-col'>
                    <div className='flex flex-col space-y-4'>
                        <input
                            type='text'
                            name='nomeAluno'
                            value={formData.nomeAluno}
                            onChange={handleInputChange}
                            placeholder='Nome Completo'
                            className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886]'
                        />
                        <div className='flex space-x-4'>
                            <input
                                type='text'
                                name='instituicao'
                                value={formData.instituicao}
                                onChange={handleInputChange}
                                placeholder='Instituição de ensino'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                            <input
                                type='text'
                                name='matricula'
                                value={formData.matricula}
                                onChange={handleInputChange}
                                placeholder='Matrícula'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                        </div>

                        <div className='flex space-x-4'>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Email'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                            <input
                                type='email'
                                name='confirmEmail'
                                value={formData.confirmEmail}
                                onChange={handleInputChange}
                                placeholder='Confirmar Email'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                        </div>

                        <div className='flex space-x-4'>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='Senha'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                            <input
                                type='password'
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder='Confirmar Senha'
                                className='p-2 border-b border-gray-300 outline-none focus:border-[#0E7886] w-full'
                            />
                        </div>

                        {/* Exibe a mensagem de erro se houver */}
                        {errorMessage && (
                            <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>
                        )}

                        <div className='flex justify-end pt-10'>
                            <button
                                onClick={handleCadastro}
                                className='bg-[#0E7886] text-white text-xl py-2 px-4 w-[190px] h-[41px]'
                            >
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>

                {showSuccessModal && (
                    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
                        <div className='bg-white p-6 w-[651px] h-[179px] shadow-lg text-center'>
                            <h2 className='text-2xl mb-10 text-green-600'>Cadastro realizado com sucesso!</h2>
                            <button
                                onClick={handleLoginRedirect}
                                className='bg-[#0E7886] text-white text-xl w-[190px] h-[41px]'
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
