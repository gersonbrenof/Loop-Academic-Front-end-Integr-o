import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaSearch } from 'react-icons/fa';

// --- INTERFACE PARA OS DADOS DA API ---
interface MaterialApoioItem {
  id: number;
  titulo: string;
  descricao: string;
  quantidade_conteudo: number;
}
type SearchResultItem = MaterialApoioItem;

const apiUrl = import.meta.env.VITE_API_URL;

export function MaterialDeApoio() {
  const totalItemsGrid = 9;
  
  // --- ESTADOS DO COMPONENTE ---
  const [items, setItems] = useState<MaterialApoioItem[]>([]); // Para a grade principal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- ESTADOS PARA A BUSCA DINÂMICA ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  
  const navigate = useNavigate();

  // Efeito para buscar os materiais da grade principal (só roda uma vez)
  useEffect(() => {
    const fetchAllMaterials = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        const response = await fetch(`${apiUrl}/material-apoio/material-apoio/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.status === 401) { navigate('/login'); return; }
        if (!response.ok) throw new Error(`Falha ao carregar. Status: ${response.status}`);
        
        const data: MaterialApoioItem[] = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMaterials();
  }, [navigate]);

  // =======================================================
  //         MUDANÇA PRINCIPAL: LÓGICA DE BUSCA
  // =======================================================
  const handleSearch = async () => {
    // Se a busca estiver vazia, limpa os resultados e não faz nada
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchMessage('');
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    
    const urlBusca = `${apiUrl}/material-apoio/buscar-material-apoio/?search=${encodeURIComponent(searchQuery)}`;
    
    try {
      const response = await fetch(urlBusca, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Falha na busca.');
      
      const data: SearchResultItem[] = await response.json();
      setSearchResults(data);
      if (data.length === 0) {
        setSearchMessage('Nenhum material encontrado.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao realizar a busca.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const emptySlots = totalItemsGrid - items.length;

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className='mt-0 absolute top-[-10px] left-[-550px]'>
      <h1 className='text-center text-3xl italic font-bold ml-[190px]'>MATERIAL DE APOIO</h1>

      <div className='flex pt-20'>
        <Link to='/' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Menu Principal</p>
        </Link>

        <div className='ml-8'>
          <div className='relative w-[920px]'>
            <div className='w-full bg-white border-2 border-[#707070] shadow-lg flex items-center'>
              <FaSearch className='w-5 h-5 ml-4 text-gray-400'/>
              <input 
                className='w-[750px] h-[50px] px-4 text-base text-black'
                type='text'
                placeholder='O que você quer estudar?'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Permite buscar com a tecla Enter
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button 
                className='h-full w-32 py-3 bg-[#0E7886] text-white text-xl flex items-center justify-center'
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? <FaSpinner className="animate-spin" /> : 'Buscar'}
              </button>
            </div>
            
            {(searchResults.length > 0 || searchMessage) && (
              <div className="absolute top-full left-0 w-full bg-white border-x-2 border-b-2 border-gray-300 shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={`/material-de-apoio/${item.id}`}
                    className="block p-3 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  >
                    <p className="text-black font-semibold">{item.titulo}</p>
                    <p className="text-sm text-gray-500">{item.quantidade_conteudo} conteúdos</p>
                  </Link>
                ))}
                {searchMessage && (
                  <div className="p-3 text-center text-gray-500 italic">
                    {searchMessage}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='w-[920px] bg-white mt-5 border-2 border-[#707070] shadow-lg'>
             <div className='h-3 w-full bg-[#0E7886]'></div>
              <div className='px-4 py-2'>
                <p className='text-[#0000003F]'>Consulte nossos</p>
                <h1 className='text-2xl font-semibold'>Materiais de Apoio</h1>
              </div>
          </div>

          <div className='w-[920px] bg-white mt-5 border-2 border-[#707070] shadow-lg'>
            <div className='grid grid-cols-3 gap-5 px-5 py-8'>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/material-de-apoio/${item.id}`}
                  className='border-2 border-[#707070] bg-[#0E7886] text-white flex flex-col justify-between h-52'
                >
                  <h1 className='text-lg text-center pt-10 px-2 break-words'>{item.titulo}</h1>
                  <div className='border-t-2 border-[#707070] bg-white flex items-center justify-center p-4'>
                    <div className='border-2 border-[#707070] bg-[#0E7886] text-white w-36 h-9 rounded-full flex items-center justify-center'>
                      <p>{item.quantidade_conteudo} Conteúdos</p>
                    </div>
                  </div>
                </Link>
              ))}
              {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, index) => (
                <div key={`empty-${index}`} className='border-2 border-[#707070] bg-[#3A9AA0] flex flex-col items-center justify-between h-52'>
                  <img src="/img/cadeado.png" alt='cadeado' className='h-16 w-auto my-auto'/>
                  <div className='border-t-2 border-[#707070] bg-white w-full h-16 flex items-center justify-center'>
                    <div className='border-2 border-[#707070] bg-[#3A9AA0] w-36 h-9 rounded-full'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}