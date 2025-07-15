import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function Usuario() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='bg-[#0E7886] w-[1520px] min-h-screen flex items-start justify-center p-40'>
      <button onClick={handleBack} className='mr-5 mt-5'>
        <FaArrowLeft className='text-white text-2xl w-10 h-auto' />
      </button>
      <div className='bg-white p-10 shadow-lg w-[478px] h-[359px]'>
        <h1 className='text-[#0E7886] text-2xl mb-4'>Perfil de Usuário</h1>
        <div className='flex flex-col space-y-[23px] pt-10 items-center'>
            <button onClick={() => navigate('/cadastrodealuno')} className='bg-[#0E7886] text-white text-xl py-2 px-4 w-[190px] h-[41px]'>
                Aluno
            </button>
            <button onClick={() => navigate('/cadastrodealuno')} className='bg-[#0E7886] text-white text-xl py-2 px-4 w-[190px] h-[41px]'>
                Professor
            </button>
            <button onClick={() => navigate('/cadastrodealuno')} className='bg-[#0E7886] text-white text-xl py-2 px-4 w-[190px] h-[41px]'>
                Monitor
            </button>
        </div>
      </div>
    </div>
  );
}
