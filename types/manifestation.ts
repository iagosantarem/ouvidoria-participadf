/**
 * Tipos para o sistema de manifestações do Participa DF
 */

export type ManifestationChannel = "text" | "audio" | "image" | "video";

export interface UserIdentification {
  isAnonymous: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

export interface ManifestationContent {
  channel: ManifestationChannel;
  text?: string;
  audioBlob?: Blob;
  audioUrl?: string;
  imageFile?: File;
  imagePreview?: string;
  videoFile?: File;
  videoPreview?: string;
}

export interface SubjectSelection {
  subjectId: string;
  subjectLabel: string;
  suggestedAgency: string;
}

export interface Manifestation {
  identification: UserIdentification;
  subject: SubjectSelection;
  content: ManifestationContent;
  consent: boolean;
  protocol?: string;
  createdAt?: Date;
}

/**
 * Registro de protocolo para o painel de demonstração
 */
export interface ProtocolRecord {
  protocol: string;
  subjectLabel: string;
  suggestedAgency: string;
  channel: ManifestationChannel;
  createdAt: string;
  status: "Recebido";
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Identificação",
    description: "Escolha como deseja se identificar",
  },
  {
    id: 2,
    title: "Assunto",
    description: "Selecione o assunto da sua manifestação",
  },
  {
    id: 3,
    title: "Canal",
    description: "Escolha como deseja enviar sua manifestação",
  },
  {
    id: 4,
    title: "Revisão",
    description: "Confirme os dados antes de enviar",
  },
];

/**
 * Payload estruturado para integração futura com Participa DF e IZA
 */
export interface SubmissionPayload {
  identification: {
    anonymous: boolean;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  subject: {
    subjectId: string;
    subjectLabel: string;
    suggestedAgency: string;
  };
  content: {
    channel: ManifestationChannel;
    text: string | null;
    hasAudio: boolean;
    hasImage: boolean;
    hasVideo: boolean;
  };
  metadata: {
    timestamp: string;
    userAgent: string;
    accessibilityMode: boolean;
  };
}

export interface SubmissionResponse {
  success: boolean;
  protocol: string;
  message: string;
}
