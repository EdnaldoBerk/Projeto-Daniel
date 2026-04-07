import styles from '../../styles/PgPrivacidade.module.css';

export default function PgPrivacidade() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Política de Privacidade</h1>
        <p className={styles.lastUpdated}>Última atualização: 30 de março de 2026</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Introdução</h2>
            <p>
              A Estante Aberta ("we", "us", "our" or "Company") opera a website estanteaberta.com (the "Site"). Esta página informa você de nossa política sobre coleta, uso e divulgação de dados pessoais quando você utiliza nosso website e as escolhas que você tem associadas a esses dados.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Informações Coletadas</h2>
            <p>Coletamos diferentes tipos de informações para fins diversos, incluindo:</p>
            
            <h3>Informações Fornecidas Diretamente por Você</h3>
            <ul>
              <li>Informações de conta: nome, e-mail, CPF, telefone, senha</li>
              <li>Informações de perfil: foto de perfil, bio, preferências de leitura</li>
              <li>Conteúdo criado: resenhas, comentários, avaliações</li>
              <li>Informações de contato: mensagens enviadas através do formulário de contato</li>
            </ul>

            <h3>Informações Coletadas Automaticamente</h3>
            <ul>
              <li>Log data: endereço IP, tipo de navegador, páginas visitadas, horário e data</li>
              <li>Cookies e tecnologias similares: identificadores únicos, preferências</li>
              <li>Dados de dispositivo: tipo de dispositivo, sistema operacional, identificadores únicos</li>
              <li>Dados de uso: como você interage com nosso site, links clicados, tempo gasto em páginas</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Como Usamos suas Informações</h2>
            <p>Usamos as informações coletadas para:</p>
            <ul>
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar suas transações e enviar-lhe informações relacionadas</li>
              <li>Enviar notificações por e-mail sobre atualizações, ofertas ou outros assuntos relacionados</li>
              <li>Responder a suas dúvidas e solicitações de suporte</li>
              <li>Monitorar e analisar tendências, uso e atividades para fins de marketing</li>
              <li>Detectar, prevenir e resolver problemas técnicos e fraudes</li>
              <li>Personalizar sua experiência no site</li>
              <li>Conformidade com requisitos legais e regulatórios</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, negociamos ou alugamos suas informações pessoais para terceiros. Podemos compartilhar suas informações em situações limitadas:
            </p>
            <ul>
              <li><strong>Prestadores de Serviço:</strong> Compartilhamos dados com fornecedores que nos ajudam a operar o site (hospedagem, análise, suporte ao cliente)</li>
              <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou autoridades competentes</li>
              <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, privacidade, segurança ou propriedade</li>
              <li><strong>Consentimento:</strong> Com seu consentimento explícito para fins específicos</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas, administrativas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
            </p>
            <ul>
              <li>Criptografia de dados em repouso e em trânsito (protocolo HTTPS)</li>
              <li>Firewalls e sistemas de detecção de intrusão</li>
              <li>Acesso limitado a dados pessoais apenas para funcionários autorizados</li>
              <li>Backup regular dos dados</li>
              <li>Testes de segurança periódicos</li>
            </ul>
            <p>
              Entretanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Portanto, não podemos garantir segurança absoluta.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos para os quais foram coletadas, além do período necessário para cumprir obrigações legais ou comerciais. Você pode solicitar a exclusão de suas informações a qualquer momento, sujeito às nossas obrigações legais.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Seus Direitos</h2>
            <p>Você tem os seguintes direitos em relação às suas informações pessoais:</p>
            <ul>
              <li><strong>Acesso:</strong> Direito de acessar os dados pessoais que possuímos sobre você</li>
              <li><strong>Correção:</strong> Direito de corrigir dados imprecisos ou incompletos</li>
              <li><strong>Exclusão:</strong> Direito de solicitar a exclusão dos seus dados</li>
              <li><strong>Portabilidade:</strong> Direito de receber seus dados em formato legível</li>
              <li><strong>Oposição:</strong> Direito de se opor ao processamento de seus dados</li>
              <li><strong>Retirada de Consentimento:</strong> Direito de retirar seu consentimento a qualquer momento</li>
            </ul>
            <p>
              Para exercer qualquer destes direitos, entre em contato conosco em <a href="mailto:privacy@estanteaberta.com">privacy@estanteaberta.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Cookies</h2>
            <p>
              Usamos cookies e tecnologias similares para melhorar sua experiência. Os cookies são pequenos arquivos armazenados no seu dispositivo que nos permitem:
            </p>
            <ul>
              <li>Lembrá-lo de suas preferências</li>
              <li>Entender como você usa o site</li>
              <li>Melhorar nossos serviços</li>
              <li>Fornecer conteúdo e anúncios personalizados</li>
            </ul>
            <p>
              Você pode controlar cookies através das configurações do seu navegador. A recusa de cookies pode afetar a funcionalidade do site.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Links para Terceiros</h2>
            <p>
              Nosso site pode conter links para websites de terceiros. Esta Política de Privacidade se aplica apenas ao nosso setor. Não somos responsáveis pelas práticas de privacidade de sites de terceiros. Recomendamos revisar as políticas de privacidade desses sites.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Consentimento e Comunicações</h2>
            <p>
              Ao criar uma conta, você consente com nossa coleta e uso de dados pessoais conforme descrito nesta Política. Você pode optar por receber comunicações de marketing fornecendo preferências em seu perfil ou clicando no link de unsubscribe em qualquer e-mail.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Usuários Menores</h2>
            <p>
              O site não é destinado a menores de 13 anos. Não coletamos intencionalmente informações pessoais de menores de 13 anos. Se descobrirmos que coletamos dados de uma criança, removeremos esses dados imediatamente.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Mudanças nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova Política no site e atualizando a data de "última atualização".
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
            </p>
            <p>
              Estante Aberta<br />
              E-mail: <a href="mailto:privacy@estanteaberta.com">privacy@estanteaberta.com</a><br />
              Website: <a href="https://estanteaberta.com">estanteaberta.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
