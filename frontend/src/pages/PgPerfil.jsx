import React from 'react';
import styles from '../styles/PgPerfil.module.css';

const sampleFavorites = [
  { id: 1, title: 'O Conde de Monte Cristo', cover: 'https://via.placeholder.com/100x150?text=Monte+Cristo' },
  { id: 2, title: 'A Máquina que mudou o mundo', cover: 'https://via.placeholder.com/100x150?text=Máquina' },
  { id: 3, title: 'Sêneca', cover: 'https://via.placeholder.com/100x150?text=Sêneca' },
];

const sampleCollection = [
  { id: 1, title: 'O Conde de Monte Cristo', cover: 'https://via.placeholder.com/80x120?text=Monte+Cristo' },
  { id: 2, title: 'A Máquina que mudou o mundo', cover: 'https://via.placeholder.com/80x120?text=Máquina' },
  { id: 3, title: 'Descartes', cover: 'https://via.placeholder.com/80x120?text=Descartes' },
  { id: 4, title: 'O Príncipe', cover: 'https://via.placeholder.com/80x120?text=Príncipe' },
  { id: 5, title: 'O Mito da Caverna', cover: 'https://via.placeholder.com/80x120?text=Caverna' },
  { id: 6, title: 'Sêneca', cover: 'https://via.placeholder.com/80x120?text=Sêneca' },
];

export default function PgPerfil() {
  return (
  <main className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Meu Perfil</button>
        <button className={styles.tab}>Conta</button>
      </nav>

      <section className={styles.profileCard}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar} aria-hidden="true">
            <span className={styles.avatarIcon}>👤</span>
          </div>
        </div>

        <div className={styles.profileMain}>
          <h1 className={styles.name}>Ruan Miguel</h1>

          <div className={styles.stats}>
            <div className={styles.statItem}><span className={styles.statNumber}>56</span> Seguidores</div>
            <div className={styles.statItem}><span className={styles.statNumber}>130</span> Seguindo</div>
          </div>

          <div className={styles.actionLinks}>
            <button className={styles.btnPrimary}>➕ Adicionar foto do perfil</button>
            <button className={styles.btnOutline}>✏️ Modificar dados pessoais</button>
          </div>
        </div>
      </section>

      <hr className={styles.hr} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sobre você</h2>
        <div className={styles.sectionBody}>
          <button className={styles.smallAction}>➕ Adicionar minibio</button>
          <ul className={styles.bullets}>
            <li>🗣️ Gosto de conversar</li>
            <li>✈️ Amo viajar</li>
          </ul>
        </div>
      </section>

      <hr className={styles.hr} />

      <section className={styles.section}>
        <h2 className={styles.libraryTitle}>BIBLIOTECA</h2>

        <div className={styles.subsection}>
          <h3 className={styles.subTitle}>FAVORITOS ⭐</h3>
          <div className={styles.grid}>
            {sampleFavorites.map((book) => (
              <figure key={book.id} className={styles.bookCard}>
                <img src={book.cover} alt="" className={styles.bookCover} />
                <figcaption className={styles.bookTitle}>{book.title}</figcaption>
              </figure>
            ))}

            <button className={`${styles.plusCard}`} aria-label="Adicionar favorito">
              <div className={styles.plusSign}>+</div>
            </button>

            <button className={`${styles.plusCard}`} aria-label="Adicionar favorito">
              <div className={styles.plusSign}>+</div>
            </button>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subTitle}>COLEÇÃO 📚</h3>
          <div className={styles.gridCollection}>
            {sampleCollection.map((book) => (
              <figure key={book.id} className={styles.colCard}>
                <img src={book.cover} alt="" className={styles.bookCoverSmall} />
                <figcaption className={styles.bookTitleSmall}>{book.title}</figcaption>
              </figure>
            ))}

            {/* espaços + para completar a grade */}
            {[...Array(4)].map((_, i) => (
              <button key={i} className={styles.plusCardSmall} aria-label="Adicionar à coleção">
                <div className={styles.plusSignSmall}>+</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  </main>
  );
}