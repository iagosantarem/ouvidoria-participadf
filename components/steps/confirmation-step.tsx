"use client";

import { useState } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { CheckCircle, Copy, Check, Plus } from "lucide-react";

export function ConfirmationStep() {
  const { protocol, resetForm } = useManifestationForm();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (protocol) {
      try {
        await navigator.clipboard.writeText(protocol);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement("textarea");
        textArea.value = protocol;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* Não mostra progress bar na confirmação, que é a etapa final */}

      <div className="flex flex-col items-center text-center">
        {/* Ícone de sucesso */}
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-accent" aria-hidden="true" />
        </div>

        {/* Mensagem de sucesso */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Manifestação enviada com sucesso!
        </h2>
        <p className="text-muted-foreground mb-8 text-pretty leading-relaxed">
          Sua manifestação foi registrada na Ouvidoria do Governo do Distrito
          Federal. Guarde o número do protocolo para acompanhar o andamento.
        </p>

        {/* Card do protocolo */}
        <div className="w-full bg-card border-2 border-primary rounded-xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Número do protocolo</p>
          <p
            className="text-2xl sm:text-3xl font-mono font-bold text-primary mb-4"
            aria-live="polite"
          >
            {protocol}
          </p>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full h-14 text-lg font-medium focus-visible-ring bg-transparent"
            aria-label={copied ? "Protocolo copiado" : "Copiar protocolo"}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" aria-hidden="true" />
                Copiar protocolo
              </>
            )}
          </Button>
        </div>

        {/* Informação adicional */}
        <div className="bg-secondary rounded-xl p-4 mb-8 text-left w-full">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Próximos passos:</strong> Sua
            manifestação será analisada pela equipe da Ouvidoria. Você receberá
            uma resposta dentro do prazo legal. Se você informou um e-mail, as
            atualizações serão enviadas por lá.
          </p>
        </div>

        {/* Botão de nova manifestação */}
        <Button
          onClick={resetForm}
          className="w-full sm:w-auto min-w-64 h-14 text-lg font-medium focus-visible-ring"
        >
          <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
          Nova manifestação
        </Button>
      </div>
    </div>
  );
}
