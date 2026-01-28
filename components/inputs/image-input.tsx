"use client";

import React from "react"

import { useState, useRef } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeft, ArrowRight, Upload, X, AlertCircle, ImageIcon } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function ImageInput() {
  const { content, setContent, nextStep, goToStep } = useManifestationForm();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato não suportado. Use JPG, PNG, GIF ou WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter no máximo 10MB.");
      return;
    }

    setError("");
    const preview = URL.createObjectURL(file);
    setContent({ imageFile: file, imagePreview: preview });
  };

  const removeImage = () => {
    if (content.imagePreview) {
      URL.revokeObjectURL(content.imagePreview);
    }
    setContent({ imageFile: undefined, imagePreview: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!content.imageFile) {
      setError("Por favor, selecione uma imagem antes de continuar");
      return;
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={4} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Envie uma imagem
      </h2>
      <p className="text-muted-foreground mb-6 text-pretty">
        Você pode enviar uma foto ou captura de tela relacionada à sua manifestação.
      </p>

      {/* Área de upload */}
      <div className="mb-6">
        {!content.imagePreview ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-secondary transition-colors focus-within:ring-4 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" aria-hidden="true" />
              <p className="text-lg font-medium text-foreground mb-2">
                Clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, GIF ou WebP (máx. 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileSelect}
              className="sr-only"
              aria-describedby={error ? "image-error" : undefined}
            />
          </label>
        ) : (
          <div className="relative">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-secondary">
              <Image
                src={content.imagePreview || "/placeholder.svg"}
                alt="Preview da imagem selecionada"
                fill
                className="object-contain"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={removeImage}
              className="absolute top-2 right-2 w-10 h-10 rounded-full focus-visible-ring"
              aria-label="Remover imagem"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {content.imageFile?.name}
            </p>
          </div>
        )}
      </div>

      {/* Descrição opcional */}
      <div className="mb-6">
        <Label htmlFor="image-description" className="text-base font-medium">
          Descrição da imagem <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="image-description"
          value={content.text || ""}
          onChange={(e) => setContent({ text: e.target.value })}
          placeholder="Descreva o que a imagem mostra..."
          className="mt-2 min-h-24 text-lg focus-visible-ring"
        />
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-4 mb-6 flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <p id="image-error" className="text-destructive">{error}</p>
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
          disabled={!content.imageFile}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Revisar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
