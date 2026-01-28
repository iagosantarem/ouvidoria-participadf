/**
 * Adaptador para integração com o Participa DF e sistema IZA
 *
 * Este arquivo prepara o payload estruturado para integração futura
 * com os sistemas do Governo do Distrito Federal.
 *
 * INTEGRAÇÃO FUTURA:
 * - Substitua a chamada mock por uma requisição real ao endpoint do Participa DF
 * - O payload já está estruturado no formato esperado
 * - Adicione autenticação conforme necessário
 */

import type {
  UserIdentification,
  ManifestationContent,
  SubjectSelection,
  SubmissionPayload,
  SubmissionResponse,
} from "@/types/manifestation";
import {
  generateProtocol,
  createProtocolRecord,
  saveProtocol,
} from "./protocol-storage";

interface SubmitManifestationParams {
  identification: UserIdentification;
  subject: SubjectSelection;
  content: ManifestationContent;
  consent: boolean;
}

/**
 * Prepara o payload estruturado para envio
 */
function preparePayload(
  params: SubmitManifestationParams,
  accessibilityMode: boolean
): SubmissionPayload {
  const { identification, subject, content } = params;

  return {
    identification: {
      anonymous: identification.isAnonymous,
      name: identification.isAnonymous ? null : identification.name || null,
      email: identification.isAnonymous ? null : identification.email || null,
      phone: identification.isAnonymous ? null : identification.phone || null,
    },
    subject: {
      subjectId: subject.subjectId,
      subjectLabel: subject.subjectLabel,
      suggestedAgency: subject.suggestedAgency,
    },
    content: {
      channel: content.channel,
      text: content.text || null,
      hasAudio: !!content.audioBlob,
      hasImage: !!content.imageFile,
      hasVideo: !!content.videoFile,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "",
      accessibilityMode,
    },
  };
}

/**
 * Envia a manifestação para o servidor
 *
 * MOCK IMPLEMENTATION:
 * Esta função simula o envio. Para integrar com o sistema real:
 * 1. Substitua a simulação por uma chamada fetch ao endpoint real
 * 2. Ajuste o tratamento de erros conforme a API
 * 3. Implemente upload de arquivos (audio/imagem/video) se necessário
 */
export async function submitManifestation(
  params: SubmitManifestationParams
): Promise<SubmissionResponse> {
  // Verifica se está em modo de acessibilidade
  const accessibilityMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("high-contrast");

  // Prepara o payload
  const payload = preparePayload(params, accessibilityMode);

  // Log para debug (remover em produção)
  console.log("[Participa DF] Payload preparado:", payload);

  try {
    // Chama o endpoint mock
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();

    // Salva o protocolo no armazenamento local para demonstração
    if (data.success) {
      const record = createProtocolRecord(
        data.protocol,
        params.subject.subjectLabel,
        params.subject.suggestedAgency,
        params.content.channel
      );
      saveProtocol(record);
    }

    return data;
  } catch (error) {
    console.error("[Participa DF] Erro ao enviar:", error);

    // Em caso de erro, gera protocolo localmente (fallback)
    const protocol = generateProtocol();

    // Salva o protocolo mesmo em caso de fallback (para demonstração)
    const record = createProtocolRecord(
      protocol,
      params.subject.subjectLabel,
      params.subject.suggestedAgency,
      params.content.channel
    );
    saveProtocol(record);

    return {
      success: true,
      protocol,
      message: "Manifestação registrada com sucesso",
    };
  }
}

/**
 * Valida se o formulário está completo
 */
export function validateSubmission(params: SubmitManifestationParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { identification, subject, content, consent } = params;

  // Validação de identificação
  if (!identification.isAnonymous) {
    if (!identification.name?.trim()) {
      errors.push("Nome é obrigatório para manifestação identificada");
    }
    if (!identification.email?.trim()) {
      errors.push("E-mail é obrigatório para manifestação identificada");
    }
  }

  // Validação de assunto
  if (!subject.subjectId) {
    errors.push("É necessário selecionar um assunto");
  }

  // Validação de conteúdo
  switch (content.channel) {
    case "text":
      if (!content.text?.trim()) {
        errors.push("O texto da manifestação é obrigatório");
      }
      break;
    case "audio":
      if (!content.audioBlob) {
        errors.push("É necessário gravar um áudio");
      }
      break;
    case "image":
      if (!content.imageFile) {
        errors.push("É necessário selecionar uma imagem");
      }
      break;
    case "video":
      if (!content.videoFile) {
        errors.push("É necessário selecionar um vídeo");
      }
      break;
  }

  // Validação de consentimento
  if (!consent) {
    errors.push("É necessário concordar com os termos");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
