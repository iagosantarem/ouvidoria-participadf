/**
 * Dados de assuntos para triagem de manifestações
 * O cidadão escolhe o assunto e o sistema sugere o órgão responsável
 */

export interface Subject {
  id: string;
  label: string;
  keywords: string[];
  suggestedAgency: string;
  icon?: string;
}

export const SUBJECT_CATEGORIES: Subject[] = [
  {
    id: "saude",
    label: "Saúde",
    keywords: [
      "hospital",
      "upa",
      "posto de saúde",
      "médico",
      "enfermeiro",
      "remédio",
      "medicamento",
      "vacina",
      "exame",
      "consulta",
      "atendimento médico",
      "emergência",
      "ambulância",
      "samu",
      "clínica",
      "dentista",
    ],
    suggestedAgency: "Secretaria de Saúde do DF (SES-DF)",
  },
  {
    id: "transito",
    label: "Trânsito e Transporte",
    keywords: [
      "ônibus",
      "metrô",
      "brt",
      "transporte público",
      "semáforo",
      "trânsito",
      "buraco",
      "asfalto",
      "pista",
      "rodovia",
      "estacionamento",
      "multa",
      "detran",
      "carteira de motorista",
      "cnh",
      "placa",
      "sinalização",
    ],
    suggestedAgency: "Secretaria de Transporte e Mobilidade (SEMOB-DF)",
  },
  {
    id: "educacao",
    label: "Educação",
    keywords: [
      "escola",
      "creche",
      "universidade",
      "professor",
      "aluno",
      "matrícula",
      "vaga",
      "merenda",
      "uniforme",
      "livro",
      "material escolar",
      "ensino",
      "faculdade",
      "educação infantil",
    ],
    suggestedAgency: "Secretaria de Educação do DF (SEE-DF)",
  },
  {
    id: "seguranca",
    label: "Segurança",
    keywords: [
      "polícia",
      "segurança",
      "crime",
      "roubo",
      "furto",
      "assalto",
      "violência",
      "iluminação",
      "delegacia",
      "ocorrência",
      "patrulha",
      "viatura",
      "bombeiro",
      "incêndio",
    ],
    suggestedAgency: "Secretaria de Segurança Pública do DF (SSP-DF)",
  },
  {
    id: "servicos",
    label: "Serviços Públicos",
    keywords: [
      "água",
      "luz",
      "esgoto",
      "lixo",
      "coleta",
      "limpeza",
      "calçada",
      "praça",
      "parque",
      "documento",
      "certidão",
      "na hora",
      "atendimento",
      "fila",
      "protocolo",
    ],
    suggestedAgency: "Secretaria de Governo do DF (SEGOV-DF)",
  },
  {
    id: "servidor",
    label: "Servidor Público",
    keywords: [
      "servidor",
      "funcionário público",
      "atendimento ruim",
      "má conduta",
      "assédio",
      "corrupção",
      "abuso",
      "negligência",
      "descaso",
      "desrespeito",
    ],
    suggestedAgency: "Controladoria-Geral do DF (CGDF)",
  },
  {
    id: "meioambiente",
    label: "Meio Ambiente",
    keywords: [
      "árvore",
      "poda",
      "queimada",
      "poluição",
      "rio",
      "lago",
      "animal",
      "fauna",
      "flora",
      "desmatamento",
      "lixo irregular",
      "entulho",
      "esgoto a céu aberto",
    ],
    suggestedAgency: "Secretaria de Meio Ambiente do DF (SEMA-DF)",
  },
  {
    id: "outro",
    label: "Outro Assunto",
    keywords: [],
    suggestedAgency: "Ouvidoria-Geral do DF",
  },
];

/**
 * Busca assuntos por palavra-chave
 */
export function searchSubjects(query: string): Subject[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return SUBJECT_CATEGORIES.filter((subject) => {
    // Verifica o label
    const normalizedLabel = subject.label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (normalizedLabel.includes(normalizedQuery)) return true;

    // Verifica as keywords
    return subject.keywords.some((keyword) => {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedKeyword.includes(normalizedQuery);
    });
  });
}

/**
 * Obtém assunto por ID
 */
export function getSubjectById(id: string): Subject | undefined {
  return SUBJECT_CATEGORIES.find((subject) => subject.id === id);
}
