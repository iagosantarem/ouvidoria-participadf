"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  FileText,
  Edit3,
} from "lucide-react";
import {
  classifyByKeywords,
  getConfidenceText,
  type ClassificationResult,
} from "@/utils/classifyByKeywords";
import {
  generateProtocol,
  createProtocolRecord,
  saveProtocol,
} from "@/services/protocol-storage";

type QuickModeStep = "recording" | "edit-transcript" | "transcription" | "classification" | "done";

// Função utilitária para scroll to top (mobile UX)
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }
};

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function QuickVoiceMode() {
  // Estado do fluxo
  const [step, setStep] = useState<QuickModeStep>("recording");

  // Estado de gravação
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estado de transcrição
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState(""); // Declare setLiveTranscript here

  // Estado de classificação
  const [classification, setClassification] =
    useState<ClassificationResult | null>(null);

  // Estado de protocolo
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Verifica suporte a Web Speech API e se e mobile
  const [isMobile, setIsMobile] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Detecta mobile
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [audioUrl]);

  // Inicia gravação
  const startRecording = async () => {
    try {
      // Solicita permissao do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      // Verifica formato suportado para mobile
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      // Inicia reconhecimento de fala em tempo real
      if (speechSupported) {
        try {
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = !isMobile; // Mobile nao suporta bem continuous
          recognition.interimResults = true;
          recognition.lang = "pt-BR";

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = "";
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
if (result.isFinal) {
                                final += result[0].transcript + " ";
                              } else {
                                interim += result[0].transcript;
                              }
                            }
                            // Atualiza transcrição em tempo real
                            if (final) {
                              setTranscript((prev) => prev + final);
                            }
            setLiveTranscript(interim); // Update liveTranscript here
          };

recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                            if (event.error === "not-allowed") {
              setPermissionDenied(true);
              setSpeechSupported(false);
            }
            // Em mobile, tenta reiniciar apos erros nao-criticos
            if (isMobile && event.error === "no-speech" && isRecording) {
              try {
                recognition.start();
              } catch {
                // Ignora erro de reinicializacao
              }
            }
          };

          recognition.onend = () => {
            // Em mobile, reinicia se ainda estiver gravando
            if (isMobile && isRecording && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch {
                // Ignora erro de reinicializacao
              }
            }
          };

recognitionRef.current = recognition;
                          recognition.start();
                        } catch {
                          // Continua sem transcricao automatica
                        }
      }

      mediaRecorder.start(1000); // Coleta dados a cada 1 segundo
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript("");
      setPermissionDenied(false);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
} catch {
                  setPermissionDenied(true);
      alert("Nao foi possivel acessar o microfone. Por favor, permita o acesso ao microfone nas configuracoes do seu navegador.");
    }
  };

  // Para gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
// O transcript já foi atualizado em tempo real via onresult
                      // Apenas garante que temos algo capturado
                      setTranscript((prev) => prev.trim());
    }
  }, [isRecording]);

  // Reproduz áudio
  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Regrava
  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript("");
    setRecordingTime(0);
    setIsPlaying(false);
    setLiveTranscript("");
  };

  // Avança para edição de transcrição (nova etapa mobile)
  const goToEditTranscript = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      setStep("edit-transcript");
      scrollToTop();
    }, 500);
  };

  // Avança para transcrição (confirmação)
  const goToTranscription = () => {
    setStep("transcription");
    scrollToTop();
  };

  // Confirma texto e classifica
  const confirmText = () => {
    const result = classifyByKeywords(transcript);
    setClassification(result);
    setStep("classification");
    scrollToTop();
  };

  // Gera protocolo final
  const generateFinalProtocol = () => {
    const newProtocol = generateProtocol();
    setProtocol(newProtocol);

    // Salva no localStorage
    if (classification) {
      const record = createProtocolRecord(
        newProtocol,
        classification.subjectLabel,
        classification.suggestedAgency,
        "audio"
      );
      saveProtocol(record);
    }

    setStep("done");
    scrollToTop();
  };

  // Copia protocolo
  const copyProtocol = () => {
    if (protocol) {
      navigator.clipboard.writeText(protocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Formata tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 py-6 px-4" tabIndex={-1}>
        <div className="max-w-lg mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Navegação">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Voltar ao início
              </Link>
            </Button>
          </nav>

          {/* Título */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Mic className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Modo Rápido por Voz
            </h1>
            <p className="text-muted-foreground">
              Fale sua manifestação e nós cuidamos do resto
            </p>
          </div>

          {/* Etapa 1: Gravação */}
          {step === "recording" && (
            <Card className="border-2">
              <CardContent className="pt-6">
                {/* Indicador de etapa */}
                <div
                  className="flex items-center justify-center gap-2 mb-6"
                  aria-hidden="true"
                >
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">
                  1. Grave sua mensagem
                </h2>
                <p className="text-muted-foreground text-center mb-4">
                  Aperte o botao e fale o que deseja registrar
                </p>

                {/* Aviso para mobile */}
                {isMobile && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-center">
                    <p className="text-foreground">
                      <strong>Dica:</strong> Apos gravar, voce podera digitar ou editar o texto na proxima etapa.
                    </p>
                  </div>
                )}

                {/* Aviso de permissao negada */}
                {permissionDenied && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                    <p className="text-destructive font-medium mb-1">Permissao de microfone negada</p>
                    <p className="text-muted-foreground">
                      Por favor, permita o acesso ao microfone nas configuracoes do seu navegador para gravar sua mensagem.
                    </p>
                  </div>
                )}

                {/* Área de gravação */}
                <div className="flex flex-col items-center gap-6">
                  {!audioBlob ? (
                    <>
                      {/* Botão de gravar */}
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all focus-visible-ring ${
                          isRecording
                            ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                            : "bg-accent hover:bg-accent/90"
                        }`}
                        aria-label={
                          isRecording ? "Parar gravação" : "Iniciar gravação"
                        }
                      >
                        {isRecording ? (
                          <Square className="w-12 h-12 text-destructive-foreground" />
                        ) : (
                          <Mic className="w-12 h-12 text-accent-foreground" />
                        )}
                      </button>

                      {/* Timer */}
                      <div
                        className="text-center"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <p className="text-3xl font-mono font-bold text-foreground">
                          {formatTime(recordingTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isRecording ? "Gravando..." : "Máximo 2 minutos"}
                        </p>
                      </div>

                      {/* Transcrição em tempo real */}
                      {isRecording && speechSupported && liveTranscript && (
                        <div className="w-full p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Transcrição em tempo real:
                          </p>
                          <p className="text-foreground">{liveTranscript}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Preview do áudio */}
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            onClick={playAudio}
                            variant="outline"
                            size="lg"
                            className="h-14 px-6 bg-transparent"
                            aria-label={
                              isPlaying ? "Pausar áudio" : "Ouvir gravação"
                            }
                          >
                            <Play
                              className={`w-6 h-6 mr-2 ${isPlaying ? "text-primary" : ""}`}
                            />
                            {isPlaying ? "Pausar" : "Ouvir"}
                          </Button>
                          <Button
                            onClick={resetRecording}
                            variant="outline"
                            size="lg"
                            className="h-14 px-6 bg-transparent"
                            aria-label="Gravar novamente"
                          >
                            <RotateCcw className="w-6 h-6 mr-2" />
                            Regravar
                          </Button>
                        </div>
                        <audio
                          ref={audioRef}
                          src={audioUrl || undefined}
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />

                        <p className="text-center text-sm text-muted-foreground">
                          Duração: {formatTime(recordingTime)}
                        </p>

                        {/* Mostra transcrição capturada */}
                        {transcript && (
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              Texto capturado:
                            </p>
                            <p className="text-foreground">{transcript}</p>
                          </div>
                        )}
                      </div>

                      {/* Botão continuar */}
                      <Button
                        onClick={goToEditTranscript}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                        disabled={isTranscribing}
                      >
                        {isTranscribing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            Continuar
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Etapa 1.5: Edição de transcrição (Mobile) */}
          {step === "edit-transcript" && (
            <Card className="border-2">
              <CardContent className="pt-6">
                {/* Indicador de etapa */}
                <div
                  className="flex items-center justify-center gap-2 mb-6"
                  aria-hidden="true"
                >
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-primary/50" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Edit3 className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-center">
                    Edite sua mensagem
                  </h2>
                </div>
                <p className="text-muted-foreground text-center mb-6">
                  Confira e edite o texto abaixo antes de continuar
                </p>

                {/* Área de edição completa */}
                <div className="space-y-4">
                  {/* Aviso se não tiver texto */}
                  {!transcript && (
                    <div
                      className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Nenhum texto foi capturado
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Digite sua mensagem no campo abaixo ou volte e grave novamente.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Texto capturado (se houver) */}
                  {transcript && (
                    <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        Texto capturado do audio:
                      </p>
                    </div>
                  )}

                  {/* Campo de edição grande */}
                  <div>
                    <label
                      htmlFor="edit-transcript-text"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Sua manifestacao
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <Textarea
                      id="edit-transcript-text"
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={10}
                      className="text-lg leading-relaxed resize-none min-h-[200px]"
                      placeholder="Digite ou edite sua mensagem aqui..."
                      aria-describedby="edit-transcript-hint"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p
                        id="edit-transcript-hint"
                        className="text-sm text-muted-foreground"
                      >
                        {transcript.length} caracteres
                      </p>
                      {transcript.length > 0 && transcript.length < 20 && (
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Minimo recomendado: 20 caracteres
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={goToTranscription}
                      size="lg"
                      className="h-14 text-lg font-semibold w-full"
                      disabled={!transcript.trim() || transcript.trim().length < 5}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Confirmar e continuar
                    </Button>
                    <Button
                      onClick={() => {
                        resetRecording();
                        setStep("recording");
                        scrollToTop();
                      }}
                      variant="outline"
                      size="lg"
                      className="h-12 text-base w-full bg-transparent"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Gravar novamente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Etapa 2: Confirmação do texto */}
          {step === "transcription" && (
            <Card className="border-2">
              <CardContent className="pt-6">
                {/* Indicador de etapa */}
                <div
                  className="flex items-center justify-center gap-2 mb-6"
                  aria-hidden="true"
                >
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">
                  2. Confirme o texto
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Verifique se o texto esta correto
                </p>

                {/* Área de visualização do texto */}
                <div className="space-y-4">
                  {/* Preview do texto */}
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Sua mensagem:</p>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {transcript}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {transcript.length} caracteres
                    </p>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={confirmText}
                      size="lg"
                      className="h-14 text-lg font-semibold w-full"
                      disabled={!transcript.trim()}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Confirmar e continuar
                    </Button>
                    <Button
                      onClick={() => {
                        setStep("edit-transcript");
                        scrollToTop();
                      }}
                      variant="outline"
                      size="lg"
                      className="h-12 text-base w-full bg-transparent"
                    >
                      <Edit3 className="w-5 h-5 mr-2" />
                      Editar texto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Etapa 3: Classificação */}
          {step === "classification" && classification && (
            <Card className="border-2">
              <CardContent className="pt-6">
                {/* Indicador de etapa */}
                <div
                  className="flex items-center justify-center gap-2 mb-6"
                  aria-hidden="true"
                >
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-muted" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">
                  3. Confirme o encaminhamento
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Identificamos o assunto da sua mensagem
                </p>

                {/* Card de classificação */}
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Assunto sugerido
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {classification.subjectLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Encaminhamento sugerido
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {classification.suggestedAgency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nível de confiança */}
                  <p className="text-sm text-center text-muted-foreground">
                    {getConfidenceText(classification.confidence)}
                    {classification.matchedKeywords.length > 0 && (
                      <span className="block mt-1">
                        Palavras identificadas:{" "}
                        {classification.matchedKeywords.slice(0, 3).join(", ")}
                        {classification.matchedKeywords.length > 3 && "..."}
                      </span>
                    )}
                  </p>

                  {/* Link para alterar */}
                  <div className="text-center">
                    <Button
                      asChild
                      variant="link"
                      className="text-primary underline"
                    >
                      <Link href="/?step=2">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Alterar assunto manualmente
                      </Link>
                    </Button>
                  </div>

                  {/* Resumo do texto */}
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Sua mensagem:
                    </p>
                    <p className="text-foreground line-clamp-3">{transcript}</p>
                  </div>

                  {/* Botão gerar protocolo */}
                  <Button
                    onClick={generateFinalProtocol}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar e gerar protocolo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Etapa 4: Protocolo gerado */}
          {step === "done" && protocol && (
            <Card className="border-2 border-accent">
              <CardContent className="pt-6">
                {/* Ícone de sucesso */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-accent" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                  Manifestação registrada!
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Guarde o número do protocolo para acompanhar sua manifestação
                </p>

                {/* Protocolo */}
                <div
                  className="p-6 bg-primary/10 rounded-xl text-center mb-6"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    Número do protocolo
                  </p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-primary break-all">
                    {protocol}
                  </p>
                </div>

                {/* Botão copiar */}
                <Button
                  onClick={copyProtocol}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg mb-4 bg-transparent"
                  aria-label={copied ? "Protocolo copiado" : "Copiar protocolo"}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2 text-accent" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copiar protocolo
                    </>
                  )}
                </Button>

                {/* Links */}
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline" size="lg" className="h-12 bg-transparent">
                    <Link href="/protocolos">Ver registro no painel (demo)</Link>
                  </Button>
                  <Button asChild size="lg" className="h-12">
                    <Link href="/">Nova manifestação</Link>
                  </Button>
                </div>

                {/* Informações */}
                {classification && (
                  <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      <strong>Assunto:</strong> {classification.subjectLabel}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Encaminhado para:</strong>{" "}
                      {classification.suggestedAgency}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
