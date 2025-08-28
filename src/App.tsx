// App.tsx - CÓDIGO AJUSTADO PARA FUNCIONAR APÓS O BUILD

// 1. ADICIONE 'useEffect' E MUDE 'BrowserRouter' PARA 'HashRouter'
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// MUDANÇA AQUI: Trocado BrowserRouter por HashRouter
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/MenuPrincipal';
import { MenuLateral } from './components/layout/MenuLateral';
import { Footer } from './components/layout/Footer';
import { Login } from './components/pages/Login';
import { Perfil } from './components/pages/Perfil';
import { CadastroDeAluno } from './components/pages/Cadastro-De-Aluno';
import { Exercicio } from './components/pages/Exercicio';
import { Material } from './components/pages/Material';
import { Usuario } from './components/pages/Usuario';

import './index.css';

const App = () => {
  // 2. ADICIONE O MESMO BLOCO 'useEffect' DO PRIMEIRO CÓDIGO
  // Este "vigia" garante que todos os links <a> internos funcionem com o HashRouter.
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a');

      if (!link || !link.href) {
        return;
      }

      const path = link.getAttribute('href');
      
      // Verifica se é um link interno (começa com "/") e não para um site externo
      if (path && path.startsWith('/') && !path.startsWith('//')) {
        // Impede o navegador de recarregar a página
        event.preventDefault();
        // Muda a URL manualmente para usar o hash, e o HashRouter fará o resto
        window.location.hash = path;
      }
    };

    // Adiciona o "vigia" de cliques
    document.body.addEventListener('click', handleLinkClick as any);

    // Remove o "vigia" quando o componente não for mais necessário
    return () => {
      document.body.removeEventListener('click', handleLinkClick as any);
    };
  }, []); // O array vazio [] faz com que este código rode apenas uma vez

  return (
    // Seu código de Routes continua EXATAMENTE o mesmo
    <Router>
      <React.StrictMode>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/usuario' element={<Usuario />} />
          <Route path='/cadastrodealuno' element={<CadastroDeAluno />} />
          <Route path='/exercicio' element={<Exercicio />} />
          <Route path='/material/:materialId/:tipo/:conteudoId' element={<Material />} />
          
          <Route path="/exercicio/responder/:exercicioId" element={<Exercicio />} />

          <Route 
            path='/' 
            element={
              <>
                <Header />
                <Navbar />
                <Footer />
              </>
            } 
          />

          <Route
            path='/Perfil'
            element={
              <>
                <Perfil />
                <Footer />
              </>
            }
          />

          <Route
            path='*'
            element={
              <>
                <Header />
                <MenuLateral />
              </>
            }
          />

        </Routes>
      </React.StrictMode>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);