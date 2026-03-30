import { useState } from 'react';
import api from '../services/api';
import styles from './ReportComentarioModal.module.css';

export default function ReportComentarioModal({ comentarioId, onClose, onSuccess }) {
  const [motivo, setMotivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const motivosDisponiveis = [
    { value: 'spam', label: '🚫 Spam' },
    { value: 'ofensivo', label: '😤 Conteúdo ofensivo' },
    { value: 'inapropriado', label: '⚠️ Conteúdo inapropriado' },
    { value: 'conteudo_falso', label: '❌ Informação falsa' },
    { value: 'outro', label: '🤔 Outro motivo' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!motivo.trim()) {
      setError('Por favor, selecione um motivo');
      return;
    }

    const usuarioData = localStorage.getItem('user') || localStorage.getItem('usuario');
    if (!usuarioData) {
      setError('Você precisa estar logado para denunciar');
      return;
    }

    const { id: usuarioId } = JSON.parse(usuarioData);

    try {
      setLoading(true);
      setError('');

      await api.post('/denuncias', {
        usuarioId,
        comentarioId,
        motivo,
        descricao: descricao.trim() || undefined
      });

      setSuccess('Denúncia enviada com sucesso! Agradecemos por ajudar a manter nosso comunidade segura.');
      setMotivo('');
      setDescricao('');

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      
      // Tratamento especial para denúncia duplicada
      if (err.response?.status === 409) {
        setError('Você já denunciou este comentário');
      } else {
        setError(`Erro ao enviar denúncia: ${errorMsg}`);
      }
      
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>🚩 Denunciar Comentário</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="motivo" className={styles.label}>
              Por que você quer denunciar este comentário? *
            </label>
            <select
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className={styles.select}
              disabled={loading}
            >
              <option value="">Selecione um motivo...</option>
              {motivosDisponiveis.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao" className={styles.label}>
              Descrição adicional (opcional)
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva por que você acredita que este comentário viola as diretrizes..."
              className={styles.textarea}
              maxLength={500}
              disabled={loading}
            />
            <small className={styles.charCount}>{descricao.length}/500</small>
          </div>

          <div className={styles.info}>
            <p>
              ℹ️ <strong>Denúncias anônimas:</strong> Seu nome não será compartilhado com o usuário que fez o comentário.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !motivo}
            >
              {loading ? 'Enviando...' : 'Enviar Denúncia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
