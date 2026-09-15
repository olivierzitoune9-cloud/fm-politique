// Page serveur : lit le monde simulé, affiche tableaux et chronologie causale.
// Aucune décision ici, seulement de la lecture. Seed fixe pour la démo.
import { simuler } from "../../src/sim/engine";
import { raconterChronologie } from "../../src/sim/narrative/raconteur";
import { FRANCE_2026 } from "../../src/sim/data/france-2026";

export default function Page() {
  const monde = simuler(42, 20);
  const textes = raconterChronologie(monde.evenements, monde.decisions);

  return (
    <div>
      <section>
        <h2>Groupes suivis (seed 42, 20 pas)</h2>
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Groupe</th>
              <th>Identité</th>
              <th>Bascule</th>
              <th>Réceptivité ordre</th>
              <th>Adoption</th>
            </tr>
          </thead>
          <tbody>
            {monde.groupes.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{(g.identiteActive * 100).toFixed(0)}</td>
                <td>{(g.bascule * 100).toFixed(0)}</td>
                <td>{(g.receptiviteOrdre * 100).toFixed(0)}</td>
                <td>{(g.adoption * 100).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>France septembre 2026, repères datés</h2>
        <ul>
          {FRANCE_2026.map((i) => (
            <li key={i.id}>
              {i.libelle} : {i.valeur} ({i.date}, {i.source})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Chronologie causale</h2>
        <ol>
          {textes.map((t, n) => (
            <li key={n}>
              <strong>{t.titre}</strong> (t{t.tick}) : {t.corps}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
