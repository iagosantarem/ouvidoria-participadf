"use client";

import { FORM_STEPS } from "@/types/manifestation";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  // Não mostra na tela inicial (step 0)
  if (currentStep === 0) return null;

  const progress = (currentStep / FORM_STEPS.length) * 100;
  const stepInfo = FORM_STEPS[currentStep - 1];

  return (
    <div className="w-full mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={FORM_STEPS.length}>
      {/* Indicador de texto */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-medium text-foreground">
          Passo {currentStep} de {FORM_STEPS.length}
        </span>
        <span className="text-muted-foreground">
          {stepInfo?.title}
        </span>
      </div>

      {/* Barra de progresso visual */}
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Indicadores de etapa */}
      <div className="flex justify-between mt-3" aria-hidden="true">
        {FORM_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              index + 1 <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
