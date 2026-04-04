import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { CardBook } from './components/cardbook/CardBook'
import Slider from './components/slider/Slider'
import Cardreview from './components/cardreview/Cardreview'
import { PgLogin } from './pages/PgLogin'
import { PgCadastro } from './pages/PgCadastro'
import PgResenha from './pages/PgResenha'
import PgBusca from './pages/PgBusca'
import PgPerfil from './pages/PgPerfil'
import PgAjuda from './pages/institucional/PgAjuda'
import PgContato from './pages/institucional/PgContato'
import PgTermos from './pages/institucional/PgTermos'
import PgPrivacidade from './pages/institucional/PgPrivacidade'
import { PgAdminLogin } from './pages/admin/PgAdminLogin'
import { PgAdminDashboard } from './pages/admin/PgAdminDashboard'
import { PgAdminUsers } from './pages/admin/PgAdminUsers'
import PgAdminBooks from './pages/admin/PgAdminBooks'
import { PgAdminResenhas } from './pages/admin/PgAdminResenhas'
import PgAdminComentarios from './pages/admin/PgAdminComentarios'
import api from './services/api'

function Home() {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [resenhas, setResenhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLivros();
    carregarResenhas();
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

  async function carregarResenhas() {
    try {
      const response = await api.get('/resenhas');
      // Filtrar apenas resenhas ativas e pegar as mais recentes
      const resenhasAtivas = (response.data || [])
        .filter(resenha => resenha.ativo !== false)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3); // Pegar apenas as 3 mais recentes
      setResenhas(resenhasAtivas);
    } catch (error) {
      console.error('Erro ao carregar resenhas:', error);
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
    <main style={{ 
      padding: '2rem 1rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    }}>
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
        gap={20}
        autoplay={true}
        autoplayInterval={5000}
        infinite={true}
        maxItemWidth={280}
        title="Livros em Destaque"
      />

      {resenhas.length > 0 && (
        <div style={{ 
          marginTop: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: '2rem', 
            fontWeight: '600',
            textAlign: 'center' 
          }}>
            Resenhas Recentes
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {resenhas.map((resenha) => (
              <Cardreview
                key={resenha.id}
                bookCover={resenha.livro?.fotoCapa 
                  ? `http://localhost:3001${resenha.livro.fotoCapa}` 
                  : '/placeholder.png'}
                userPhoto={resenha.usuario?.fotoPerfil 
                  ? `http://localhost:3001${resenha.usuario.fotoPerfil}` 
                  : null}
                userName={resenha.usuario?.nome || 'Usuário'}
                bookTitle={resenha.livro?.titulo || 'Livro'}
                reviewText={resenha.textoResumo || ''}
                reviewDate={new Date(resenha.createdAt).toLocaleDateString('pt-BR')}
                rating={resenha.avaliacao || 0}
                likes={resenha.curtidas || 0}
                onClick={() => navigate(`/resenha?livroId=${resenha.livroId}`)}
              />
            ))}
          </div>
        </div>
      )}
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
        <Route path="/busca" element={<PgBusca />} />
        <Route path="/perfil" element={<PgPerfil />} />
        
        {/* Support Pages */}
        <Route path="/ajuda" element={<PgAjuda />} />
        <Route path="/contato" element={<PgContato />} />
        <Route path="/termos" element={<PgTermos />} />
        <Route path="/privacidade" element={<PgPrivacidade />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<PgAdminLogin />} />
        <Route path="/admin/dashboard" element={<PgAdminDashboard />} />
        <Route path="/admin/usuarios" element={<PgAdminUsers />} />
        <Route path="/admin/livros" element={<PgAdminBooks />} />
        <Route path="/admin/resenhas" element={<PgAdminResenhas />} />
        <Route path="/admin/comentarios" element={<PgAdminComentarios />} />
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