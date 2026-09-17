// P3 §29-30/94 : hypothèses de gameplay, 2026-09-17, non calibrées empiriquement.
// 8 semaines, 2 points d'argent/tour, supervision 5 %, gestion personnelle 20 %.
import type { Partie } from "./partie.js";
import { clamp01b } from "./carriere.js";
import { enregistrerEvenement, NOEUD_JOUEUR } from "./monde-social.js";
import { nomComplet } from "./personnages.js";
import type { Rng } from "./rng.js";
export type ObjectifMission = "recrutement" | "enquete";
export interface OrdreMission { objectif: ObjectifMission; responsableId: string | null; budget: number }
export interface Mission extends OrdreMission {
  id: string; tickCreation: number; echeance: number; progression: number; depense: number;
  statut: "en-cours" | "pause" | "terminee" | "echouee";
  rapports: { tick: number; texte: string }[];
}
function responsableValide(p: Partie, id: string | null, missionId?: string) {
  if (id === null) return;
  if (!p.personnages.some((x) => x.id === id)) throw new Error("Responsable inconnu.");
  if (p.missions.some((m) => m.id !== missionId && m.responsableId === id && ["en-cours", "pause"].includes(m.statut))) throw new Error("Cette personne a déjà une mission.");
}
export function lancerMission(p: Partie, ordre: OrdreMission): Partie {
  if (p.fin) throw new Error("La partie est terminée.");
  if (!["recrutement", "enquete"].includes(ordre.objectif) || !Number.isFinite(ordre.budget) || ordre.budget < 0 || ordre.budget > 1) throw new Error("Consignes invalides.");
  responsableValide(p, ordre.responsableId);
  const mission: Mission = { ...ordre, id: `mission.${p.tick}.${p.missions.length}`, tickCreation: p.tick, echeance: p.tick + 8, progression: 0, depense: 0, statut: "en-cours", rapports: [] };
  return { ...p, missions: [...p.missions, mission] };
}
export function piloterMission(p: Partie, id: string, ordre: { responsableId?: string | null; statut?: "pause" | "en-cours" }): Partie {
  if (p.fin) throw new Error("La partie est terminée.");
  const m = p.missions.find((x) => x.id === id);
  if (!m || !["en-cours", "pause"].includes(m.statut)) throw new Error("Mission inactive ou inconnue.");
  if (ordre.responsableId !== undefined) responsableValide(p, ordre.responsableId, id);
  const texte = ordre.responsableId === null ? "Reprise en gestion personnelle." : ordre.responsableId !== undefined ? "Responsable réaffecté." : ordre.statut === "pause" ? "Mission suspendue." : "Mission relancée.";
  return { ...p, missions: p.missions.map((x) => x.id === id ? { ...x, ...ordre, rapports: [...x.rapports, { tick: p.tick, texte }] } : x) };
}
export function coutMission(m: Mission): { temps: number; argent: number } {
  return m.statut === "en-cours" ? { temps: m.responsableId === null ? 0.2 : 0.05, argent: 0.02 } : { temps: 0, argent: 0 };
}


export function avancerMissions(p: Partie, tick: number, rng: Rng): Partie {
  let suite = p;
  for (const m of p.missions) {
    if (!["en-cours", "pause"].includes(m.statut)) continue;
    let suivant = { ...m };
    let texte = "";
    const personne = suite.personnages.find((x) => x.id === m.responsableId);
    const cout = coutMission(m);
    if (tick > m.echeance) { suivant.statut = "echouee"; texte = "Échéance dépassée : mission inachevée."; }
    else if (m.statut === "pause") continue;
    else if ((m.responsableId !== null && !personne) || m.depense + cout.argent > m.budget + 1e-9 || suite.carriere.ressources.argent + 1e-9 < cout.argent || suite.carriere.ressources.temps + 1e-9 < cout.temps) {
      suivant.statut = "pause"; texte = "Mission suspendue : responsable, budget ou moyens insuffisants. Aucun coût débité.";
    } else {
      const competence = personne?.expertise ?? suite.carriere.competences.strategie;
      const relation = personne?.relation ?? 0.5;
      const reunion = suite.reunions.some((r) => r.tick === tick && r.rendement >= 0.4 && (m.responsableId === null || r.participantsIds.includes(m.responsableId)));
      const gain = Math.max(0.02, 0.12 + competence * 0.12 + relation * 0.08 + (personne?.traits.includes("loyal") ? 0.04 : 0) + (reunion ? 0.06 : 0) + rng.next() * 0.04);
      suivant.progression = clamp01b(m.progression + gain);
      suivant.depense = Math.round((m.depense + cout.argent) * 10000) / 10000;
      suite = { ...suite, carriere: { ...suite.carriere, ressources: { ...suite.carriere.ressources, temps: Math.max(0, suite.carriere.ressources.temps - cout.temps), argent: Math.max(0, suite.carriere.ressources.argent - cout.argent) } } };
      texte = `${personne ? nomComplet(personne) : "Toi"} : ${m.objectif}, progression ${(suivant.progression * 100).toFixed(0)} %. Coût : ${cout.temps * 100} % de semaine, 2 points d'argent.${reunion ? " Réunion exploitée : coordination améliorée." : ""}`;
      if (suivant.progression >= 1) {
        suivant.statut = "terminee";
        if (m.objectif === "recrutement") {
          suite = { ...suite, carriere: { ...suite.carriere, ressources: { ...suite.carriere.ressources, militants: clamp01b(suite.carriere.ressources.militants + 0.06) } } };
          texte += " Recrutement terminé : militants +6 points.";
        } else {
          suite = { ...suite, personnages: suite.personnages.map((x) => ({ ...x, connaissance: clamp01b(x.connaissance + 0.1) })) };
          texte += " Enquête terminée : connaissance des profils +10 points, sans révéler les faits hors palier.";
        }
      } else if (tick === m.echeance) { suivant.statut = "echouee"; texte += " Échéance atteinte sans résultat complet."; }
    }
    suivant.rapports = [...m.rapports, { tick, texte }];
    let mondeSocial = suite.mondeSocial;
    for (const noeudId of [NOEUD_JOUEUR, ...(personne ? [personne.id] : [])]) mondeSocial = enregistrerEvenement(mondeSocial, { tick, noeudId, type: "mission", texte });
    suite = { ...suite, mondeSocial, missions: suite.missions.map((x) => x.id === m.id ? suivant : x), journal: [...suite.journal, { tick, texte }] };
  }
  return suite;
}
