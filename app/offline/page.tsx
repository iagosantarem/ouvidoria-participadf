import { OfflineContent } from "./offline-content";

export const metadata = {
  title: "Sem conexão – Participa DF",
  description: "Você está sem conexão com a internet",
};

export default function OfflinePage() {
  return <OfflineContent />;
}
