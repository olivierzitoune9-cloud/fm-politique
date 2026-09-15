"use client";

// Partie jouable minimale : le joueur choisit un coup par tick, le monde répond.
// Vue filtrée uniquement, jamais l'état exact. Pur moteur local, sans réseau.
import { useState } from "react";
import { creerMonde, pas, ACTIONS_JOUABLES, type Monde, type ActionJouable } from "../../src/sim/engine";
import { filtrerVueJoueur } from "../../src/sim/joueur";
import { FRANCE_2026 } from "../../src/sim/data/france-2026";

const LIBELLES: Record<ActionJouable, string> = {
  "preparer-silencieux": "Préparer en silence",
  "etiquetage-modere": "Étiquetage modéré",
  "etiquetage-agressif": "Étiquetage agressif",
  "chercher-coalition": "Chercher une coalition",
  "attaquer-institution": "Attaquer une institution",
};

export default function PartiePage() {
  const [monde, setMonde] = useState<Monde>(() => creerMonde(42));
  const vue = filtrerVueJoueur(monde);

  function jouer(optionId: ActionJouable) {
    setMonde((m) => pas(m, { optionId }));
  }

  function recommencer() {
    setMonde(creerMonde(42));
  }

  return (
    <div>
      <section>
        <h2>Partie démo, seed 42, tick {vue.tick}</h2>
        <p>{vue.avertissement}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {ACTIONS_JOUABLES.map((a) => (
            <button key={a} onClick={() => jouer(a)} type="button">
              {LIBELLES[a]}
            </button>
          ))}
          <button onClick={recommencer} type="button">
            Recommencer
          </button>
        </div>
      </section>

      <section>
        <h2>Ce que tu perçois (sondages approximatifs)</h2>
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Groupe</th>
              <th>Identité</th>
              <th>Bascule</th>
              <th>Réceptivité</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {vue.groupes.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{(g.identiteAffichee * 100).toFixed(0)}</td>
                <td>{(g.basculeAffichee * 100).toFixed(0)}</td>
                <td>{(g.receptiviteAffichee * 100).toFixed(0)}</td>
                <td>{g.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Tes coups ({vue.mesDecisions.length})</h2>
        <ol>
          {vue.mesDecisions.map((d, n) => (
            <li key={n}>
              t{d.tick} : {LIBELLES[d.optionId as ActionJouable] ?? d.optionId} vers {d.groupeId}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Chronologie</h2>
        <ol>
          {vue.chronologie.map((t, n) => (
            <li key={n}>
              <strong>{t.titre}</strong> (t{t.tick}) : {t.corps}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Repères France</h2>
        <ul>
          {FRANCE_2026.map((i) => (
            <li key={i.id}>
              {i.libelle} : {i.valeur} ({i.date})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
