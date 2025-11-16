import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'
import { Profile } from '../profile/Profile.user'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    // Listener para atualizar o estado quando o login/logout acontecer
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event para mudanças no mesmo tab
    window.addEventListener('userChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChange', handleStorageChange);
    };
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
          <Profile />
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