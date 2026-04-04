import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PgPerfil.module.css';

export default function PgPerfil() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);
  const [leituras, setLeituras] = useState([]);
  const [loadingLeituras, setLoadingLeituras] = useState(true);
  const [catalogoLivros, setCatalogoLivros] = useState([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);
  const [showLeituraModal, setShowLeituraModal] = useState(false);
  const [leituraModalStatus, setLeituraModalStatus] = useState('lendo');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Dados da conta
  const [accountData, setAccountData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    bio: ''
  });

  // Dados de alteração de senha
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    
    // Carregar dados completos do usuário
    loadUserData(parsed.id);
    loadFavoritos(parsed.id);
    loadLeituras(parsed.id);
    loadCatalogoLivros();
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAccountData({
          nome: data.nome || '',
          email: data.email || '',
          telefone: formatTelefone(data.telefone || ''),
          cpf: formatCPF(data.cpf || ''),
          bio: data.bio || ''
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const loadFavoritos = async (userId) => {
    setLoadingFavoritos(true);
    try {
      const response = await fetch(`http://localhost:3001/api/favoritos/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavoritos(data);
      }
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    } finally {
      setLoadingFavoritos(false);
    }
  };

  const loadLeituras = async (userId) => {
    setLoadingLeituras(true);
    try {
      const response = await fetch(`http://localhost:3001/api/leituras/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setLeituras(data);
      }
    } catch (err) {
      console.error('Erro ao carregar leituras:', err);
    } finally {
      setLoadingLeituras(false);
    }
  };

  const loadCatalogoLivros = async () => {
    setLoadingCatalogo(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/livros');
      if (response.ok) {
        const data = await response.json();
        setCatalogoLivros((data || []).filter((livro) => livro.ativo !== false));
      }
    } catch (err) {
      console.error('Erro ao carregar catálogo de livros:', err);
    } finally {
      setLoadingCatalogo(false);
    }
  };

  const openLeituraModal = (status) => {
    setLeituraModalStatus(status);
    setShowLeituraModal(true);
  };

  const salvarLeitura = async (livroId) => {
    try {
      const response = await fetch('http://localhost:3001/api/leituras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: user.id,
          livroId,
          status: leituraModalStatus
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar leitura');
      }

      await loadLeituras(user.id);
      setShowLeituraModal(false);
      setMessage(leituraModalStatus === 'finalizada' ? 'Livro adicionado em Leitura Finalizada!' : 'Livro adicionado em Estou Lendo!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const removerLeitura = async (livroId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/leituras/${user.id}/${livroId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadLeituras(user.id);
        setMessage('Livro removido da lista de leituras!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error('Erro ao remover leitura:', err);
      setError('Erro ao remover leitura');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handleRemoveFavorito = async (livroId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/favoritos/${user.id}/${livroId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFavoritos(favoritos.filter(fav => fav.livroId !== livroId));
        setMessage('Livro removido dos favoritos!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      setError('Erro ao remover favorito');
      setTimeout(() => setError(''), 2000);
    }
  };

  const leiturasFinalizadas = leituras.filter((leitura) => leitura.status === 'finalizada');
  const leiturasEmAndamento = leituras.filter((leitura) => leitura.status === 'lendo');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      setError('Selecione uma foto primeiro');
      setTimeout(() => setError(''), 2000);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fotoPerfil', photoFile);
      formData.append('usuarioId', user.id);

      const response = await fetch('http://localhost:3001/api/upload/foto-perfil', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, fotoPerfil: data.fotoPerfil };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userChange'));
        setUser(updatedUser);
        setMessage('Foto atualizada com sucesso!');
        setShowPhotoModal(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao fazer upload da foto');
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleSaveFromModal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const dataToSend = {
        nome: accountData.nome,
        telefone: accountData.telefone.replace(/\D/g, ''),
        bio: accountData.bio
      };

      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar dados');
      }

      const updatedUser = { ...user, nome: accountData.nome };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userChange'));
      setUser(updatedUser);
      
      // Recarregar dados completos do usuário para garantir que a bio seja exibida
      await loadUserData(user.id);
      
      setMessage('Dados atualizados com sucesso!');
      setShowEditModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Funções de formatação
  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return value;
  };

  const formatTelefone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      if (cleaned.length <= 10) {
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      } else {
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      }
    }
    return value;
  };

  const handleAccountChange = (field, value) => {
    if (field === 'cpf') {
      setAccountData({ ...accountData, [field]: formatCPF(value) });
    } else if (field === 'telefone') {
      setAccountData({ ...accountData, [field]: formatTelefone(value) });
    } else {
      setAccountData({ ...accountData, [field]: value });
    }
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const dataToSend = {
        nome: accountData.nome,
        email: accountData.email,
        telefone: accountData.telefone.replace(/\D/g, ''),
        cpf: accountData.cpf.replace(/\D/g, '')
      };

      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar dados');
      }

      // Atualizar localStorage
      const updatedUser = { ...user, nome: accountData.nome, email: accountData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userChange'));
      setUser(updatedUser);
      
      setMessage('Dados atualizados com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordData.novaSenha.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: passwordData.novaSenha })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao alterar senha');
      }

      setMessage('Senha alterada com sucesso!');
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className={styles.page}>Carregando...</div>;

  return (
  <main className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'perfil' ? styles.active : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Meu Perfil
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'conta' ? styles.active : ''}`}
          onClick={() => setActiveTab('conta')}
        >
          Conta
        </button>
      </nav>

      {activeTab === 'perfil' && (
        <>
          {message && <div className={styles.successMessage}>{message}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <section className={styles.profileCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar} aria-hidden="true">
                {user.fotoPerfil ? (
                  <img 
                    src={`http://localhost:3001${user.fotoPerfil}`} 
                    alt="Foto de perfil" 
                    className={styles.avatarImage}
                  />
                ) : (
                  <span className={styles.avatarIcon}>👤</span>
                )}
              </div>
            </div>

            <div className={styles.profileMain}>
              <h1 className={styles.name}>{user.nome || 'Usuário'}</h1>

              <div className={styles.stats}>
                <div className={styles.statItem}><span className={styles.statNumber}>{favoritos.length}</span> Livros Favoritados</div>
              </div>

              <div className={styles.actionLinks}>
                <button className={styles.btnPrimary} onClick={() => setShowPhotoModal(true)}>
                  ➕ Adicionar foto do perfil
                </button>
                <button className={styles.btnOutline} onClick={handleOpenEditModal}>
                  ✏️ Modificar dados pessoais
                </button>
              </div>
            </div>
          </section>

          <hr className={styles.hr} />

          <section className={styles.section}>
            <h2 className={styles.libraryTitle}>BIBLIOTECA</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subTitle}>LEITURA FINALIZADA 📘</h3>

              {loadingLeituras ? (
                <div className={styles.loadingText}>Carregando leituras...</div>
              ) : (
                <>
                  {leiturasFinalizadas.length === 0 && (
                    <p className={styles.sectionHint}>Adicione os livros que você já terminou de ler.</p>
                  )}

                  <div className={styles.grid}>
                    {leiturasFinalizadas.map((leitura) => (
                      <figure key={leitura.id} className={styles.bookCard}>
                        <div className={styles.bookImageWrapper}>
                          <img
                            src={`http://localhost:3001${leitura.livro.fotoCapa}`}
                            alt={leitura.livro.titulo}
                            className={styles.bookCover}
                            onClick={() => navigate('/resenha', {
                              state: {
                                livroId: leitura.livro.id,
                                livro: {
                                  id: leitura.livro.id,
                                  titulo: leitura.livro.titulo,
                                  autor: leitura.livro.autor,
                                  fotoCapa: leitura.livro.fotoCapa
                                }
                              }
                            })}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                            }}
                          />
                          <button
                            className={styles.removeFavorite}
                            onClick={() => removerLeitura(leitura.livroId)}
                            title="Remover da leitura finalizada"
                          >
                            ❌
                          </button>
                        </div>
                        <figcaption
                          className={styles.bookTitle}
                          onClick={() => navigate('/resenha', {
                            state: {
                              livroId: leitura.livro.id,
                              livro: {
                                id: leitura.livro.id,
                                titulo: leitura.livro.titulo,
                                autor: leitura.livro.autor,
                                fotoCapa: leitura.livro.fotoCapa
                              }
                            }
                          })}
                        >
                          {leitura.livro.titulo}
                        </figcaption>
                      </figure>
                    ))}

                    <button className={styles.addBookCard} type="button" onClick={() => openLeituraModal('finalizada')}>
                      <span className={styles.addBookPlus}>+</span>
                      <span className={styles.addBookLabel}>Adicionar livro</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subTitle}>ESTOU LENDO 📖</h3>

              {loadingLeituras ? (
                <div className={styles.loadingText}>Carregando leituras...</div>
              ) : (
                <>
                  {leiturasEmAndamento.length === 0 && (
                    <p className={styles.sectionHint}>Adicione os livros que você está lendo agora.</p>
                  )}

                  <div className={styles.grid}>
                    {leiturasEmAndamento.map((leitura) => (
                      <figure key={leitura.id} className={styles.bookCard}>
                        <div className={styles.bookImageWrapper}>
                          <img
                            src={`http://localhost:3001${leitura.livro.fotoCapa}`}
                            alt={leitura.livro.titulo}
                            className={styles.bookCover}
                            onClick={() => navigate('/resenha', {
                              state: {
                                livroId: leitura.livro.id,
                                livro: {
                                  id: leitura.livro.id,
                                  titulo: leitura.livro.titulo,
                                  autor: leitura.livro.autor,
                                  fotoCapa: leitura.livro.fotoCapa
                                }
                              }
                            })}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                            }}
                          />
                          <button
                            className={styles.removeFavorite}
                            onClick={() => removerLeitura(leitura.livroId)}
                            title="Remover de estou lendo"
                          >
                            ❌
                          </button>
                        </div>
                        <figcaption
                          className={styles.bookTitle}
                          onClick={() => navigate('/resenha', {
                            state: {
                              livroId: leitura.livro.id,
                              livro: {
                                id: leitura.livro.id,
                                titulo: leitura.livro.titulo,
                                autor: leitura.livro.autor,
                                fotoCapa: leitura.livro.fotoCapa
                              }
                            }
                          })}
                        >
                          {leitura.livro.titulo}
                        </figcaption>
                      </figure>
                    ))}

                    <button className={styles.addBookCard} type="button" onClick={() => openLeituraModal('lendo')}>
                      <span className={styles.addBookPlus}>+</span>
                      <span className={styles.addBookLabel}>Adicionar livro</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subTitle}>FAVORITOS ⭐</h3>
              
              {loadingFavoritos ? (
                <div className={styles.loadingText}>Carregando favoritos...</div>
              ) : favoritos.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Você ainda não tem livros favoritos.</p>
                  <button className={styles.btnExplore} onClick={() => navigate('/')}>
                    📚 Explorar Livros
                  </button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {favoritos.map((favorito) => (
                    <figure key={favorito.id} className={styles.bookCard}>
                      <div className={styles.bookImageWrapper}>
                        <img 
                          src={`http://localhost:3001${favorito.livro.fotoCapa}`} 
                          alt={favorito.livro.titulo} 
                          className={styles.bookCover}
                          onClick={() => navigate('/resenha', { 
                            state: { 
                              livroId: favorito.livro.id, 
                              livro: {
                                id: favorito.livro.id,
                                titulo: favorito.livro.titulo,
                                autor: favorito.livro.autor,
                                fotoCapa: favorito.livro.fotoCapa
                              }
                            }
                          })}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                          }}
                        />
                        <button 
                          className={styles.removeFavorite}
                          onClick={() => handleRemoveFavorito(favorito.livroId)}
                          title="Remover dos favoritos"
                        >
                          ❌
                        </button>
                      </div>
                      <figcaption 
                        className={styles.bookTitle}
                        onClick={() => navigate('/resenha', { 
                          state: { 
                            livroId: favorito.livro.id, 
                            livro: {
                              id: favorito.livro.id,
                              titulo: favorito.livro.titulo,
                              autor: favorito.livro.autor,
                              fotoCapa: favorito.livro.fotoCapa
                            }
                          }
                        })}
                      >
                        {favorito.livro.titulo}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </section>

          {showLeituraModal && (
            <div className={styles.modal} onClick={() => setShowLeituraModal(false)}>
              <div className={`${styles.modalContent} ${styles.modalContentWide}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>{leituraModalStatus === 'finalizada' ? 'Adicionar leitura finalizada' : 'Adicionar livro que estou lendo'}</h2>
                  <button className={styles.closeButton} onClick={() => setShowLeituraModal(false)}>✖</button>
                </div>

                <div className={styles.modalBody}>
                  <p className={styles.modalDescription}>
                    Selecione uma capa do catálogo para salvar no seu perfil.
                  </p>

                  {loadingCatalogo ? (
                    <div className={styles.loadingText}>Carregando catálogo...</div>
                  ) : catalogoLivros.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>Nenhum livro disponível no catálogo.</p>
                    </div>
                  ) : (
                    <div className={styles.catalogGrid}>
                      {catalogoLivros.map((livro) => (
                        <button
                          key={livro.id}
                          type="button"
                          className={styles.catalogCard}
                          onClick={() => salvarLeitura(livro.id)}
                        >
                          <img
                            src={`http://localhost:3001${livro.fotoCapa}`}
                            alt={livro.titulo}
                            className={styles.catalogCover}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                            }}
                          />
                          <span className={styles.catalogTitle}>{livro.titulo}</span>
                          <span className={styles.catalogButtonLabel}>Adicionar</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <hr className={styles.hr} />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre você</h2>
            <div className={styles.sectionBody}>
              {accountData.bio ? (
                <p className={styles.bioText}>{accountData.bio}</p>
              ) : (
                <p className={styles.emptyBio}>Adicione uma bio em "Modificar dados pessoais" para contar um pouco sobre você.</p>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === 'conta' && (
        <div className={styles.accountSection}>
          {message && <div className={styles.successMessage}>{message}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <section className={styles.accountCard}>
            <h2 className={styles.accountTitle}>Informações da Conta</h2>
            <form onSubmit={handleSaveAccount} className={styles.accountForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => handleAccountChange('email', e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>CPF</label>
                  <input
                    type="text"
                    value={accountData.cpf}
                    onChange={(e) => handleAccountChange('cpf', e.target.value)}
                    maxLength="14"
                    placeholder="000.000.000-00"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.saveButton} disabled={loading}>
                {loading ? 'Salvando...' : '💾 Salvar Alterações'}
              </button>
            </form>
          </section>

          <section className={styles.accountCard}>
            <h2 className={styles.accountTitle}>Alterar Senha</h2>
            <form onSubmit={handleChangePassword} className={styles.accountForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Senha Atual</label>
                <input
                  type="password"
                  value={passwordData.senhaAtual}
                  onChange={(e) => setPasswordData({ ...passwordData, senhaAtual: e.target.value })}
                  className={styles.input}
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nova Senha</label>
                  <input
                    type="password"
                    value={passwordData.novaSenha}
                    onChange={(e) => setPasswordData({ ...passwordData, novaSenha: e.target.value })}
                    className={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={passwordData.confirmarSenha}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmarSenha: e.target.value })}
                    className={styles.input}
                    placeholder="Digite novamente"
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.saveButton} disabled={loading}>
                {loading ? 'Alterando...' : '🔒 Alterar Senha'}
              </button>
            </form>
          </section>
        </div>
      )}

      {/* Modal de Upload de Foto */}
      {showPhotoModal && (
        <div className={styles.modal} onClick={() => setShowPhotoModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Adicionar Foto do Perfil</h2>
              <button className={styles.closeButton} onClick={() => setShowPhotoModal(false)}>✖</button>
            </div>
            
            <div className={styles.photoUploadSection}>
              {photoPreview ? (
                <div className={styles.photoPreviewWrapper}>
                  <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
                </div>
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span className={styles.photoIcon}>📷</span>
                  <p>Selecione uma foto</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className={styles.fileInput}
                id="photoInput"
              />
              
              <label htmlFor="photoInput" className={styles.selectPhotoButton}>
                Escolher Foto
              </label>
            </div>

            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnCancelModal} 
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className={styles.btnSubmitModal}
                onClick={handleUploadPhoto}
                disabled={!photoFile || loading}
              >
                {loading ? 'Enviando...' : 'Salvar Foto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Dados Pessoais */}
      {showEditModal && (
        <div className={styles.modal} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Modificar Dados Pessoais</h2>
              <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            
            <form onSubmit={handleSaveFromModal} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nome Completo</label>
                <input
                  type="text"
                  value={accountData.nome}
                  onChange={(e) => handleAccountChange('nome', e.target.value)}
                  className={styles.modalInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  type="text"
                  value={accountData.telefone}
                  onChange={(e) => handleAccountChange('telefone', e.target.value)}
                  maxLength="15"
                  placeholder="(00) 00000-0000"
                  className={styles.modalInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sobre mim</label>
                <textarea
                  value={accountData.bio}
                  onChange={(e) => handleAccountChange('bio', e.target.value)}
                  className={styles.modalTextarea}
                  placeholder="Conte um pouco sobre você..."
                  rows="4"
                  maxLength="500"
                />
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnCancelModal} 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.btnSubmitModal}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </main>
  );
}