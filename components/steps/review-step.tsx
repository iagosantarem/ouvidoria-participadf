"use client";

import { useState } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/progress-bar";
import { submitManifestation } from "@/services/participa-df-adapter";
import {
  ArrowLeft,
  Send,
  User,
  UserX,
  FileText,
  Mic,
  ImageIcon,
  Video,
  Pencil,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import Image from "next/image";

export function ReviewStep() {
  const {
    identification,
    subject,
    content,
    consent,
    setConsent,
    goToStep,
    nextStep,
    setProtocol,
  } = useManifestationForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getChannelIcon = () => {
    switch (content.channel) {
      case "text":
        return <FileText className="w-6 h-6" aria-hidden="true" />;
      case "audio":
        return <Mic className="w-6 h-6" aria-hidden="true" />;
      case "image":
        return <ImageIcon className="w-6 h-6" aria-hidden="true" />;
      case "video":
        return <Video className="w-6 h-6" aria-hidden="true" />;
    }
  };

  const getChannelName = () => {
    switch (content.channel) {
      case "text":
        return "Texto";
      case "audio":
        return "Áudio";
      case "image":
        return "Imagem";
      case "video":
        return "Vídeo";
    }
  };

  const handleSubmit = async () => {
    if (!consent) {
      setError("Por favor, confirme que você leu e concorda com os termos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await submitManifestation({
        identification,
        subject,
        content,
        consent,
      });

      if (response.success) {
        setProtocol(response.protocol);
        nextStep();
      } else {
        setError(response.message || "Erro ao enviar manifestação");
      }
    } catch {
      setError("Erro de conexão. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={4} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Revise sua manifestação
      </h2>
      <p className="text-muted-foreground mb-8 text-pretty">
        Confira se todas as informações estão corretas antes de enviar.
      </p>

      {/* Card de identificação */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {identification.isAnonymous ? (
              <UserX className="w-6 h-6 text-accent" aria-hidden="true" />
            ) : (
              <User className="w-6 h-6 text-primary" aria-hidden="true" />
            )}
            <h3 className="font-semibold text-foreground">Identificação</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(1)}
            className="text-primary focus-visible-ring"
            aria-label="Editar identificação"
          >
            <Pencil className="w-4 h-4 mr-1" aria-hidden="true" />
            Editar
          </Button>
        </div>
        <div className="text-muted-foreground">
          {identification.isAnonymous ? (
            <p>Manifestação anônima</p>
          ) : (
            <>
              <p>
                <strong>Nome:</strong> {identification.name}
              </p>
              <p>
                <strong>E-mail:</strong> {identification.email}
              </p>
              {identification.phone && (
                <p>
                  <strong>Telefone:</strong> {identification.phone}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Card de assunto */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Assunto</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(2)}
            className="text-primary focus-visible-ring"
            aria-label="Editar assunto"
          >
            <Pencil className="w-4 h-4 mr-1" aria-hidden="true" />
            Editar
          </Button>
        </div>
        <div className="text-muted-foreground">
          <p>
            <strong>Categoria:</strong> {subject.subjectLabel}
          </p>
          <p>
            <strong>Órgão sugerido:</strong> {subject.suggestedAgency}
          </p>
        </div>
      </div>

      {/* Card de conteúdo */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getChannelIcon()}
            <h3 className="font-semibold text-foreground">
              Conteúdo ({getChannelName()})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(4)}
            className="text-primary focus-visible-ring"
            aria-label="Editar conteúdo"
          >
            <Pencil className="w-4 h-4 mr-1" aria-hidden="true" />
            Editar
          </Button>
        </div>
        <div className="text-muted-foreground">
          {content.channel === "text" && (
            <p className="whitespace-pre-wrap line-clamp-5">{content.text}</p>
          )}
          {content.channel === "audio" && content.audioUrl && (
            <audio
              src={content.audioUrl}
              controls
              className="w-full"
              aria-label="Áudio gravado"
            />
          )}
          {content.channel === "image" && content.imagePreview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-secondary">
              <Image
                src={content.imagePreview || "/placeholder.svg"}
                alt="Imagem enviada"
                fill
                className="object-contain"
              />
            </div>
          )}
          {content.channel === "video" && content.videoPreview && (
            <video
              src={content.videoPreview}
              controls
              className="w-full rounded-lg"
              aria-label="Vídeo enviado"
            />
          )}
          {content.text && content.channel !== "text" && (
            <p className="mt-3 text-sm whitespace-pre-wrap">{content.text}</p>
          )}
        </div>
      </div>

      {/* Checkbox de consentimento */}
      <div className="bg-secondary rounded-xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-1 w-6 h-6 focus-visible-ring"
          />
          <Label
            htmlFor="consent"
            className="text-base leading-relaxed cursor-pointer"
          >
            Li e concordo que minha manifestação será analisada pela Ouvidoria do
            GDF. Declaro que as informações são verdadeiras e estou ciente de que
            não devo incluir dados pessoais sensíveis no relato.
          </Label>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div
          className="bg-destructive/10 border border-destructive rounded-xl p-4 mb-6 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle
            className="w-5 h-5 text-destructive shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => goToStep(4)}
          disabled={isSubmitting}
          className="h-14 text-lg font-medium focus-visible-ring order-2 sm:order-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !consent}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="w-5 h-5 mr-2 animate-spin"
                aria-hidden="true"
              />
              Enviando...
            </>
          ) : (
            <>
              Enviar manifestação
              <Send className="w-5 h-5 ml-2" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
