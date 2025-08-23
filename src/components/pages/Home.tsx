import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Assets ---
import megaphone from '../../../public/img/megaphone.png';
import confetti from '../../../public/img/confetti.png';

const apiUrl = import.meta.env.VITE_API_URL;

// MELHORIA 1: Componente de Modal genérico para um código mais limpo e reutilizável
const Modal = ({ children }: { children: React.ReactNode }) => (
  // O padding 'p-4' garante que o modal nunca toque as bordas da tela em mobile
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
    {children}
  </div>
);

export function Home() {
  // --- LÓGICA DE ESTADO (INTOCADA E FUNCIONAL) ---
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNoCodeMessage, setShowNoCodeMessage] = useState(false);
  const [showInvalidCodeMessage, setShowInvalidCodeMessage] = useState(false);
  const [showValidCodeMessage, setShowValidCodeMessage] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // MELHORIA: Feedback de loading para o usuário
  const navigate = useNavigate();

  // --- LÓGICA DE VERIFICAÇÃO DE TURMA (INTOCADA E FUNCIONAL) ---
  useEffect(() => {
    const checkTurma = async () => { 
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return; 
      }
      try {
        const response = await fetch(`${apiUrl}/turma/verificar-turma/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();

        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (response.ok && result.detail === 'O aluno não está associado a nenhuma turma.') {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Erro ao verificar a turma:', error);
        setError('Ocorreu um erro ao verificar a turma.'); // Você pode querer mostrar isso em um toast/notificação
      }
    };
    checkTurma();
  }, [navigate]);

  // --- LÓGICA DE ENVIO DE CÓDIGO (INTOCADA, COM MELHORIAS DE UX) ---
  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previne recarregamento da página em formulários
    if (!code.trim()) {
      setError('Por favor, insira o código da turma.');
      return;
    }
    setIsLoading(true);
    setError('');

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
        setShowWelcome(false);
        setShowValidCodeMessage(true);
        setTimeout(() => { window.location.reload(); }, 2500); // Aumentei um pouco o tempo para o usuário ler
      } else {
        setError(result.detail || 'Código da turma inválido.');
        setShowWelcome(false);
        setShowInvalidCodeMessage(true);
      }
    } catch (error) {
      console.error('Erro ao vincular o código:', error);
      setError('Erro de comunicação. Por favor, tente novamente.');
      setShowWelcome(false);
      setShowInvalidCodeMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS DA UI (INTOCADOS) ---
  const handleNoCode = () => { setShowWelcome(false); setShowNoCodeMessage(true); };
  const handleTryAgain = () => { setShowInvalidCodeMessage(false); setShowWelcome(true); setError(''); setCode(''); };
  const handleValidCodeClose = () => { window.location.reload(); };

  // Se nenhum modal deve ser exibido, o componente não renderiza nada,
  // deixando o resto do layout (Menu, etc.) funcionar normalmente.
  if (!showWelcome && !showNoCodeMessage && !showInvalidCodeMessage && !showValidCodeMessage) {
    return null;
  }

  return (
    <div>
      {/* ======================================================= */}
      {/*      FRONT-END DOS MODAIS TOTALMENTE RECONSTRUÍDO       */}
      {/* ======================================================= */}
      
      {showWelcome && (
        <Modal>
          {/* MELHORIA 2: Layout Responsivo com `max-w-` */}
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden">
            <h1 className="text-2xl font-bold bg-[#0E7886] text-white p-4 text-center">
              Boas-vindas ao Loop Academic!
            </h1>
            {/* Permite scroll em telas pequenas se o conteúdo for grande */}
            <div className="p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed max-h-[80vh] overflow-y-auto">
              <p>Olá, futuro(a) programador(a)! \o/</p>
              <p>Estamos muito felizes em ter você aqui. No Loop Academic, você terá acesso a listas de exercícios, materiais de apoio, fórum de dúvidas e muito mais para impulsionar seu aprendizado em Algoritmos.</p>
              <p className="font-semibold text-lg text-gray-800">Para começar, por favor, insira abaixo o Código da Turma Virtual fornecido pelo seu professor.</p>
              
              <form onSubmit={handleCodeSubmit} className="pt-4">
                <input
                  type="text"
                  value={code}
                  placeholder="Digite o Código da Turma aqui"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  className="p-3 border-2 border-gray-300 rounded-md w-full focus:border-[#0E7886] focus:ring-1 focus:ring-[#0E7886] transition"
                />
                {error && <p className="text-red-600 mt-2 text-center font-semibold">{error}</p>}
                {/* MELHORIA 3: Botões responsivos */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button type="button" onClick={handleNoCode} className="text-lg font-bold bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-md transition-colors">
                    Não tenho o código
                  </button>
                  <button type="submit" disabled={isLoading} className="text-lg font-bold bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? 'Verificando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {showNoCodeMessage && (
        <Modal>
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl text-center p-8">
            <img src={megaphone} alt="Atenção" className="h-24 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Atenção!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Solicite o Código da Turma ao seu professor para ter acesso às funcionalidades do sistema!
            </p>
            <button onClick={() => navigate('/login')} className="text-lg font-bold bg-[#0E7886] hover:bg-[#0b5a66] text-white py-3 px-8 rounded-md transition-colors w-full">
              Retornar à tela de Login
            </button>
          </div>
        </Modal>
      )}

      {showInvalidCodeMessage && (
        <Modal>
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl text-center p-8">
            <img src={megaphone} alt="Erro" className="h-24 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Código da Turma Inválido!</h2>
            <p className="text-lg text-gray-700 mb-6">
              {error || 'Houve um erro com o código. Verifique com seu professor e tente novamente.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/login')} className="text-lg font-bold bg-[#0E7886] hover:bg-[#0b5a66] text-white py-2 px-6 rounded-md transition-colors">
                Tela de Login
              </button>
              <button onClick={handleTryAgain} className="text-lg font-bold bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-md transition-colors">
                Tentar Novamente
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showValidCodeMessage && (
        <Modal>
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl text-center p-8">
            <img src={confetti} alt="Sucesso" className="h-24 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Código Vinculado com Sucesso!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Parabéns! A página será recarregada para você começar a usar o Loop Academic.
            </p>
            <button onClick={handleValidCodeClose} className="text-lg font-bold bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-md transition-colors w-full">
              Vamos nessa! o/
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}