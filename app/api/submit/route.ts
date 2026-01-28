import { NextResponse } from "next/server";
import type { SubmissionPayload, SubmissionResponse } from "@/types/manifestation";

/**
 * API Route para receber manifestações
 *
 * MOCK IMPLEMENTATION:
 * Este endpoint simula o processamento. Para integrar com o sistema real:
 * 1. Valide e sanitize os dados de entrada
 * 2. Conecte ao banco de dados ou API do Participa DF
 * 3. Implemente upload de arquivos para storage
 * 4. Integre com o sistema IZA para processamento por IA
 */

/**
 * Gera um protocolo no formato DF-YYYYMMDD-XXXXXX
 */
function generateProtocol(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `DF-${year}${month}${day}-${random}`;
}

export async function POST(request: Request) {
  try {
    const payload: SubmissionPayload = await request.json();

    // Log para debug
    console.log("[API] Manifestação recebida:", {
      anonymous: payload.identification.anonymous,
      subject: payload.subject?.subjectLabel,
      agency: payload.subject?.suggestedAgency,
      channel: payload.content.channel,
      timestamp: payload.metadata.timestamp,
    });

    // Validação básica
    if (!payload.content.channel) {
      return NextResponse.json(
        {
          success: false,
          protocol: "",
          message: "Canal de manifestação não informado",
        } satisfies SubmissionResponse,
        { status: 400 }
      );
    }

    // Simula processamento (em produção, salvar no banco)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Gera protocolo
    const protocol = generateProtocol();

    // TODO: Integração futura
    // - Salvar no banco de dados do Participa DF
    // - Enviar para fila de processamento do IZA
    // - Enviar e-mail de confirmação (se identificado)
    // - Registrar logs de auditoria

    const response: SubmissionResponse = {
      success: true,
      protocol,
      message: "Manifestação registrada com sucesso",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Erro ao processar manifestação:", error);

    return NextResponse.json(
      {
        success: false,
        protocol: "",
        message: "Erro interno do servidor. Por favor, tente novamente.",
      } satisfies SubmissionResponse,
      { status: 500 }
    );
  }
}
