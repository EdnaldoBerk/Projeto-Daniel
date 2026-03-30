import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/admin/PgAdminResenhas.module.css';
import adminStyles from '../../styles/admin/PgAdminUsers.module.css';
import api from '../../services/api';

export function PgAdminResenhas() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [resenhas, setResenhas] = useState([]);
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingResenha, setEditingResenha] = useState(null);
  const [formData, setFormData] = useState({
    livroId: '',
    usuarioId: '',
    titulo: '',
    textoResumo: '',
    textoCompleto: '',
    avaliacao: 5,
    trechosMarcantes: [''],
    ativo: true
  });

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    const parsed = JSON.parse(adminData);
    if (!parsed.isAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdmin(parsed);
    carregarDados();
  }, [navigate]);

  async function carregarDados() {
    setLoading(true);
    try {
      const [resenhasRes, livrosRes, usuariosRes] = await Promise.all([
        api.get('/admin/resenhas'),
        api.get('/admin/livros'),
        api.get('/admin/usuarios')
      ]);
      setResenhas(resenhasRes.data || []);
      setLivros(livrosRes.data || []);
      setUsuarios(usuariosRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateResenha() {
    setEditingResenha(null);
    setFormData({
      livroId: '',
      usuarioId: admin.id,
      titulo: '',
      textoResumo: '',
      textoCompleto: '',
      avaliacao: 5,
      trechosMarcantes: [''],
      ativo: true
    });
    setShowCreateModal(true);
  }

  function handleEditResenha(resenha) {
    setEditingResenha(resenha);
    setFormData({
      livroId: resenha.livroId,
      usuarioId: resenha.usuarioId,
      titulo: resenha.titulo,
      textoResumo: resenha.textoResumo,
      textoCompleto: resenha.textoCompleto,
      avaliacao: resenha.avaliacao,
      trechosMarcantes: resenha.trechosMarcantes.length > 0 ? resenha.trechosMarcantes : [''],
      ativo: resenha.ativo
    });
    setShowCreateModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const trechosFiltrados = formData.trechosMarcantes.filter(t => t.trim() !== '');
    
    const data = {
      ...formData,
      trechosMarcantes: trechosFiltrados,
      livroId: parseInt(formData.livroId),
      usuarioId: parseInt(formData.usuarioId),
      avaliacao: parseFloat(formData.avaliacao)
    };

    try {
      if (editingResenha) {
        await api.put(`/admin/resenhas/${editingResenha.id}`, data);
        alert('Resenha atualizada com sucesso!');
      } else {
        await api.post('/resenhas', data);
        alert('Resenha criada com sucesso!');
      }
      setShowCreateModal(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar resenha:', error);
      alert(error.response?.data?.error || 'Erro ao salvar resenha');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja deletar esta resenha?')) return;
    try {
      await api.delete(`/admin/resenhas/${id}`);
      alert('Resenha deletada com sucesso!');
      carregarDados();
    } catch (error) {
      console.error('Erro ao deletar resenha:', error);
      alert('Erro ao deletar resenha');
    }
  }

  async function handleToggleAtivo(id, ativoAtual) {
    try {
      await api.put(`/admin/resenhas/${id}`, { ativo: !ativoAtual });
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  }

  function addTrecho() {
    setFormData({
      ...formData,
      trechosMarcantes: [...formData.trechosMarcantes, '']
    });
  }

  function removeTrecho(index) {
    const novos = formData.trechosMarcantes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      trechosMarcantes: novos.length > 0 ? novos : ['']
    });
  }

  function updateTrecho(index, value) {
    const novos = [...formData.trechosMarcantes];
    novos[index] = value;
    setFormData({ ...formData, trechosMarcantes: novos });
  }

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event('adminChange'));
    navigate('/admin/login');
  };

  if (!admin) return <div>Carregando...</div>;

  return (
    <div className={adminStyles.container}>
      <aside className={adminStyles.sidebar}>
        <div className={adminStyles.logo}>
          <div className={adminStyles.logoIcon}>⚡</div>
          <h2 className={adminStyles.logoText}>Admin Panel</h2>
        </div>

        <nav className={adminStyles.nav}>
          <button className={adminStyles.navItem} onClick={() => navigate('/admin/dashboard')}>
            <span className={adminStyles.navIcon}>📊</span>
            Dashboard
          </button>
          <button className={adminStyles.navItem} onClick={() => navigate('/admin/usuarios')}>
            <span className={adminStyles.navIcon}>👥</span>
            Usuários
          </button>
          <button className={adminStyles.navItem} onClick={() => navigate('/admin/livros')}>
            <span className={adminStyles.navIcon}>📚</span>
            Livros
          </button>
          <button className={`${adminStyles.navItem} ${adminStyles.active}`}>
            <span className={adminStyles.navIcon}>⭐</span>
            Resenhas
          </button>
          <button className={adminStyles.navItem} onClick={() => navigate('/admin/comentarios')}>
            <span className={adminStyles.navIcon}>💬</span>
            Comentários
          </button>
        </nav>

        <div className={adminStyles.navDivider}></div>

        <button className={adminStyles.backToSiteButton} onClick={() => navigate('/')}>
          <span className={adminStyles.navIcon}>🏠</span>
          Voltar ao site
        </button>

        <button className={adminStyles.logoutButton} onClick={handleLogout}>
          <span className={adminStyles.navIcon}>🚪</span>
          Sair
        </button>
      </aside>

      <main className={adminStyles.main}>
        <header className={adminStyles.header}>
          <div>
            <h1 className={adminStyles.pageTitle}>Gerenciar Resenhas</h1>
            <p className={adminStyles.pageSubtitle}>
              {loading ? 'Carregando...' : `${resenhas.length} resenha(s) cadastrada(s)`}
            </p>
          </div>
          <button className={adminStyles.createButton} onClick={handleCreateResenha}>
            <span>➕</span>
            Criar Nova Resenha
          </button>
        </header>

        {loading && <div className={styles.loading}>Carregando resenhas...</div>}

        {!loading && (
          <div className={adminStyles.tableContainer}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Livro</th>
                  <th>Título da Resenha</th>
                  <th>Autor</th>
                  <th>Avaliação</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {resenhas.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Nenhuma resenha cadastrada
                    </td>
                  </tr>
                ) : (
                  resenhas.map((resenha) => (
                    <tr key={resenha.id}>
                      <td>{resenha.id}</td>
                      <td>{resenha.livro?.titulo || 'N/A'}</td>
                      <td>{resenha.titulo}</td>
                      <td>{resenha.usuario?.nome || 'N/A'}</td>
                      <td>
                        <span className={styles.rating}>
                          ⭐ {resenha.avaliacao.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleAtivo(resenha.id, resenha.ativo)}
                          className={resenha.ativo ? styles.ativo : styles.inativo}
                        >
                          {resenha.ativo ? 'Ativa' : 'Inativa'}
                        </button>
                      </td>
                      <td>{new Date(resenha.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <div className={adminStyles.actions}>
                          <button
                            className={adminStyles.btnEdit}
                            onClick={() => handleEditResenha(resenha)}
                          >
                            ✏️
                          </button>
                          <button
                            className={adminStyles.btnDelete}
                            onClick={() => handleDelete(resenha.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showCreateModal && (
          <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingResenha ? 'Editar Resenha' : 'Criar Nova Resenha'}</h2>
                <button className={styles.closeButton} onClick={() => setShowCreateModal(false)}>
                  ✖
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Livro *</label>
                    <select
                      value={formData.livroId}
                      onChange={(e) => setFormData({ ...formData, livroId: e.target.value })}
                      required
                      className={styles.select}
                    >
                      <option value="">Selecione um livro</option>
                      {livros.map((livro) => (
                        <option key={livro.id} value={livro.id}>
                          {livro.titulo} - {livro.autor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Avaliação *</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.avaliacao}
                      onChange={(e) => setFormData({ ...formData, avaliacao: e.target.value })}
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Título da Resenha *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    className={styles.input}
                    placeholder="Ex: Uma obra-prima da literatura moderna"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Resumo da Resenha *</label>
                  <textarea
                    value={formData.textoResumo}
                    onChange={(e) => setFormData({ ...formData, textoResumo: e.target.value })}
                    required
                    rows="3"
                    className={styles.textarea}
                    placeholder="Breve resumo que aparecerá no início..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Texto Completo da Resenha *</label>
                  <textarea
                    value={formData.textoCompleto}
                    onChange={(e) => setFormData({ ...formData, textoCompleto: e.target.value })}
                    required
                    rows="8"
                    className={styles.textarea}
                    placeholder="Resenha completa e detalhada..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Trechos Marcantes</label>
                  {formData.trechosMarcantes.map((trecho, index) => (
                    <div key={index} className={styles.trechoRow}>
                      <input
                        type="text"
                        value={trecho}
                        onChange={(e) => updateTrecho(index, e.target.value)}
                        className={styles.input}
                        placeholder={`Trecho ${index + 1}`}
                      />
                      {formData.trechosMarcantes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTrecho(index)}
                          className={styles.btnRemove}
                        >
                          ✖
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTrecho}
                    className={styles.btnAddTrecho}
                  >
                    + Adicionar Trecho
                  </button>
                </div>

                <div className={styles.formGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  <label htmlFor="ativo">Resenha ativa (visível para usuários)</label>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnSubmit}>
                    {editingResenha ? 'Atualizar' : 'Criar'} Resenha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
