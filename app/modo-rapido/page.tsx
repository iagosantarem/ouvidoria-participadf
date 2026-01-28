import type { Metadata } from "next";
import { QuickVoiceMode } from "./quick-voice-mode";

export const metadata: Metadata = {
  title: "Modo Rápido por Voz - Participa DF",
  description:
    "Registre sua manifestação por voz de forma simples e rápida na Ouvidoria do GDF.",
};

export default function ModoRapidoPage() {
  return <QuickVoiceMode />;
}
