import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/PgAdminUsers.module.css';

export function PgAdminUsers() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    isAdmin: false
  });

  useEffect(() => {
    // Verificar se está logado como admin
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
    carregarUsuarios();
  }, [navigate]);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/usuarios');
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario.id);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || '',
      cpf: usuario.cpf,
      isAdmin: usuario.isAdmin
    });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erro ao atualizar usuário');
      
      setEditingUser(null);
      carregarUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja deletar o usuário "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar usuário');
      
      carregarUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }
      
      setShowCreateModal(false);
      setNewUser({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        senha: '',
        isAdmin: false
      });
      carregarUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event('adminChange'));
    navigate('/admin/login');
  };

  if (!admin) return <div>Carregando...</div>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <h2 className={styles.logoText}>Admin Panel</h2>
        </div>

        <nav className={styles.nav}>
          <button className={styles.navItem} onClick={() => navigate('/admin/dashboard')}>
            <span className={styles.navIcon}>📊</span>
            Dashboard
          </button>
          <button className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>👥</span>
            Usuários
          </button>
          <button className={styles.navItem} onClick={() => navigate('/admin/livros')}>
            <span className={styles.navIcon}>📚</span>
            Livros
          </button>
          <button className={styles.navItem} onClick={() => navigate('/admin/resenhas')}>
            <span className={styles.navIcon}>⭐</span>
            Resenhas
          </button>
          <button className={styles.navItem}>
            <span className={styles.navIcon}>⚙️</span>
            Configurações
          </button>
        </nav>

        <div className={styles.navDivider}></div>

        <button className={styles.backToSiteButton} onClick={() => navigate('/')}>
          <span className={styles.navIcon}>🏠</span>
          Voltar ao site
        </button>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <span className={styles.navIcon}>🚪</span>
          Sair
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Gerenciar Usuários</h1>
            <p className={styles.pageSubtitle}>Total: {usuarios.length} usuários cadastrados</p>
          </div>
          <button className={styles.createButton} onClick={() => setShowCreateModal(true)}>
            <span>➕</span>
            Criar Novo Usuário
          </button>
        </header>

        {loading && <div className={styles.loading}>Carregando usuários...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Admin</th>
                  <th>Cadastrado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>
                      {editingUser === usuario.id ? (
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className={styles.input}
                        />
                      ) : (
                        usuario.nome
                      )}
                    </td>
                    <td>
                      {editingUser === usuario.id ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={styles.input}
                        />
                      ) : (
                        usuario.email
                      )}
                    </td>
                    <td>
                      {editingUser === usuario.id ? (
                        <input
                          type="text"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          className={styles.input}
                        />
                      ) : (
                        usuario.telefone || '-'
                      )}
                    </td>
                    <td>
                      {editingUser === usuario.id ? (
                        <input
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          className={styles.input}
                        />
                      ) : (
                        usuario.cpf
                      )}
                    </td>
                    <td>
                      {editingUser === usuario.id ? (
                        <input
                          type="checkbox"
                          checked={formData.isAdmin}
                          onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                          className={styles.checkbox}
                        />
                      ) : (
                        <span className={usuario.isAdmin ? styles.badgeAdmin : styles.badgeUser}>
                          {usuario.isAdmin ? '✓ Admin' : 'Usuário'}
                        </span>
                      )}
                    </td>
                    <td>{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className={styles.actions}>
                        {editingUser === usuario.id ? (
                          <>
                            <button
                              className={styles.btnSave}
                              onClick={() => handleSave(usuario.id)}
                            >
                              💾
                            </button>
                            <button
                              className={styles.btnCancel}
                              onClick={() => setEditingUser(null)}
                            >
                              ✖
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.btnEdit}
                              onClick={() => handleEdit(usuario)}
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.btnDelete}
                              onClick={() => handleDelete(usuario.id, usuario.nome)}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showCreateModal && (
          <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Criar Novo Usuário</h2>
                <button className={styles.closeButton} onClick={() => setShowCreateModal(false)}>✖</button>
              </div>
              
              <form onSubmit={handleCreateUser} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                    required
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={newUser.telefone}
                    onChange={(e) => setNewUser({ ...newUser, telefone: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>CPF *</label>
                  <input
                    type="text"
                    value={newUser.cpf}
                    onChange={(e) => setNewUser({ ...newUser, cpf: e.target.value })}
                    required
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Senha *</label>
                  <input
                    type="password"
                    value={newUser.senha}
                    onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                    required
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="isAdminCreate"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                  />
                  <label htmlFor="isAdminCreate">Conceder privilégios de administrador</label>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnCancelModal} onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnSubmitModal}>
                    Criar Usuário
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
