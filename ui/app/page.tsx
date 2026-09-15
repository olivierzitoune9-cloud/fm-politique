// Page serveur : lit le monde simulé, affiche tableaux et chronologie causale.
// Aucune décision ici, seulement de la lecture. Seed fixe pour la démo.
import { simuler } from "../../src/sim/engine";
import { raconterChronologie } from "../../src/sim/narrative/raconteur";
import { FRANCE_2026 } from "../../src/sim/data/france-2026";

function Barre({ valeur }: { valeur: number }) {
  return (
    <span className="barre">
      <span style={{ width: `${Math.round(valeur * 100)}%` }} />
    </span>
  );
}

export default function Page() {
  const monde = simuler(42, 20);
  const textes = raconterChronologie(monde.evenements, monde.decisions);

  return (
    <div className="grille">
      <a className="lien-jouer" href="/partie">
        Jouer la partie démo : cinq coups par tick, vue filtrée
      </a>

      <section className="carte">
        <h2>Groupes suivis, seed 42, 20 pas</h2>
        <table className="table-monde">
          <thead>
            <tr>
              <th>Groupe</th>
              <th>Identité</th>
              <th>Bascule</th>
              <th>Ordre</th>
              <th>Adoption</th>
            </tr>
          </thead>
          <tbody>
            {monde.groupes.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>
                  {(g.identiteActive * 100).toFixed(0)} <Barre valeur={g.identiteActive} />
                </td>
                <td>
                  {(g.bascule * 100).toFixed(0)} <Barre valeur={g.bascule} />
                </td>
                <td>
                  {(g.receptiviteOrdre * 100).toFixed(0)} <Barre valeur={g.receptiviteOrdre} />
                </td>
                <td>
                  {(g.adoption * 100).toFixed(0)} <Barre valeur={g.adoption} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="carte">
        <h2>France septembre 2026, repères datés</h2>
        <ul className="liste-plat">
          {FRANCE_2026.map((i) => (
            <li key={i.id}>
              {i.libelle} : <strong>{i.valeur}</strong> <span className="source">({i.date}, {i.source})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="carte">
        <h2>Chronologie causale</h2>
        <ol className="chrono">
          {textes.map((t, n) => (
            <li key={n}>
              <span className="tick">t{t.tick}</span>
              <strong>{t.titre}</strong> : {t.corps}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
