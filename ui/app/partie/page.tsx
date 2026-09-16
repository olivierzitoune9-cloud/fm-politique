"use client";

// Écran de partie V1 : semaine datée, actions hebdo, interactions avec personnages nommés,
// vue filtrée du monde, fins multiples. Sauvegarde locale automatique, sans réseau.
import { useEffect, useState } from "react";
import { AMBITIONS, libelleMetierOrigine, libelleStatut, objectifsPour, palierDeStatut, type ConfigCarriere } from "../../sim/carriere";
import { ACTIONS_JEU, type CategorieAction } from "../../sim/actions";
import { SONDAGES, sondageParId, LIBELLES_ENJEU } from "../../sim/courrier";
import { INTERACTIONS, type InteractionId } from "../../sim/interactions";
import { nomComplet, libelleMetier, estimationRelation } from "../../sim/personnages";
import { LIBELLES_SAISON } from "../../sim/temps";
import { creerPartie, jouerSemaine, vuePartie, type Partie, type TourSemaine } from "../../sim/partie";
import { genererCourriels } from "../../sim/courrier";
import { raconterChronologie } from "../../sim/narrative/raconteur";
import { FRANCE_2026 } from "../../sim/data/france-2026";
import { libelleGroupe } from "../../sim/joueur";
import { deserialiser, serialiser } from "../../sim/sauvegarde";
import { ajouterTrace, resumerTraces, traceDepuisFin, type TraceFin } from "../../sim/traces";

const CLE_CONFIG = "fm-politique:config";
const CLE_SAVE = "fm-politique:sauvegarde";
const CLE_TRACES = "fm-politique:traces";

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
  const [sondageId, setSondageId] = useState("sond.bar");
  const [lectureSondage, setLectureSondage] = useState<string | null>(null);
  // J15 F1 : le second étage de la semaine. J16 F4 : le carrefour en attente de choix.
  const [activiteId, setActiviteId] = useState<string>("repos");
  const [optionDilemme, setOptionDilemme] = useState<string>("");
  const [categoriePromesse, setCategoriePromesse] = useState<CategorieAction>("terrain");
  // Retouche 5 audit : les trajectoires déjà tentées, persistées localement, jamais effacées au rejouer.
  const [traces, setTraces] = useState<TraceFin[]>([]);

  useEffect(() => {
    // Retouche 5 : les traces survivent à tout, y compris à un rejouer avec la même graine.
    let deja: TraceFin[] = [];
    try {
      const brutes = localStorage.getItem(CLE_TRACES);
      if (brutes !== null) deja = JSON.parse(brutes) as TraceFin[];
    } catch {
      deja = [];
    }
    try {
      const conf = sessionStorage.getItem(CLE_CONFIG);
      if (conf !== null) {
        sessionStorage.removeItem(CLE_CONFIG);
        const idee = JSON.parse(conf) as { graine: number; config: ConfigCarriere };
        setPartie(creerPartie(idee.graine, idee.config));
      } else {
        const save = localStorage.getItem(CLE_SAVE);
        if (save !== null) {
          const chargee = deserialiser(save);
          setPartie(chargee);
          // Une partie déjà finie au chargement laisse sa trace, même fermée et rouverte.
          if (chargee.fin !== null) {
            deja = ajouterTrace(deja, traceDepuisFin(chargee.graine, chargee.carriere.ambition, chargee.fin, new Date().toLocaleDateString("fr-FR")));
          }
        } else {
          setErreur("Aucune partie en cours. Crée un personnage pour commencer.");
        }
      }
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
    }
    setTraces(deja);
    if (deja.length > 0) localStorage.setItem(CLE_TRACES, JSON.stringify(deja));
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
  // R1 J10 : la sélection suit toujours le palier visible, le clic répond toujours avec une raison.
  const persoChoisi = vue.personnagesVisibles.find((p) => p.id === persoId) ?? vue.personnages.find((p) => p.id === persoId) ?? null;

  function peut(a: { coutTemps: number; coutArgent: number }): boolean {
    return a.coutTemps <= c.ressources.temps + 1e-9 && a.coutArgent <= c.ressources.argent + 1e-9;
  }

  // J7 : le joueur ne voit que les actions de son palier et des précédents. Le reste existe mais attend.
  const palier = palierDeStatut(c.statut);
  const actionsVisibles = ACTIONS_JEU.filter((a) => a.palier <= palier);
  const actionsMasquees = ACTIONS_JEU.length - actionsVisibles.length;

  function avancer() {
    if (partie === null) return;
    // R1 J10 : l'action suit le palier visible, le personnage suit les visages du palier.
    const actionSure = actionsVisibles.some((a) => a.id === actionId) ? actionId : actionsVisibles[0]?.id ?? actionId;
    const persoSur = persoId !== "" && vue.personnagesVisibles.some((p) => p.id === persoId) ? persoId : "";
    const mediaSur = (palier > 1 ? vue.medias : vue.mediasVisibles).some((m) => m.id === mediaId)
      ? mediaId
      : (palier > 1 ? vue.medias[0]?.id : vue.mediasVisibles[0]?.id) ?? mediaId;
    const tour: TourSemaine = { actionId: actionSure, mediaId: mediaSur, sondageId, activiteId };
    if (pousserProp) tour.pousserProposition = true;
    if (persoSur !== "") {
      tour.interaction = {
        persoId: persoSur,
        interactionId,
        promesse: promesse.trim().length > 0 ? promesse.trim() : undefined,
        categorieAttendue: categoriePromesse,
      };
    }
    // F4 : le carrefour ouvert se tranche ici, jamais dans une fenêtre séparée du temps du jeu.
    if (vue.dilemmeOuvert !== null && optionDilemme !== "") {
      tour.choixDilemme = { dilemmeId: vue.dilemmeOuvert.id, optionId: optionDilemme };
    }
    try {
      const suivante = jouerSemaine(partie, tour);
      setPartie(suivante);
      if (actionSure !== actionId) setActionId(actionSure);
      if (persoSur !== persoId) setPersoId(persoSur);
      if (mediaSur !== mediaId) setMediaId(mediaSur);
      // J4 : lecture du sondage commandé, biaisé et approximatif, jamais l'état exact.
      try {
        const s = sondageParId(sondageId);
        const vrai = suivante.carriere.progression.soutiens;
        const ecart = (s.biais * 0.5).toFixed(2);
        setLectureSondage(
          `${s.libelle} : soutiens estimés à ${(Math.max(0, Math.min(1, vrai + s.biais * 0.2)) * 100).toFixed(0)} sur 100 (${s.precision}, écart possible ${ecart}).`,
        );
      } catch {
        setLectureSondage(null);
      }
      setErreur(null);
      localStorage.setItem(CLE_SAVE, serialiser(suivante));
      setPromesse("");
      // Retouche 5 : aucune fin ne passe en silence, la défaite laisse une trace reconstructible.
      if (suivante.fin !== null) {
        const avecTrace = ajouterTrace(traces, traceDepuisFin(suivante.graine, c.ambition, suivante.fin, new Date().toLocaleDateString("fr-FR")));
        setTraces(avecTrace);
        localStorage.setItem(CLE_TRACES, JSON.stringify(avecTrace));
      }
    } catch (e) {
      // R1 J10 : toute erreur de semaine s'affiche immédiatement, jamais de clic silencieux.
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
        <h2 className="entete-partie">
          <span className="qui">{c.nom}</span>
          <span className="metier">{libelleMetierOrigine(c.origine as ConfigCarriere["origine"])}</span>
          <span className="statut">{libelleStatut(c.statut)}</span>
          <span className="semaine">Semaine {vue.semaine}</span>
        </h2>
        <p>
          {vue.libelleSemaine}. Ambition : <strong>{ambition.libelle}</strong>. Palier {palier} sur 5.
          {vue.saison !== null && (
            <>
              {" "}
              <span className="badge mauve">{vue.saison}</span>{" "}
              <span className="source">{LIBELLES_SAISON[vue.saison]}</span>
            </>
          )}
        </p>
        <div className="barres-progression">
          <span>Énergie</span><span className="barre"><span style={{ width: `${Math.round(c.etat.energie * 100)}%` }} /></span><span>{(c.etat.energie * 100).toFixed(0)}</span>
          <span>Moral</span><span className="barre"><span style={{ width: `${Math.round(c.etat.moral * 100)}%` }} /></span><span>{(c.etat.moral * 100).toFixed(0)}</span>
          {Object.entries(c.competences).map(([k, v]) => (
            <span key={k} style={{ display: "contents" }}>
              <span>{k}</span>
              <span className="barre">
                <span style={{ width: `${Math.round(v * 100)}%` }} />
              </span>
              <span>{(v * 100).toFixed(0)}</span>
            </span>
          ))}
        </div>
        <div className="barres-progression">
          {objectifsPour(c.ambition).map((o) => (
            <span key={`${o.palier}-${o.libelle}`} style={{ display: "contents" }}>
              <span>{o.libelle}</span>
              <span className="barre">
                <span style={{ width: `${Math.round(Math.min(1, c.progression.soutiens / Math.max(0.01, o.seuilSoutiens)) * 100)}%` }} />
              </span>
              <span>{c.progression.soutiens >= o.seuilSoutiens ? "atteint" : `palier ${o.palier}`}</span>
            </span>
          ))}
        </div>
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
        <p className="source">
          Coût de ton palier : temps et argent multipliés par {vue.coutPalier.temps.toFixed(2)} (E4).
          {vue.coutSurcoutDurees > 0
            ? ` Tes effets durables alourdissent chaque semaine de ${Math.round(vue.coutSurcoutDurees * 100)} points de temps.`
            : ""}
          {c.investiture === "obtenue"
            ? " Investiture obtenue : ton camp te porte en juin 2027."
            : c.investiture === "ratee"
              ? " Investiture ratée en mai 2027 : le banc de l'Assemblée ne viendra pas par la voie du parti."
              : ""}
        </p>
        {(c.effetsDurees.length > 0 || c.promesses.length > 0 || c.dons.length > 0) && (
          <div className="meta">
            {c.effetsDurees.map((e) => (
              <span className={`badge${e.reputationHebdo !== undefined && e.reputationHebdo < 0 ? " grave" : ""}`} key={e.id}>
                {e.libelle}
              </span>
            ))}
            {c.promesses
              .filter((p) => p.statut === "en-cours")
              .map((p) => (
                <span className="badge" key={p.id}>
                  promesse : {p.texte} (semaine {p.tickEcheance})
                </span>
              ))}
            {c.promesses
              .filter((p) => p.statut === "manquee")
              .map((p) => (
                <span className="badge grave" key={`${p.id}-m`}>
                  promesse manquée : {p.texte}
                </span>
              ))}
            {c.dons.map((d, n) => (
              <span className="badge mauve" key={`${d.persoId}-${n}`}>
                don de {d.nomPerso} ({Math.round(d.montant * 100)}) : {d.contre}
              </span>
            ))}
          </div>
        )}
        <div className="boutons">
          <button onClick={avancer} type="button">
            Semaine suivante : {ACTIONS_JEU.find((a) => a.id === actionId)?.libelle ?? actionId}
          </button>
        </div>
        {erreur !== null && <p className="erreur">{erreur}</p>}
      </section>

      {vue.dilemmeOuvert !== null && vue.fin === null && (
        <section className="carte">
          <h2>Carrefour : {vue.dilemmeOuvert.titre}</h2>
          <p>{vue.dilemmeOuvert.texte}</p>
          <p className="source">
            Origine : {vue.dilemmeOuvert.origine}. Compétence qui pèse : {vue.dilemmeOuvert.competence}. Le résultat se
            lit en texte, jamais en chiffres avant les faits.
          </p>
          {vue.dilemmeOuvert.options.map((o) => (
            <label key={o.id} className={`action-option${optionDilemme === o.id ? " choisi" : ""}`}>
              <input
                type="radio"
                name="dilemme"
                checked={optionDilemme === o.id}
                onChange={() => setOptionDilemme(o.id)}
                style={{ marginRight: 6 }}
              />
              <span className="titre">{o.libelle}</span>
            </label>
          ))}
          {optionDilemme === "" && (
            <p className="source">Choisis une réponse : elle sera tranchée à la prochaine semaine jouée.</p>
          )}
        </section>
      )}

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
          {traces.length > 0 && (
            <div>
              <h3 style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Trajectoires déjà tentées</h3>
              <ul className="liste-plat">
                {resumerTraces(traces).map((t, n) => (
                  <li key={n}>{t}</li>
                ))}
              </ul>
              <p className="source">Rejouer la même graine rejoue le même monde : la trace garde la leçon, pas le monde.</p>
            </div>
          )}
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
                <span>{libelleGroupe(groupe)}</span>
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
          <h2>Carte : où ton idée prend</h2>
          <div className="barres-progression">
            {vue.territoires.map((t) => (
              <span key={t.id} style={{ display: "contents" }}>
                <span>
                  {t.nom} <span className="source">({LIBELLES_ENJEU[t.enjeu]})</span>
                </span>
                <span className="barre">
                  <span style={{ width: `${Math.round(t.adoption * 100)}%` }} />
                </span>
                <span>{(t.adoption * 100).toFixed(0)}</span>
              </span>
            ))}
          </div>
          <p className="source">
            Douze territoires types, vecteurs bouche à oreille militants médias réseaux. Chaque territoire a son enjeu
            dominant : ton positionnement accélère ici et freine là (E6). La réponse adverse monte avec ta notoriété.
          </p>
        </section>

        <section className="carte">
          {vue.partisVisibles ? (
            <>
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
              {vue.manoeuvresVisibles.map((m, n) => (
                <div className="mail" key={n}>
                  <div className="de">t{m.tick}</div>
                  <div>{m.texte}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h2>Le pays au loin</h2>
              <p className="source">
                À ton palier, les états-majors ne te voient pas encore. Ils agissent sans toi, et tu les rencontreras en
                montant de palier.
              </p>
            </>
          )}
        </section>

        <section className="carte">
          <h2>Médias et économie</h2>
          <ul className="liste-plat">
            {vue.mediasVisibles.map((m) => (
              <li key={m.id}>
                {m.nom} : vigilance {Math.round(m.vigilance * 100)}, amplification {Math.round(m.amplification * 100)}
              </li>
            ))}
            {!vue.partisVisibles && (
              <li className="source">Les médias nationaux te découvriront quand ta notoriété les y obligera.</li>
            )}
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
            <p className="source">
              Palier {palier} sur 5 : {actionsVisibles.length} actions visibles
              {actionsMasquees > 0 ? `, ${actionsMasquees} se révéleront en montant de palier.` : "."}
            </p>
            {ORDRE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>
                  {LIBELLES_CATEGORIE[cat]}
                </h3>
                {actionsVisibles.filter((a) => a.categorie === cat).map((a) => {
                  const possible = peut(a);
                  return (
                    <label
                      key={a.id}
                      className={`action-option${actionId === a.id ? " choisi" : ""}`}
                    >
                      <input
                        type="radio"
                        name="action"
                        checked={actionId === a.id}
                        onChange={() => setActionId(a.id)}
                        style={{ marginRight: 6 }}
                      />
                      <span className="titre">{a.libelle}</span>{" "}
                      <span className="cout">
                        (temps {Math.round(a.coutTemps * 100)}
                        {a.coutArgent > 0 ? `, argent ${Math.round(a.coutArgent * 100)}` : ""}
                        {a.regle ? `, ${a.regle}` : ""}
                        {!possible ? ", hors moyens : possible, mais sanctionné" : ""})
                      </span>
                      <div className="desc">{a.description}</div>
                    </label>
                  );
                })}
              </div>
            ))}
            <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>Activité de fond (second étage)</h3>
            {vue.activites.map((a) => (
              <label key={a.id} className={`action-option${activiteId === a.id ? " choisi" : ""}`}>
                <input
                  type="radio"
                  name="activite"
                  checked={activiteId === a.id}
                  onChange={() => setActiviteId(a.id)}
                  style={{ marginRight: 6 }}
                />
                <span className="titre">{a.libelle}</span>
                <div className="desc">{a.description}</div>
              </label>
            ))}
            <div className="boutons">
              <button onClick={avancer} type="button">
                Semaine suivante
              </button>
              <button className="secondaire" onClick={recommencer} type="button">
                Recommencer avec une autre graine
              </button>
            </div>
            {partie.fin !== null && (
              <p className="source">
                Partie terminée : {partie.fin.titre}. Recommencer garde la leçon, pas le monde : prends une autre
                graine pour un autre pays.
              </p>
            )}
            <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>Passage média</h3>
            {(palier > 1 ? vue.medias : vue.mediasVisibles).map((m) => (
              <label key={m.id} className="action-option">
                <input
                  type="radio"
                  name="media"
                  checked={(palier > 1 ? mediaId : vue.mediasVisibles[0]?.id ?? mediaId) === m.id}
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
            <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "10px 0 6px" }}>Sondage commandé (J4)</h3>
            <p className="source">
              L'écran ne montre que la vue filtrée : sondages approximatifs, rapports biaisés. Commander coûte, ne pas
              savoir coûte aussi.
            </p>
            {SONDAGES.map((s) => (
              <label key={s.id} className={`action-option${sondageId === s.id ? " choisi" : ""}`}>
                <input
                  type="radio"
                  name="sondage"
                  checked={sondageId === s.id}
                  onChange={() => setSondageId(s.id)}
                  style={{ marginRight: 6 }}
                />
                <span className="titre">{s.libelle}</span>{" "}
                <span className="cout">
                  (argent {Math.round(s.coutArgent * 100)}, temps {Math.round(s.coutTemps * 100)})
                </span>
                <div className="desc">{s.precision}.</div>
              </label>
            ))}
            {lectureSondage !== null && <p className="source">{lectureSondage}</p>}
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
            <p className="source">
              {vue.personnagesVisibles.length} visages à ton palier
              {vue.personnages.length - vue.personnagesVisibles.length > 0
                ? `, ${vue.personnages.length - vue.personnagesVisibles.length} encore hors de portée.`
                : "."}
            </p>
            <div className="grille grille-2" style={{ gap: 8 }}>
              {vue.personnagesVisibles.map((p) => (
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
                    <span className="badge mauve">relation estimée {estimationRelation(p).libelle}</span>
                    <span className="badge">connaissance {Math.round(p.connaissance * 100)} %</span>
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
              Clique un personnage pour viser l'interaction. La relation s'affiche en estimation tant que tu ne connais
              pas la personne (F7), et la mémoire garde promesses, dettes et trahisons.
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
                {interactionId === "promettre" && (
                  <div className="rang-radio">
                    <span className="source">Action attendue d'ici huit semaines :</span>
                    {ORDRE_CATEGORIES.map((cat) => (
                      <label key={cat} className={categoriePromesse === cat ? "choisi" : ""}>
                        <input
                          type="radio"
                          name="categoriePromesse"
                          checked={categoriePromesse === cat}
                          onChange={() => setCategoriePromesse(cat)}
                          style={{ marginRight: 6 }}
                        />
                        {LIBELLES_CATEGORIE[cat]}
                      </label>
                    ))}
                  </div>
                )}
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
                  <td>{g.libelle}</td>
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
