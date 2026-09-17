// P3 C3, hypothèse de gameplay datée du 2026-09-17, non calibrée empiriquement.
// Préparer mobilise 0,15 semaine ; relation, expertise et traits modulent l'accord.
// La surcharge réduit le rendement et coûte en réputation, sans interdire l'essai.
import { clamp01b } from "./carriere.js";
import { enregistrerEvenement, NOEUD_JOUEUR } from "./monde-social.js";
import { nomComplet } from "./personnages.js";
import type { Partie } from "./partie.js";
import type { Rng } from "./rng.js";

export interface OrdreReunion { participantsIds: string[]; preparee: boolean }
export interface CompteRenduReunion extends OrdreReunion {
  tick: number; rendement: number; forcee: boolean;
  coutTemps: number; coutArgent: number; texte: string;
}
export function coutReunion(ordre: OrdreReunion): { temps: number; argent: number } {
  return { temps: 0.3 + (ordre.preparee ? 0.15 : 0), argent: 0.02 };
}
export function tenirReunion(p: Partie, ordre: OrdreReunion, tick: number, rng: Rng): Partie {
  const ids = ordre.participantsIds;
  if (ids.length < 2 || ids.length > 3 || new Set(ids).size !== ids.length) throw new Error("Invite deux ou trois personnes distinctes.");
  const participants = ids.map((id) => {
    const perso = p.personnages.find((x) => x.id === id);
    if (!perso) throw new Error(`Participant inconnu : ${id}`);
    return perso;
  });
  const cout = coutReunion(ordre);
  const forcee = p.carriere.ressources.temps + 1e-9 < cout.temps || p.carriere.ressources.argent + 1e-9 < cout.argent;
  const disposition = participants.reduce((s, x) => s + x.relation * 0.2 + x.expertise * 0.2
    + (x.traits.includes("empathique") ? 0.1 : 0) - (x.traits.includes("rigide") ? 0.1 : 0), 0) / participants.length;
  const rendement = clamp01b((0.2 + disposition + rng.next() * 0.2 + (ordre.preparee ? 0.2 : 0)) * (forcee ? 0.5 : 1));
  const gain = rendement * 0.04;
  const texte = `Réunion ${ordre.preparee ? "préparée" : "sans préparation"} avec ${participants.map(nomComplet).join(", ")} : organisation +${(gain * 100).toFixed(1)}, relations +${(rendement * 0.05).toFixed(2)}. Coûts : ${(cout.temps * 100).toFixed(0)} % de semaine et 2 points d'argent.${forcee ? " Moyens dépassés : rendement réduit, réputation -2." : ""}`;
  let mondeSocial = p.mondeSocial;
  for (const id of [NOEUD_JOUEUR, ...ids]) mondeSocial = enregistrerEvenement(mondeSocial, { tick, noeudId: id, type: "reunion", texte });
  return { ...p, mondeSocial,
    reunions: [...p.reunions, { ...ordre, participantsIds: [...ids], tick, rendement, forcee, coutTemps: cout.temps, coutArgent: cout.argent, texte }],
    personnages: p.personnages.map((x) => ids.includes(x.id) ? { ...x, relation: Math.min(1, x.relation + rendement * 0.05), connaissance: clamp01b(x.connaissance + 0.1) } : x),
    carriere: { ...p.carriere,
      progression: { ...p.carriere.progression, organisation: clamp01b(p.carriere.progression.organisation + gain), reputation: clamp01b(p.carriere.progression.reputation - (forcee ? 0.02 : 0)) },
      ressources: { ...p.carriere.ressources, temps: Math.max(0, p.carriere.ressources.temps - cout.temps), argent: Math.max(0, p.carriere.ressources.argent - cout.argent) },
    }, journal: [...p.journal, { tick, texte }],
  };
}
