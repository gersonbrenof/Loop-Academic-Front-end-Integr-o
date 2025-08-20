import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// --- Importando todos os ícones necessários ---
import { FaArrowLeft, FaYoutube, FaFilePdf, FaSpinner, FaBrain, FaBookOpen } from 'react-icons/fa';

// --- INTERFACES ---
interface VideoYoutube { id: number; link_youtube: string; titulo: string; descricao: string; }
interface ArquivoPdf { id: number; arquivo: string; titulo: string; descricao: string; }
interface MapaMental { id: number; mapa_mental: string; titulo: string; descricao: string; }
interface MaterialDetalhado { 
  id: number; 
  titulo: string; 
  descricao: string; 
  videos_youtube: VideoYoutube[]; 
  arquivos_pdf: ArquivoPdf[];
  mapas_mentais: MapaMental[];
}
interface ConteudoUnificado { 
  id: string; 
  numericId: number; 
  titulo: string; 
  descricao: string; 
  link: string; 
  tipo: 'video' | 'pdf' | 'mapa-mental';
  displayTipo: 'Vídeo' | 'PDF' | 'Mapa Mental';
  imageUrl: string; 
}
interface SearchResultItem { id: number; titulo: string; tipo: 'video' | 'pdf' | 'mapa-mental'; }

const apiUrl = import.meta.env.VITE_API_URL;

function getYoutubeThumbnail(url: string): string {
  try {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
    }
  } catch (e) { console.error("Erro ao extrair ID do vídeo:", e); }
  return '/img/pesquisa.png';
}

export function MaterialDeApoio02() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<MaterialDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // --- LÓGICA DE FETCH COMPLETA ---
  useEffect(() => {
    const fetchMaterialDetail = async () => {
      if (!materialId) return;
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/material-apoio/material-apoio/${materialId}/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!response.ok) {
          throw new Error(`Falha ao carregar o material. Status: ${response.status}`);
        }
        const data: MaterialDetalhado = await response.json();
        setMaterial(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterialDetail();
  }, [materialId, navigate]);

  // --- LÓGICA DE BUSCA COMPLETA ---
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch(`${apiUrl}/material-apoio/buscar-material-apoio/?search=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha na busca.');
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- LÓGICA useMemo COMPLETA COM A ALTERAÇÃO PARA O ÍCONE ---
  const combinedContent: ConteudoUnificado[] = useMemo(() => {
    if (!material) return [];
    const videos = material.videos_youtube.map(video => ({
      id: `video-${video.id}`, numericId: video.id, titulo: video.titulo,
      descricao: video.descricao, link: video.link_youtube,
      tipo: 'video' as const, displayTipo: 'Vídeo' as const,
      imageUrl: getYoutubeThumbnail(video.link_youtube),
    }));
    const pdfs = material.arquivos_pdf.map(pdf => ({
      id: `pdf-${pdf.id}`, numericId: pdf.id, titulo: pdf.titulo,
      descricao: pdf.descricao, link: pdf.arquivo,
      tipo: 'pdf' as const, displayTipo: 'PDF' as const,
      imageUrl: '/public/img/img-arquivo.png', // Identificador para renderizar o ícone
    }));
    const mapasMentais = (material.mapas_mentais || []).map(mapa => ({
        id: `mapa-${mapa.id}`, numericId: mapa.id, titulo: mapa.titulo,
        descricao: mapa.descricao, link: mapa.mapa_mental,
        tipo: 'mapa-mental' as const, displayTipo: 'Mapa Mental' as const,
        imageUrl: mapa.mapa_mental,
    }));
    return [...videos, ...pdfs, ...mapasMentais];
  }, [material]);
  
  if (loading) return <div className="p-8 text-center text-xl absolute top-10 left-[-400px]">Carregando conteúdo...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-500 absolute top-10 left-[-400px]">{error}</div>;
  if (!material) return <div className="p-8 text-center text-xl">Material não encontrado.</div>;

  return (
    <div className='mt-[0px] absolute top-[-10px] left-[-550px] pb-10'>
      <h1 className='text-center text-3xl italic font-bold ml-32'>
        MATERIAL DE APOIO - {material.titulo.toUpperCase()}
      </h1>
      <div className='flex pt-20'>
        <Link to='/material-de-apoio' className='flex flex-col items-center py-1 h-full ml-9'>
          <FaArrowLeft className='w-10 h-auto' />
          <p className='w-32 text-sm text-center'>Retornar</p>
        </Link>
        <div>
          <div className='relative w-[920px] ml-8'>
            <div className='w-full h-[55px] bg-white flex items-center border-2 border-[#707070] shadow-lg'>
              <img src="/img/pesquisa.png" alt='pesquisa' className='w-10 ml-4'/>
              <input 
                className='w-[750px] h-[50px] px-4 text-base text-black' 
                type='text' 
                placeholder='Buscar em todos os materiais...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className='h-full w-32 bg-[#0E7886] text-white text-xl flex items-center justify-center'
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? <FaSpinner className="animate-spin" /> : 'Buscar'}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border-x-2 border-b-2 border-gray-300 shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.tipo}-${result.id}`}
                    to={`/material/${materialId}/${result.tipo}/${result.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  >
                    {result.tipo === 'video' && <FaYoutube className="text-red-500 w-6 h-6 flex-shrink-0" />}
                    {result.tipo === 'pdf' && <FaFilePdf className="text-green-600 w-6 h-6 flex-shrink-0" />}
                    {result.tipo === 'mapa-mental' && <FaBrain className="text-purple-600 w-6 h-6 flex-shrink-0" />}
                    <span className="text-black">{result.titulo}</span>
                  </Link>
                ))}
              </div>
            )}
             {isSearching && searchResults.length === 0 && (
                 <div className="absolute top-full left-0 w-full bg-white border-x-2 border-b-2 border-gray-300 shadow-lg mt-1 z-10 p-4 text-center text-gray-500">
                    Buscando...
                 </div>
            )}
          </div>
          <div className='w-[920px] h-auto bg-white mt-5 p-5 ml-8 flex flex-col items-center border-2 border-[#707070] shadow-lg'>
            <div className='w-[880px] h-[90px] bg-white items-center border-2 border-[#707070]'>
              <div className='h-3 w-full bg-[#0E7886]'></div>
              <div className='px-4'>
                <p className='text-[#0000003F] mt-2'>Material de Apoio</p>
                <h1 className='text-2xl font-semibold'>{material.titulo}</h1>
              </div>
            </div>
            {combinedContent.map((item) => (
              <div key={item.id} className='w-[880px] min-h-[224px] bg-white mt-5 border-2 border-[#707070] flex flex-col'>
                <div className={`h-6 w-full ${
                    item.tipo === 'video' ? 'bg-[#c4302b]' :
                    item.tipo === 'pdf' ? 'bg-[#0E862E]' :
                    'bg-purple-600'
                }`}></div>
                <div className='flex flex-grow'>
                  {/* --- RENDERIZAÇÃO CONDICIONAL PARA O ÍCONE DE LIVRO --- */}
                  <div className='w-1/3 bg-gray-100 flex items-center justify-center'>
                    {item.imageUrl === 'use-book-icon' ? (
                      <FaBookOpen className='w-32 h-32 text-gray-400' />
                    ) : (
                      <img 
                        src={item.imageUrl} 
                        alt={`Thumbnail para ${item.titulo}`} 
                        className='w-full h-full object-cover'
                      />
                    )}
                  </div>
                  <div className='w-2/3 flex flex-col justify-between p-4'>
                    <div>
                      <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-semibold break-words'>{item.titulo}</h1>
                        <span className='flex items-center gap-2 text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded'>
                          {item.tipo === 'video' && <FaYoutube className="text-red-600"/>}
                          {item.tipo === 'pdf' && <FaFilePdf className="text-green-700"/>}
                          {item.tipo === 'mapa-mental' && <FaBrain className="text-purple-600"/>}
                          {item.displayTipo}
                        </span>
                      </div>
                      <p className='text-black text-base mt-2 break-words'>{item.descricao}</p>
                    </div>
                    <div className='flex justify-end mt-4'>
                      <Link 
                        to={`/material/${materialId}/${item.tipo}/${item.numericId}`}
                        className='bg-[#0E7886] text-white px-5 py-1 text-lg rounded hover:bg-[#0b5a66] transition-colors'>
                        Visualizar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {combinedContent.length === 0 && (
              <div className="text-center text-gray-500 italic py-10">
                Nenhum conteúdo encontrado para este material.
              </div>
            )}
          </div>
        </div>
      </div>
    </div> 
  );
}