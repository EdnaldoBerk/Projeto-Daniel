import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/admin/PgAdminBooks.module.css';
import adminStyles from '../../styles/admin/PgAdminUsers.module.css';

export default function PgAdminBooks() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBook, setNewBook] = useState({
    titulo: '',
    autor: '',
    ano: '',
    editora: '',
    paginas: '',
    isbn: '',
    categoria: '',
    sinopse: '',
    idioma: 'Português',
    edicao: '',
    fotoCapa: null,
    galeria: []
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
    carregarLivros();
    // eslint-disable-next-line
  }, [navigate]);

  async function carregarLivros() {
    try {
      console.log('Iniciando requisição para carregar livros...');
      const response = await api.get('/admin/livros');
      console.log('Response completo:', response);
      console.log('Livros carregados:', response.data);
      console.log('Tipo de response.data:', typeof response.data);
      console.log('É array?', Array.isArray(response.data));
      setLivros(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      console.error('Detalhes do erro:', error.response);
      alert('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateBook() {
    setShowCreateModal(true);
    setNewBook({
      titulo: '',
      autor: '',
      ano: '',
      editora: '',
      paginas: '',
      isbn: '',
      categoria: '',
      sinopse: '',
      idioma: 'Português',
      edicao: '',
      fotoCapa: null,
      galeria: []
    });
  }

  async function handleSubmitCreate(e) {
    e.preventDefault();
    if (!newBook.fotoCapa) {
      alert('A foto da capa é obrigatória');
      return;
    }
    const formData = new FormData();
    formData.append('titulo', newBook.titulo);
    formData.append('autor', newBook.autor);
    formData.append('ano', newBook.ano);
    formData.append('editora', newBook.editora);
    formData.append('paginas', newBook.paginas);
    formData.append('isbn', newBook.isbn);
    formData.append('categoria', newBook.categoria);
    formData.append('sinopse', newBook.sinopse);
    formData.append('idioma', newBook.idioma);
    formData.append('edicao', newBook.edicao);
    formData.append('fotoCapa', newBook.fotoCapa);
    if (newBook.galeria.length > 0) {
      newBook.galeria.forEach(file => formData.append('galeria', file));
    }

    try {
      await api.post('/admin/livros', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Livro criado com sucesso!');
      setShowCreateModal(false);
      carregarLivros();
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      alert(error.response?.data?.error || 'Erro ao criar livro');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja deletar este livro?')) return;
    try {
      await api.delete(`/admin/livros/${id}`);
      alert('Livro deletado com sucesso!');
      carregarLivros();
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      alert('Erro ao deletar livro');
    }
  }

  async function handleToggleAtivo(id, ativoAtual) {
    try {
      await api.put(`/admin/livros/${id}`, { ativo: !ativoAtual });
      carregarLivros();
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      alert('Erro ao atualizar status');
    }
  }

  function handleFotoCapaChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      setNewBook({ ...newBook, fotoCapa: file });
    }
  }

  function handleGaleriaChange(e) {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} excede 5MB`);
        return false;
      }
      return true;
    });
    setNewBook({ ...newBook, galeria: validFiles });
  }

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event('adminChange'));
    navigate('/admin/login');
  };

  if (!admin) return <div className={styles.container}>Carregando...</div>;

  return (
    <div className={adminStyles.container}>
      <aside className={adminStyles.sidebar}>
        <div className={adminStyles.logo}>
          <div className={adminStyles.logoIcon}>⚡</div>
          <h2 className={adminStyles.logoText}>Admin Panel</h2>
        </div>

        <nav className={adminStyles.nav}>
          <button
            className={adminStyles.navItem}
            onClick={() => navigate('/admin/dashboard')}
          >
            <span className={adminStyles.navIcon}>📊</span>
            Dashboard
          </button>

          <button
            className={adminStyles.navItem}
            onClick={() => navigate('/admin/usuarios')}
          >
            <span className={adminStyles.navIcon}>👥</span>
            Usuários
          </button>

          <button
            className={`${adminStyles.navItem} ${adminStyles.active}`}
            onClick={() => navigate('/admin/livros')}
          >
            <span className={adminStyles.navIcon}>📚</span>
            Livros
          </button>

          <button className={adminStyles.navItem} onClick={() => navigate('/admin/resenhas')}>
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
            <h1 className={adminStyles.pageTitle}>Gerenciar Livros</h1>
            <p className={adminStyles.pageSubtitle}>
              {loading ? 'Carregando...' : `${livros.length} livro(s)`}
            </p>
          </div>

          <button onClick={handleCreateBook} className={styles.createBtn}>
            + Criar Livro
          </button>
        </header>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Capa</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Ano</th>
                <th>Editora</th>
                <th>ISBN</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros && livros.length > 0 ? (
                livros.map((livro) => (
                  <tr key={livro.id}>
                    <td>
                      <img
                        src={livro.fotoCapa ? `http://localhost:3001${livro.fotoCapa}` : '/placeholder.png'}
                        alt={livro.titulo}
                        className={styles.thumbnail}
                      />
                    </td>
                    <td>{livro.titulo}</td>
                    <td>{livro.autor}</td>
                    <td>{livro.ano}</td>
                    <td>{livro.editora}</td>
                    <td>{livro.isbn || '-'}</td>
                    <td>{livro.categoria || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleToggleAtivo(livro.id, livro.ativo)}
                        className={livro.ativo ? styles.ativo : styles.inativo}
                      >
                        {livro.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(livro.id)} className={styles.deleteBtn}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.noData}>
                    Nenhum livro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showCreateModal && (
          <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Criar Novo Livro</h2>
              <form onSubmit={handleSubmitCreate}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={newBook.titulo}
                      onChange={(e) => setNewBook({ ...newBook, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Autor *</label>
                    <input
                      type="text"
                      value={newBook.autor}
                      onChange={(e) => setNewBook({ ...newBook, autor: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ano *</label>
                    <input
                      type="number"
                      value={newBook.ano}
                      onChange={(e) => setNewBook({ ...newBook, ano: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Editora *</label>
                    <input
                      type="text"
                      value={newBook.editora}
                      onChange={(e) => setNewBook({ ...newBook, editora: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Páginas *</label>
                    <input
                      type="number"
                      value={newBook.paginas}
                      onChange={(e) => setNewBook({ ...newBook, paginas: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>ISBN</label>
                    <input
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Categoria</label>
                    <input
                      type="text"
                      value={newBook.categoria}
                      onChange={(e) => setNewBook({ ...newBook, categoria: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Idioma</label>
                    <input
                      type="text"
                      value={newBook.idioma}
                      onChange={(e) => setNewBook({ ...newBook, idioma: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Edição</label>
                    <input
                      type="text"
                      value={newBook.edicao}
                      onChange={(e) => setNewBook({ ...newBook, edicao: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Sinopse</label>
                  <textarea
                    value={newBook.sinopse}
                    onChange={(e) => setNewBook({ ...newBook, sinopse: e.target.value })}
                    rows="4"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Foto da Capa * (máx. 5MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoCapaChange}
                    required
                  />
                  {newBook.fotoCapa && <p className={styles.fileName}>{newBook.fotoCapa.name}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label>Galeria (máx. 10 imagens)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGaleriaChange}
                    multiple
                  />
                  {newBook.galeria.length > 0 && (
                    <p className={styles.fileName}>{newBook.galeria.length} arquivo(s) selecionado(s)</p>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Criar Livro
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