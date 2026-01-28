import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, Lock, Eye, Trash2, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacidade e LGPD – Participa DF",
  description:
    "Política de privacidade e informações sobre a Lei Geral de Proteção de Dados do Participa DF",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Título */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Privacidade e LGPD
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            O Governo do Distrito Federal se compromete a proteger sua
            privacidade e seus dados pessoais, em conformidade com a Lei Geral de
            Proteção de Dados (Lei nº 13.709/2018).
          </p>

          {/* Alerta importante */}
          <div className="bg-accent/10 border border-accent rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertTriangle
              className="w-8 h-8 text-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Atenção ao fazer sua manifestação
              </h3>
              <p className="text-muted-foreground">
                Evite incluir dados pessoais sensíveis no corpo da manifestação,
                como CPF, RG, endereço completo, informações de saúde ou dados
                bancários. Essas informações não são necessárias para processar
                sua solicitação.
              </p>
            </div>
          </div>

          {/* Seções */}
          <div className="space-y-8">
            {/* Quais dados coletamos */}
            <section aria-labelledby="collect-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 id="collect-heading" className="text-xl font-bold text-foreground">
                  Quais dados coletamos?
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  Coletamos apenas as informações necessárias para processar sua
                  manifestação:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Nome e e-mail</strong>{" "}
                      (apenas se você optar por se identificar)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Telefone</strong>{" "}
                      (opcional, para contato)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">
                        Conteúdo da manifestação
                      </strong>{" "}
                      (texto, áudio, imagem ou vídeo)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">
                        Data e hora do envio
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Como usamos */}
            <section aria-labelledby="use-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 id="use-heading" className="text-xl font-bold text-foreground">
                  Como usamos seus dados?
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  Seus dados são utilizados exclusivamente para:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Registrar e processar sua manifestação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      Entrar em contato com você sobre o andamento (se
                      identificado)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      Gerar estatísticas anônimas para melhoria dos serviços
                      públicos
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <strong className="text-foreground">Não vendemos</strong> e{" "}
                  <strong className="text-foreground">não compartilhamos</strong>{" "}
                  seus dados com terceiros para fins comerciais.
                </p>
              </div>
            </section>

            {/* Anonimato */}
            <section aria-labelledby="anonymous-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 id="anonymous-heading" className="text-xl font-bold text-foreground">
                  Posso enviar de forma anônima?
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Sim!</strong> Você pode
                  enviar sua manifestação de forma totalmente anônima. Nesse
                  caso, não coletamos nenhum dado de identificação pessoal. Sua
                  manifestação será processada normalmente, mas não poderemos
                  entrar em contato com você sobre o resultado.
                </p>
              </div>
            </section>

            {/* Segurança */}
            <section aria-labelledby="security-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 id="security-heading" className="text-xl font-bold text-foreground">
                  Como protegemos seus dados?
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Comunicação criptografada (HTTPS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Armazenamento seguro em servidores do GDF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Acesso restrito a funcionários autorizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Logs de auditoria para rastreamento de acessos</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Seus direitos */}
            <section aria-labelledby="rights-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 id="rights-heading" className="text-xl font-bold text-foreground">
                  Quais são seus direitos?
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  De acordo com a LGPD, você tem direito a:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Acesso</strong> aos
                      dados que temos sobre você
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Correção</strong> de
                      dados incorretos ou desatualizados
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Eliminação</strong>{" "}
                      dos dados, quando aplicável
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      <strong className="text-foreground">Informação</strong>{" "}
                      sobre como seus dados são tratados
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Para exercer esses direitos, entre em contato pelo e-mail:{" "}
                  <a
                    href="mailto:lgpd@gdf.df.gov.br"
                    className="text-primary underline focus-visible-ring rounded"
                  >
                    lgpd@gdf.df.gov.br
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Link para voltar */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary underline font-medium focus-visible-ring rounded"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
