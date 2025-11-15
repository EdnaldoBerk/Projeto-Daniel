import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PgLogin.module.css';
import BgRight from '../assets/BackgroundRightLogin.jpg';
import Logo from '../assets/Logo.png';
import { loginUser } from '../services/api';

export function PgLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser({ email, senha: password });
      // Exemplo simples: guardar usuário no localStorage
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* Lado esquerdo: formulário */}
      <section className={styles.leftPane}>
        <div className={styles.formWrapper}>
          <img src={Logo} alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>Entrar</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/cadastro')}
            >
              Criar conta
            </button>
          </form>
          {error && <p style={{ color: '#ff6b6b', marginTop: '0.75rem' }}>{error}</p>}

          <a href="#" className={styles.forgotPassword}>
            Esqueceu sua senha?
          </a>
        </div>
      </section>

      {/* Lado direito: imagem de fundo */}
      <aside
        className={styles.rightPane}
        aria-hidden="true"
        style={{ '--bg-right': `url(${BgRight})` }}
      />
    </div>
  );
}
