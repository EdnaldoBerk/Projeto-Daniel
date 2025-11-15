import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PgLogin.module.css';
import BgRight from '../assets/BackgroundRightLogin.jpg';
import Logo from '../assets/Logo.png';

export function PgLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    console.log('Login tentado com:', { email, password });
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

            <button type="submit" className={styles.loginButton}>
              Entrar
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/cadastro')}
            >
              Criar conta
            </button>
          </form>

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
