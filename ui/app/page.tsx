// Page d'accueil, niveau 0 : une phrase, une chapeau, deux portes, puis le pays que l'on rejoint.
// Aucun chiffre de jeu ici, la lecture du monde vivant se fait dans la partie.
import { FRANCE_2026 } from "../sim/data/france-2026";

export default function Page() {
  return (
    <>
      <section className="ecran-titre">
        <p className="phrase">Tu n'es personne. Tu as une idée. La France de septembre 2026 ne t'attend pas.</p>
        <p className="chapeau">
          Semaine après semaine, tu écris à des gens, tu promets, tu te déplaces, tu te fais connaître ou tu te fais
          oublier. Le pays continue de vivre sans toi, et il se souvient de ce que tu as dit.
        </p>
        <div className="portes">
          <a className="porte" href="/nouvelle-partie">
            Commencer une carrière
          </a>
          <a className="porte secondaire" href="/partie">
            Reprendre où j'en étais
          </a>
        </div>
        <p className="mentions-bas">
          Tu choisis une origine, une idée et une ambition. Le statut d'élu, de chef de parti ou de candidat ne se
          décrète pas, il se gagne sur le calendrier réel, jusqu'aux échéances de 2027. Les trajectoires autoritaires
          sont simulées comme les autres et ne sont jamais recommandées.
        </p>
      </section>

      <section className="carte">
        <h2>Le pays que tu rejoins</h2>
        <ul className="liste-plat">
          {FRANCE_2026.map((i) => (
            <li key={i.id}>
              {i.libelle} : <strong>{i.valeur}</strong>{" "}
              <span className="source">
                ({i.date}, {i.source})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
