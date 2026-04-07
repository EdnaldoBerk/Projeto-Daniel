import React from 'react';
import styles from '../../styles/PgTermos.module.css';

export default function PgTermos() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Termos de Uso</h1>
        <p className={styles.lastUpdated}>Última atualização: 30 de março de 2026</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma Estante Aberta, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com nenhuma dessas disposições, é proibido usar ou acessar este site.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Licença de Uso</h2>
            <p>
              É concedida a você uma licença limitada, não exclusiva e revogável para acessar e usar a Estante Aberta para fins pessoais e não comerciais, de acordo com estes Termos. Você não é autorizado a:
            </p>
            <ul>
              <li>Reproduzir, copiar ou transmitir qualquer conteúdo</li>
              <li>Vender, alugar ou transferir acesso à plataforma</li>
              <li>Alterar, traduzir ou criar trabalhos derivados da plataforma</li>
              <li>Usar a plataforma para fins ilegais ou prejudiciais</li>
              <li>Fazer acesso não autorizado aos sistemas da plataforma</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Conta de Usuário</h2>
            <p>
              Ao criar uma conta, você concorda em fornecer informações verdadeiras, precisas e completas. Você é responsável por:
            </p>
            <ul>
              <li>Manter a confidencialidade da sua senha</li>
              <li>Todas as atividades que ocorrem em sua conta</li>
              <li>Notificar-nos imediatamente de qualquer uso não autorizado</li>
              <li>Cumprir todas as leis aplicáveis ao usar sua conta</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Conteúdo do Usuário</h2>
            <p>
              Você é responsável por todo o conteúdo que você publica (incluindo resenhas, comentários e fotos). Você garante que:
            </p>
            <ul>
              <li>Possui todos os direitos necessários sobre o conteúdo</li>
              <li>O conteúdo não viola os direitos de propriedade intelectual de terceiros</li>
              <li>O conteúdo não é difamatório, abusivo ou ofensivo</li>
              <li>O conteúdo não contém informações privadas de outras pessoas</li>
            </ul>
            <p>
              Ao publicar conteúdo, você nos concede uma licença permanente, irrevogável e global para usar, reproduzir, modificar e distribuir esse conteúdo.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Proibições</h2>
            <p>Você concorda em não:</p>
            <ul>
              <li>Fazer acesso não autorizado aos sistemas da plataforma</li>
              <li>Interferir ou interromper a operação normal do site</li>
              <li>Coletar ou rastrear informações pessoais de outros usuários</li>
              <li>Usar a plataforma para spam, phishing ou malware</li>
              <li>Criar múltiplas contas para fins fraudulentos</li>
              <li>Publicar conteúdo obsceno, ofensivo ou ilegal</li>
              <li>Infligir qualquer tipo de assédio ou intimidação</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Direitos de Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da Estante Aberta, incluindo texto, gráficos, logos, imagens e software, é propriedade nossa ou de nossos fornecedores de conteúdo e é protegido pelas leis de direitos autorais. Você não pode reproduzir, modificar ou distribuir este conteúdo sem permissão prévia por escrito.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Isenção de Responsabilidade</h2>
            <p>
              A Estante Aberta é fornecida "no estado em que se encontra" sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que:
            </p>
            <ul>
              <li>A plataforma funcionará sem interrupções ou erros</li>
              <li>Os defeitos serão corrigidos</li>
              <li>O conteúdo será atualizado em tempo real</li>
              <li>A plataforma está livre de vírus ou componentes prejudiciais</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              Em nenhum caso a Estante Aberta será responsável por qualquer dano indireto, incidental, especial, consequente ou punitivo resultante do seu uso ou incapacidade de usar a plataforma, mesmo que tenhamos sido avisados da possibilidade de tais danos.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Indenização</h2>
            <p>
              Você concorda em indenizar e manter a Estante Aberta, seus administradores, funcionários e agentes indemnes de e contra todas as reclamações, perdas, danos, responsabilidades e despesas (incluindo taxas de advogados) decorrentes de:
            </p>
            <ul>
              <li>Seu uso da plataforma</li>
              <li>Sua violação destes Termos</li>
              <li>Seu conteúdo publicado</li>
              <li>Violação de direitos de qualquer terceiro</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>10. Modificação dos Termos</h2>
            <p>
              Reservamos o direito de modificar estes Termos a qualquer momento. As mudanças entrarão em vigor quando forem publicadas na plataforma. Seu uso continuado da plataforma após as modificações constituirá sua aceitação dos Termos revisados.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Rescisão</h2>
            <p>
              Podemos rescindir ou suspender sua conta e acesso à plataforma imediatamente, sem aviso prévio e responsabilidade, se você violar estes Termos ou qualquer lei aplicável. Após a rescisão, você perde o direito de usar a plataforma.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Lei Aplicável</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil e você irrevogavelmente concorda em se submeter à jurisdição exclusiva dos tribunais localizados no Brasil.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Disposições Finais</h2>
            <p>
              Se qualquer disposição destes Termos for considerada inválida ou inaplicável, tal disposição será modificada na extensão necessária para torná-la válida, ou se isso não for possível, será rescindida, e as demais disposições continuarão em vigor. Este é o acordo completo entre você e a Estante Aberta.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos, entre em contato conosco em <a href="mailto:suporte@estanteaberta.com">suporte@estanteaberta.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
