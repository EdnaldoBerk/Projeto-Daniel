import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/header/Header'
import { CardBook } from './components/cardbook/CardBook'
import { PgLogin } from './pages/PgLogin'

function Home() {
  return (
    <main style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <CardBook 
        image="https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg"
        title="O Senhor dos Anéis"
        author="J.R.R. Tolkien"
      />
    </main>
  );
}

function AppLayout() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PgLogin />} />
      </Routes>
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