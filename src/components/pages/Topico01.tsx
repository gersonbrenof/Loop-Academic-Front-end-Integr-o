import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';

// --- INTERFACES (sem alterações) ---
interface AlunoNaResposta {
  id: number;
  nomeAluno: string;
  instituicao: string;
  matricula: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  foto_perfil?: string | null;
}
interface TopicoResposta {
  id: number;
  respostaForum: string;
  data_resposta: string;
  aluno: AlunoNaResposta;
}
interface ForumTopicoCompleto {
  id: number;
  titulo: string;
  descricao: string;
  data_inico: string;
  categoria: string;
  nome_do_aluno: string;
  foto_perfil: string | null;
  respostas: TopicoResposta[];
}

// --- URLs DA API (sem alterações) ---
const apiUrl = import.meta.env.VITE_API_URL;
const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export function Topico01() {
  const [topicData, setTopicData] = useState<ForumTopicoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textoNovaResposta, setTextoNovaResposta] = useState('');
  
  // --- ESTADOS PARA O MODO DE EDIÇÃO (sem alterações) ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  
  const respostaRef = useRef<HTMLDivElement>(null);
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  // --- FUNÇÕES AUXILIARES (sem alterações) ---
  const getImageUrl = (path?: string | null) => {
    return path ? `${backendBaseUrl}${path}` : '/img/user.png';
  }
  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.toLocaleDateString('pt-BR')}, às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // --- LÓGICA DE BUSCA (GET) (sem alterações) ---
  const fetchAllTopicData = async () => {
    // Se estiver editando, não faz sentido recarregar a página
    if (isEditing) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token || !topicId) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/ForumExibirForum/${topicId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Falha ao carregar o tópico. Status: ${response.status}`);
      
      const data: ForumTopicoCompleto = await response.json();
      if (!data.respostas) {
        data.respostas = [];
      }
      setTopicData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE RESPOSTA (POST) (sem alterações) ---
  const handleResponder = async () => {
    if (!textoNovaResposta.trim() || !topicId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const corpoDaRequisicao = { respostaForum: textoNovaResposta };
    try {
      const response = await fetch(`${apiUrl}/Forumrespondertopico/${topicId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(corpoDaRequisicao),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Falha ao enviar a resposta: ${JSON.stringify(errorData)}`);
      }
      setTextoNovaResposta('');
      fetchAllTopicData(); // Recarrega tudo após responder
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- FUNÇÕES PARA CONTROLAR A EDIÇÃO (sem alterações) ---
  const handleStartEditing = () => {
    if (!topicData) return;
    setEditedTitle(topicData.titulo);
    setEditedDescription(topicData.descricao);
    setEditedCategory(topicData.categoria);
    setIsEditing(true);
  };
  const handleCancelEditing = () => {
    setIsEditing(false);
  };
  const handleSaveChanges = async () => {
    if (!editedTitle.trim() || !editedDescription.trim() || !editedCategory.trim() || !topicId) {
        alert('Todos os campos devem ser preenchidos.');
        return;
    }
    setIsSaving(true);
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
    const corpoDaRequisicao = {
      titulo: editedTitle,
      descricao: editedDescription,
      categoria: editedCategory,
    };
    try {
      const response = await fetch(`${apiUrl}/ForumForum/${topicId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(corpoDaRequisicao),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Falha ao salvar: ${JSON.stringify(errorData)}`);
      }
      alert('Tópico atualizado com sucesso!');
      setIsEditing(false);
      fetchAllTopicData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => { if (topicId) { fetchAllTopicData(); } }, [topicId]);

  const scrollToResposta = () => {
    respostaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (loading) return <div className="p-8 text-center text-xl">Carregando tópico...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-500">{error}</div>;
  if (!topicData) return <div className="p-8 text-center text-xl">Tópico não encontrado.</div>;
  
  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[200px]'>FÓRUM</h1>
      <div className='flex pt-20 items-start'>
        <Link to='/Forum' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar</p>
        </Link>
        <div className='m-3 text-lg text-white'>
          <Link to='/Criar-Topico' className='bg-red-700 py-2 px-4 rounded-md'>Criar Tópico</Link>
          
          {/* ======================================================= */}
          {/*   MUDANÇA PRINCIPAL: BOTÃO DE ATUALIZAR/EDITAR UNIFICADO */}
          {/* ======================================================= */}
          {!isEditing && (
            <>
              {/* Este botão agora só aparece quando NÃO estamos editando */}
              <button 
                onClick={handleStartEditing}
                className='bg-blue-600 py-1 px-4 ml-2 rounded-md inline-flex items-center gap-2'
              >
                <FaPencilAlt size={14}/> Editar Tópico
              </button>
              <button className='bg-[#0E7886] py-1 px-4 ml-2 rounded-md' onClick={scrollToResposta}>Responder</button>
            </>
          )}
          {/* Quando isEditing for true, os botões acima desaparecem, evitando confusão. */}
        </div>
      </div>

      <div className='w-[900px] h-full mt-4 ml-44 py-2'>
        
        {isEditing ? (
          // MODO DE EDIÇÃO (FORMULÁRIO)
          <div className='bg-white border-2 border-blue-500 shadow-lg rounded-lg'>
            <div className='text-white text-lg bg-blue-600 px-4 py-2 rounded-t-lg font-semibold'>
                Editando Tópico...
            </div>
            <div className='p-4 space-y-4'>
                <div>
                    <label className='block font-bold text-gray-700 mb-1'>Título</label>
                    <input 
                        type="text" 
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className='w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500 outline-none'
                    />
                </div>
                <div>
                    <label className='block font-bold text-gray-700 mb-1'>Categoria</label>
                    <input 
                        type="text" 
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        className='w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500 outline-none'
                    />
                </div>
                <div>
                    <label className='block font-bold text-gray-700 mb-1'>Descrição</label>
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className='w-full h-48 border-2 border-gray-300 p-2 rounded resize-y font-mono focus:border-blue-500 outline-none'
                    />
                </div>
                <div className='flex items-center gap-4 pt-2'>
                    <button 
                        onClick={handleSaveChanges} 
                        disabled={isSaving}
                        className='flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 disabled:bg-gray-400'
                    >
                        <FaSave />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                        onClick={handleCancelEditing}
                        className='flex items-center gap-2 bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600'
                    >
                        <FaTimes />
                        Cancelar
                    </button>
                </div>
            </div>
          </div>
        ) : (
          // MODO DE VISUALIZAÇÃO (ORIGINAL)
          <>
            <div className='text-white text-lg bg-[#0E7886] border-2 border-[#707070] shadow-lg flex items-center justify-between px-4 py-2 rounded-t-lg'>
              <h1 className='w-4/5 font-semibold break-words'>{topicData.titulo}</h1>
              <h1 className='text-sm font-light'>Categoria: {topicData.categoria}</h1>
            </div>
            
            <div className='mt-1 bg-white border-x-2 border-b-2 border-[#707070] shadow-lg flex min-h-[180px]'>
              <div className='w-1/4 bg-[#0E7886] text-white p-3 border-r-2 border-[#707070] flex flex-col items-center text-center'>
                <img src={getImageUrl(topicData.foto_perfil)} alt={`Foto de ${topicData.nome_do_aluno}`} className='bg-white w-24 h-24 mt-2 rounded-full shadow-lg object-cover border-2 border-white'/>
                <h1 className='text-xl font-bold mt-3 break-words'>{topicData.nome_do_aluno}</h1>
                <p className='text-xs opacity-80'>(Criador do Tópico)</p>
              </div>
              <div className='w-3/4 text-black p-4 flex flex-col justify-between'>
                <p className='text-base whitespace-pre-wrap break-words'>{topicData.descricao}</p>
                <p className='text-xs text-gray-500 text-right mt-4'>{formatarDataHora(topicData.data_inico)}</p>
              </div>
            </div>
          </>
        )}
        

        {topicData.respostas.length > 0 && <div className="mt-6 mb-2 border-b-2 border-gray-300"><h2 className="text-xl font-semibold text-gray-700 pb-2">Respostas</h2></div>}

        {topicData.respostas.map((item) => (
          <div key={item.id} className='mt-4 bg-white border-2 border-[#707070] shadow-lg flex min-h-[180px] rounded-lg'>
            <div className='w-1/4 bg-gray-100 text-gray-800 p-3 border-r-2 border-[#707070] flex flex-col items-center text-center rounded-l-md'>
              {/* ESTA LINHA PEGA A IMAGEM DO USUÁRIO QUE RESPONDEU */}
             <img src={getImageUrl(item.aluno.foto_perfil)} alt={`Foto de ${item.aluno.nomeAluno}`} className='bg-white w-24 h-24 mt-2 rounded-full shadow-lg object-cover border-2 border-gray-300'/>
              <h1 className='text-xl font-bold mt-3 break-words'>{item.aluno.nomeAluno}</h1>
              <p className='text-sm font-light'>{item.aluno.matricula}</p>
            </div>
            <div className='w-3/4 text-black p-4 flex flex-col justify-between'>
              <p className='text-base whitespace-pre-wrap break-words'>{item.respostaForum}</p>
              <p className='text-xs text-gray-500 text-right mt-4'>{formatarDataHora(item.data_resposta)}</p>
            </div>
          </div>
        ))}
        {/* ... restante do código sem alterações ... */}
        
        {topicData.respostas.length === 0 && (
          <div className='text-center italic text-gray-500 py-8 bg-gray-50 mt-4 rounded-lg border-2 border-dashed'>
            Nenhuma resposta ainda. Seja o primeiro a responder!
          </div>
        )}
        
        <div ref={respostaRef} className='w-[900px] h-auto mt-16 bg-white border-2 border-[#707070] shadow-lg rounded-lg'>
            <div className='w-full bg-[#0E7886] flex items-center rounded-t-lg'>
              <h1 className='text-white text-xl ml-4 p-2'>Responder tópico</h1>
            </div>
            <div className='pt-6 p-4'>
              <textarea
                className='w-full h-48 text-black border-2 border-gray-300 p-2 font-mono resize-none rounded'
                placeholder='Digite sua resposta aqui'
                value={textoNovaResposta}
                onChange={(e) => setTextoNovaResposta(e.target.value)}
              />
              <div className='flex items-center mt-6'>
                <button className='text-xl text-white bg-[#0E7886] py-1 px-7 rounded-md hover:bg-[#0b5a66]' onClick={handleResponder}>
                  Responder
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}