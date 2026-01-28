"use client";

import { useState } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";

const MAX_CHARS = 5000;

const SUGGESTIONS = [
  "Descreva o problema ou situação de forma clara",
  "Informe quando e onde aconteceu",
  "Explique como isso afeta você ou outras pessoas",
];

export function TextInput() {
  const { content, setContent, nextStep, prevStep, goToStep } =
    useManifestationForm();
  const [error, setError] = useState("");

  const charCount = content.text?.length || 0;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = () => {
    if (!content.text?.trim()) {
      setError("Por favor, escreva sua manifestação");
      return;
    }
    if (isOverLimit) {
      setError(`O texto deve ter no máximo ${MAX_CHARS} caracteres`);
      return;
    }
    setError("");
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={4} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Escreva sua manifestação
      </h2>
      <p className="text-muted-foreground mb-6 text-pretty">
        Descreva sua situação com o máximo de detalhes que puder.
      </p>

      {/* Dicas */}
      <div className="bg-secondary rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-medium text-foreground">Dicas para escrever:</span>
        </div>
        <ul className="space-y-2" aria-label="Sugestões do que escrever">
          {SUGGESTIONS.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-bold" aria-hidden="true">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Área de texto */}
      <div className="mb-6">
        <Label htmlFor="manifestation-text" className="text-base font-medium">
          Sua manifestação <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="manifestation-text"
          value={content.text || ""}
          onChange={(e) => setContent({ text: e.target.value })}
          placeholder="Descreva aqui sua sugestão, elogio, reclamação, denúncia ou solicitação..."
          className={`mt-2 min-h-48 text-lg focus-visible-ring resize-y ${
            error || isOverLimit ? "border-destructive" : ""
          }`}
          aria-invalid={!!error || isOverLimit}
          aria-describedby="char-count text-error"
        />
        <div className="flex justify-between items-center mt-2">
          <div>
            {error && (
              <p id="text-error" className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
          <p
            id="char-count"
            className={`text-sm ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}
            aria-live="polite"
          >
            {charCount.toLocaleString("pt-BR")} / {MAX_CHARS.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

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
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Revisar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
