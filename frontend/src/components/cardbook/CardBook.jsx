import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CardBook.module.css';

export function CardBook({ id, image, title, author }) {
  const navigate = useNavigate();
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      checkFavorito(parsed.id);
    }
  }, [id]);

  const checkFavorito = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/favoritos/${userId}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorito(data.isFavorito);
      }
    } catch (err) {
      console.error('Erro ao verificar favorito:', err);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorito) {
        // Remover favorito
        const response = await fetch(`http://localhost:3001/api/favoritos/${user.id}/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setIsFavorito(false);
        }
      } else {
        // Adicionar favorito
        const response = await fetch('http://localhost:3001/api/favoritos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: user.id, livroId: id })
        });
        
        if (response.ok) {
          setIsFavorito(true);
        }
      }
    } catch (err) {
      console.error('Erro ao favoritar:', err);
    } finally {
      setLoading(false);
    }
  };

  function goToReview() {
    // Passa o ID do livro para buscar as resenhas
    navigate('/resenha', { state: { livroId: id, livro: { id, titulo: title, autor: author, fotoCapa: image } } });
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={`Capa do livro ${title}`} 
          className={styles.bookImage}
        />
      </div>
      
      <div className={styles.bookInfo}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.author}>{author}</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.reviewButton}`} onClick={goToReview}>
          Ler Resenhas
        </button>
        <button 
          className={`${styles.button} ${styles.favoriteButton} ${isFavorito ? styles.favorited : ''}`}
          onClick={handleFavorite}
          disabled={loading}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isFavorito ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {isFavorito ? 'Favoritado' : 'Favoritar'}
        </button>
      </div>
    </div>
  );
}
