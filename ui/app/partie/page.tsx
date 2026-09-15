"use client";

// Partie jouable minimale : le joueur choisit un coup par tick, le monde répond.
// Vue filtrée uniquement, jamais l'état exact. Pur moteur local, sans réseau.
import { useState } from "react";
import { creerMonde, pas, ACTIONS_JOUABLES, type Monde, type ActionJouable } from "../../../src/sim/engine";
import { filtrerVueJoueur } from "../../../src/sim/joueur";
import { genererAgenda, genererCourriels } from "../../../src/sim/courrier";
import { FRANCE_2026 } from "../../../src/sim/data/france-2026";

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
  const mails = genererCourriels(monde.evenements, monde.decisions);
  const agenda = genererAgenda(monde.tick);

  function jouer(optionId: ActionJouable) {
    setMonde((m) => pas(m, { optionId }));
  }

  function recommencer() {
    setMonde(creerMonde(42));
  }

  return (
    <div className="grille">
      <section className="carte">
        <h2>Partie démo, seed 42, tick {vue.tick}</h2>
        <p className="source">{vue.avertissement}</p>
        <div className="boutons">
          {ACTIONS_JOUABLES.map((a) => (
            <button key={a} onClick={() => jouer(a)} type="button">
              {LIBELLES[a]}
            </button>
          ))}
          <button className="secondaire" onClick={recommencer} type="button">
            Recommencer
          </button>
        </div>
      </section>

      <div className="grille grille-2">
        <section className="carte">
          <h2>Ce que tu perçois</h2>
          <table className="table-monde">
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Identité</th>
                <th>Bascule</th>
                <th>Réceptivité</th>
              </tr>
            </thead>
            <tbody>
              {vue.groupes.map((g) => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{(g.identiteAffichee * 100).toFixed(0)}</td>
                  <td>{(g.basculeAffichee * 100).toFixed(0)}</td>
                  <td>{(g.receptiviteAffichee * 100).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="source">{vue.groupes[0]?.source}</p>
        </section>

        <section className="carte">
          <h2>Tes coups ({vue.mesDecisions.length})</h2>
          <ol className="liste-plat">
            {vue.mesDecisions.map((d, n) => (
              <li key={n}>
                <span className="tick">t{d.tick}</span>
                {LIBELLES[d.optionId as ActionJouable] ?? d.optionId} vers {d.groupeId}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="carte">
        <h2>Chronologie</h2>
        <ol className="chrono">
          {vue.chronologie.map((t, n) => (
            <li key={n}>
              <span className="tick">t{t.tick}</span>
              <strong>{t.titre}</strong> : {t.corps}
            </li>
          ))}
        </ol>
      </section>

      <div className="grille grille-2">
        <section className="carte">
          <h2>Boîte mail ({mails.length})</h2>
          {mails.map((m, n) => (
            <div className="mail" key={n}>
              <div className="de">
                t{m.tick} de {m.de}
              </div>
              <div>
                <strong>{m.objet}</strong> : {m.corps}
              </div>
            </div>
          ))}
        </section>

        <section className="carte">
          <h2>Agenda</h2>
          <ul className="liste-plat">
            {agenda.map((e) => (
              <li key={e.tick}>
                <span className="tick">t{e.tick}</span>
                {e.libelle}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="carte">
        <h2>Repères France</h2>
        <ul className="liste-plat">
          {FRANCE_2026.map((i) => (
            <li key={i.id}>
              {i.libelle} : <strong>{i.valeur}</strong> <span className="source">({i.date})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
