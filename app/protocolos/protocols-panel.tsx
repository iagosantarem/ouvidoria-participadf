"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { ProtocolRecord } from "@/types/manifestation";
import {
  getProtocols,
  deleteProtocol,
  clearAllProtocols,
  getChannelDisplayName,
  formatDate,
} from "@/services/protocol-storage";
import { SUBJECT_CATEGORIES } from "@/data/subjects";
import {
  ArrowLeft,
  Search,
  FileText,
  Mic,
  ImageIcon,
  Video,
  Clock,
  Building2,
  Tag,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";

export function ProtocolsPanel() {
  const [protocols, setProtocols] = useState<ProtocolRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega protocolos do localStorage
    const loadedProtocols = getProtocols();
    setProtocols(loadedProtocols);
    setIsLoading(false);
  }, []);

  const handleDelete = (protocolNumber: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o protocolo ${protocolNumber}?`)) {
      const success = deleteProtocol(protocolNumber);
      if (success) {
        setProtocols(getProtocols());
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Tem certeza que deseja excluir TODOS os registros? Esta ação não pode ser desfeita.")) {
      clearAllProtocols();
      setProtocols([]);
    }
  };

  const filteredProtocols = useMemo(() => {
    let result = protocols;

    // Filtro por assunto
    if (subjectFilter && subjectFilter !== "all") {
      result = result.filter((p) => p.subjectLabel === subjectFilter);
    }

    // Filtro por busca (protocolo)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.protocol.toLowerCase().includes(query) ||
          p.subjectLabel.toLowerCase().includes(query) ||
          p.suggestedAgency.toLowerCase().includes(query)
      );
    }

    return result;
  }, [protocols, subjectFilter, searchQuery]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "text":
        return <FileText className="w-4 h-4" aria-hidden="true" />;
      case "audio":
        return <Mic className="w-4 h-4" aria-hidden="true" />;
      case "image":
        return <ImageIcon className="w-4 h-4" aria-hidden="true" />;
      case "video":
        return <Video className="w-4 h-4" aria-hidden="true" />;
      default:
        return <FileText className="w-4 h-4" aria-hidden="true" />;
    }
  };

  // Obtém lista única de assuntos dos protocolos
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(protocols.map((p) => p.subjectLabel));
    return Array.from(subjects);
  }, [protocols]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Cabeçalho */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:underline focus-visible-ring rounded px-1 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Voltar ao início
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Meus Registros
              </h1>
              {protocols.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Limpar tudo
                </Button>
              )}
            </div>
            <p className="text-muted-foreground text-pretty">
              Visualize e gerencie suas manifestações registradas.
            </p>

            {/* Aviso de demonstração */}
            <div className="mt-4 bg-accent/10 border border-accent rounded-xl p-4 flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-accent shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-foreground">
                  Painel de demonstração
                </p>
                <p className="text-sm text-muted-foreground">
                  Este painel é apenas para fins de demonstração. Não exibe dados
                  pessoais sensíveis em conformidade com a LGPD.
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Busca por protocolo */}
              <div>
                <Label htmlFor="search-protocol" className="text-sm font-medium">
                  Buscar protocolo
                </Label>
                <div className="relative mt-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="search-protocol"
                    type="search"
                    placeholder="Digite o número do protocolo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus-visible-ring"
                  />
                </div>
              </div>

              {/* Filtro por assunto */}
              <div>
                <Label htmlFor="filter-subject" className="text-sm font-medium">
                  Filtrar por assunto
                </Label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger id="filter-subject" className="mt-1 focus-visible-ring">
                    <SelectValue placeholder="Todos os assuntos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os assuntos</SelectItem>
                    {uniqueSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lista de protocolos */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando registros...</p>
            </div>
          ) : filteredProtocols.length === 0 ? (
            <div className="bg-secondary rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText
                  className="w-8 h-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhum registro encontrado
              </h2>
              <p className="text-muted-foreground mb-6">
                {protocols.length === 0
                  ? "Ainda não há manifestações registradas."
                  : "Nenhum protocolo corresponde aos filtros selecionados."}
              </p>
              <Button asChild>
                <Link href="/">Registrar manifestação</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredProtocols.length} registro(s) encontrado(s)
              </p>

              <div className="space-y-4">
                {filteredProtocols.map((protocol) => (
                  <article
                    key={protocol.protocol}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                  >
                    {/* Cabeçalho do card */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Protocolo
                        </p>
                        <p className="text-lg font-mono font-bold text-primary">
                          {protocol.protocol}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                          <CheckCircle className="w-4 h-4" aria-hidden="true" />
                          <span className="text-sm font-medium">
                            {protocol.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(protocol.protocol)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus-visible-ring"
                          aria-label={`Excluir protocolo ${protocol.protocol}`}
                        >
                          <Trash2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <Tag
                          className="w-4 h-4 text-muted-foreground mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-muted-foreground">Assunto</p>
                          <p className="font-medium text-foreground">
                            {protocol.subjectLabel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building2
                          className="w-4 h-4 text-muted-foreground mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-muted-foreground">Órgão sugerido</p>
                          <p className="font-medium text-foreground">
                            {protocol.suggestedAgency}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        {getChannelIcon(protocol.channel)}
                        <div>
                          <p className="text-muted-foreground">Canal</p>
                          <p className="font-medium text-foreground">
                            {getChannelDisplayName(protocol.channel)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock
                          className="w-4 h-4 text-muted-foreground mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-muted-foreground">Data/Hora</p>
                          <p className="font-medium text-foreground">
                            {formatDate(protocol.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
