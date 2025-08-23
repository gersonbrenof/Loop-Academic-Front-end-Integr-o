// src/components/MenuLateral.tsx

import { NavLink } from 'react-router-dom'; // IMPORTANTE: Usar NavLink em vez de <a>
import menuItems from '../data/MenuItens';
import { LiaBookReaderSolid } from 'react-icons/lia';
import { IoIosInfinite } from 'react-icons/io';

export function MenuLateral() {
  // Estilos base para os links, para não repetir
  const baseLinkStyle = 'flex items-center w-full p-3 mb-2 shadow-lg h-14 rounded-md transition-colors duration-200';
  
  return (
    // MELHORIA 1: Layout Responsivo e "Sticky"
    // - hidden: Escondido em telas pequenas (mobile-first).
    // - md:flex: Aparece como flex em telas médias e maiores.
    // - h-screen: Ocupa 100% da altura da tela.
    // - sticky top-0: Fica fixo no topo enquanto a página rola.
    <aside className='hidden md:flex flex-col justify-between w-64 bg-[#0E7886] p-4 h-screen sticky top-0'>
      <nav>
        <ul className='space-y-2 mt-4'>
          {menuItems.map((item) => (
            <li key={item.title}>
              {/* MELHORIA 2: Navegação de SPA com <NavLink> */}
              {/* - NavLink evita recarregamento da página. */}
              {/* - Ele aplica estilos automaticamente ao link da página ativa. */}
              <NavLink
                to={item.link}
                // Função que aplica estilos com base no estado 'isActive'
                className={({ isActive }) =>
                  `${baseLinkStyle} ${
                    isActive
                      ? 'bg-[#0b5a66] text-white font-bold' // Estilo ATIVO
                      : 'bg-white text-[#0E7886] hover:bg-gray-200' // Estilo PADRÃO
                  }`
                }
              >
                <img src={item.imgSrc} alt={item.title} className='w-7 h-7 mr-4' />
                <span className='italic font-semibold'>{item.title.toUpperCase()}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* MELHORIA 3: Logo com alinhamento limpo via Flexbox */}
      <div className='flex flex-col items-center text-white pb-4'>
        <LiaBookReaderSolid className='w-40 h-auto' />
        <div className='text-3xl font-bold flex items-center mt-[-10px]'>
          <span>L</span>
          <IoIosInfinite className='w-8 h-auto mx-1' />
          <span>P</span>
        </div>
        <div className='text-3xl font-bold -mt-2'>Academic</div>
      </div>
    </aside>
  );
}