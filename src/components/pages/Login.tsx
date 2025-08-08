import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa";
import { IoIosInfinite } from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";

import megaphone from '../../../public/img/megaphone.png';
import icon from '../../../public/img/icon.png';
const apiUrl = import.meta.env.VITE_API_URL;

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // 2. CORREÇÃO: Adicionar o tipo ao parâmetro 'e'.
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            setError('Email e senha são obrigatórios.');
            setShowModal(true);
            return;
        }

        const loginData = {
            email: email.trim(),
            password: password,
        };
        try {
            const response = await fetch(`${apiUrl}/Api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Resposta da API:', data);

                const token = data.access; 

                if (token) {
                    localStorage.setItem('token', token);
                    console.log('Token salvo:', localStorage.getItem('token'));
                    navigate('/');
                } else {
                    console.error('Token não encontrado na resposta:', data);
                    setError('Erro ao processar o login.');
                    setShowModal(true);
                }
            } else {
                setError('Login ou senha inválidos!');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setError('');
        setShowModal(false);
    };

    return (
        <div className="bg-[#0E7886] w-screen h-screen flex flex-col justify-center items-center relative">
            {error && showModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeModal}></div>
                    <div className="absolute top-[134px] left-1/2 transform -translate-x-1/2 w-[505px] h-auto bg-white p-8 shadow-lg z-50 text-center rounded-lg">
                        <button onClick={closeModal} className="absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full">
                            <IoCloseSharp className="w-7 h-7"/>
                        </button>

                        <img src={megaphone} alt='megaphone' className="h-[100px] mx-auto mb-4" />
                        <strong className="text-xl text-red-600 ">
                            {error}
                        </strong>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5">
                            <button onClick={() => navigate('/forgot-password')} className="text-lg bg-[#0E7886] hover:bg-cyan-800 w-full sm:w-[237px] h-[41px] text-white rounded">
                                <strong>Esqueci minha senha</strong>
                            </button>
                            <button onClick={() => navigate('/cadastro-de-aluno')} className="text-lg bg-[#0E7886] hover:bg-cyan-800 w-full sm:w-[237px] h-[41px] text-white rounded">
                                <strong>Realizar Cadastro</strong>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className="bg-white w-96 h-auto mb-5 shadow-lg p-5 rounded-lg">
                <div className="flex items-start">
                    <h2 className="w-80 mb-8 pt-8 text-[#0E7886] text-2xl opacity-80">Já tenho cadastro</h2>
                    <div className="flex flex-col items-center mr-0 mt-[-80px] ">
                        <img src={icon} alt="Icone" className="w-48 h-auto mt-[15px]"/>
                        <div className="text-2xl w-[120px] items-center  text-[#0E7886] font-bold">
                            <h1 className="flex mt-[-4px]">
                                L<IoIosInfinite className="align-middle w-[35px] h-auto" />P
                            </h1>
                            <h1 className="flex mt-[-10px]" >
                                Academic
                            </h1>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="text-center mt-5">
                    <div className="mb-4 flex items-center border border-gray-400 rounded">
                        <MdOutlineEmail className="text-gray-500 w-9 h-9 ml-2" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 h-10 text-lg p-2 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4 flex items-center border border-gray-400 rounded">
                        <RiLock2Line className="text-gray-500 w-9 h-9 ml-2" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex-1 h-10 text-lg p-2 focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-[190px] h-10 bg-[#0E7886] text-white rounded hover:bg-cyan-800">Login</button>
                </form>
                
                <div className="text-right mt-5">
                    <a href="#" className="text-[#0E7886] "><strong>Problema com login?</strong></a>
                </div>
            </div>

            <button onClick={() => navigate('/cadastro-de-aluno')} className="bg-white w-96 h-20 shadow-lg p-5 flex items-center justify-between rounded-lg">
                <h2 className="mb-8 pt-8 text-[#0E7886] text-2xl opacity-80">Criar minha conta</h2>
                <FaChevronRight className="text-[#0E7886] text-[25px]" />
            </button>
        </div>
    );
}