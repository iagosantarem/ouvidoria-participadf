"use client";

import React from "react"

import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import type { ManifestationChannel } from "@/types/manifestation";
import { ArrowLeft, FileText, Mic, ImageIcon, Video } from "lucide-react";

interface ChannelOption {
  id: ManifestationChannel;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CHANNELS: ChannelOption[] = [
  {
    id: "text",
    title: "Texto",
    description: "Escreva sua manifestação",
    icon: <FileText className="w-10 h-10" aria-hidden="true" />,
  },
  {
    id: "audio",
    title: "Áudio",
    description: "Grave um áudio de até 2 minutos",
    icon: <Mic className="w-10 h-10" aria-hidden="true" />,
  },
  {
    id: "image",
    title: "Imagem",
    description: "Envie uma foto ou captura de tela",
    icon: <ImageIcon className="w-10 h-10" aria-hidden="true" />,
  },
  {
    id: "video",
    title: "Vídeo",
    description: "Envie um vídeo curto",
    icon: <Video className="w-10 h-10" aria-hidden="true" />,
  },
];

export function ChannelStep() {
  const { content, setChannel, setContent, nextStep, prevStep } =
    useManifestationForm();

  const handleSelectChannel = (channel: ManifestationChannel) => {
    setChannel(channel);
    // Limpa conteúdo anterior ao mudar de canal
    setContent({
      channel,
      text: channel === "text" ? content.text : "",
      audioBlob: undefined,
      audioUrl: undefined,
      imageFile: undefined,
      imagePreview: undefined,
      videoFile: undefined,
      videoPreview: undefined,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={3} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Como deseja enviar?
      </h2>
      <p className="text-muted-foreground mb-8 text-pretty">
        Escolha a forma mais conveniente para registrar sua manifestação.
      </p>

      {/* Cards de canal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="group" aria-label="Opções de canal">
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleSelectChannel(channel.id)}
            className={`flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all focus-visible-ring ${
              content.channel === channel.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary"
            }`}
            role="button"
            aria-label={`${channel.title}: ${channel.description}`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                content.channel === channel.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-primary"
              }`}
            >
              {channel.icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {channel.title}
            </h3>
            <p className="text-sm text-muted-foreground">{channel.description}</p>
          </button>
        ))}
      </div>

      {/* Botão voltar */}
      <Button
        variant="outline"
        onClick={prevStep}
        className="h-14 text-lg font-medium focus-visible-ring w-full sm:w-auto bg-transparent"
      >
        <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
        Voltar
      </Button>
    </div>
  );
}
