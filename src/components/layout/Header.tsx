import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaGear, FaBell } from 'react-icons/fa6';
import { IoExitSharp, IoCloseSharp } from 'react-icons/io5';
import axios from 'axios';

import danger from '../../../public/img/danger.png';
import notificationItems from '../data/NotificationItens';
import UsuarioItens from '../data/UsuarioItens'; // Corrija o caminho conforme necessário

import { Home } from '../pages/Home';
import { Usuario } from '../pages/Usuario';
import { ListasDeExercicios } from '../pages/Listas-De-Exercicios';
import { MaterialDeApoio } from '../pages/Material-De-Apoio';
import { Desempenho } from '../pages/Desempenho';
import { Duvidas } from '../pages/Duvidas';
import { EnviarDuvidas } from '../pages/Enviar-Duvidas';
import { Forum } from '../pages/Forum';
import { CriarTopico } from '../pages/Criar-Topico';
import { Topico01 } from '../pages/Topico01';
import { Emblemas } from '../pages/Emblemas';
import { TodosOsEmblemas } from '../pages/Todos-os-Emblemas';
import { ListasDeExercicios01 } from '../pages/Listas-De-Exercicios-01';
import { ListasDeExercicios02 } from '../pages/Listas-De-Exercicios-02';
import { MaterialDeApoio02 } from '../pages/Material-De-Apoio-02';
const apiUrl = import.meta.env.VITE_API_URL;
export function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/Perfil-aluno/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Assumindo que há apenas um item no array
        setUserInfo(data[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleExitClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleConfirmExit = async () => {  `${apiUrl}/Logout/'`
    try {
      const response = await fetch(`${apiUrl}/Logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Inclui o token de autenticação
        },
      });
  
      if (response.ok) {
        // Se o logout for bem-sucedido, remove o token e redireciona para a página de login
        localStorage.removeItem('token');
        window.location.href = '/Login';
      } else {
        console.error('Falha ao realizar logout');
      }
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(prevState => !prevState);
  };

  const handleNotificationClick = (link) => {
    navigate(link);
    setShowNotifications(false);
  };

  const notificationCount = notificationItems.length;

  return (
    <div className='bg-[#0E7886] w-[1510px] shadow-lg'>
      <div className='flex justify-end text-base'>
        <a href='#' className='text-white p-1'>
          Configurações <FaGear className='inline'/>
        </a>
        <a href='#' onClick={handleExitClick} className='text-white p-1'>
          Sair <IoExitSharp className='inline'/>
        </a>
      </div>

      <div className='flex items-center justify-between bg-white p-2 h-[80px]'>
        <div className='flex items-center'>
          {userInfo && (
            <>
              <a href='/Perfil'>
                <img src={userInfo.fotoPerfil || 'path/to/default/avatar.png'} alt='User' className='bg-white w-[130px] h-[130px] rounded-full shadow-lg mr-2' />
              </a>
              <div className='ml-1 w-84'>
                <h3 className='text-lg font-bold'>
                  {userInfo.nome_do_aluno}
                </h3>
                <p className='text-sm'><strong>Matrícula:</strong> {userInfo.matricula_aluno}</p>
                <p className='text-sm'><strong>Turma:</strong> {userInfo.turma_aluno}</p>
              </div>
            </>
          )}
        </div>

        <div className='text-[#0E7886] font-semibold -ml-40 relative'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Usuario' element={<Usuario />} />
            <Route path='/Lista-de-Exercicios' element={<ListasDeExercicios />} />
            <Route path='/Material-de-Apoio' element={<MaterialDeApoio />} />
            <Route path='/Desempenho' element={<Desempenho />} />
            <Route path='/Duvidas' element={<Duvidas />} />
            <Route path='/Enviar-Duvidas' element={<EnviarDuvidas />} />
            <Route path='/Forum' element={<Forum />} />
            <Route path='/Criar-Topico' element={<CriarTopico />} />
            <Route path='/Topico01' element={<Topico01 />} />
            <Route path='/Emblemas' element={<Emblemas />} />
            <Route path='/Todos-os-Emblemas' element={<TodosOsEmblemas />} />
            <Route path="/Listas-De-Exercicios-01/:id" element={<ListasDeExercicios01 />} />
            <Route path='/Listas-De-Exercicios-02' element={<ListasDeExercicios02 />} />
            <Route path='/Material-De-Apoio-02' element={<MaterialDeApoio02 />} />
          </Routes>
        </div>

        <div className='relative'>
          <a href='#' onClick={toggleNotifications} className='flex items-center text-[#0E7886] text-center'>
            <div className='flex flex-col items-center'>
              <div className='relative'>
                <FaBell className='text-yellow-500 w-6 h-auto' />
                <div className='absolute top-[-7px] right-[-5px] bg-[#C84C4C] border border-[#C84C4C] rounded text-white w-5 h-5 text-xs flex justify-center items-center font-bold'>
                  {notificationCount}
                </div>
              </div>
              <p className='text-base'><strong>Notificações</strong></p>
            </div>
          </a>

          {showNotifications && (
            <div className='absolute right-[-8px] w-[280px] mt-4 bg-white shadow-lg overflow-hidden z-50'>
              <ul className='px-2 text-sm'>
                {notificationItems.map((item, index) => (
                  <li key={index} className='flex p-4 border-b cursor-pointer' onClick={() => handleNotificationClick(item.link)}>
                    <img src={item.imgSrc} alt={item.message} className='w-14 h-12 pr-5' />
                    <p className='w-40'>{item.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='absolute top-[134px] w-[560px] h-72 bg-white shadow-lg z-50 text-center'>
            <button onClick={handleCloseModal} className='absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center'>
              <IoCloseSharp className='w-8 h-8'/>
            </button>
            <h1 className='text-xl bg-[#0E7886] text-[white] h-[51px] flex items-center justify-center'>
              Aviso
            </h1>
            <img src={danger} alt='megaphone' className='h-[80px] mx-auto mb-4' />
            <h2 className='text-xl text-red-600'>
              <strong>Deseja mesmo sair do Loop Academic?</strong>
            </h2>
            <p className='px-5'>Não quer ficar e estudar mais um pouco? Nós iremos sentir a sua falta =[</p>
            <div className='pt-4 flex justify-end pr-5'>
              <button onClick={handleConfirmExit} className='bg-[#9B1111EA] text-white w-[167px] px-4 py-2 rounded mr-2'>
                Sair
              </button>
              <button onClick={handleCloseModal} className='bg-[#0E862E] text-white w-[167px] px-4 py-2 rounded'>
                Permanecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
