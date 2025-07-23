import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import megaphone from '../../../public/img/megaphone.png';
import confetti from '../../../public/img/confetti.png';
const apiUrl = import.meta.env.VITE_API_URL;

export function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNoCodeMessage, setShowNoCodeMessage] = useState(false);
  const [showInvalidCodeMessage, setShowInvalidCodeMessage] = useState(false);
  const [showValidCodeMessage, setShowValidCodeMessage] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ***** A ALTERAÇÃO ESTÁ AQUI *****
  useEffect(() => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('token');

    // 2. Se não houver token, redireciona para o login e para a execução
    if (!token) {
      navigate('/login');
      return; 
    }

    // 3. Se houver token, o resto da lógica continua normalmente
    const checkTurma = async () => { 
      try {
        const response = await fetch(`${apiUrl}/turma/verificar-turma/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Usa o token que já pegamos
          },
          // 'credentials' não é necessário ao enviar token via Authorization header
        });

        const result = await response.json();

        if (response.status === 401) { // Lida especificamente com token inválido/expirado
          navigate('/login');
          return;
        }

        if (response.ok) {
          // A lógica original foi ajustada para lidar com a ausência de turma
          // Se o detalhe for que o aluno não está em turma, mostra o modal de boas-vindas.
          if (result.detail && result.detail === 'O aluno não está associado a nenhuma turma.') {
            setShowWelcome(true);
          } else {
            // Se já estiver em uma turma, ou qualquer outra resposta OK, pode ficar na home.
            // O comportamento padrão aqui é não mostrar nenhum modal.
          }
        } else {
          // Erros que não são de autenticação
          setError('Erro ao verificar a turma.');
        }
      } catch (error) {
        console.error('Erro ao verificar a turma:', error);
        setError('Ocorreu um erro ao verificar a turma.');
      }
    };

    checkTurma();
  }, [navigate]);

  const handleCodeSubmit = async () => {
    // ... sua função handleCodeSubmit permanece a mesma ...
    if (!code.trim()) {
      setError('Código da turma é obrigatório.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/turma/vincular-codico/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ codicoTurma: code.trim() })
      });
    
      const result = await response.json();
    
      if (response.ok) {
        // Assume-se que um 200 OK significa sucesso.
        setShowValidCodeMessage(true);
        setTimeout(() => {
          window.location.reload(); // Recarrega a página para refletir o novo estado da turma
        }, 2000);
      } else {
        // Trata erros específicos retornados pela API
        setError(result.detail || result.error || 'Código da turma inválido ou erro inesperado.');
        setShowInvalidCodeMessage(true);
        setShowWelcome(false); // Esconde o modal de boas-vindas para mostrar o de erro
      }
    } catch (error) {
      console.error('Erro ao vincular o código:', error);
      setError('Ocorreu um erro ao tentar vincular o código. Por favor, tente novamente.');
      setShowInvalidCodeMessage(true);
      setShowWelcome(false);
    }
  };

  const handleNoCode = () => {
    setShowWelcome(false);
    setShowNoCodeMessage(true);
  };

  const handleTryAgain = () => {
    setShowInvalidCodeMessage(false);
    setShowWelcome(true);
    setError(''); // Limpa a mensagem de erro anterior
    setCode(''); // Limpa o campo do código
  };

  const handleValidCodeClose = () => {
    setShowValidCodeMessage(false);
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-3xl text-center italic">Menu Principal</h1>

      <div>
        {/* Seus modais permanecem os mesmos */}
        {showWelcome && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[1273px] h-[628px] bg-white shadow-lg z-50 text-black">
              <h1 className="text-xl bg-[#0E7886] text-[white] h-[51px] flex items-center justify-center">
                Boas Vindas!
              </h1>

              <div className="px-8">
                <p className="pt-8 text-left text-lg">
                  Olá, futuro(a) programador(a)<br />
                  <br />
                  É com enorme satisfação que desejamos-lhe nossas boas vindas ao Loop Academic! \o/<br />
                  <br />
                  Neste Software Educacional, você terá acesso à uma série de funcionalidades que lhe auxiliarão no aprendizado de Algoritmos, por exemplo: listas de exercícios de programação, material de apoio ao estudo de Algoritmos, envio de dúvidas ao professor ou monitor, fórum de interação com os colegas do curso e muito mais! o/<br />
                  <br />
                  Para ter acesso à todas as funcionalidades, é necessário que você informe abaixo o Código da Turma Virtual criada pelo seu professor. É com ele que você terá acesso aos materiais exclusivos da sua turma!<br />
                  <br />
                  Por favor, digite o seu Código da Turma Virtual.
                </p>

                <input
                  type="text"
                  value={code}
                  placeholder="Código da Turma Virtual"
                  onChange={(e) => setCode(e.target.value)}
                  className="border-b border-gray-400 outline-none mb-4 w-[560px] pt-12"
                />
                
                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="flex justify-end gap-4 mt-5">
                  <button onClick={handleNoCode} className="text-lg bg-[#9B1111EA] w-[190px] h-[41px] text-white">
                    <strong>Não tenho</strong>
                  </button>

                  <button onClick={handleCodeSubmit} className="text-lg bg-[#0E862E] w-[190px] h-[41px] text-white">
                    <strong>Enviar</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showNoCodeMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="absolute text-center left-1/2 transform -translate-x-1/2 w-[600px] h-auto p-8 bg-white shadow-lg z-50 text-black">
              <img src={megaphone} alt="megaphone" className="h-[100px] mx-auto mb-4" />
              <strong className="text-xl text-red-600">
                Atenção!
              </strong>

              <div className="px-8">
                <p className="pt-3 text-left text-lg">
                  Solicite o Código da Turma ao seu Professor. Sem ele você não poderá ter acesso às funcionalidades do sistema!
                </p>

                <div className="flex justify-center gap-4 mt-5">
                  <button onClick={() => navigate('/login')} className="text-lg bg-[#0E7886] w-[358px] h-[41px] text-white">
                    <strong>Retornar à tela de Login</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showInvalidCodeMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-auto p-8 bg-white shadow-lg z-50 text-black text-center">
              <img src={megaphone} alt="megaphone" className="h-[100px] mx-auto mb-4" />
              <strong className="text-xl text-red-600">
                Código da Turma Inválido!
              </strong>

              <div className="px-8">
                <p className="pt-3 text-left text-lg">
                  {error || 'Provavelmente, há algum erro com o seu Código de Turma. Por favor, digite-o novamente ou entre em contato com o seu professor.'}
                </p>

                <div className="flex justify-end gap-4 mt-5">
                  <button onClick={() => navigate('/login')} className="text-lg bg-[#0E7886] w-[190px] h-[41px] text-white">
                    <strong>Retornar à tela de Login</strong>
                  </button>

                  <button onClick={handleTryAgain} className="text-lg bg-[#9B1111EA] w-[190px] h-[41px] text-white">
                    <strong>Tentar Novamente</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showValidCodeMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-auto p-8 bg-white shadow-lg z-50 text-black text-center">
              <img src={confetti} alt="confetti" className="h-[100px] mx-auto mb-4" />
              <strong className="text-xl text-green-600">
                Código da Turma Vinculado com Sucesso!
              </strong>

              <div className="px-8">
                <p className="pt-3 text-left text-lg">
                  Parabéns! O código da turma foi vinculado com sucesso. Você será redirecionado.
                </p>

                <div className="flex justify-center gap-4 mt-5">
                  <button onClick={handleValidCodeClose} className="text-lg bg-[#0E7886] w-[358px] h-[41px] text-white">
                    <strong>Ir para o Menu Principal</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}