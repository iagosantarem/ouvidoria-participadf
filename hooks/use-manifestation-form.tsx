"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  UserIdentification,
  ManifestationContent,
  ManifestationChannel,
  SubjectSelection,
} from "@/types/manifestation";

// Função utilitária para scroll to top (mobile UX)
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Também foca no conteúdo principal para leitores de tela
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }
};

interface ManifestationFormContextType {
  // Estado do formulário
  currentStep: number;
  identification: UserIdentification;
  subject: SubjectSelection;
  content: ManifestationContent;
  consent: boolean;
  protocol: string | null;

  // Ações de navegação
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;

  // Ações de dados
  setIdentification: (data: Partial<UserIdentification>) => void;
  setSubject: (data: SubjectSelection) => void;
  setChannel: (channel: ManifestationChannel) => void;
  setContent: (data: Partial<ManifestationContent>) => void;
  setConsent: (value: boolean) => void;
  setProtocol: (protocol: string) => void;
}

const ManifestationFormContext =
  createContext<ManifestationFormContextType | null>(null);

export function useManifestationForm() {
  const context = useContext(ManifestationFormContext);
  if (!context) {
    throw new Error(
      "useManifestationForm deve ser usado dentro de ManifestationFormProvider"
    );
  }
  return context;
}

const STORAGE_KEY = "participa-df-draft";

const initialIdentification: UserIdentification = {
  isAnonymous: false,
  name: "",
  email: "",
  phone: "",
};

const initialSubject: SubjectSelection = {
  subjectId: "",
  subjectLabel: "",
  suggestedAgency: "",
};

const initialContent: ManifestationContent = {
  channel: "text",
  text: "",
};

interface ManifestationFormProviderProps {
  children: ReactNode;
}

export function ManifestationFormProvider({
  children,
}: ManifestationFormProviderProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = tela inicial
  const [identification, setIdentificationState] =
    useState<UserIdentification>(initialIdentification);
  const [subject, setSubjectState] =
    useState<SubjectSelection>(initialSubject);
  const [content, setContentState] =
    useState<ManifestationContent>(initialContent);
  const [consent, setConsentState] = useState(false);
  const [protocol, setProtocolState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Carrega rascunho salvo
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.identification) setIdentificationState(draft.identification);
        if (draft.subject) setSubjectState(draft.subject);
        if (draft.content) setContentState(draft.content);
        if (draft.currentStep) setCurrentStep(draft.currentStep);
      }
    } catch {
      // Ignora erro de parse
    }
  }, []);

  // Limpa rascunho quando volta para home (step 0)
  useEffect(() => {
    if (!mounted) return;

    if (currentStep === 0) {
      // Limpa tudo ao voltar para home
      setIdentificationState(initialIdentification);
      setSubjectState(initialSubject);
      setContentState(initialContent);
      setConsentState(false);
      setProtocolState(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentStep, mounted]);

  // Salva rascunho automaticamente
  useEffect(() => {
    if (!mounted) return;

    // Não salva na home (step 0) ou após confirmação (step 6)
    if (currentStep === 0 || currentStep >= 6) return;

    const draft = {
      identification,
      subject,
      content: {
        channel: content.channel,
        text: content.text,
        // Não salvamos blobs no localStorage
      },
      currentStep,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage cheio ou indisponível
    }
  }, [identification, subject, content, currentStep, mounted]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    scrollToTop();
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  };
  const goToStep = (step: number) => {
    setCurrentStep(step);
    scrollToTop();
  };

  const resetForm = () => {
    setCurrentStep(0);
    setIdentificationState(initialIdentification);
    setSubjectState(initialSubject);
    setContentState(initialContent);
    setConsentState(false);
    setProtocolState(null);
    localStorage.removeItem(STORAGE_KEY);
    scrollToTop();
  };

  const setIdentification = (data: Partial<UserIdentification>) => {
    setIdentificationState((prev) => ({ ...prev, ...data }));
  };

  const setSubject = (data: SubjectSelection) => {
    setSubjectState(data);
  };

  const setChannel = (channel: ManifestationChannel) => {
    setContentState((prev) => ({ ...prev, channel }));
  };

  const setContent = (data: Partial<ManifestationContent>) => {
    setContentState((prev) => ({ ...prev, ...data }));
  };

  const setConsent = (value: boolean) => {
    setConsentState(value);
  };

  const setProtocol = (newProtocol: string) => {
    setProtocolState(newProtocol);
  };

  return (
    <ManifestationFormContext.Provider
      value={{
        currentStep,
        identification,
        subject,
        content,
        consent,
        protocol,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
        setIdentification,
        setSubject,
        setChannel,
        setContent,
        setConsent,
        setProtocol,
      }}
    >
      {children}
    </ManifestationFormContext.Provider>
  );
}
