import React, { useState } from 'react';
import styles from '../../styles/PgAjuda.module.css';

export default function PgAjuda() {
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      categoria: 'Conta e Login',
      pergunta: 'Como criar uma conta?',
      resposta: 'Para criar uma conta, clique no botão "Cadastro" na página inicial. Preencha seus dados pessoais (nome, e-mail, CPF, telefone e senha) e clique em "Registrar". Você receberá um e-mail de confirmação para validar sua conta.'
    },
    {
      id: 2,
      categoria: 'Conta e Login',
      pergunta: 'Como faço para recuperar minha senha?',
      resposta: 'Na página de login, clique em "Esqueceu a senha?". Insira seu e-mail cadastrado e enviaremos um link de recuperação. Siga as instruções no e-mail para redefinir sua senha.'
    },
    {
      id: 3,
      categoria: 'Conta e Login',
      pergunta: 'Posso alterar meu e-mail ou nome?',
      resposta: 'Sim! Acesse seu perfil clicando no ícone de usuário no menu superior. Na aba "Editar Perfil", você pode alterar informações como nome, bio e foto de perfil. Para alterações de e-mail, entre em contato com nosso suporte.'
    },
    {
      id: 6,
      categoria: 'Resenhas',
      pergunta: 'Como comentar em uma resenha?',
      resposta: 'Na página da resenha, role até a seção de comentários no final. Se estiver logado, você verá um campo de texto para adicionar seu comentário. Escreva seu comentário e clique em "Publicar". Você precisa estar logado para comentar.'
    },
    {
      id: 7,
      categoria: 'Busca e Exploração',
      pergunta: 'Como buscar livros?',
      resposta: 'Use a barra de busca no topo da página (Header). Digite o nome do livro, autor ou editora. Os resultados aparecerão em tempo real. Você também pode clicar nas sugestões que aparecem enquanto digita.'
    },
    {
      id: 8,
      categoria: 'Busca e Exploração',
      pergunta: 'Como filtrar livros por categoria?',
      resposta: 'Na página principal, você verá livros organizados por categorias. Também pode usar a busca avançada para filtrar por gênero, ano de publicação, autor ou editora.'
    },
    {
      id: 9,
      categoria: 'Curtidas e Favoritos',
      pergunta: 'Como dar like em uma resenha?',
      resposta: 'Na página da resenha, no topo da postagem, você encontrará um botão com um coração. Clique nele para "curtir" a resenha. O contador mostrará quantas pessoas curtiram aquela resenha.'
    },
    {
      id: 10,
      categoria: 'Curtidas e Favoritos',
      pergunta: 'Como adicionar um livro aos meus favoritos?',
      resposta: 'Na página do livro, procure pelo botão de estrela. Clique nela para adicionar aos favoritos. Todos os seus livros favoritos aparecem na aba "Favoritos" do seu perfil.'
    },
    {
      id: 11,
      categoria: 'Privacidade',
      pergunta: 'Meus dados são seguros?',
      resposta: 'Sim! Seus dados são criptografados e armazenados com segurança nos nossos servidores. Nunca compartilhamos suas informações pessoais com terceiros sem sua autorização. Leia nossa Política de Privacidade para mais detalhes.'
    },
    {
      id: 12,
      categoria: 'Privacidade',
      pergunta: 'Como deletar minha conta?',
      resposta: 'Para deletar sua conta, acesse seu perfil, vá até "Configurações" e procure pela opção "Deletar Conta". Você será solicitado a confirmar a ação. Após a exclusão, todos os seus dados serão removidos permanentemente.'
    }
  ];

  const categorias = [...new Set(faqs.map(faq => faq.categoria))];

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Central de Ajuda</h1>
          <p className={styles.subtitle}>
            Encontre respostas para suas dúvidas sobre o Estante Aberta
          </p>
          
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Busque por sua dúvida aqui..."
              className={styles.searchInput}
            />
          </div>
        </section>

        {/* Categorias e FAQ */}
        <section className={styles.faqSection}>
          <div className={styles.faqContent}>
            {categorias.map((categoria) => (
              <div key={categoria} className={styles.categoryBlock}>
                <h2 className={styles.categoryTitle}>{categoria}</h2>
                
                <div className={styles.faqList}>
                  {faqs
                    .filter(faq => faq.categoria === categoria)
                    .map((faq) => (
                      <div
                        key={faq.id}
                        className={`${styles.faqItem} ${expandedId === faq.id ? styles.expanded : ''}`}
                      >
                        <button
                          className={styles.faqQuestion}
                          onClick={() => toggleExpanded(faq.id)}
                        >
                          <span>{faq.pergunta}</span>
                          <span className={styles.icon}>+</span>
                        </button>
                        {expandedId === faq.id && (
                          <div className={styles.faqAnswer}>
                            <p>{faq.resposta}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Não encontrou o que procura?</h2>
          <p className={styles.contactText}>
            Nosso time de suporte está sempre pronto para ajudar
          </p>
          <a href="/contato" className={styles.contactButton}>
            Entre em Contato
          </a>
        </section>
      </div>
    </div>
  );
}
