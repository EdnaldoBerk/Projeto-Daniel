import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'
import { Profile } from '../profile/Profile.user'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

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

  // Explore dropdown state
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false)
  const exploreRef = useRef(null)
  const exploreWrapperRef = useRef(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const admin = localStorage.getItem('admin')
    setIsLoggedIn(!!(user || admin))

    const handleStorageChange = () => {
      const user = localStorage.getItem('user')
      const admin = localStorage.getItem('admin')
      setIsLoggedIn(!!(user || admin))
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChange', handleStorageChange)
    window.addEventListener('adminChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChange', handleStorageChange)
      window.removeEventListener('adminChange', handleStorageChange)
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
      if (
        exploreDropdownOpen &&
        exploreWrapperRef.current &&
        !exploreWrapperRef.current.contains(e.target)
      ) {
        setExploreDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen, exploreDropdownOpen])

  function toggleDropdown() {
    setDropdownOpen((v) => !v)
  }

  function selectFilter(filter) {
    setSelectedFilter(filter)
    setDropdownOpen(false)
  }

  function toggleExploreDropdown() {
    setExploreDropdownOpen((v) => !v)
  }

  function doSearch() {
    const q = query.trim()
    if (!q) return
    const tipo = selectedFilter.value
    navigate(`/busca?q=${encodeURIComponent(q)}&tipo=${encodeURIComponent(tipo)}`)
    setDropdownOpen(false)
    setExploreDropdownOpen(false)
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch() }}
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

          <button className={styles.searchButton} aria-label="Pesquisar" onClick={doSearch}>
            Pesquisar
          </button>

          <div className={styles.exploreWrapper} ref={exploreWrapperRef}>
            <button 
              className={styles.exploreButton} 
              type="button" 
              aria-label="Explorar"
              onClick={toggleExploreDropdown}
              aria-expanded={exploreDropdownOpen}
              aria-haspopup="menu"
            >
              <span>Explorar</span>
              <svg className={styles.chev} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 8L10 12L14 8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {exploreDropdownOpen && (
              <div className={styles.exploreDropdown} ref={exploreRef} role="menu" aria-label="Menu de exploração">
                <Link to="/" className={styles.exploreItem} onClick={() => setExploreDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Página Inicial</span>
                </Link>
                
                <Link to="/" className={styles.exploreItem} onClick={() => setExploreDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Todos os Livros</span>
                </Link>
                
                <Link to="/" className={styles.exploreItem} onClick={() => setExploreDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Autores</span>
                </Link>
                
                <Link to="/" className={styles.exploreItem} onClick={() => setExploreDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 7H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 11H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 15H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 15H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Editoras</span>
                </Link>
                
                <div className={styles.exploreDivider}></div>
                
                <Link to="/" className={styles.exploreItem} onClick={() => setExploreDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Categorias</span>
                </Link>
              </div>
            )}
          </div>

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