import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/PgResenha.module.css";

/**
 * PgResenha.jsx
 * Página de resenha estática (sem backend) para exibir um livro.
 *
 * Uso:
 * - Importe e coloque <PgResenha /> em App.jsx ou na rota desejada.
 * - Opcional: passe um objeto "book" via prop para popular dinamicamente:
 *     <PgResenha book={meuLivro} />
 *
 * Observações:
 * - Layout responsivo: imagem ajustável, coluna esquerda (imagem) + coluna direita (dados).
 * - Relacionados: carrossel horizontal com scroll nativo.
 * - Comentários: formulário local (simula enviar, guarda em estado local).
 */

const defaultBook = {
  title: "Felicidade ordinária",
  author: "Vera Iaconelli",
  authorUrl: "#",
  publisher: "Zahar",
  year: 2024,
  isbn: "9786559791910",
  rating: 4.5,
  reviewsCount: 3,
  coverImage:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b7f0fb7ebd5d2c6b309719a1c9d7c0b", // troque pela sua capa local se preferir
  shortDescription:
    "Sofremos todos, mas não da mesma forma. Em textos memoráveis, a conceituada psicanalista propõe leituras surpreendentes do cotidiano brasileiro e oferece um retrato vívido das angústias contemporâneas.",
  fullDescription:
    "Descrição completa do livro. Aqui você pode colocar o texto longo da sinopse. Atualmente a página funciona sem backend; quando o backend estiver disponível, substitua por dados reais.",
  related: [
    {
      title: "Resenha: Minha Querida Menina – Jennifer McMahon",
      cover:
        "https://images.unsplash.com/photo-1496104679561-38d5a4b8e548?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c8e8a0f1a6b23d3b7b8b3b37a2c2a97",
      url: "#",
    },
    {
      title: "Resenha: Rosa Egipcíaca – Luiz Mott",
      cover:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a5b2c5f1c0d9b9c9dd6f8f5a7d0c0a9",
      url: "#",
    },
    {
      title: "Resenha: O Pássaro Pintado – Jerzy Kosinski",
      cover:
        "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b0a7a6b4a3f1d4e5c1d3f2b6a7c8d9e",
      url: "#",
    },
  ],
};

export default function PgResenha({ book }) {
  const location = useLocation();
  const stateBook = location?.state?.book;
  const mergedBook = { ...defaultBook, ...(book || {}), ...(stateBook || {}) };

  const [showFull, setShowFull] = useState(false);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ comment: "", name: "", email: "", site: "" });
  const [errors, setErrors] = useState({});

  const carouselRef = useRef(null);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!form.comment.trim()) newErrors.comment = "Digite um comentário";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "E-mail inválido";
    return newErrors;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    const newComment = { id: Date.now(), ...form, createdAt: new Date().toISOString() };
    setComments((c) => [newComment, ...c]);
    setForm({ comment: "", name: "", email: "", site: "" });
  };

  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8; // scroll chunk
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span aria-label={`Avaliação ${rating} de 5`}>
        {Array.from({ length: full }).map((_, i) => <span key={`f${i}`}>★</span>)}
        {half && <span key="half">☆</span>}
        {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`}>☆</span>)}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <span>Home</span> <span className={styles.sep}>/</span>
          <span>{mergedBook.publisher}</span> <span className={styles.sep}>/</span>
          <a href={mergedBook.authorUrl}>{mergedBook.author}</a> <span className={styles.sep}>/</span>
          <span className={styles.current}>{mergedBook.title}</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.coverCol}>
            <figure className={styles.figure}>
              <img src={mergedBook.coverImage} alt={`Capa do livro ${mergedBook.title}`} className={styles.coverImage} />
              <figcaption className={styles.caption}>imagem ilustrativa</figcaption>
            </figure>
          </div>
          <div className={styles.detailsCol}>
            <h1 className={styles.title}>{mergedBook.title}</h1>
            <a className={styles.authorLink} href={mergedBook.authorUrl}>{mergedBook.author}</a>
            <div className={styles.ratingRow}>
              <div className={styles.stars}>{renderStars(mergedBook.rating)}</div>
              <div className={styles.ratingInfo}>
                <strong>{mergedBook.rating.toFixed(1)}</strong> | <a href="#comments">{mergedBook.reviewsCount} avaliações</a>
              </div>
            </div>
            <ul className={styles.metaList}>
              <li><strong>Editora:</strong> {mergedBook.publisher}</li>
              <li><strong>Ano:</strong> {mergedBook.year}</li>
              <li><strong>ISBN:</strong> {mergedBook.isbn}</li>
            </ul>
            <div className={styles.synopsis}>
              <p>{showFull ? mergedBook.fullDescription : mergedBook.shortDescription}</p>
              {!showFull && (
                <button type="button" className={styles.readMore} onClick={() => setShowFull(true)} aria-expanded={showFull}>
                  Ler sinopse completa →
                </button>
              )}
            </div>
            <div className={styles.heroActions}>
              <button className={styles.primaryGhost} aria-label="Salvar edição">♡ Salvar</button>
              <button className={styles.primaryGhost} aria-label="Compartilhar">🔗 Compartilhar</button>
            </div>
          </div>
        </section>

        <section className={styles.relatedSection} aria-labelledby="relacionados-heading">
          <header className={styles.sectionHeader}>
            <h2 id="relacionados-heading" className={styles.sectionTitle}>Artigos relacionados</h2>
            <div className={styles.carouselControls}>
              <button type="button" className={styles.arrowBtn} onClick={() => scrollCarousel('prev')} aria-label="Anterior">←</button>
              <button type="button" className={styles.arrowBtn} onClick={() => scrollCarousel('next')} aria-label="Próximo">→</button>
            </div>
          </header>
          <div className={styles.carouselWrapper}>
            <div ref={carouselRef} className={styles.carousel} role="list">
              {mergedBook.related.map((r, idx) => (
                <a className={styles.relatedCard} role="listitem" key={idx} href={r.url}>
                  <div className={styles.relatedImgWrap}>
                    <img src={r.cover} alt={r.title} loading="lazy" />
                  </div>
                  <div className={styles.relatedTitle}>{r.title}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="comments" className={styles.commentsSection} aria-labelledby="comentarios-heading">
          <h2 id="comentarios-heading" className={styles.sectionTitle}>Comentários</h2>
          <form onSubmit={handleSubmit} className={styles.commentForm} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="comment" className={styles.label}>Comentário *</label>
              <textarea id="comment" name="comment" rows={6} value={form.comment} onChange={handleChange} className={`${styles.textarea} ${errors.comment ? styles.invalid : ''}`} aria-invalid={!!errors.comment} required />
              {errors.comment && <div className={styles.errorMsg}>{errors.comment}</div>}
            </div>
            <div className={styles.inlineGrid}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>Nome</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} className={styles.input} placeholder="Seu nome" />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input id="email" name="email" value={form.email} onChange={handleChange} className={`${styles.input} ${errors.email ? styles.invalid : ''}`} placeholder="voce@exemplo.com" aria-invalid={!!errors.email} />
                {errors.email && <div className={styles.errorMsg}>{errors.email}</div>}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="site" className={styles.label}>Site</label>
                <input id="site" name="site" value={form.site} onChange={handleChange} className={styles.input} placeholder="https://" />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>Postar Comentário</button>
            </div>
          </form>
          <div className={styles.commentList}>
            {comments.length === 0 && <p className={styles.emptyState}>Nenhum comentário ainda. Seja o primeiro!</p>}
            {comments.map((c) => (
              <article key={c.id} className={styles.comment} aria-label="Comentário">
                <header className={styles.commentMeta}>
                  <strong>{c.name || 'Anônimo'}</strong>
                  <time className={styles.commentDate} dateTime={c.createdAt}>{new Date(c.createdAt).toLocaleString()}</time>
                </header>
                <p className={styles.commentBody}>{c.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}