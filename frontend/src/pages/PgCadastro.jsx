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

  // Função para formatar CPF
  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara: 000.000.000-00
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return cpf;
  };

  // Função para formatar Telefone
  const formatTelefone = (value) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara: (00) 00000-0000 ou (00) 0000-0000
    if (cleaned.length <= 11) {
      if (cleaned.length <= 10) {
        // Formato: (00) 0000-0000
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      } else {
        // Formato: (00) 00000-0000
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      }
    }
    return telefone;
  };

  // Handler para CPF
  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  // Handler para Telefone
  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Remove formatação antes de enviar
      const cpfLimpo = cpf.replace(/\D/g, '');
      const telefoneLimpo = telefone.replace(/\D/g, '');
      
      await registerUser({ 
        nome, 
        email, 
        telefone: telefoneLimpo, 
        cpf: cpfLimpo, 
        senha 
      });
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
                onChange={handleTelefoneChange}
                maxLength="15"
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
                onChange={handleCPFChange}
                maxLength="14"
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
