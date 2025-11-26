import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PgAdminDashboard.module.css';

export function PgAdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalReviews: 0,
    activeUsers: 0
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
    
    // Carregar estatísticas (placeholder - implementar backend)
    // fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event('adminChange'));
    navigate('/admin/login');
  };

  if (!admin) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <h2 className={styles.logoText}>Admin Panel</h2>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>📊</span>
            Dashboard
          </button>
          <button className={styles.navItem}>
            <span className={styles.navIcon}>👥</span>
            Usuários
          </button>
          <button className={styles.navItem}>
            <span className={styles.navIcon}>📚</span>
            Livros
          </button>
          <button className={styles.navItem}>
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
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Bem-vindo, {admin.nome}</p>
          </div>
          <div className={styles.adminBadge}>
            <span className={styles.badgeIcon}>🛡️</span>
            Administrador
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #646cff, #9334e6)' }}>
              👥
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.totalUsers}</h3>
              <p className={styles.statLabel}>Total de Usuários</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              📚
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.totalBooks}</h3>
              <p className={styles.statLabel}>Total de Livros</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              ⭐
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.totalReviews}</h3>
              <p className={styles.statLabel}>Total de Resenhas</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              🟢
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.activeUsers}</h3>
              <p className={styles.statLabel}>Usuários Ativos</p>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Atividades Recentes</h3>
            <div className={styles.activityList}>
              <p className={styles.emptyState}>Nenhuma atividade recente</p>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Ações Rápidas</h3>
            <div className={styles.actionButtons}>
              <button className={styles.actionButton}>
                <span>➕</span>
                Adicionar Livro
              </button>
              <button className={styles.actionButton}>
                <span>👤</span>
                Criar Usuário
              </button>
              <button className={styles.actionButton}>
                <span>📝</span>
                Ver Relatórios
              </button>
              <button className={styles.actionButton}>
                <span>🔧</span>
                Manutenção
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
