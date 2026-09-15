import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FM politique, lecture du monde",
  description: "Tableau de bord et chronologie causale, prototype local.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 24, maxWidth: 960 }}>
        <header>
          <h1>FM politique, lecture du monde</h1>
          <p>Prototype local. Le joueur lit le monde : tableaux et chronologie, jamais de personnages.</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
