/**
 * Armazenamento de protocolos para demonstração
 * Este é um mock para fins de demonstração à banca.
 * Em produção, os dados seriam armazenados em banco de dados.
 */

import type { ProtocolRecord, ManifestationChannel } from "@/types/manifestation";

const STORAGE_KEY = "participa-df-protocols";

/**
 * Salva um novo protocolo no armazenamento local
 */
export function saveProtocol(record: ProtocolRecord): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getProtocols();
    existing.unshift(record); // Adiciona no início (mais recentes primeiro)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Erro ao salvar protocolo:", error);
  }
}

/**
 * Recupera todos os protocolos do armazenamento local
 */
export function getProtocols(): ProtocolRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ProtocolRecord[];
  } catch {
    return [];
  }
}

/**
 * Gera um novo número de protocolo
 * Formato: DF-YYYYMMDD-XXXXXX
 */
export function generateProtocol(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return `DF-${year}${month}${day}-${random}`;
}

/**
 * Cria um registro de protocolo
 */
export function createProtocolRecord(
  protocol: string,
  subjectLabel: string,
  suggestedAgency: string,
  channel: ManifestationChannel
): ProtocolRecord {
  return {
    protocol,
    subjectLabel,
    suggestedAgency,
    channel,
    createdAt: new Date().toISOString(),
    status: "Recebido",
  };
}

/**
 * Deleta um protocolo pelo número
 */
export function deleteProtocol(protocolNumber: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = getProtocols();
    const filtered = existing.filter((p) => p.protocol !== protocolNumber);
    
    if (filtered.length === existing.length) {
      return false; // Protocolo não encontrado
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Erro ao deletar protocolo:", error);
    return false;
  }
}

/**
 * Deleta todos os protocolos
 */
export function clearAllProtocols(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar protocolos:", error);
  }
}

/**
 * Filtra protocolos por assunto
 */
export function filterProtocolsBySubject(
  protocols: ProtocolRecord[],
  subjectLabel: string
): ProtocolRecord[] {
  if (!subjectLabel) return protocols;
  return protocols.filter((p) =>
    p.subjectLabel.toLowerCase().includes(subjectLabel.toLowerCase())
  );
}

/**
 * Obtém nome legível do canal
 */
export function getChannelDisplayName(channel: ManifestationChannel): string {
  const names: Record<ManifestationChannel, string> = {
    text: "Texto",
    audio: "Áudio",
    image: "Imagem",
    video: "Vídeo",
  };
  return names[channel] || channel;
}

/**
 * Formata data para exibição
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoDate;
  }
}
