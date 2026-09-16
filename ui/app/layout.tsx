import type { Metadata } from "next";
import { MENTION_DISCRETE } from "../sim/carriere";
import "./globals.css";
import "./styles/composants.css";
import "./styles/formulaire.css";
import "./styles/tableau-de-bord.css";

export const metadata: Metadata = {
  title: "FM politique",
  description:
    "Carrière politique hebdomadaire à partir de septembre 2026. Personnages nommés, calendrier réel, monde qui vit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          <header className="site-entete">
            <a className="marque" href="/">
              FM politique
              <span className="partie-nom">dossier de campagne</span>
            </a>
            <p className="mention">
              Simulation ouverte le 7 septembre 2026. Faits, groupes et personnages fictifs, aucune personne réelle
              n'est mise en scène.
            </p>
          </header>
          <main>{children}</main>
          <footer className="site-pied">
            <p className="mention">{MENTION_DISCRETE}</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
