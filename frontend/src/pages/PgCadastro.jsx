import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PgCadastro.module.css';
import BgRight from '../assets/BackgroundRightLogin.jpg';
import Logo from '../assets/Logo.png';
import { registerUser } from '../services/api';

export function PgCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser({ nome, email, telefone, cpf, senha });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar.');
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
          <h1 className={styles.title}>Criar Conta</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="nome" className={styles.label}>Nome</label>
              <input
                type="text"
                id="nome"
                className={styles.input}
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

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
              <label htmlFor="telefone" className={styles.label}>Telefone</label>
              <input
                type="tel"
                id="telefone"
                className={styles.input}
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cpf" className={styles.label}>CPF</label>
              <input
                type="text"
                id="cpf"
                className={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="senha" className={styles.label}>Senha</label>
              <input
                type="password"
                id="senha"
                className={styles.input}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? 'Enviando...' : 'Cadastrar'}
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/login')}
            >
              Já tenho conta
            </button>
          </form>
          {error && <p style={{ color: '#ff6b6b', marginTop: '0.75rem' }}>{error}</p>}
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
