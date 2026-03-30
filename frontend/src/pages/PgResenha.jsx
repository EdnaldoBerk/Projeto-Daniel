import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/PgResenha.module.css";
import api from "../services/api";
import ReportComentarioModal from "../components/ReportComentarioModal";

/**
 * PgResenha.jsx
 * Página de Resenha de Livro (Dark Mode) - sem Header/Footer
 */

function StarRating({ value = 4.2 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className={styles.stars} aria-label={`Avaliação ${value} de 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`}>★</span>
      ))}
      {half && <span key="half">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`}>☆</span>
      ))}
    </div>
  );
}

export default function PgResenha() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Pegar livroId da query string ou do state
  const livroIdFromQuery = searchParams.get('livroId');
  const { livroId: livroIdFromState, livro } = location?.state || {};
  const livroId = livroIdFromQuery || livroIdFromState;
  
  const [resenha, setResenha] = useState(null);
  const [livroCompleto, setLivroCompleto] = useState(livro || null);
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comentarioParaDenunciar, setComentarioParaDenunciar] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    if (!livroId) {
      alert('Nenhum livro selecionado');
      navigate('/');
      return;
    }
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    carregarDados();
  }, [livroId, navigate]);

  async function carregarDados() {
    try {
      setLoading(true);
      
      console.log('🔍 Carregando dados para livroId:', livroId);
      
      // Buscar dados completos do livro primeiro
      const livroRes = await api.get(`/admin/livros/${livroId}`);
      console.log('📚 Livro carregado:', livroRes.data);
      setLivroCompleto(livroRes.data);
      
      // Buscar resenhas do livro
      const resenhasRes = await api.get(`/resenhas/livro/${livroId}`);
      const resenhas = resenhasRes.data || [];
      console.log('⭐ Resenhas encontradas:', resenhas);
      
      // Pegar a primeira resenha ativa ou null
      if (resenhas.length > 0) {
        console.log('✅ Usando resenha:', resenhas[0]);
        setResenha(resenhas[0]);
        setCurtidas(resenhas[0].curtidas || 0);
        
        // Buscar comentários da resenha
        try {
          const comentariosRes = await api.get(`/resenhas/${resenhas[0].id}/comentarios`);
          console.log('💬 Comentários carregados:', comentariosRes.data);
          setComments(comentariosRes.data || []);
        } catch (err) {
          console.error('Erro ao buscar comentários:', err);
          setComments([]);
        }
        
        // Verificar se o usuário já curtiu
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          try {
            const curtidaResponse = await api.get(`/resenhas/${resenhas[0].id}/curtir/${user.id}`);
            setCurtiu(curtidaResponse.data.curtiu);
          } catch (err) {
            console.error('Erro ao verificar curtida:', err);
          }
        }
      } else {
        console.log('❌ Nenhuma resenha encontrada para este livro');
        setResenha(null);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      alert('Erro ao carregar resenha do livro');
    } finally {
      setLoading(false);
    }
  }

  async function handleCurtir() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      alert('Você precisa estar logado para curtir');
      navigate('/login');
      return;
    }

    if (!resenha?.id) return;

    try {
      if (!curtiu) {
        const response = await api.post(`/resenhas/${resenha.id}/curtir`, { 
          usuarioId: user.id 
        });
        setCurtidas(response.data.curtidas);
        setCurtiu(true);
      } else {
        const response = await api.delete(`/resenhas/${resenha.id}/curtir`, {
          data: { usuarioId: user.id }
        });
        setCurtidas(response.data.curtidas);
        setCurtiu(false);
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
      if (error.response?.status === 409) {
        alert('Você já curtiu esta resenha');
      } else {
        alert('Erro ao processar curtida');
      }
    }
  }

  function handlePostComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id || !resenha?.id) {
      alert('Erro: usuário ou resenha não identificados');
      return;
    }

    console.log('📤 Enviando comentário:', { resenhaId: resenha.id, usuarioId: user.id, texto: commentText.trim() });

    // Enviar para o backend
    api.post('/comentarios', {
      resenhaId: resenha.id,
      usuarioId: user.id,
      texto: commentText.trim()
    })
    .then(response => {
      console.log('✅ Comentário criado com sucesso:', response.data);
      // Adiciona o novo comentário ao início da lista
      setComments((s) => [response.data, ...s]);
      setCommentText("");
    })
    .catch(error => {
      console.error('❌ Erro ao enviar comentário:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      alert(`Erro ao enviar comentário: ${error.response?.data?.error || error.message}`);
    });
  }

  function abrirModalDenuncia(comentario) {
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || '{}');
    if (!user.id) {
      alert('Você precisa estar logado para denunciar');
      navigate('/login');
      return;
    }
    setComentarioParaDenunciar(comentario);
  }

  function fecharModalDenuncia() {
    setComentarioParaDenunciar(null);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Carregando resenha...</div>
      </div>
    );
  }

  if (!resenha) {
    return (
      <div className={styles.pageNoResenha}>
        <div className={styles.noResenha}>
          <h2>Nenhuma resenha disponível para este livro</h2>
          <p>Em breve teremos uma resenha completa sobre "{livroCompleto?.titulo}"</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  // Preparar dados para exibição
  console.log('🖼️ Preparando imagens do livro:', {
    fotoCapa: livroCompleto?.fotoCapa,
    galeria: livroCompleto?.galeria,
    galeriaLength: livroCompleto?.galeria?.length
  });

  // Banner: usar a fotoCapa do livro como fundo principal
  const bannerImage = livroCompleto?.fotoCapa 
    ? `http://localhost:3001${livroCompleto.fotoCapa}`
    : 'https://placehold.co/1600x480?text=Banner+do+Livro';

  // Avatar do autor da resenha
  const avatarImage = resenha.usuario?.avatar 
    ? `http://localhost:3001${resenha.usuario.avatar}`
    : 'https://placehold.co/128x128?text=' + (resenha.usuario?.nome?.[0] || 'U');

  // Galeria: usar todas as imagens da galeria do livro, ou a capa como fallback
  const galeriaImages = livroCompleto?.galeria && livroCompleto.galeria.length > 0
    ? livroCompleto.galeria.map(img => `http://localhost:3001${img}`)
    : livroCompleto?.fotoCapa 
      ? [`http://localhost:3001${livroCompleto.fotoCapa}`]
      : ['https://placehold.co/1000x380?text=Galeria+do+Livro'];

  console.log('🎨 Imagens preparadas:', {
    banner: bannerImage,
    avatar: avatarImage,
    galeria: galeriaImages
  });

  return (
    <div className={styles.page}>
      {/* Banner */}
      <div
        className={styles.banner}
        role="img"
        aria-label={`Banner: ${livroCompleto?.titulo}`}
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className={styles.bannerFade} />
        <button 
          className={`${styles.likeButton} ${curtiu ? styles.liked : ''}`}
          onClick={handleCurtir}
          aria-label={curtiu ? 'Remover curtida' : 'Curtir resenha'}
        >
          <span className={styles.likeIcon}>❤️</span>
          <span className={styles.likeText}>
            {curtiu ? 'Curtiu' : 'Curtir'}
          </span>
          <span className={styles.likeCount}>{curtidas}</span>
        </button>
      </div>

      {/* Card container overlapping banner */}
      <main className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarWrap}>
              <img src={avatarImage} alt="ícone do resenhista" className={styles.avatar} />
            </div>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{resenha.titulo}</h1>
              <div className={styles.metaRow}>
                <span className={styles.author}>Por {resenha.usuario?.nome || 'Anônimo'}</span>
                <span className={styles.separator}>•</span>
                <StarRating value={resenha.avaliacao} />
              </div>
            </div>
          </div>
        </header>

        {/* Lead / Texto principal */}
        <section className={styles.leadSection}>
          <p className={styles.lead}>{resenha.textoResumo}</p>

          <div className={styles.articleText}>
            {resenha.textoCompleto.split('\n').map((paragrafo, index) => (
              paragrafo.trim() && <p key={index}>{paragrafo}</p>
            ))}
          </div>
        </section>

        {/* Trechos Marcantes */}
        {resenha.trechosMarcantes && resenha.trechosMarcantes.length > 0 && (
          <section className={styles.excerptsSection}>
            <h2 className={styles.sectionTitle}>Trechos marcantes de {livroCompleto?.titulo}</h2>
            <div className={styles.excerpts}>
              {resenha.trechosMarcantes.map((trecho, i) => (
                <blockquote key={i} className={styles.quote}>
                  <em>{trecho}</em>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Galeria + link */}
        <section className={styles.gallerySection}>
          {galeriaImages.length > 1 ? (
            // Se houver múltiplas imagens na galeria, mostrar todas
            <div className={styles.galleryGrid}>
              {galeriaImages.map((img, index) => (
                <figure key={index} className={styles.galleryFigure}>
                  <img 
                    src={img} 
                    alt={`Imagem ${index + 1} de ${livroCompleto?.titulo}`} 
                    className={styles.galleryImg} 
                  />
                </figure>
              ))}
            </div>
          ) : (
            // Se houver apenas uma imagem, mostrar single
            <figure className={styles.galleryFigure}>
              <img 
                src={galeriaImages[0]} 
                alt={`Capa de ${livroCompleto?.titulo}`} 
                className={styles.galleryImg} 
              />
              <figcaption className={styles.galleryCaption}>
                {livroCompleto?.titulo} - {livroCompleto?.autor}
              </figcaption>
            </figure>
          )}

          <p className={styles.amazonLink}>
            Encontre o livro no site Amazon{" "}
            <a href="#" className={styles.inlineLink} rel="noopener noreferrer"> (clique aqui) </a>
          </p>
        </section>

        {/* Ficha Técnica (tabela) */}
        <section className={styles.metaSection}>
          <table className={styles.metaTable}>
            <tbody>
              <tr>
                <th>Título</th>
                <td>{livroCompleto?.titulo}</td>
              </tr>
              <tr>
                <th>Autor</th>
                <td>{livroCompleto?.autor}</td>
              </tr>
              <tr>
                <th>Ano</th>
                <td>{livroCompleto?.ano}</td>
              </tr>
              <tr>
                <th>Editora</th>
                <td>{livroCompleto?.editora}</td>
              </tr>
              <tr>
                <th>Páginas</th>
                <td>{livroCompleto?.paginas}</td>
              </tr>
              {livroCompleto?.isbn && (
                <tr>
                  <th>ISBN</th>
                  <td>{livroCompleto.isbn}</td>
                </tr>
              )}
              {livroCompleto?.categoria && (
                <tr>
                  <th>Categoria</th>
                  <td>{livroCompleto.categoria}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Post footer: date */}
        <section className={styles.postFooter}>
          <div className={styles.postInfo}>
            <span className={styles.calendar} aria-hidden>📅</span>
            <time dateTime={resenha.createdAt} className={styles.postDate}>
              {new Date(resenha.createdAt).toLocaleDateString('pt-BR')}
            </time>
          </div>
          {livroCompleto?.categoria && (
            <div className={styles.tags}>
              <span className={styles.tag}>#{livroCompleto.categoria.toUpperCase()}</span>
            </div>
          )}
        </section>

        {/* Comentários / estilo Disqus-like */}
        <section className={styles.commentsWrap}>
          <h2 className={styles.sectionTitle}>Comentários</h2>

          {!isLoggedIn ? (
            <div className={styles.loginPrompt}>
              <p>Você precisa estar logado para comentar.</p>
              <button 
                onClick={() => navigate('/login')} 
                className={styles.loginButton}
              >
                Fazer Login
              </button>
            </div>
          ) : (
            <>
              {/* Policy card */}
              <div className={styles.policyCard}>
                <div className={styles.policyText}>
                  <strong>Política de comentários</strong>
                  <p>Por favor, leia nossa política de comentários antes de postar.</p>
                </div>
                <button className={styles.policyButton}>Compreendi</button>
              </div>

              {/* Reactions */}
              <div className={styles.reactionsRow}>
                <div className={styles.reactionsTitle}>O que você achou?</div>
                <div className={styles.reactionButtons}>
                  {[
                    { id: "like", emoji: "👍", label: "Gostei" },
                    { id: "fun", emoji: "😆", label: "Engraçado" },
                    { id: "love", emoji: "😍", label: "Amei" },
                    { id: "wow", emoji: "😮", label: "Uau" },
                    { id: "sad", emoji: "😢", label: "Triste" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      className={`${styles.reactionBtn} ${reaction === r.id ? styles.reactionActive : ""}`}
                      onClick={() => setReaction(r.id)}
                      aria-pressed={reaction === r.id}
                      title={r.label}
                    >
                      <span className={styles.emoji}>{r.emoji}</span>
                      <small className={styles.reactionLabel}>{r.label}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment input with social icons (simulated) */}
              <div className={styles.commentCard}>
                <div className={styles.commentInputRow}>

                  <form onSubmit={handlePostComment} className={styles.commentForm}>
                    <input
                      type="text"
                      placeholder="Iniciar debate..."
                      className={styles.commentInput}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className={styles.commentActions}>
                      <button type="submit" className={styles.postButton}>Publicar</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Comment list */}
              <div className={styles.commentList}>
                {comments.length === 0 && <div className={styles.emptyComments}>Seja o primeiro a comentar!</div>}
                {comments.map((c) => {
                  // A estrutura vem do backend com 'texto' e 'usuario' incluído
                  const nomeUsuario = c.usuario?.nome || 'Anônimo';
                  const fotoUsuario = c.usuario?.fotoPerfil 
                    ? `http://localhost:3001${c.usuario.fotoPerfil}`
                    : 'https://placehold.co/32x32?text=' + nomeUsuario[0];
                  const dataComentario = new Date(c.createdAt).toLocaleString('pt-BR');
                  
                  return (
                    <article key={c.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <img src={fotoUsuario} alt={nomeUsuario} className={styles.commentAvatar} />
                        <div className={styles.commentMeta}>
                          <strong>{nomeUsuario}</strong>
                          <time dateTime={c.createdAt} className={styles.commentTime}>{dataComentario}</time>
                        </div>
                      </div>
                      <p className={styles.commentText}>{c.texto}</p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => abrirModalDenuncia(c)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#c67d2f',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: 0
                          }}
                        >
                          🚩 Denunciar comentário
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {comentarioParaDenunciar && (
        <ReportComentarioModal
          comentarioId={comentarioParaDenunciar.id}
          onClose={fecharModalDenuncia}
          onSuccess={() => {
            // Mantém o fluxo simples por enquanto: apenas feedback visual do modal
          }}
        />
      )}
    </div>
  );
}