"use client";

import { useState, useRef, useEffect } from "react";
import { useManifestationForm } from "@/hooks/use-manifestation-form";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeft, ArrowRight, Mic, Square, Play, RotateCcw, AlertCircle } from "lucide-react";

const MAX_DURATION = 120; // 2 minutos em segundos

export function AudioInput() {
  const { content, setContent, nextStep, goToStep } = useManifestationForm();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Limpa recursos ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (content.audioUrl) URL.revokeObjectURL(content.audioUrl);
    };
  }, [content.audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setContent({ audioBlob, audioUrl });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    if (content.audioUrl) {
      URL.revokeObjectURL(content.audioUrl);
    }
    setContent({ audioBlob: undefined, audioUrl: undefined });
    setDuration(0);
    setIsPlaying(false);
  };

  const playAudio = () => {
    if (content.audioUrl && audioRef.current) {
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

  const handleSubmit = () => {
    if (!content.audioBlob) {
      setError("Por favor, grave um áudio antes de continuar");
      return;
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <ProgressBar currentStep={4} />

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Grave sua manifestação
      </h2>
      <p className="text-muted-foreground mb-6 text-pretty">
        Você pode gravar um áudio de até 2 minutos explicando sua situação.
      </p>

      {/* Área de gravação */}
      <div className="bg-card border border-border rounded-xl p-8 mb-6">
        {!content.audioUrl ? (
          <>
            {/* Timer e botão de gravação */}
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-colors ${
                  isRecording ? "bg-destructive animate-pulse" : "bg-primary"
                }`}
              >
                {isRecording ? (
                  <Square className="w-12 h-12 text-destructive-foreground" aria-hidden="true" />
                ) : (
                  <Mic className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
                )}
              </div>

              <p className="text-4xl font-mono font-bold text-foreground mb-2" aria-live="polite">
                {formatTime(duration)}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Máximo: {formatTime(MAX_DURATION)}
              </p>

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="lg"
                className={`h-16 px-8 text-xl font-semibold focus-visible-ring ${
                  isRecording ? "bg-destructive hover:bg-destructive/90" : ""
                }`}
                aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
              >
                {isRecording ? "Parar" : "Gravar"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Preview do áudio */}
            <div className="flex flex-col items-center">
              <div className="w-full mb-6">
                <audio
                  ref={audioRef}
                  src={content.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Mic className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Áudio gravado</p>
                      <p className="text-sm text-muted-foreground">{formatTime(duration)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={playAudio}
                  className="h-14 px-6 text-lg font-medium focus-visible-ring bg-transparent"
                  aria-label={isPlaying ? "Pausar áudio" : "Ouvir áudio"}
                >
                  <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                  {isPlaying ? "Pausar" : "Ouvir"}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetRecording}
                  className="h-14 px-6 text-lg font-medium focus-visible-ring bg-transparent"
                  aria-label="Gravar novamente"
                >
                  <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                  Regravar
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-4 mb-6 flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => goToStep(3)}
          className="h-14 text-lg font-medium focus-visible-ring order-2 sm:order-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Trocar canal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.audioBlob}
          className="h-14 text-lg font-medium focus-visible-ring flex-1 order-1 sm:order-2"
        >
          Revisar
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
