import type { Metadata } from "next";
import { ProtocolsPanel } from "./protocols-panel";

export const metadata: Metadata = {
  title: "Registros de Manifestações (Demo) | Participa DF",
  description:
    "Painel demonstrativo para visualização dos protocolos registrados na Ouvidoria do GDF.",
};

export default function ProtocolsPage() {
  return <ProtocolsPanel />;
}
