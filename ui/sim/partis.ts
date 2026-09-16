// Partis organisés : les acteurs du moteur ont des leaders nommés et des partis fictifs.
// Leurs coups deviennent des manoeuvres lisibles. Les relations évoluent avec tes coups.
import type { Monde } from "./engine.js";
import type { Rng } from "./rng.js";
import type { Personnage } from "./personnages.js";
import { nomComplet } from "./personnages.js";

export interface Parti {
  id: string;
  nom: string;
  leaderId: string; // pers.* du personnage leader
  acteurMoteur: string; // act.* du moteur
  baseGroupe: string;
}

export const PARTIS: Parti[] = [
  { id: "parti.radical", nom: "Front de l'ordre (fictif)", leaderId: "pers.leader-radical", acteurMoteur: "act.fonceur", baseGroupe: "grp.peripherie" },
  { id: "parti.modere", nom: "Alliance parlementaire (fictif)", leaderId: "pers.leader-modere", acteurMoteur: "act.prudent", baseGroupe: "grp.centre" },
];

export const LIBELLES_OPTIONS: Record<string, string> = {
  "preparer-silencieux": "prépare en silence",
  "etiquetage-modere": "étiquette avec retenue",
  "etiquetage-agressif": "étiquette brutalement",
  "chercher-coalition": "tisse une coalition",
  "attaquer-institution": "attaque une institution",
};

export interface ManoeuvreParti {
  partiId: string;
  leader: string;
  tick: number;
  texte: string;
}

export function manoeuvresPartis(monde: Monde, personnages: Personnage[], dernierTickSeulement: boolean): ManoeuvreParti[] {
  const sortie: ManoeuvreParti[] = [];
  for (const parti of PARTIS) {
    const leader = personnages.find((p) => p.id === parti.leaderId);
    if (leader === undefined) continue;
    const decisions = monde.decisions.filter(
      (d) => d.acteurId === parti.acteurMoteur && (!dernierTickSeulement || d.tick === monde.tick),
    );
    for (const d of decisions) {
      sortie.push({
        partiId: parti.id,
        leader: nomComplet(leader),
        tick: d.tick,
        texte: `${nomComplet(leader)} (${parti.nom}) ${LIBELLES_OPTIONS[d.optionId] ?? d.optionId} vers ${d.groupeId}.`,
      });
    }
  }
  return sortie;
}

// Relations des partis envers le joueur : l'agressif séduit le radical et inquiète le modéré, borné.
export function majPartis(
  partis: Record<string, number>,
  dernierCoupJoueur: string | undefined,
  trahisonsLeaders: number,
): Record<string, number> {
  const suivant = { ...partis };
  for (const p of PARTIS) suivant[p.id] = suivant[p.id] ?? 0;
  if (dernierCoupJoueur === "etiquetage-agressif") {
    suivant["parti.radical"] = brigner(suivant["parti.radical"] + 0.04);
    suivant["parti.modere"] = brigner(suivant["parti.modere"] - 0.05);
  } else if (dernierCoupJoueur === "etiquetage-modere" || dernierCoupJoueur === "chercher-coalition") {
    suivant["parti.modere"] = brigner(suivant["parti.modere"] + 0.03);
    suivant["parti.radical"] = brigner(suivant["parti.radical"] - 0.02);
  } else if (dernierCoupJoueur === "attaquer-institution") {
    suivant["parti.modere"] = brigner(suivant["parti.modere"] - 0.04);
    suivant["parti.radical"] = brigner(suivant["parti.radical"] + 0.02);
  }
  if (trahisonsLeaders > 0) {
    suivant["parti.modere"] = brigner(suivant["parti.modere"] - 0.05 * trahisonsLeaders);
    suivant["parti.radical"] = brigner(suivant["parti.radical"] - 0.05 * trahisonsLeaders);
  }
  return suivant;
}

function brigner(x: number): number {
  return Math.max(-1, Math.min(1, Math.round(x * 100) / 100));
}

export function relationsInitialesPartis(): Record<string, number> {
  const r: Record<string, number> = {};
  for (const p of PARTIS) r[p.id] = 0;
  return r;
}

// E2/E3 (J12) : le monde te répond. Quand tu deviens assez visible, les partis adverses
// coalisent et frappent ton territoire le plus fort. Borné, seedé, jamais gratuit : il faut
// des relations déjà dégradées et de la notoriété pour que la frappe se déclenche.
export interface FrappeAdverse {
  partiId: string;
  nomParti: string;
  territoireNom: string;
  texte: string;
  deltaAdoption: number;
}

export function frappeAdverse(
  territoires: { id: string; nom: string; adoption: number; reponseAdverse: number }[],
  relationsPartis: Record<string, number>,
  notoriete: number,
  rng: Rng,
): { frappes: FrappeAdverse[]; territoires: Map<string, number>; reponses: Map<string, number> } {
  const frappes: FrappeAdverse[] = [];
  const deltasAdoption = new Map<string, number>();
  const deltasReponse = new Map<string, number>();
  if (notoriete < 0.25) return { frappes, territoires: deltasAdoption, reponses: deltasReponse };
  for (const parti of PARTIS) {
    const relation = relationsPartis[parti.id] ?? 0;
    if (relation > -0.2) continue; // pas d'hostilité, pas de frappe
    const intensite = Math.min(1, (notoriete - 0.25) * 2) * Math.min(1, -relation);
    if (rng.next() > 0.15 + intensite * 0.4) continue; // conditionné, pas aléatoire
    const cible = [...territoires].sort((a, b) => b.adoption - a.adoption)[0];
    if (cible === undefined) continue;
    const deltaAdoption = -0.03 - intensite * 0.05;
    const deltaReponse = 0.04 + intensite * 0.05;
    deltasAdoption.set(cible.id, (deltasAdoption.get(cible.id) ?? 0) + deltaAdoption);
    deltasReponse.set(cible.id, (deltasReponse.get(cible.id) ?? 0) + deltaReponse);
    frappes.push({
      partiId: parti.id,
      nomParti: parti.nom,
      territoireNom: cible.nom,
      texte: `Le ${parti.nom} riposte : contre-offensive organisée à ${cible.nom}, ton implantation y plie.`,
      deltaAdoption,
    });
  }
  return { frappes, territoires: deltasAdoption, reponses: deltasReponse };
}
