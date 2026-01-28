"use client";

import Link from "next/link";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Clock, Shield, MessageSquare, Mic, Phone } from "lucide-react";

export function HomeScreen() {
  const { nextStep } = useManifestationForm();

  return (
    <div className="flex flex-col items-center text-center px-4 py-8 max-w-lg mx-auto">
      {/* Ícone principal */}
      <div
        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        aria-hidden="true"
      >
        <MessageSquare className="w-12 h-12 text-primary" />
      </div>

      {/* Título principal */}
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
        Registrar manifestação
      </h2>

      {/* Descrição */}
      <p className="text-lg text-muted-foreground mb-6 text-pretty leading-relaxed">
        Envie sua sugestão, elogio, reclamação, denúncia ou solicitação para a
        Ouvidoria do Governo do Distrito Federal.
      </p>

      {/* Balão de ajuda - 162 */}
      <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Phone className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-base font-bold text-foreground mb-1">
              Precisa de ajuda?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Se você não conseguir fazer o seu registro, ligue na{" "}
              <span className="font-bold text-primary">Central 162</span>
            </p>
          </div>
        </div>
      </div>

      {/* Modo Rápido por Voz - Destaque principal */}
      <div className="w-full bg-accent/10 border-2 border-accent rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="w-14 h-14 bg-accent rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <Mic className="w-7 h-7 text-accent-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Modo Rápido por Voz
        </h3>
        <p className="text-base text-muted-foreground mb-4">
          Fale com suas palavras. Depois confirmamos o texto e geramos o
          protocolo.
        </p>
        <Button
          asChild
          size="lg"
          className="w-full h-16 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground focus-visible-ring"
        >
          <Link href="/modo-rapido" aria-label="Iniciar modo rápido por voz">
            Falar agora
          </Link>
        </Button>
      </div>

      {/* Informações rápidas */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
        <div className="flex items-center gap-3 bg-secondary rounded-lg p-4 flex-1">
          <Clock className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
          <span className="text-sm text-foreground">
            Leva cerca de 1 minuto
          </span>
        </div>
        <div className="flex items-center gap-3 bg-secondary rounded-lg p-4 flex-1">
          <Shield className="w-6 h-6 text-accent shrink-0" aria-hidden="true" />
          <span className="text-sm text-foreground">Pode ser anônimo</span>
        </div>
      </div>

      {/* Botão secundário - Fluxo completo */}
      <Button
        onClick={nextStep}
        size="lg"
        className="w-full sm:w-auto min-w-64 h-14 text-lg font-semibold focus-visible-ring bg-primary hover:bg-primary/80 text-primary-foreground"
        aria-label="Começar a registrar manifestação pelo fluxo completo"
      >
        ou registrar manifestação manualmente
      </Button>

      {/* Informação adicional */}
      <p className="text-sm text-muted-foreground mt-6">
        Ao final, você receberá um número de protocolo para acompanhar sua
        manifestação.
      </p>
    </div>
  );
}
