import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-secondary border-t border-border mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-muted-foreground text-sm">
              Governo do Distrito Federal
            </p>
            <p className="text-muted-foreground text-sm">
              Ouvidoria-Geral do DF
            </p>
          </div>

          <nav aria-label="Links do rodapé">
            <ul className="flex flex-wrap justify-center sm:justify-end gap-4">
              
              <li>
                <Link
                  href="/privacidade"
                  className="text-sm text-muted-foreground hover:text-foreground underline focus-visible-ring rounded px-1"
                >
                  Privacidade e LGPD
                </Link>
              </li>
              <li>
                <Link
                  href="/acessibilidade"
                  className="text-sm text-muted-foreground hover:text-foreground underline focus-visible-ring rounded px-1"
                >
                  Acessibilidade
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Este aplicativo segue as diretrizes WCAG 2.1 AA de acessibilidade
          </p>
        </div>
      </div>
    </footer>
  );
}
