import React, { useState } from 'react';
import styles from '../../styles/PgContato.module.css';

export default function PgContato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    setEnviado(true);
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Fale Conosco</h1>
          <p className={styles.subtitle}>
            Tem alguma dúvida ou sugestão? Entre em contato com nosso time
          </p>
        </section>

        <div className={styles.content}>
          {/* Formulário */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Envie uma Mensagem</h2>
            
            {enviado && (
              <div className={styles.successMessage}>
                ✓ Mensagem enviada com sucesso! Responderemos em breve.
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>E-mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="assunto" className={styles.label}>Assunto *</label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="problema">Relatar um Problema</option>
                  <option value="parceria">Parceria</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensagem" className={styles.label}>Mensagem *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Escreva sua mensagem aqui..."
                  className={styles.textarea}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Enviar Mensagem
              </button>
            </form>
          </section>

          {/* Informações de Contato */}
          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Outras Formas de Contato</h2>

            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📧</div>
                <h3>E-mail</h3>
                <p><a href="mailto:suporte@estanteaberta.com">suporte@estanteaberta.com</a></p>
                <small>Respondemos em até 24 horas</small>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💬</div>
                <h3>Chat ao Vivo</h3>
                <p><a href="#">Iniciar Chat</a></p>
                <small>Disponível de seg-sex, 9h às 18h</small>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🐙</div>
                <h3>Redes Sociais</h3>
                <p>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                  {' | '}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </p>
                <small>Mensagens respondidas em até 48 horas</small>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>❓</div>
                <h3>FAQ</h3>
                <p><a href="/ajuda">Central de Ajuda</a></p>
                <small>Respostas para as dúvidas mais comuns</small>
              </div>
            </div>
          </section>
        </div>

        {/* Horário de Atendimento */}
        <section className={styles.scheduleSection}>
          <h2 className={styles.sectionTitle}>Horário de Atendimento</h2>
          <div className={styles.scheduleBox}>
            <div className={styles.scheduleItem}>
              <span>Segunda a Sexta:</span>
              <strong>9h00 - 18h00</strong>
            </div>
            <div className={styles.scheduleItem}>
              <span>Sábado:</span>
              <strong>10h00 - 14h00</strong>
            </div>
            <div className={styles.scheduleItem}>
              <span>Domingo:</span>
              <strong>Fechado</strong>
            </div>
            <p className={styles.timezone}>Horário de Brasília (GMT-3)</p>
          </div>
        </section>
      </div>
    </div>
  );
}
