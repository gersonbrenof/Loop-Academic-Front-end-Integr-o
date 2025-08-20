import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

// --- INTERFACES PARA OS DADOS DA API ---
interface VideoApi { id: number; link_youtube: string; titulo: string; descricao: string; }
interface PdfApi { id: number; arquivo: string; titulo: string; descricao: string; }
interface MapaMentalApi { id: number; mapa_mental: string; titulo: string; descricao: string; }

interface MaterialCollectionApi {
  id: number;
  titulo: string;
  videos_youtube: VideoApi[];
  arquivos_pdf: PdfApi[];
  mapas_mentais: MapaMentalApi[];
}

// --- PADRONIZANDO OS TIPOS PARA A LÓGICA INTERNA ---
type ConteudoTipo = 'video' | 'pdf' | 'mapa-mental';

interface ConteudoUnificado {
  uniqueId: string;
  numericId: number;
  tipo: ConteudoTipo;
  titulo: string;
  descricao: string;
  sourceUrl: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export function Material() {
  const { materialId, tipo, conteudoId } = useParams<{ materialId: string; tipo: ConteudoTipo; conteudoId: string }>();
  const navigate = useNavigate();

  const [collectionTitle, setCollectionTitle] = useState('');
  const [sidebarItems, setSidebarItems] = useState<ConteudoUnificado[]>([]);
  const [currentItem, setCurrentItem] = useState<ConteudoUnificado | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdfInfo, setSelectedPdfInfo] = useState<{ url: string; titulo: string; descricao: string; } | null>(null);

  useEffect(() => {
    const loadMaterial = async () => {
      if (!materialId || !tipo || !conteudoId) return;
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        // 1. Busca a coleção completa de uma só vez
        const response = await fetch(`${apiUrl}/material-apoio/material-apoio/${materialId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Falha ao carregar coleção: ${response.status}`);
        const collectionData: MaterialCollectionApi = await response.json();

        setCollectionTitle(collectionData.titulo);

        // 2. Normaliza os dados da API usando os tipos padronizados
        const videos: ConteudoUnificado[] = collectionData.videos_youtube.map(v => ({
          uniqueId: `video-${v.id}`, numericId: v.id, tipo: 'video',
          titulo: v.titulo, descricao: v.descricao, sourceUrl: v.link_youtube
        }));
        const pdfs: ConteudoUnificado[] = collectionData.arquivos_pdf.map(p => ({
          uniqueId: `pdf-${p.id}`, numericId: p.id, tipo: 'pdf',
          titulo: p.titulo, descricao: p.descricao, sourceUrl: p.arquivo
        }));
        const mapas: ConteudoUnificado[] = (collectionData.mapas_mentais || []).map(m => ({
          uniqueId: `mapa-${m.id}`, numericId: m.id, tipo: 'mapa-mental',
          titulo: m.titulo, descricao: m.descricao, sourceUrl: m.mapa_mental
        }));
        
        const allItems = [...videos, ...pdfs, ...mapas];
        setSidebarItems(allItems);
        
        // 3. Encontra o item atual na lista já carregada
        const foundIndex = allItems.findIndex(item => item.tipo === tipo && item.numericId === parseInt(conteudoId));

        if (foundIndex !== -1) {
          setCurrentIndex(foundIndex);
          setCurrentItem(allItems[foundIndex]);
        } else {
          setError("Conteúdo não encontrado na coleção. Verifique a URL.");
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMaterial();
  }, [materialId, tipo, conteudoId, navigate]);

  // --- NAVEGAÇÃO PERFEITA PELOS MENUS E BOTÕES ---
  const handleNavigation = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < sidebarItems.length) {
      const newItem = sidebarItems[newIndex];
      navigate(`/material/${materialId}/${newItem.tipo}/${newItem.numericId}`);
    }
  };
  
  const getEmbedLink = (link: string) => link.includes("embed") ? link : link.replace("watch?v=", "embed/");
  const handlePdfClick = (pdf: ConteudoUnificado) => {
    setSelectedPdfInfo({ url: pdf.sourceUrl, titulo: pdf.titulo, descricao: pdf.descricao });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!currentItem) return <div>Conteúdo não encontrado.</div>;

  const getDisplayTipo = (tipo: ConteudoTipo) => {
    switch(tipo) {
      case 'video': return 'Video-Aula';
      case 'pdf': return 'Arquivos';
      case 'mapa-mental': return 'Mapa Mental';
      default: return 'Conteúdo';
    }
  }

  const renderMaterial = () => {
    switch (currentItem.tipo) {
      case 'video':
        return <iframe className='w-full h-[433px]' src={getEmbedLink(currentItem.sourceUrl)} title='YouTube video player' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe>;
      case 'mapa-mental':
        return <img className='w-full h-[433px] object-contain bg-gray-100' src={currentItem.sourceUrl} alt={currentItem.titulo} />;
      case 'pdf':
        const pdfsInCollection = sidebarItems.filter(item => item.tipo === 'pdf');
        return (
          <div className='p-5 h-full overflow-y-auto'>
            <p className='-mt-12 mb-8'>{currentItem.descricao}</p>
            <h2 className='text-[#0E7886] text-2xl font-semibold mb-4'>Arquivos Disponíveis na Coleção</h2>
            <div className='w-full h-px bg-gray-300 mb-4 -mt-4'></div>
            <div className='flex flex-wrap gap-8'>
              {pdfsInCollection.map(pdf => (
                <div key={pdf.uniqueId} className='flex flex-col items-center'>
                  <button onClick={() => handlePdfClick(pdf)}>
                    <img className='w-24' src='/public/img/pdf.png' alt='Ícone de PDF' />
                  </button>
                  <p className='text-xs w-32 text-center mt-2'>{pdf.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Tipo de material não suportado.</div>;
    }
  };

  return (
    <div>
      <div className='absolute top-[19px] left-[15px] text-[#0E7886] w-[135px] flex flex-col items-center'>
        <a href={`/material-de-apoio/${materialId}`} className='flex flex-col items-center'>
          <FaArrowLeft className='w-10 h-10' />
          <p>Retornar</p>
        </a>
      </div>
      <div className='absolute top-[115px] left-[61px]'>
        <div className='bg-[#FFFFFF] w-[1170px] h-[550px] shadow-md'>
          <div className='p-5'>
            <p>Página {currentIndex + 1} de {sidebarItems.length}</p>
            <h1 className='text-[#0E7886] text-2xl font-semibold mb-5'>{getDisplayTipo(currentItem.tipo)}: {currentItem.titulo}</h1>
          </div>
          <div className='w-full h-[433px]'>{renderMaterial()}</div>
        </div>
        <div className='mt-10 flex justify-center'>
          <div className='flex text-white shadow-md'>
            <button className={`w-[400px] h-[60px] flex items-center justify-center ${currentIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600'}`} onClick={() => handleNavigation(currentIndex - 1)} disabled={currentIndex === 0}>
              <h2 className='flex items-center space-x-2'><FaAngleLeft /><span>Anterior</span></h2>
            </button>
            <button className={`w-[400px] h-[60px] flex items-center justify-center ${currentIndex === sidebarItems.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600'}`} onClick={() => handleNavigation(currentIndex + 1)} disabled={currentIndex === sidebarItems.length - 1}>
              <h2 className='flex items-center space-x-2'><span>Próximo</span><FaAngleRight /></h2>
            </button>
          </div>
        </div>
      </div>
      <div className='ml-[1310px] bg-[#302D2DCC] w-[200px] h-[800px] overflow-y-auto'>
        <div className='text-white p-4'>
          <p>Material de Apoio</p>
          <h1 className='text-lg'>{collectionTitle}</h1>
        </div>
        {sidebarItems.map((item, index) => (
          <button key={item.uniqueId} className={`h-[115px] w-[200px] border-t-2 border-[#707070] relative ${index === currentIndex ? 'bg-white text-black' : 'bg-[#302D2D] text-white'}`} onClick={() => handleNavigation(index)}>
            {index === currentIndex && <div className='absolute top-0 left-0 w-full bg-[#0E7886] text-white text-center py-1'>Atual</div>}
            <div className='p-2 pt-8 text-left'>
              <p className='text-gray-400 text-sm'>{getDisplayTipo(item.tipo)}</p>
              <h1 className='text-base'>{item.titulo}</h1>
            </div>
          </button>
        ))}
      </div>
      {isModalOpen && selectedPdfInfo && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='relative w-[900px] h-auto max-h-[90vh] bg-white shadow-lg text-black flex flex-col'>
            <h1 className='text-xl bg-[#0E7886] text-white h-[51px] flex items-center p-5 flex-shrink-0'>Apostila: {selectedPdfInfo.titulo}</h1>
            <div className='p-5 overflow-y-auto'>
              <p className='mb-4'>{selectedPdfInfo.descricao}</p>
              <div className='flex justify-end mt-4'>
                <a href={selectedPdfInfo.url} download className='bg-[#0E7886] text-white py-2 px-4 text-xl w-[200px] flex justify-center'>Baixar Apostila</a>
              </div>
            </div>
            <button onClick={closeModal} className='absolute top-[-10px] right-[-10px] w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full'>
              <IoCloseSharp className='w-7 h-7' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}