import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Estante Aberta Logo" className={styles.logoImage} />
        <span className={styles.logoText}>Estante Aberta</span>
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
        {isLoggedIn ? (
          <> 
            <Link to="/profile" className={`${styles.authButton} ${styles.profileButton}`}>Visualizar Perfil</Link>
            <button onClick={() => { localStorage.removeItem('user'); setIsLoggedIn(false); }} className={`${styles.authButton} ${styles.logoutButton}`}>Logout</button>
          </>
        ) : (
          <> 
            <Link to="/login" className={`${styles.authButton} ${styles.loginButton}`}>Login</Link>
            <Link to="/cadastro" className={`${styles.authButton} ${styles.registerButton}`}>Cadastro</Link>
          </>
        )}
      </div>
    </header>
  );
}