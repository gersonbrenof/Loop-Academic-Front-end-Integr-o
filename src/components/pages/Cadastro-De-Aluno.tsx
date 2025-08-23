import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react'; // Adicionado FormEvent

// Usando a variável de ambiente para a URL da API, como no seu código bom
const apiUrl = import.meta.env.VITE_API_URL;

export function CadastroDeAluno() {
    const navigate = useNavigate();
    
    // Mantendo toda a sua lógica de estado robusta
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Bônus: Estado de loading para o botão
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

    // Handler de input genérico e tipado
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Lógica de cadastro completa, com tratamento de erros e loading
    const handleCadastro = async (e: FormEvent) => {
        e.preventDefault(); // Previne o recarregamento da página
        setErrorMessage('');
        setIsLoading(true);

        if (formData.email !== formData.confirmEmail) {
            setErrorMessage("Os emails não coincidem.");
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        // Payload com os nomes corretos que a API espera
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                const data = await response.json();
                console.error('Erro no cadastro:', data);
                // Extrai a primeira mensagem de erro da resposta da API
                const errorMsg = Object.values(data).flat().join(' ');
                setErrorMessage(errorMsg || 'Erro ao realizar o cadastro. Verifique os dados.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setErrorMessage('Não foi possível se comunicar com o servidor. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        // ESTRUTURA RESPONSIVA: w-full e min-h-screen garantem que o fundo cubra a tela toda
        <div className='bg-[#0E7886] w-full min-h-screen flex items-center justify-center p-4 sm:p-8 relative'>
            {/* Botão de voltar com posicionamento absoluto para não interferir no layout */}
            <button onClick={handleBack} className='absolute top-6 left-6 text-white hover:opacity-80 transition-opacity'>
                <FaArrowLeft className='w-8 h-auto' />
            </button>
            
            {/* CARD RESPONSIVO: w-full e max-w-4xl fazem o card se adaptar a qualquer tela */}
            <div className='bg-white px-6 sm:px-10 py-8 shadow-2xl rounded-lg w-full max-w-4xl h-auto'>
                <h1 className='text-[#0E7886] text-3xl font-bold mb-8'>Dados Cadastrais - Aluno</h1>

                {/* Usando <form> para uma melhor semântica e acessibilidade */}
                <form onSubmit={handleCadastro} className='flex flex-col'>
                    <div className='flex flex-col space-y-6'>
                        <input
                            type='text'
                            name='nomeAluno' // CORREÇÃO: 'name' corresponde ao estado
                            value={formData.nomeAluno}
                            onChange={handleInputChange}
                            placeholder='Nome Completo'
                            className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] transition-colors'
                            required
                        />
                        <div className='flex flex-col md:flex-row gap-6'>
                            <input
                                type='text'
                                name='instituicao'
                                value={formData.instituicao}
                                onChange={handleInputChange}
                                placeholder='Instituição de ensino'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                            <input
                                type='text'
                                name='matricula'
                                value={formData.matricula}
                                onChange={handleInputChange}
                                placeholder='Matrícula'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                        </div>
                        <div className='flex flex-col md:flex-row gap-6'>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Email'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                            <input
                                type='email'
                                name='confirmEmail' // CORREÇÃO: 'name' corresponde ao estado
                                value={formData.confirmEmail}
                                onChange={handleInputChange}
                                placeholder='Confirmar Email'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                        </div>
                        <div className='flex flex-col md:flex-row gap-6'>
                            <input
                                type='password'
                                name='password' // CORREÇÃO: 'name' corresponde ao estado
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='Senha'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                            <input
                                type='password'
                                name='confirmPassword' // CORREÇÃO: 'name' corresponde ao estado
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder='Confirmar Senha'
                                className='p-3 border-b-2 border-gray-300 outline-none focus:border-[#0E7886] w-full transition-colors'
                                required
                            />
                        </div>

                        {/* Exibição da mensagem de erro de forma clara */}
                        {errorMessage && (
                            <p className='text-red-600 text-center font-semibold mt-2'>{errorMessage}</p>
                        )}

                        <div className='flex justify-end pt-10'>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className='bg-[#0E7886] text-white text-xl font-bold py-2 px-4 w-[190px] h-[45px] rounded-md hover:bg-[#0b5a66] transition-all duration-300 disabled:bg-gray-400'
                            >
                                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Modal de sucesso com posicionamento 'fixed' para cobrir a tela inteira */}
            {showSuccessModal && (
                <div className='fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50'>
                    <div className='bg-white p-8 w-full max-w-lg shadow-lg text-center flex flex-col justify-center items-center rounded-lg'>
                        <h2 className='text-3xl mb-8 font-bold text-green-600'>Cadastro realizado com sucesso!</h2>
                        <button
                            onClick={handleLoginRedirect}
                            className='bg-[#0E7886] text-white text-xl font-bold w-[190px] h-[45px] rounded-md hover:bg-[#0b5a66] transition-all'
                        >
                            Ir para Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}