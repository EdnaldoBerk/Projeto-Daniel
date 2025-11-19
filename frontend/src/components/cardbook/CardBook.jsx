import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CardBook.module.css';

export function CardBook({ image, title, author }) {
  const navigate = useNavigate();

  function goToReview() {
    // Passa dados mínimos; PgResenha irá mesclar com defaults
    navigate('/resenha', { state: { book: { title, author, coverImage: image } } });
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
        <button className={`${styles.button} ${styles.favoriteButton}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Favoritar
        </button>
      </div>
    </div>
  );
}
