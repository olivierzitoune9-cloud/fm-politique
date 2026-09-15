"use client";

// Écran de partie V1 : semaine datée, actions hebdo, interactions avec personnages nommés,
// vue filtrée du monde, fins multiples. Sauvegarde locale automatique, sans réseau.
import { useEffect, useState } from "react";
import { AMBITIONS, libelleStatut, type ConfigCarriere } from "../../../src/sim/carriere";
import { ACTIONS_JEU, type CategorieAction } from "../../../src/sim/actions";
import { INTERACTIONS, type InteractionId } from "../../../src/sim/interactions";
import { nomComplet, libelleMetier } from "../../../src/sim/personnages";
import { creerPartie, jouerSemaine, vuePartie, type Partie, type TourSemaine } from "../../../src/sim/partie";
import { genererCourriels } from "../../../src/sim/courrier";
import { raconterChronologie } from "../../../src/sim/narrative/raconteur";
import { FRANCE_2026 } from "../../../src/sim/data/france-2026";
import { deserialiser, serialiser } from "../../../src/sim/sauvegarde";

const CLE_CONFIG = "fm-politique:config";
const CLE_SAVE = "fm-politique:sauvegarde";

const LIBELLES_CATEGORIE: Record<CategorieAction, string> = {
  terrain: "Terrain",
  media: "Média",
  coalition: "Coalition",
  institution: "Institution",
  preparation: "Préparation",
};

const ORDRE_CATEGORIES: CategorieAction[] = ["terrain", "media", "coalition", "institution", "preparation"];

export default function PartiePage() {
  const [partie, setPartie] = useState<Partie | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [actionId, setActionId] = useState<string>(ACTIONS_JEU[0].id);
  const [persoId, setPersoId] = useState<string>("");
  const [interactionId, setInteractionId] = useState<InteractionId>("convaincre");
  const [promesse, setPromesse] = useState("");
  const [mediaId, setMediaId] = useState("med.quotidien-regional");
  const [pousserProp, setPousserProp] = useState(false);

  useEffect(() => {
    try {
      const conf = sessionStorage.getItem(CLE_CONFIG);
      if (conf !== null) {
        sessionStorage.removeItem(CLE_CONFIG);
        const idee = JSON.parse(conf) as { graine: number; config: ConfigCarriere };
        setPartie(creerPartie(idee.graine, idee.config));
      } else {
        const save = localStorage.getItem(CLE_SAVE);
        if (save !== null) setPartie(deserialiser(save));
        else setErreur("Aucune partie en cours. Crée un personnage pour commencer.");
      }
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
    }
    setChargement(false);
  }, []);

  if (chargement) return <p className="source">Chargement…</p>;

  if (partie === null) {
    return (
      <div className="grille">
        <p className="erreur">{erreur ?? "Aucune partie."}</p>
        <a className="lien-jouer" href="/nouvelle-partie">
          Créer un personnage
        </a>
      </div>
    );
  }

  const vue = vuePartie(partie);
  const c = vue.carriere;
  const mails = genererCourriels(partie.monde.evenements, partie.monde.decisions);
  const chrono = raconterChronologie(partie.monde.evenements, partie.monde.decisions);
  const ambition = AMBITIONS.find((a) => a.id === c.ambition)!;
  const persoChoisi = vue.personnages.find((p) => p.id === persoId) ?? null;

  function peut(a: { coutTemps: number; coutArgent: number }): boolean {
    return a.coutTemps <= c.ressources.temps + 1e-9 && a.coutArgent <= c.ressources.argent + 1e-9;
  }

  function avancer() {
    if (partie === null) return;
    const tour: TourSemaine = { actionId, mediaId };
    if (pousserProp) tour.pousserProposition = true;
    if (persoId !== "") {
      tour.interaction = { persoId, interactionId, promesse: promesse.trim().length > 0 ? promesse.trim() : undefined };
    }
    try {
      const suivante = jouerSemaine(partie, tour);
      setPartie(suivante);
      setErreur(null);
      localStorage.setItem(CLE_SAVE, serialiser(suivante));
      setPromesse("");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
    }
  }

  function recommencer() {
    if (partie === null) return;
    const fraiche = creerPartie(partie.graine, {
      nom: c.nom,
      origine: c.origine as ConfigCarriere["origine"],
      traits: c.traits,
      ideologie: c.ideologie,
      ambition: c.ambition,
    });
    setPartie(fraiche);
    localStorage.setItem(CLE_SAVE, serialiser(fraiche));
    setErreur(null);
  }

  return (
    <div className="grille">
      <section className="carte">
        <h2>
          {c.nom}, {libelleStatut(c.statut)} — semaine {vue.semaine}
        </h2>
        <p>
          {vue.libelleSemaine}. Ambition : <strong>{ambition.libelle}</strong>.
        </p>
        <p className="source">{vue.avertissement}</p>
        <div className="barres-progression">
          <span>Soutiens</span><span className="barre"><span style={{ width: `${Math.round(c.progression.soutiens * 100)}%` }} /></span><span>{(c.progression.soutiens * 100).toFixed(0)}</span>
          <span>Légitimité</span><span className="barre"><span style={{ width: `${Math.round(c.progression.legitime * 100)}%` }} /></span><span>{(c.progression.legitime * 100).toFixed(0)}</span>
          <span>Organisation</span><span className="barre"><span style={{ width: `${Math.round(c.progression.organisation * 100)}%` }} /></span><span>{(c.progression.organisation * 100).toFixed(0)}</span>
          <span>Notoriété</span><span className="barre"><span style={{ width: `${Math.round(c.progression.notoriete * 100)}%` }} /></span><span>{(c.progression.notoriete * 100).toFixed(0)}</span>
          <span>Réputation</span><span className="barre"><span style={{ width: `${Math.round(c.progression.reputation * 100)}%` }} /></span><span>{(c.progression.reputation * 100).toFixed(0)}</span>
        </div>
        <p className="cout">
          Temps {(c.ressources.temps * 100).toFixed(0)} %, argent {(c.ressources.argent * 100).toFixed(0)}, audience{" "}
          {(c.ressources.audience * 100).toFixed(0)}, militants {(c.ressources.militants * 100).toFixed(0)}, risque
          d'enquête {(c.risqueEnquete * 100).toFixed(0)}.
        </p>
      </section>

      {vue.fin !== null && (
        <section className="ecran-fin">
          <h2>Fin de partie : {vue.fin.titre}</h2>
          <p>{vue.fin.detail}</p>
          <p className="source">
            {vue.fin.victoire ? "Objectif atteint." : "La carrière s'arrête ici."} Semaine {vue.fin.tick}.
          </p>
          <div className="boutons">
            <button onClick={recommencer} type="button">
              Rejouer avec la même graine
            </button>
            <a className="lien-jouer secondaire-lien" href="/nouvelle-partie">
              Nouveau personnage
            </a>
          </div>
        </section>
      )}

      {erreur !== null && <p className="erreur">{erreur}</p>}

      <div className="grille grille-3">
        <section className="carte">
          <h2>Ta proposition</h2>
          <p>
            « <strong>{vue.proposition.texte}</strong> » <span className="source">(statut de preuve : {vue.proposition.statutPreuve})</span>
          </p>
          <div className="barres-progression">
            {Object.entries(vue.proposition.dicibilite).map(([groupe, v]) => (
              <span key={groupe} style={{ display: "contents" }}>
                <span>{groupe}</span>
                <span className="barre">
                  <span style={{ width: `${Math.round(v * 100)}%` }} />
                </span>
                <span>{(v * 100).toFixed(0)}</span>
              </span>
            ))}
          </div>
          <p className="source">Dicibilité moyenne : {(Object.values(vue.proposition.dicibilite).reduce((s, v) => s + v, 0) / Math.max(1, Object.values(vue.proposition.dicibilite).length) * 100).toFixed(0)} sur 100. Le moteur ne tranche jamais la vérité.</p>
        </section>

        <section className="carte">
          <h2>Partis rivaux</h2>
          {Object.entries(vue.relationsPartis).map(([id, v]) => {
            const nom = id === "parti.radical" ? "Front de l'ordre (fictif)" : "Alliance parlementaire (fictif)";
            return (
              <div key={id} className="perso">
                <div className="identite">{nom}</div>
                <div className="meta">
                  Envers toi : <span className="badge mauve">{v.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
          {vue.manoeuvres.map((m, n) => (
            <div className="mail" key={n}>
              <div className="de">t{m.tick}</div>
              <div>{m.texte}</div>
            </div>
          ))}
        </section>

        <section className="carte">
          <h2>Médias et économie</h2>
          <ul className="liste-plat">
            {vue.medias.map((m) => (
              <li key={m.id}>
                {m.nom} : vigilance {Math.round(m.vigilance * 100)}, amplification {Math.round(m.amplification * 100)}
              </li>
            ))}
            <li>
              Chômage du mois : <strong>{vue.chomage.toFixed(1).replace(".", ",")} %</strong>{" "}
              <span className="source">({vue.sourceChomage})</span>
            </li>
          </ul>
        </section>
      </div>

      {vue.fin === null && (
        <div className="grille grille-3">
          <section className="carte">
            <h2>Une action cette semaine</h2>
            {ORDRE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>
                  {LIBELLES_CATEGORIE[cat]}
                </h3>
                {ACTIONS_JEU.filter((a) => a.categorie === cat).map((a) => {
                  const possible = peut(a);
                  return (
                    <label
                      key={a.id}
                      className={`action-option${actionId === a.id ? " choisi" : ""}${possible ? "" : " desactivee"}`}
                    >
                      <input
                        type="radio"
                        name="action"
                        disabled={!possible}
                        checked={actionId === a.id}
                        onChange={() => setActionId(a.id)}
                        style={{ marginRight: 6 }}
                      />
                      <span className="titre">{a.libelle}</span>{" "}
                      <span className="cout">
                        (temps {Math.round(a.coutTemps * 100)}
                        {a.coutArgent > 0 ? `, argent ${Math.round(a.coutArgent * 100)}` : ""}
                        {a.regle ? `, ${a.regle}` : ""})
                      </span>
                      <div className="desc">{a.description}</div>
                    </label>
                  );
                })}
              </div>
            ))}
            <div className="boutons">
              <button onClick={avancer} type="button">
                Semaine suivante
              </button>
              <button className="secondaire" onClick={recommencer} type="button">
                Recommencer
              </button>
            </div>
            <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>Passage média</h3>
            {vue.medias.map((m) => (
              <label key={m.id} className="action-option">
                <input
                  type="radio"
                  name="media"
                  checked={mediaId === m.id}
                  onChange={() => setMediaId(m.id)}
                  style={{ marginRight: 6 }}
                />
                <span className="titre">{m.nom}</span>{" "}
                <span className="cout">
                  ({m.orientation}, vigilance {Math.round(m.vigilance * 100)}, amplification{" "}
                  {Math.round(m.amplification * 100)})
                </span>
              </label>
            ))}
            <label className="action-option">
              <input
                type="checkbox"
                checked={pousserProp}
                onChange={(e) => setPousserProp(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              <span className="titre">Pousser ta proposition en même temps</span>
              <div className="desc">Relais à déni, case par case sur l'échelle de dicibilité (R9).</div>
            </label>
          </section>

          <section className="carte">
            <h2>Une interaction cette semaine</h2>
            <div className="grille grille-2" style={{ gap: 8 }}>
              {vue.personnages.map((p) => (
                <div
                  key={p.id}
                  className={`perso${persoId === p.id ? " choisi" : ""}`}
                  onClick={() => setPersoId(persoId === p.id ? "" : p.id)}
                >
                  <div className="identite">{nomComplet(p)}</div>
                  <div className="meta">
                    {libelleMetier(p.metier)}, {p.organisation}, {p.age} ans
                  </div>
                  <div className="meta">
                    {p.traits.map((t) => (
                      <span className="badge" key={t}>
                        {t}
                      </span>
                    ))}
                    <span className="badge mauve">relation {p.relation.toFixed(2)}</span>
                    {p.cautionActive !== null && <span className="badge">caution R14 active</span>}
                  </div>
                  {p.memoire.length > 0 && (
                    <div className="meta">
                      {p.memoire.slice(-3).map((m, n) => (
                        <span key={n} className={`badge${m.type === "trahison" ? " grave" : ""}`}>
                          {m.type} : {m.detail}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="source">
              Clique un personnage pour viser l'interaction. Relation mémoire : promesses, dettes, trahisons.
            </p>
            {persoChoisi !== null && (
              <div>
                <div className="rang-radio">
                  {INTERACTIONS.map((i) => (
                    <label key={i.id} className={interactionId === i.id ? "choisi" : ""}>
                      <input
                        type="radio"
                        name="interaction"
                        checked={interactionId === i.id}
                        onChange={() => setInteractionId(i.id)}
                        style={{ marginRight: 6 }}
                      />
                      {i.libelle} <span className="cout">(temps {Math.round(i.coutTemps * 100)})</span>
                    </label>
                  ))}
                </div>
                {interactionId === "promettre" && (
                  <label className="champ">
                    <label>Ta promesse (texte libre)</label>
                    <input
                      type="text"
                      value={promesse}
                      onChange={(e) => setPromesse(e.target.value)}
                      placeholder="un poste, un soutien, un silence…"
                    />
                  </label>
                )}
                <p className="source">
                  {INTERACTIONS.find((i) => i.id === interactionId)!.description}
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      <div className="grille grille-2">
        <section className="carte">
          <h2>Boîte mail ({mails.length})</h2>
          {mails.slice(-12).map((m, n) => (
            <div className="mail" key={n}>
              <div className="de">
                t{m.tick} de {m.de}
              </div>
              <div>
                <strong>{m.objet}</strong> : {m.corps}
              </div>
            </div>
          ))}
          {mails.length === 0 && <p className="source">Pas encore de courrier. Le monde regarde ailleurs, pour l'instant.</p>}
        </section>

        <section className="carte">
          <h2>Journal et échéances</h2>
          <ul className="liste-plat">
            {vue.journal.map((j, n) => (
              <li key={n}>
                <span className="tick">s{j.tick}</span>
                {j.texte}
              </li>
            ))}
          </ul>
          <h3 style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Échéances à venir</h3>
          <ul className="liste-plat">
            {vue.echeances.map((e) => (
              <li key={e.id}>
                <span className="tick">s{e.tick}</span>
                {e.libelle} <span className="source">({e.statut}, {e.detail})</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grille grille-2">
        <section className="carte">
          <h2>Ce que tu perçois du monde</h2>
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
          <h2>Chronologie narrée</h2>
          <ol className="chrono">
            {chrono.slice(-15).map((t, n) => (
              <li key={n}>
                <span className="tick">t{t.tick}</span>
                <strong>{t.titre}</strong> : {t.corps}
              </li>
            ))}
          </ol>
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
