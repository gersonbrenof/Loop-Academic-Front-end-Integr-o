import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Navbar } from './MenuPrincipal'; // Se o Navbar for o menu superior
import { MenuLateral } from './MenuLateral';
import { Footer } from './Footer';

// Este é o "molde" para TODAS as suas páginas internas
export const MainLayout = () => {
  return (
    <>
      <Header />
      {/* Container para o conteúdo principal e o menu lateral */}
      <div className="flex">
        <MenuLateral />
        <main className="flex-grow p-4 md:p-8"> {/* O conteúdo principal ocupa o resto do espaço */}
          {/* O <Outlet /> é o espaço onde a página (Ex: ListasDeExercicios01) será renderizada */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};