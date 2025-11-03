import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="BookUniverse Logo" className={styles.logoImage} />
        <span className={styles.logoText}>BookUniverse</span>
      </div>

      <div className={styles.searchContainer}>
        <select className={styles.filterSelect}>
          <option value="titulo">Título</option>
          <option value="autor">Autor</option>
          <option value="ano">Ano de Publicação</option>
        </select>

        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Procure seu livro aqui"
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            Pesquisar
          </button>
        </div>
      </div>

      <div className={styles.authContainer}>
        <Link to="/login" className={`${styles.authButton} ${styles.loginButton}`}>
          Login
        </Link>
        <Link to="/registro" className={`${styles.authButton} ${styles.registerButton}`}>
          Cadastro
        </Link>
      </div>
    </header>
  )
}