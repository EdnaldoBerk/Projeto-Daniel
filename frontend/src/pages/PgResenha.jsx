import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/PgResenha.module.css";

/**
 * PgResenha.jsx
 * Página de Resenha de Livro (Dark Mode) - sem Header/Footer
 *
 * Coloque este arquivo em src/pages/ e o CSS em src/pages/PgResenha.module.css
 *
 * Uso:
 *  <PgResenha />
 */

const defaultData = {
  title: "Tudo que acontece aqui dentro – Resenha",
  author: "Júlio Hermann",
  publisher: "Faro",
  year: "2018",
  pages: "192",
  isbn: "",
  date: "05/08/2025",
  short:
    "Tudo que acontece aqui dentro é um livro diferente de todos que já li; não se trata de uma história apenas, mas de várias cartas que trazem emoção, lembranças e linguagem poética.",
  full:
    "Não é um livro que você precisa ler na sequência; as histórias são independentes e os personagens também. Algumas cartas são intensas e é preciso ser mais sensível para entender essa proposta. É importante entender que não há um enredo formado e você nunca sabe o que virá na próxima carta. São sentimentos e emoções de outras pessoas que em alguns momentos podem fazer sentido para você e em outros não. Em alguns momentos a intensidade também pode te incomodar e você pode deixar o livro de lado por algum tempo.",
  excerpts: [
    `"Quando a gente não diz o que sente, o outro vai embora sem saber que talvez tivesse um motivo para ficar". (p.27)`,
    `"Autossabotagem é a gente morrer engasgado vendo a outra pessoa partir". (p.27)`,
    `"Dia desses a gente se encontra e eu te conto que todas essas metáforas que eu crio sobre o amor são sobre você". (p.40)`,
  ],
  gallery: ["https://placehold.co/1000x380?text=Galeria+do+Livro"],
  avatar: "https://placehold.co/128x128?text=U",
  hero: "https://placehold.co/1600x480?text=Banner+do+Livro",
  tags: ["#CARTAS", "#PENSAMENTOS", "#POESIA", "#ROMANCE"],
};

function StarRating({ value = 4.2 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className={styles.stars} aria-label={`Avaliação ${value} de 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`}>★</span>
      ))}
      {half && <span key="half">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`}>☆</span>
      ))}
    </div>
  );
}

export default function PgResenha({ data }) {
  const location = useLocation();
  const stateBook = location?.state?.book;
  const book = { ...defaultData, ...(data || {}), ...(stateBook || {}) };
  const [reaction, setReaction] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  function handlePostComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const c = {
      id: Date.now(),
      text: commentText.trim(),
      date: new Date().toISOString(),
    };
    setComments((s) => [c, ...s]);
    setCommentText("");
  }

  return (
    <div className={styles.page}>
      {/* Banner */}
      <div
        className={styles.banner}
        role="img"
        aria-label={`Banner: ${book.title}`}
        style={{ backgroundImage: `url(${book.hero})` }}
      >
        <div className={styles.bannerFade} />
      </div>

      {/* Card container overlapping banner */}
      <main className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarWrap}>
              <img src={book.avatar} alt="ícone do resenhista" className={styles.avatar} />
            </div>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{book.title}</h1>
              <div className={styles.metaRow}>
                <span className={styles.author}>{book.author}</span>
                <span className={styles.separator}>•</span>
                <StarRating value={4.3} />
              </div>
            </div>
          </div>
        </header>

        {/* Lead / Texto principal */}
        <section className={styles.leadSection}>
          <p className={styles.lead}>{book.short}</p>

          <div className={styles.articleText}>
            <p>{book.full}</p>
            <p>
              Algumas cartas são intensas, outras mais sutis. A leitura exige disponibilidade emocional e permite que o leitor
              se reconheça em trechos e imagens, sem a necessidade de um enredo linear.
            </p>
            <p>
              A linguagem poética do autor cria momentos de grande sensibilidade e também desconforto — o que é, muitas vezes,
              sinal de uma obra que provoca e não apenas entretém.
            </p>
          </div>
        </section>

        {/* Trechos Marcantes */}
        <section className={styles.excerptsSection}>
          <h2 className={styles.sectionTitle}>Trechos marcantes de {book.title}</h2>
          <div className={styles.excerpts}>
            {book.excerpts.map((q, i) => (
              <blockquote key={i} className={styles.quote}>
                <em>{q}</em>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Galeria + link */}
        <section className={styles.gallerySection}>
          <figure className={styles.galleryFigure}>
            <img src={book.gallery[0]} alt="Ilustrações do livro" className={styles.galleryImg} />
            <figcaption className={styles.galleryCaption}>O livro possui lindas ilustrações.</figcaption>
          </figure>

          <p className={styles.amazonLink}>
            Encontre o livro no site Amazon{" "}
            <a href="#" className={styles.inlineLink} rel="noopener noreferrer"> (clique aqui) </a>
          </p>
        </section>

        {/* Ficha Técnica (tabela) */}
        <section className={styles.metaSection}>
          <table className={styles.metaTable}>
            <tbody>
              <tr>
                <th>Título</th>
                <td>{book.title}</td>
              </tr>
              <tr>
                <th>Autor</th>
                <td>{book.author}</td>
              </tr>
              <tr>
                <th>Ano</th>
                <td>{book.year}</td>
              </tr>
              <tr>
                <th>Editora</th>
                <td>{book.publisher}</td>
              </tr>
              <tr>
                <th>Páginas</th>
                <td>{book.pages}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Post footer: date + tags */}
        <section className={styles.postFooter}>
          <div className={styles.postInfo}>
            <span className={styles.calendar} aria-hidden>📅</span>
            <time dateTime="2025-08-05" className={styles.postDate}>{book.date}</time>
          </div>
          <div className={styles.tags}>
            {book.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </section>

        {/* Comentários / estilo Disqus-like */}
        <section className={styles.commentsWrap}>
          <h2 className={styles.sectionTitle}>Comentários</h2>

          {/* Policy card */}
          <div className={styles.policyCard}>
            <div className={styles.policyText}>
              <strong>Política de comentários</strong>
              <p>Por favor, leia nossa política de comentários antes de postar.</p>
            </div>
            <button className={styles.policyButton}>Compreendi</button>
          </div>

          {/* Reactions */}
          <div className={styles.reactionsRow}>
            <div className={styles.reactionsTitle}>O que você achou?</div>
            <div className={styles.reactionButtons}>
              {[
                { id: "like", emoji: "👍", label: "Gostei" },
                { id: "fun", emoji: "😆", label: "Engraçado" },
                { id: "love", emoji: "😍", label: "Amei" },
                { id: "wow", emoji: "😮", label: "Uau" },
                { id: "sad", emoji: "😢", label: "Triste" },
              ].map((r) => (
                <button
                  key={r.id}
                  className={`${styles.reactionBtn} ${reaction === r.id ? styles.reactionActive : ""}`}
                  onClick={() => setReaction(r.id)}
                  aria-pressed={reaction === r.id}
                  title={r.label}
                >
                  <span className={styles.emoji}>{r.emoji}</span>
                  <small className={styles.reactionLabel}>{r.label}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Comment input with social icons (simulated) */}
          <div className={styles.commentCard}>
            <div className={styles.commentInputRow}>
              <div className={styles.socialIcons}>
                <button className={styles.socialIcon} title="Login com Google">G</button>
                <button className={styles.socialIcon} title="Login com Facebook">f</button>
                <button className={styles.socialIcon} title="Login com Apple"></button>
              </div>

              <form onSubmit={handlePostComment} className={styles.commentForm}>
                <input
                  type="text"
                  placeholder="Iniciar debate..."
                  className={styles.commentInput}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className={styles.commentActions}>
                  <button type="submit" className={styles.postButton}>Publicar</button>
                </div>
              </form>
            </div>

            {/* Small footer links under comment area */}
            <div className={styles.commentFooter}>
              <a href="#" className={styles.footerLink}>Subscrever</a>
              <a href="#" className={styles.footerLink}>Privacidade</a>
              <a href="#" className={styles.footerLink}>Não vender os meus dados</a>
            </div>
          </div>

          {/* Comment list */}
          <div className={styles.commentList}>
            {comments.length === 0 && <div className={styles.emptyComments}>Seja o primeiro a comentar!</div>}
            {comments.map((c) => (
              <article key={c.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAvatar}>U</div>
                  <div className={styles.commentMeta}>
                    <strong>Anônimo</strong>
                    <time dateTime={c.date} className={styles.commentTime}>{new Date(c.date).toLocaleString()}</time>
                  </div>
                </div>
                <p className={styles.commentText}>{c.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}