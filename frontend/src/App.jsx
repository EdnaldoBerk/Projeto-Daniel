import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { CardBook } from './components/cardbook/CardBook'
import Slider from './components/slider/Slider'
import { PgLogin } from './pages/PgLogin'
import { PgCadastro } from './pages/PgCadastro'
import PgResenha from './pages/PgResenha'
import PgPerfil from './pages/PgPerfil'
import { PgAdminLogin } from './pages/PgAdminLogin'
import { PgAdminDashboard } from './pages/PgAdminDashboard'
import { PgAdminUsers } from './pages/PgAdminUsers'
import PgAdminBooks from './pages/PgAdminBooks'
import { PgAdminResenhas } from './pages/PgAdminResenhas'
import api from './services/api'

function Home() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLivros();
  }, []);

  async function carregarLivros() {
    try {
      const response = await api.get('/admin/livros');
      // Filtrar apenas livros ativos
      const livrosAtivos = (response.data || []).filter(livro => livro.ativo !== false);
      setLivros(livrosAtivos);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        <p>Carregando livros...</p>
      </main>
    );
  }

  if (livros.length === 0) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        <p>Nenhum livro disponível no momento.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <Slider 
        items={livros}
        renderItem={(livro) => (
          <CardBook 
            key={livro.id}
            id={livro.id}
            image={livro.fotoCapa ? `http://localhost:3001${livro.fotoCapa}` : '/placeholder.png'}
            title={livro.titulo}
            author={livro.autor}
          />
        )}
        slidesToShow={5}
        gap={12}
        autoplay={true}
        autoplayInterval={5000}
        infinite={true}
        title="Livros em Destaque"
      />
    </main>
  );
}

function AppLayout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || 
                          location.pathname === '/cadastro' ||
                          location.pathname.startsWith('/admin');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PgLogin />} />
        <Route path="/cadastro" element={<PgCadastro />} />
        <Route path="/resenha" element={<PgResenha />} />
        <Route path="/perfil" element={<PgPerfil />} />
        <Route path="/admin/login" element={<PgAdminLogin />} />
        <Route path="/admin/dashboard" element={<PgAdminDashboard />} />
        <Route path="/admin/usuarios" element={<PgAdminUsers />} />
        <Route path="/admin/livros" element={<PgAdminBooks />} />
        <Route path="/admin/resenhas" element={<PgAdminResenhas />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App