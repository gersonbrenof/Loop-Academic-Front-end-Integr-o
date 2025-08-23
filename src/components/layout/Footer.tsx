import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from 'react-icons/fa';
import { LiaBookReaderSolid } from 'react-icons/lia';
import { IoIosInfinite } from 'react-icons/io';
import { Link } from 'react-router-dom'; // Usar Link para navegação interna

export const Footer: React.FC = () => {
  return (
    // MELHORIA 1: Responsividade e Padding
    // - 'w-full' em vez de 'w-[1510px]' para se adaptar a qualquer tela.
    // - Padding mais claro e consistente com 'px-6 py-8'.
    <footer className='bg-[#0E7886] text-white w-full'>
      {/* Container para centralizar o conteúdo em telas grandes */}
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-8'>

        {/* --- LOGO --- */}
        {/* MELHORIA 2: Semântica e Interatividade */}
        {/* - O logo agora é um link para a página inicial. */}
        {/* - A estrutura do logo está em um único bloco, mais coeso. */}
        <Link to="/" className='flex items-center gap-4 text-center md:text-left'>
          <LiaBookReaderSolid className='w-20 h-auto flex-shrink-0' />
          <div>
            <div className='text-3xl font-bold flex items-center'>
              L<IoIosInfinite className='w-8 h-auto mx-1' />P
            </div>
            <div className='text-3xl font-bold -mt-2'>
                Academic
            </div>
          </div>
        </Link>

        {/* --- LINKS DE NAVEGAÇÃO --- */}
        {/* MELHORIA 3: Usando Links reais e Hover Effects */}
        {/* - Os itens agora são links clicáveis. */}
        {/* - Adicionado efeito de hover para melhor feedback visual. */}
        <nav>
          <ul className='flex flex-col items-center md:items-start gap-2'>
            <li><Link to="/about" className="hover:underline">Conheça-nos</Link></li>
            <li><Link to="/faq" className="hover:underline">Tenho dúvidas</Link></li>
            <li><Link to="/support" className="hover:underline">Como apoiar?</Link></li>
          </ul>
        </nav>

        {/* --- REDES SOCIAIS --- */}
        {/* MELHORIA 4: Acessibilidade e Espaçamento Moderno */}
        {/* - Ícones agora são links clicáveis. */}
        {/* - 'aria-label' para acessibilidade (importante para leitores de tela). */}
        {/* - 'gap-4' para um espaçamento mais robusto. */}
        <div className='flex flex-col items-center md:items-end'>
          <p className='mb-2 font-semibold'>Redes Sociais:</p>
          <ul className='flex items-center gap-4'>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <FaFacebookSquare className='w-10 h-auto' />
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                <FaInstagramSquare className='w-10 h-auto' />
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-80 transition-opacity">
                <FaTwitterSquare className='w-10 h-auto' />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* --- COPYRIGHT --- */}
      {/* Separado para um alinhamento centralizado e limpo */}
      <div className='text-center py-4 border-t border-white/20'>
        <p>&copy; {new Date().getFullYear()} Loop Academic</p>
      </div>
    </footer>
  );
};