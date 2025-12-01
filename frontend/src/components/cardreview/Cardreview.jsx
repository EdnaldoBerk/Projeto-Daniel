import React from "react";
import styles from "./Cardreview.module.css";

/**
 * Props:
 * - bookCover: URL da capa do livro principal
 * - userPhoto: URL da foto do usuário (opcional)
 * - userName: nome do usuário que fez a resenha
 * - bookTitle: título do livro
 * - reviewText: texto da resenha (será truncado)
 * - reviewDate: data da resenha
 * - rating: avaliação (0-5 estrelas)
 * - likes: número de curtidas
 * - onClick: função chamada ao clicar em "Ver Resenha"
 */
export default function Cardreview({
  bookCover = "/placeholder-book.jpg",
  userPhoto = null,
  userName = "Usuário",
  bookTitle = "Título do Livro",
  reviewText = "Texto da resenha...",
  reviewDate = new Date().toLocaleDateString('pt-BR'),
  rating = 0,
  likes = 0,
  onClick = () => {},
}) {
  // Truncar texto da resenha para preview
  const truncatedReview = reviewText.length > 120 
    ? reviewText.substring(0, 120) + '...' 
    : reviewText;

  // Formatar data
  const formattedDate = typeof reviewDate === 'string' 
    ? reviewDate 
    : reviewDate.toLocaleDateString('pt-BR');

  return (
    <article className={styles.card} aria-labelledby="card-title">
      <div className={styles.media}>
        <img 
          src={bookCover} 
          alt={`Capa do livro ${bookTitle}`}
          className={styles.bookCover}
          loading="lazy"
        />
        
        <div className={styles.userBadge}>
          {userPhoto ? (
            <img src={userPhoto} alt={userName} className={styles.userPhoto} />
          ) : (
            <div className={styles.userInitials}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <span className={styles.reviewBy}>Por {userName}</span>
          <div className={styles.stars} aria-label={`Avaliação: ${rating} de 5 estrelas`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.star} ${i < Math.round(rating) ? styles.filled : ""}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <h3 id="card-title" className={styles.bookTitle}>
          {bookTitle}
        </h3>

        <p className={styles.reviewExcerpt}>{truncatedReview}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className={styles.metaText}>{formattedDate}</span>
          </div>

          <div className={styles.metaItem}>
            <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.metaText}>{likes} {likes === 1 ? 'curtida' : 'curtidas'}</span>
          </div>
        </div>

        <button className={styles.cta} onClick={onClick}>
          VER RESENHA
        </button>
      </div>
    </article>
  );
}