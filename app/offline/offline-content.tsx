"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OfflineContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header simplificado */}
      <header className="w-full bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">GDF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Participa DF</h1>
              <p className="text-xs opacity-90">Ouvidoria Cidadã</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          {/* Ícone */}
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
          </div>

          {/* Mensagem */}
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Sem conexão com a internet
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Não foi possível carregar a página. Verifique sua conexão com a
            internet e tente novamente.
          </p>

          {/* Botão de atualizar */}
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto min-w-48 h-14 text-lg font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
            Tentar novamente
          </Button>

          {/* Informação adicional */}
          <div className="mt-8 p-4 bg-secondary rounded-xl text-left">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Dica:</strong> Se você tinha um
              rascunho salvo, ele será recuperado automaticamente quando a conexão
              for restabelecida.
            </p>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="w-full bg-secondary border-t border-border py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Governo do Distrito Federal – Ouvidoria-Geral
          </p>
        </div>
      </footer>
    </div>
  );
}
