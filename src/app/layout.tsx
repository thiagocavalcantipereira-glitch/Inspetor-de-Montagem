import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shineray | Inspeção de Montagem",
  description: "Sistema interno de Inspeção de Montagem (offline-first).",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
