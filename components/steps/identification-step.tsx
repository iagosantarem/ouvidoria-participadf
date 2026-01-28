"use client";

import { useState } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeft, ArrowRight, User, UserX, Shield } from "lucide-react";

export function IdentificationStep() {
  const { identification, setIdentification, nextStep, prevStep } =
    useManifestationForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email) return true; // Opcional quando anônimo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!identification.isAnonymous) {
      if (!identification.name?.trim()) {
        newErrors.name = "Por favor, informe seu nome";
      }
      if (!identification.email?.trim()) {
        newErrors.email = "Por favor, informe seu e-mail";
      } else if (!validateEmail(identification.email)) {
        newErrors.email = "Por favor, informe um e-mail válido";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={1} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Como deseja se identificar?
      </h2>
      <p className="text-muted-foreground mb-8 text-pretty">
        Você pode enviar sua manifestação de forma anônima ou identificada.
      </p>

      {/* Toggle de anonimato */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {identification.isAnonymous ? (
              <UserX className="w-8 h-8 text-accent" aria-hidden="true" />
            ) : (
              <User className="w-8 h-8 text-primary" aria-hidden="true" />
            )}
            <div>
              <Label htmlFor="anonymous-toggle" className="text-lg font-semibold cursor-pointer">
                Enviar de forma anônima
              </Label>
              <p className="text-sm text-muted-foreground">
                {identification.isAnonymous
                  ? "Sua identidade será protegida"
                  : "Você será identificado"}
              </p>
            </div>
          </div>
          <Switch
            id="anonymous-toggle"
            checked={identification.isAnonymous}
            onCheckedChange={(checked) =>
              setIdentification({ isAnonymous: checked })
            }
            className="scale-125"
            aria-describedby="anonymous-description"
          />
        </div>
      </div>

      {/* Campos de identificação (quando não anônimo) */}
      {!identification.isAnonymous && (
        <div className="space-y-6 mb-6" role="group" aria-label="Dados de identificação">
          <div>
            <Label htmlFor="name" className="text-base font-medium">
              Nome completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={identification.name || ""}
              onChange={(e) => setIdentification({ name: e.target.value })}
              placeholder="Digite seu nome completo"
              className={`mt-2 h-14 text-lg focus-visible-ring ${
                errors.name ? "border-destructive" : ""
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <p id="name-error" className="text-destructive text-sm mt-2" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium">
              E-mail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={identification.email || ""}
              onChange={(e) => setIdentification({ email: e.target.value })}
              placeholder="Digite seu e-mail"
              className={`mt-2 h-14 text-lg focus-visible-ring ${
                errors.email ? "border-destructive" : ""
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="text-destructive text-sm mt-2" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Telefone <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={identification.phone || ""}
              onChange={(e) => setIdentification({ phone: e.target.value })}
              placeholder="(61) 99999-9999"
              className="mt-2 h-14 text-lg focus-visible-ring"
              autoComplete="tel"
            />
          </div>
        </div>
      )}

      {/* Informação sobre privacidade */}
      <div className="bg-secondary rounded-xl p-4 mb-8 flex items-start gap-3">
        <Shield className="w-6 h-6 text-accent shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Seus dados são protegidos pela Lei Geral de Proteção de Dados (LGPD).
          Eles serão usados apenas para processar sua manifestação.
        </p>
      </div>

      {/* Botões de navegação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          className="h-14 text-lg font-medium focus-visible-ring order-2 sm:order-1 bg-transparent"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
