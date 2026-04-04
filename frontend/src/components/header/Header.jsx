import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/Logo.png'
import { Profile } from '../profile/Profile.user'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)
  const debounceTimerRef = useRef(null)

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

  // Busca em tempo real com debounce
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }
    try {
      const { data } = await (async () => {
        const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(searchQuery)}`)
        const text = await res.text()
        const parsed = text ? JSON.parse(text) : null
        return { data: parsed?.results || [] }
      })()
      setSuggestions(Array.isArray(data) ? data.slice(0, 8) : [])
    } catch (e) {
      console.error('Erro ao buscar sugestões:', e)
      setSuggestions([])
    }
  }, [])

  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)
    
    clearTimeout(debounceTimerRef.current)
    if (val.trim() && val.trim().length > 0) {
      setShowSuggestions(true)
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(val)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(livro) {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    navigate(`/resenha?livroId=${livro.id}`)
  }

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function doSearch() {
    const q = query.trim()
    if (!q) return
    navigate(`/busca?q=${encodeURIComponent(q)}`)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="Estante Aberta Logo" className={styles.logoImage} />
        <span className={styles.logoText}>Estante Aberta</span>
      </Link>

      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Busque por título, autor, editora, ISBN..."
              className={styles.searchInput}
              aria-label="Buscar livros"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.trim() && suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => { if (e.key === 'Enter') doSearch() }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestionsDropdown} ref={suggestionsRef} role="listbox">
                {suggestions.map((livro) => (
                  <button
                    key={livro.id}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(livro)}
                    type="button"
                    role="option"
                  >
                    <img 
                      src={livro.fotoCapa ? `http://localhost:3001${livro.fotoCapa}` : '/placeholder.png'}
                      alt={livro.titulo}
                      className={styles.suggestionImage}
                    />
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitle}>{livro.titulo}</div>
                      <div className={styles.suggestionAuthor}>{livro.autor}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={styles.searchButton} aria-label="Pesquisar" onClick={doSearch}>
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
  )
}