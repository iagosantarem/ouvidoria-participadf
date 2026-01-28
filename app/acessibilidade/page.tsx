import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Eye,
  Type,
  Keyboard,
  Monitor,
  Volume2,
  MousePointer2,
  Check,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Acessibilidade – Participa DF",
  description:
    "Recursos de acessibilidade do aplicativo Participa DF da Ouvidoria do Governo do Distrito Federal",
};

const ACCESSIBILITY_FEATURES = [
  {
    icon: Eye,
    title: "Alto Contraste",
    description:
      "Ative o modo de alto contraste para melhorar a legibilidade do conteúdo. As cores são ajustadas para garantir máxima visibilidade.",
    howTo: "Clique no botão 'Contraste' no cabeçalho da página.",
  },
  {
    icon: Type,
    title: "Texto Ampliado",
    description:
      "Aumente o tamanho de todos os textos do aplicativo para facilitar a leitura.",
    howTo: "Clique no botão 'Texto' no cabeçalho da página.",
  },
  {
    icon: Keyboard,
    title: "Navegação por Teclado",
    description:
      "Todo o aplicativo pode ser navegado usando apenas o teclado, sem necessidade de mouse.",
    howTo:
      "Use Tab para avançar, Shift+Tab para voltar, Enter para selecionar e Esc para cancelar.",
  },
  {
    icon: Monitor,
    title: "Leitor de Tela",
    description:
      "O aplicativo é compatível com leitores de tela como NVDA, JAWS e VoiceOver. Todos os elementos possuem descrições adequadas.",
    howTo: "Ative seu leitor de tela preferido e navegue normalmente.",
  },
  {
    icon: Volume2,
    title: "Manifestação por Áudio",
    description:
      "Você pode gravar sua manifestação em áudio se preferir não digitar. O áudio é limitado a 2 minutos para garantir processamento adequado.",
    howTo:
      "Na etapa de envio, escolha a opção 'Áudio' e clique em 'Gravar'.",
  },
  {
    icon: MousePointer2,
    title: "Áreas de Toque Amplas",
    description:
      "Todos os botões e elementos interativos possuem áreas de toque amplas, facilitando o uso em dispositivos móveis.",
    howTo: "Basta tocar ou clicar nos elementos normalmente.",
  },
];

const WCAG_CHECKLIST = [
  "Contraste de cores mínimo de 4.5:1 para texto normal",
  "Contraste de cores mínimo de 3:1 para texto grande",
  "Foco visível em todos os elementos interativos",
  "Rótulos (labels) em todos os campos de formulário",
  "Estrutura semântica com cabeçalhos hierárquicos",
  "Links com texto descritivo",
  "Mensagens de erro identificáveis",
  "Respeito à preferência de movimento reduzido",
  "Conteúdo acessível sem JavaScript",
  "Alternativas textuais para conteúdo não textual",
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Título */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Acessibilidade
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            O Participa DF foi desenvolvido seguindo as diretrizes WCAG 2.1 nível
            AA, garantindo que todos os cidadãos possam registrar suas
            manifestações de forma acessível e inclusiva.
          </p>

          {/* Recursos de acessibilidade */}
          <section aria-labelledby="features-heading" className="mb-12">
            <h3 id="features-heading" className="text-2xl font-bold text-foreground mb-6">
              Recursos disponíveis
            </h3>
            <div className="space-y-4">
              {ACCESSIBILITY_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon
                        className="w-6 h-6 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <p className="text-sm bg-secondary rounded-lg p-3">
                        <strong className="text-foreground">Como usar:</strong>{" "}
                        {feature.howTo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Conformidade WCAG */}
          <section aria-labelledby="wcag-heading" className="mb-12">
            <h3 id="wcag-heading" className="text-2xl font-bold text-foreground mb-6">
              Conformidade WCAG 2.1 AA
            </h3>
            <p className="text-muted-foreground mb-6">
              Este aplicativo implementa os seguintes critérios de acessibilidade:
            </p>
            <ul className="space-y-3">
              {WCAG_CHECKLIST.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check
                    className="w-5 h-5 text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Atalhos de teclado */}
          <section aria-labelledby="shortcuts-heading" className="mb-12">
            <h3 id="shortcuts-heading" className="text-2xl font-bold text-foreground mb-6">
              Atalhos de teclado
            </h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-4 font-semibold text-foreground">
                      Tecla
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-4">
                      <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        Tab
                      </kbd>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      Avança para o próximo elemento
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">
                      <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        Shift + Tab
                      </kbd>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      Volta para o elemento anterior
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">
                      <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        Enter
                      </kbd>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      Ativa botões e links
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">
                      <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        Espaço
                      </kbd>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      Ativa caixas de seleção
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">
                      <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        Esc
                      </kbd>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      Fecha diálogos e menus
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contato */}
          <section aria-labelledby="contact-heading" className="mb-8">
            <h3 id="contact-heading" className="text-2xl font-bold text-foreground mb-4">
              Problemas de acessibilidade?
            </h3>
            <p className="text-muted-foreground mb-4">
              Se você encontrar alguma barreira de acessibilidade neste
              aplicativo, por favor entre em contato conosco para que possamos
              melhorar.
            </p>
            <p className="text-muted-foreground">
              E-mail:{" "}
              <a
                href="mailto:ouvidoria@gdf.df.gov.br"
                className="text-primary underline focus-visible-ring rounded"
              >
                ouvidoria@gdf.df.gov.br
              </a>
            </p>
          </section>

          {/* Link para voltar */}
          <Link
            href="/"
            className="inline-flex items-center text-primary underline font-medium focus-visible-ring rounded"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
