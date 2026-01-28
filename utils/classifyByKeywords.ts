/**
 * Classificação automática de manifestações por palavras-chave
 * Usado pelo Modo Rápido por Voz para sugerir assunto e órgão
 */

import {
  KEYWORD_RULES,
  DEFAULT_CLASSIFICATION,
  type KeywordRule,
} from "@/data/keywordRules";

export interface ClassificationResult {
  subjectId: string;
  subjectLabel: string;
  suggestedAgency: string;
  confidence: "alta" | "media" | "baixa";
  matchedKeywords: string[];
}

/**
 * Normaliza texto removendo acentos e convertendo para minúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Classifica uma transcrição baseado em palavras-chave
 * Retorna o assunto e órgão sugeridos com nível de confiança
 */
export function classifyByKeywords(transcript: string): ClassificationResult {
  if (!transcript || transcript.trim().length === 0) {
    return {
      ...DEFAULT_CLASSIFICATION,
      confidence: "baixa",
      matchedKeywords: [],
    };
  }

  const normalizedTranscript = normalizeText(transcript);
  const words = normalizedTranscript.split(" ");

  // Conta matches para cada regra
  const ruleScores: Array<{
    rule: KeywordRule;
    matches: string[];
    score: number;
  }> = [];

  for (const rule of KEYWORD_RULES) {
    const matches: string[] = [];

    for (const keyword of rule.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      const keywordWords = normalizedKeyword.split(" ");

      // Verifica se a keyword (que pode ter múltiplas palavras) está presente
      if (keywordWords.length === 1) {
        // Keyword de uma palavra: verifica se está no array de palavras
        if (words.includes(normalizedKeyword)) {
          matches.push(keyword);
        }
      } else {
        // Keyword composta: verifica se a sequência está no texto
        if (normalizedTranscript.includes(normalizedKeyword)) {
          matches.push(keyword);
        }
      }
    }

    if (matches.length > 0) {
      // Score = número de matches * prioridade da regra
      const score = matches.length * rule.priority;
      ruleScores.push({ rule, matches, score });
    }
  }

  // Se não encontrou nenhum match, retorna classificação padrão
  if (ruleScores.length === 0) {
    return {
      ...DEFAULT_CLASSIFICATION,
      confidence: "baixa",
      matchedKeywords: [],
    };
  }

  // Ordena por score e pega o maior
  ruleScores.sort((a, b) => b.score - a.score);
  const best = ruleScores[0];

  // Determina confiança baseado no número de matches
  let confidence: "alta" | "media" | "baixa";
  if (best.matches.length >= 3) {
    confidence = "alta";
  } else if (best.matches.length >= 2) {
    confidence = "media";
  } else {
    confidence = "baixa";
  }

  return {
    subjectId: best.rule.subjectId,
    subjectLabel: best.rule.subjectLabel,
    suggestedAgency: best.rule.suggestedAgency,
    confidence,
    matchedKeywords: best.matches,
  };
}

/**
 * Retorna texto descritivo do nível de confiança
 */
export function getConfidenceText(
  confidence: "alta" | "media" | "baixa"
): string {
  switch (confidence) {
    case "alta":
      return "Sugestão com alta confiança";
    case "media":
      return "Sugestão com média confiança";
    case "baixa":
      return "Sugestão automática";
    default:
      return "";
  }
}
