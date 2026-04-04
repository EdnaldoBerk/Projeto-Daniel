import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { CardBook } from '../components/cardbook/CardBook'

export default function PgBusca() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') || ''
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`)
        if (!mounted) return
        setResults(Array.isArray(data?.results) ? data.results : [])
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'Erro ao buscar')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (q.trim()) run()
    else {
      setResults([])
      setLoading(false)
    }
    return () => { mounted = false }
  }, [q])

  function goHome() { navigate('/') }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
          Resultados para "{q}"
        </h1>
        <button onClick={goHome} style={{ background: 'transparent', border: '1px solid #646cff', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>Voltar</button>
      </div>

      {loading && <p style={{ marginTop: 24 }}>Buscando...</p>}
      {error && <p style={{ marginTop: 24, color: '#f87171' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {results.length === 0 && <p>Nenhum livro encontrado.</p>}
            {results.map((livro) => (
              <CardBook
                key={livro.id}
                id={livro.id}
                image={livro.fotoCapa ? `http://localhost:3001${livro.fotoCapa}` : '/placeholder.png'}
                title={livro.titulo}
                author={livro.autor}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
