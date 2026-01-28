"use client";

import React from "react"

import { useState, useMemo } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/progress-bar";
import {
  SUBJECT_CATEGORIES,
  searchSubjects,
  type Subject,
} from "@/data/subjects";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Car,
  GraduationCap,
  Shield,
  Building2,
  Users,
  Leaf,
  HelpCircle,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  saude: Heart,
  transito: Car,
  educacao: GraduationCap,
  seguranca: Shield,
  servicos: Building2,
  servidor: Users,
  meioambiente: Leaf,
  outro: HelpCircle,
};

export function SubjectStep() {
  const { subject, setSubject, nextStep, prevStep } = useManifestationForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    subject.subjectId
      ? SUBJECT_CATEGORIES.find((s) => s.id === subject.subjectId) || null
      : null
  );
  const [showConfirmation, setShowConfirmation] = useState(!!subject.subjectId);

  const searchResults = useMemo(() => {
    return searchSubjects(searchQuery);
  }, [searchQuery]);

  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
    setShowConfirmation(true);
    setSearchQuery("");
  };

  const handleConfirm = () => {
    if (selectedSubject) {
      setSubject({
        subjectId: selectedSubject.id,
        subjectLabel: selectedSubject.label,
        suggestedAgency: selectedSubject.suggestedAgency,
      });
      nextStep();
    }
  };

  const handleChangeSubject = () => {
    setShowConfirmation(false);
    setSelectedSubject(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <ProgressBar currentStep={2} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Sobre o que é sua manifestação?
      </h2>
      <p className="text-muted-foreground mb-8 text-pretty">
        Isso nos ajuda a encaminhar sua mensagem ao órgão certo.
      </p>

      {!showConfirmation ? (
        <>
          {/* Campo de busca */}
          <div className="mb-6">
            <Label htmlFor="subject-search" className="text-base font-medium">
              Pesquisar assunto
            </Label>
            <div className="relative mt-2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="subject-search"
                type="search"
                placeholder="Ex: posto de saúde, documento, atendimento"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg focus-visible-ring"
                aria-describedby="search-hint"
              />
            </div>
            <p id="search-hint" className="text-sm text-muted-foreground mt-2">
              Digite palavras-chave relacionadas à sua manifestação
            </p>
          </div>

          {/* Resultados da busca */}
          {searchQuery.length >= 2 && searchResults.length > 0 && (
            <div className="mb-6 border border-border rounded-xl overflow-hidden">
              <p className="sr-only">
                {searchResults.length} resultado(s) encontrado(s)
              </p>
              {searchResults.map((result) => {
                const Icon = CATEGORY_ICONS[result.id] || HelpCircle;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectSubject(result)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary focus-visible-ring border-b border-border last:border-b-0 transition-colors"
                    type="button"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {result.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.suggestedAgency}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="mb-6 p-4 bg-secondary rounded-xl flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-muted-foreground">
                Nenhum resultado encontrado. Selecione uma categoria abaixo ou
                escolha &quot;Outro assunto&quot;.
              </p>
            </div>
          )}

          {/* Categorias em grid */}
          <div className="mb-8">
            <p className="text-base font-medium text-foreground mb-4">
              Ou selecione uma categoria:
            </p>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              role="group"
              aria-label="Categorias de assunto"
            >
              {SUBJECT_CATEGORIES.map((category) => {
                const Icon = CATEGORY_ICONS[category.id] || HelpCircle;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleSelectSubject(category)}
                    className="flex flex-col items-center gap-3 p-4 bg-card border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 focus-visible-ring transition-colors"
                    type="button"
                    aria-label={`Categoria: ${category.label}`}
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center leading-tight">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Confirmação de seleção */
        <div className="mb-8">
          <div className="bg-accent/10 border-2 border-accent rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                <Check className="w-8 h-8 text-accent" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground mb-1">
                  Assunto selecionado: {selectedSubject?.label}
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Encaminhamento sugerido:</strong>{" "}
                  {selectedSubject?.suggestedAgency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Você pode alterar se não estiver correto.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleChangeSubject}
            className="mt-4 h-12 focus-visible-ring bg-transparent"
          >
            Alterar assunto
          </Button>
        </div>
      )}

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
          onClick={handleConfirm}
          disabled={!selectedSubject}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
