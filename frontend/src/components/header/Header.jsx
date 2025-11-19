import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'
import { Profile } from '../profile/Profile.user'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Filter dropdown state
  const filters = [
    { value: 'livros', label: 'Livros' },
    { value: 'autores', label: 'Autores' },
    { value: 'editoras', label: 'Editoras' },
    { value: 'leitores', label: 'Leitores' }
  ]
  const [selectedFilter, setSelectedFilter] = useState(filters[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)

    const handleStorageChange = () => {
      const user = localStorage.getItem('user')
      setIsLoggedIn(!!user)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChange', handleStorageChange)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  function toggleDropdown() {
    setDropdownOpen((v) => !v)
  }

  function selectFilter(filter) {
    setSelectedFilter(filter)
    setDropdownOpen(false)
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="Estante Aberta Logo" className={styles.logoImage} />
        <span className={styles.logoText}>Estante Aberta</span>
      </Link>

      <div className={styles.searchContainer}>
        <div className={styles.searchBar} ref={wrapperRef}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Busque por título, autor, editora, ISBN..."
              className={styles.searchInput}
              aria-label="Buscar livros"
            />

            <button
              type="button"
              className={styles.filterButton}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              <span>{selectedFilter.label}</span>
              <svg className={styles.chev} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 8L10 12L14 8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <button className={styles.searchButton} aria-label="Pesquisar">
            Pesquisar
          </button>

          <button className={styles.exploreButton} type="button" aria-label="Explorar">
            <span>Explorar</span>
            <svg className={styles.chev} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 8L10 12L14 8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className={styles.filterDropdown} ref={dropdownRef} role="menu" aria-label="Selecionar filtro">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={styles.filterItem}
                  onClick={() => selectFilter(f)}
                  role="menuitem"
                >
                  <span>{f.label}</span>
                  {selectedFilter.value === f.value && (
                    <svg className={styles.filterCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
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
  )
}