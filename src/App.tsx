import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
// import { ListasDeExercicios01 } from './components/pages/Listas-De-Exercicios-01';

const App = () => {
  return (
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
