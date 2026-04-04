import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/admin/PgAdminComentarios.module.css';
import adminStyles from '../../styles/admin/PgAdminUsers.module.css';

export default function PgAdminComentarios() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comentarios'); // 'comentarios' ou 'denuncias'
  const [denuncias, setDenuncias] = useState([]);
  const [denunciaFilter, setDenunciaFilter] = useState('pendente'); // 'pendente', 'analisado', 'rejeitado'
  const [selectedComentario, setSelectedComentario] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar autenticação
  useEffect(() => {
    const adminRaw = localStorage.getItem('admin');
    if (!adminRaw) {
      navigate('/admin/login');
      return;
    }

    const admin = JSON.parse(adminRaw);
    if (!admin?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdmin(admin);
  }, [navigate]);

  // Carregar comentários
  useEffect(() => {
    if (activeTab === 'comentarios') {
      carregarComentarios();
    }
  }, [activeTab]);

  // Carregar denúncias
  useEffect(() => {
    if (activeTab === 'denuncias') {
      carregarDenuncias();
    }
  }, [activeTab, denunciaFilter]);

  const carregarComentarios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/comentarios');
      setComentarios(response.data);
    } catch (err) {
      setError('Erro ao carregar comentários: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarDenuncias = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/admin/denuncias?status=${denunciaFilter}`);
      setDenuncias(response.data);
    } catch (err) {
      setError('Erro ao carregar denúncias: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (comentario) => {
    setEditingId(comentario.id);
    setEditText(comentario.texto);
  };

  const salvarEdicao = async (comentarioId) => {
    try {
      if (!editText.trim()) {
        setError('Texto do comentário não pode estar vazio');
        return;
      }
      
      await api.put(`/admin/comentarios/${comentarioId}`, { texto: editText });
      setSuccess('Comentário atualizado com sucesso!');
      setEditingId(null);
      carregarComentarios();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar: ' + (err.response?.data?.error || err.message));
    }
  };

  const deletarComentario = async (comentarioId) => {
    if (!window.confirm('Tem certeza que quer deletar este comentário?')) return;

    try {
      await api.delete(`/admin/comentarios/${comentarioId}`);
      setSuccess('Comentário deletado com sucesso!');
      carregarComentarios();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar: ' + (err.response?.data?.error || err.message));
    }
  };

  const atualizarStatusDenuncia = async (denunciaId, novoStatus) => {
    try {
      await api.put(`/admin/denuncias/${denunciaId}`, { status: novoStatus });
      setSuccess('Status da denúncia atualizado!');
      carregarDenuncias();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar status: ' + (err.response?.data?.error || err.message));
    }
  };

  const removerDenuncia = async (denunciaId) => {
    if (!window.confirm('Tem certeza que deseja retirar esta denúncia?')) return;

    try {
      await api.delete(`/admin/denuncias/${denunciaId}`);
      setSuccess('Denúncia removida com sucesso!');
      setSelectedComentario(null);
      await carregarComentarios();
      if (activeTab === 'denuncias') {
        await carregarDenuncias();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao remover denúncia: ' + (err.response?.data?.error || err.message));
    }
  };

  const abrirDetalhesComentario = (comentario) => {
    setSelectedComentario(comentario);
  };

  const fecharDetalhes = () => {
    setSelectedComentario(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event('adminChange'));
    navigate('/admin/login');
  };

  const renderStars = (nota) => {
    if (!nota || nota < 1 || nota > 5) return '-';
    return `${'★'.repeat(nota)}${'☆'.repeat(5 - nota)}`;
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
          <button className={adminStyles.navItem} onClick={() => navigate('/admin/resenhas')}>
            <span className={adminStyles.navIcon}>⭐</span>
            Resenhas
          </button>
          <button className={`${adminStyles.navItem} ${adminStyles.active}`}>
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
            <h1 className={adminStyles.pageTitle}>Gerenciar Comentários</h1>
            <p className={adminStyles.pageSubtitle}>
              {loading ? 'Carregando...' : `${comentarios.length} comentário(s) e ${denuncias.length} denúncia(s)`}
            </p>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'comentarios' ? styles.active : ''}`}
            onClick={() => setActiveTab('comentarios')}
          >
            📝 Comentários ({comentarios.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'denuncias' ? styles.active : ''}`}
            onClick={() => setActiveTab('denuncias')}
          >
            🚩 Denúncias ({denuncias.length})
          </button>
        </div>

        {activeTab === 'denuncias' && (
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${denunciaFilter === 'pendente' ? styles.active : ''}`}
              onClick={() => setDenunciaFilter('pendente')}
            >
              Pendentes
            </button>
            <button
              className={`${styles.filterBtn} ${denunciaFilter === 'analisado' ? styles.active : ''}`}
              onClick={() => setDenunciaFilter('analisado')}
            >
              Analisadas
            </button>
            <button
              className={`${styles.filterBtn} ${denunciaFilter === 'rejeitado' ? styles.active : ''}`}
              onClick={() => setDenunciaFilter('rejeitado')}
            >
              Rejeitadas
            </button>
          </div>
        )}

        {loading && <div className={styles.loading}>Carregando dados...</div>}

        {!loading && activeTab === 'comentarios' && (
          <div className={adminStyles.tableContainer}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Avaliação</th>
                  <th>Comentário</th>
                  <th>Resenha</th>
                  <th>Denúncias</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyRow}>Nenhum comentário encontrado</td>
                  </tr>
                ) : (
                  comentarios.map((comentario) => (
                    <tr key={comentario.id}>
                      <td>{comentario.id}</td>
                      <td>{comentario.usuario?.nome || 'Anônimo'}</td>
                      <td>
                        <span className={styles.ratingStars}>{renderStars(comentario.nota)}</span>
                      </td>
                      <td className={styles.commentCell}>
                        {editingId === comentario.id ? (
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={styles.editTextarea}
                          />
                        ) : (
                          comentario.texto
                        )}
                      </td>
                      <td>{comentario.resenha?.titulo || 'N/A'}</td>
                      <td>
                        <span className={comentario._count.denuncias > 0 ? styles.flagBadge : styles.cleanBadge}>
                          {comentario._count.denuncias > 0 ? `🚩 ${comentario._count.denuncias}` : 'Sem denúncias'}
                        </span>
                      </td>
                      <td>{new Date(comentario.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <div className={adminStyles.actions}>
                          {editingId === comentario.id ? (
                            <>
                              <button className={adminStyles.btnSave} onClick={() => salvarEdicao(comentario.id)}>💾</button>
                              <button className={adminStyles.btnCancel} onClick={() => setEditingId(null)}>✖</button>
                            </>
                          ) : (
                            <>
                              <button className={adminStyles.btnEdit} onClick={() => iniciarEdicao(comentario)}>✏️</button>
                              <button className={adminStyles.btnDelete} onClick={() => deletarComentario(comentario.id)}>🗑️</button>
                              {comentario._count.denuncias > 0 && (
                                <button className={styles.btnDetails} onClick={() => abrirDetalhesComentario(comentario)}>📋</button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'denuncias' && (
          <div className={adminStyles.tableContainer}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Motivo</th>
                  <th>Comentário</th>
                  <th>Denunciante</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyRow}>Nenhuma denúncia encontrada</td>
                  </tr>
                ) : (
                  denuncias.map((denuncia) => (
                    <tr key={denuncia.id}>
                      <td>{denuncia.id}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status-${denuncia.status}`]}`}>
                          {denuncia.status}
                        </span>
                      </td>
                      <td>{denuncia.motivo}</td>
                      <td className={styles.commentCell}>{denuncia.comentario?.texto || 'N/A'}</td>
                      <td>{denuncia.usuario?.nome || 'N/A'}</td>
                      <td>{new Date(denuncia.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <div className={styles.denunciaActionsInline}>
                          {denuncia.status !== 'analisado' && (
                            <button className={styles.buttonApprove} onClick={() => atualizarStatusDenuncia(denuncia.id, 'analisado')}>
                              Analisar
                            </button>
                          )}
                          {denuncia.status === 'analisado' && (
                            <button className={styles.buttonRevert} onClick={() => atualizarStatusDenuncia(denuncia.id, 'pendente')}>
                              Desfazer análise
                            </button>
                          )}
                          {denuncia.status !== 'rejeitado' && (
                            <button className={styles.buttonReject} onClick={() => atualizarStatusDenuncia(denuncia.id, 'rejeitado')}>
                              Rejeitar
                            </button>
                          )}
                          <button className={styles.buttonRemove} onClick={() => removerDenuncia(denuncia.id)}>
                            Retirar denúncia
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
      </main>

      {/* Modal de Detalhes */}
      {selectedComentario && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={fecharDetalhes}>
              ✕
            </button>
            <h2>Denúncias do Comentário</h2>
            <div className={styles.comentarioInfo}>
              <p className={styles.texto}>"{selectedComentario.texto}"</p>
              <small>
                Por: <strong>{selectedComentario.usuario.nome}</strong> em{' '}
                {new Date(selectedComentario.createdAt).toLocaleDateString('pt-BR')}
              </small>
              <p className={styles.modalRating}>
                <strong>Avaliação:</strong> <span className={styles.ratingStars}>{renderStars(selectedComentario.nota)}</span>
              </p>
            </div>

            <div className={styles.denunciasDetalhes}>
              {selectedComentario._count.denuncias === 0 ? (
                <p>Sem denúncias para este comentário</p>
              ) : (
                comentarios
                  .find((c) => c.id === selectedComentario.id)
                  ?.denuncias?.map((denuncia) => (
                    <div key={denuncia.id} className={styles.denunciaDetalhes}>
                      <p>
                        <strong>Denunciado por:</strong> {denuncia.usuario.nome}
                      </p>
                      <p>
                        <strong>Motivo:</strong> {denuncia.motivo}
                      </p>
                      <p>
                        <strong>Descrição:</strong> {denuncia.descricao}
                      </p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`${styles.statusBadge} ${styles[`status-${denuncia.status}`]}`}>
                          {denuncia.status}
                        </span>
                      </p>
                      <button className={styles.buttonRemove} onClick={() => removerDenuncia(denuncia.id)}>
                        Retirar denúncia
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
