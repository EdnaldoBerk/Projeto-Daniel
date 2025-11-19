import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { CardBook } from './components/cardbook/CardBook'
import Slider from './components/slider/Slider'
import { PgLogin } from './pages/PgLogin'
import { PgCadastro } from './pages/PgCadastro'
import PgResenha from './pages/PgResenha'

const booksData = [
  {
    id: 1,
    image: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien"
  },
  {
    id: 2,
    image: "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg",
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling"
  },
  {
    id: 3,
    image: "https://m.media-amazon.com/images/I/81ibfYk4qmL._AC_UF1000,1000_QL80_.jpg",
    title: "1984",
    author: "George Orwell"
  },
  {
    id: 4,
    image: "https://m.media-amazon.com/images/I/71nXPGovoTL._AC_UF1000,1000_QL80_.jpg",
    title: "O Hobbit",
    author: "J.R.R. Tolkien"
  },
  {
    id: 5,
    image: "https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez"
  },
  {
    id: 6,
    image: "https://m.media-amazon.com/images/I/71yJLhQekBL._AC_UF1000,1000_QL80_.jpg",
    title: "A Revolução dos Bichos",
    author: "George Orwell"
  },
  {
    id: 7,
    image: "https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry"
  },
  {
    id: 8,
    image: "https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry"
  }
];

function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <Slider 
        items={booksData}
        renderItem={(book) => (
          <CardBook 
            key={book.id}
            image={book.image}
            title={book.title}
            author={book.author}
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
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/cadastro';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PgLogin />} />
        <Route path="/cadastro" element={<PgCadastro />} />
        <Route path="/resenha" element={<PgResenha />} />
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