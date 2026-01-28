"use client";

import React from "react"

import { useState, useRef } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeft, ArrowRight, Upload, X, AlertCircle, Video } from "lucide-react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function VideoInput() {
  const { content, setContent, nextStep, goToStep } = useManifestationForm();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato não suportado. Use MP4, WebM ou MOV.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("O vídeo deve ter no máximo 100MB.");
      return;
    }

    setError("");
    const preview = URL.createObjectURL(file);
    setContent({ videoFile: file, videoPreview: preview });
  };

  const removeVideo = () => {
    if (content.videoPreview) {
      URL.revokeObjectURL(content.videoPreview);
    }
    setContent({ videoFile: undefined, videoPreview: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!content.videoFile) {
      setError("Por favor, selecione um vídeo antes de continuar");
      return;
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={4} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Envie um vídeo
      </h2>
      <p className="text-muted-foreground mb-6 text-pretty">
        Você pode enviar um vídeo curto relacionado à sua manifestação.
      </p>

      {/* Área de upload */}
      <div className="mb-6">
        {!content.videoPreview ? (
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-secondary transition-colors focus-within:ring-4 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" aria-hidden="true" />
              <p className="text-lg font-medium text-foreground mb-2">
                Clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                MP4, WebM ou MOV (máx. 100MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileSelect}
              className="sr-only"
              aria-describedby={error ? "video-error" : undefined}
            />
          </label>
        ) : (
          <div className="relative">
            <video
              src={content.videoPreview}
              controls
              className="w-full rounded-xl bg-secondary"
              aria-label="Preview do vídeo selecionado"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={removeVideo}
              className="absolute top-2 right-2 w-10 h-10 rounded-full focus-visible-ring"
              aria-label="Remover vídeo"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {content.videoFile?.name}
            </p>
          </div>
        )}
      </div>

      {/* Descrição opcional */}
      <div className="mb-6">
        <Label htmlFor="video-description" className="text-base font-medium">
          Descrição do vídeo <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="video-description"
          value={content.text || ""}
          onChange={(e) => setContent({ text: e.target.value })}
          placeholder="Descreva o que o vídeo mostra..."
          className="mt-2 min-h-24 text-lg focus-visible-ring"
        />
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-4 mb-6 flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <p id="video-error" className="text-destructive">{error}</p>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => goToStep(3)}
          className="h-14 text-lg font-medium focus-visible-ring order-2 sm:order-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Trocar canal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.videoFile}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Revisar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
