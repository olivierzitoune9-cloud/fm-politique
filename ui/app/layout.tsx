import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FM politique, lecture du monde",
  description: "Tableau de bord et chronologie causale, prototype local.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          <header className="site-header">
            <h1>
              <span className="jeu">FM politique</span>, lecture du monde
            </h1>
            <p>Prototype local. Tu lis le monde : tableaux et chronologie, jamais de personnages.</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
