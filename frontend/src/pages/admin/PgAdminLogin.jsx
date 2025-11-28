import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/PgAdminLogin.module.css';

export function PgAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password, accessKey })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar dados do admin com flag
      localStorage.setItem('admin', JSON.stringify({ ...data, isAdmin: true }));
      window.dispatchEvent(new Event('adminChange'));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login como administrador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className={styles.title}>Acesso Administrativo</h1>
          <p className={styles.subtitle}>Área restrita - Apenas administradores</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Administrativo
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="accessKey" className={styles.label}>
              Chave de Acesso
            </label>
            <input
              type="password"
              id="accessKey"
              className={styles.input}
              placeholder="Chave secreta"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Acessar Painel'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <button 
            type="button" 
            className={styles.backButton}
            onClick={() => navigate('/login')}
          >
            ← Voltar ao login normal
          </button>
        </div>
      </div>
    </div>
  );
}
