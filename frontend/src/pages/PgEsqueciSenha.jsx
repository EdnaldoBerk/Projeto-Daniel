import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../services/api';
import styles from '../styles/PgEsqueciSenha.module.css';

export default function PgEsqueciSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isResetStep = Boolean(token);

  async function handleRequestReset(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await requestPasswordReset({ email });
      setSuccess(data?.message || 'Solicitacao enviada com sucesso.');

      // Como nao temos envio de email no ambiente atual, redireciona usando o token retornado.
      if (data?.resetToken) {
        navigate(`/esqueci-senha?token=${encodeURIComponent(data.resetToken)}`);
      }
    } catch (err) {
      setError(err.message || 'Erro ao solicitar recuperacao de senha.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (novaSenha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas nao conferem.');
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        token,
        novaSenha,
        confirmarSenha
      });
      setSuccess(data?.message || 'Senha redefinida com sucesso.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>
          {isResetStep ? 'Redefinir senha' : 'Esqueci minha senha'}
        </h1>

        {!isResetStep ? (
          <form onSubmit={handleRequestReset} className={styles.form}>
            <label htmlFor="email" className={styles.label}>E-mail cadastrado</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar recuperacao'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <label htmlFor="novaSenha" className={styles.label}>Nova senha</label>
            <input
              id="novaSenha"
              type="password"
              className={styles.input}
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />

            <label htmlFor="confirmarSenha" className={styles.label}>Confirmar nova senha</label>
            <input
              id="confirmarSenha"
              type="password"
              className={styles.input}
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <Link to="/login" className={styles.backLink}>Voltar para login</Link>
      </section>
    </main>
  );
}
