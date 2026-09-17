"use client";
import { useState } from "react";
import type { Partie } from "../../sim/partie";
import { lancerMission, piloterMission, coutMission, type ObjectifMission } from "../../sim/missions";
import { coutReunion, type OrdreReunion } from "../../sim/reunions";
import { nomComplet, libelleMetier, type Personnage } from "../../sim/personnages";

interface Props {
  partie: Partie; visibles: Personnage[]; reunions: OrdreReunion[];
  changerReunions: (r: OrdreReunion[]) => void;
  sauvegarder: (p: Partie) => void; ouvrirFiche: (id: string) => void;
}
export default function ActionsCollectives({ partie, visibles, reunions, changerReunions, sauvegarder, ouvrirFiche }: Props) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [preparee, setPreparee] = useState(false);
  const [objectif, setObjectif] = useState<ObjectifMission>("recrutement");
  const [responsable, setResponsable] = useState("");
  const [budget, setBudget] = useState(12);
  const [erreur, setErreur] = useState<string | null>(null);
  const fin = partie.fin !== null;
  function executer(f: () => Partie) {
    try { sauvegarder(f()); setErreur(null); }
    catch (e) { setErreur(e instanceof Error ? e.message : String(e)); }
  }
  const couts = [...reunions.map(coutReunion), ...partie.missions.map(coutMission)];
  return <section className="carte">
    <h2>Agir avec d'autres</h2>
    {erreur && <p role="alert">{erreur}</p>}
    <p className="cout">Engagements collectifs prévus : {Math.round(couts.reduce((s, c) => s + c.temps, 0) * 100)} % de semaine, {Math.round(couts.reduce((s, c) => s + c.argent, 0) * 100)} points d'argent, en plus des coups et activités. Ils passent après les coups, avant la récupération.</p>
    <details><summary>Préparer une réunion</summary>
      <p>Invite deux ou trois personnes. Expertise, relation et traits modulent l'accord. Sans moyens : rendement réduit et réputation -2. Une réunion réussie améliore la mission de ses participants cette semaine.</p>
      <fieldset disabled={fin}><legend>Participants</legend>
        {visibles.map((p) => <label key={p.id} style={{ display: "block" }}>
          <input type="checkbox" checked={participants.includes(p.id)} onChange={(e) => setParticipants(e.target.checked ? [...participants, p.id] : participants.filter((id) => id !== p.id))} />
          {nomComplet(p)} · {libelleMetier(p.metier)} · {p.traits.join(", ")}
        </label>)}
      </fieldset>
      <label><input type="checkbox" disabled={fin} checked={preparee} onChange={(e) => setPreparee(e.target.checked)} /> Préparer les échanges (+15 % de semaine)</label>
      <p className="cout">Coût : {preparee ? 45 : 30} % de semaine et 2 points d'argent.</p>
      <button disabled={fin || participants.length < 2 || participants.length > 3} onClick={() => { changerReunions([...reunions, { participantsIds: [...participants], preparee }]); setParticipants([]); }}>Ajouter à la semaine</button>
    </details>
    {reunions.map((r, i) => <p key={i}>Réunion {r.preparee ? "préparée" : "simple"} : {r.participantsIds.map((id) => visibles.find((p) => p.id === id)).filter((p): p is Personnage => !!p).map(nomComplet).join(", ")} <button disabled={fin} onClick={() => changerReunions(reunions.filter((_, j) => j !== i))}>Retirer</button></p>)}
    <details><summary>Confier une mission</summary>
      <label>Objectif <select disabled={fin} value={objectif} onChange={(e) => setObjectif(e.target.value as ObjectifMission)}><option value="recrutement">Recrutement (+6 militants à terme)</option><option value="enquete">Enquête sur les profils (+10 connaissance à terme)</option></select></label>
      <label>Responsable <select disabled={fin} value={responsable} onChange={(e) => setResponsable(e.target.value)}><option value="">Moi-même</option>{visibles.map((p) => <option key={p.id} value={p.id}>{nomComplet(p)}</option>)}</select></label>
      <label>Budget maximal (points d'argent) <input disabled={fin} type="number" min={0} max={100} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label>
      <p>Huit semaines maximum, 2 points d'argent par semaine. Temps : 5 % en délégation, 20 % personnellement. Sans moyens ou budget restant, la mission se suspend. Aucun succès garanti.</p>
      <button disabled={fin} onClick={() => executer(() => lancerMission(partie, { objectif, responsableId: responsable || null, budget: budget / 100 }))}>Lancer la mission</button>
    </details>
    {partie.missions.map((m) => <article key={m.id}>
      <h3>{m.objectif === "enquete" ? "Enquête" : "Recrutement"} · {m.statut.replace(/-/g, " ")}</h3>
      <p>{Math.round(m.progression * 100)} % · échéance semaine {m.echeance} · dépensé {Math.round(m.depense * 100)}/{Math.round(m.budget * 100)}</p>
      {m.responsableId && <button onClick={() => ouvrirFiche(m.responsableId!)}>Dossier du responsable</button>}
      {["en-cours", "pause"].includes(m.statut) && <div>
        <label>Responsable <select disabled={fin} value={m.responsableId ?? ""} onChange={(e) => executer(() => piloterMission(partie, m.id, { responsableId: e.target.value || null }))}><option value="">Moi-même (reprendre le contrôle)</option>{visibles.map((p) => <option key={p.id} value={p.id}>{nomComplet(p)}</option>)}</select></label>
        <button disabled={fin} onClick={() => executer(() => piloterMission(partie, m.id, { statut: m.statut === "pause" ? "en-cours" : "pause" }))}>{m.statut === "pause" ? "Relancer" : "Suspendre"}</button>
      </div>}
      <details><summary>Rapports ({m.rapports.length})</summary>{m.rapports.map((r, i) => <p key={i}>Semaine {r.tick} : {r.texte}</p>)}</details>
    </article>)}
    <details><summary>Comptes rendus des réunions ({partie.reunions.length})</summary>{partie.reunions.map((r, i) => <p key={i}>Semaine {r.tick} : {r.texte} {r.participantsIds.map((id) => <button key={id} onClick={() => ouvrirFiche(id)}>Dossier</button>)}</p>)}</details>
  </section>;
}
