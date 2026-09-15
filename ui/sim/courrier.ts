// Boîte mail et agenda minimaux : lecture du monde, jamais de décision.
// Les messages naissent des événements et décisions, avec expéditeur interne.
// L'agenda liste les échéances fixes du prototype.
import type { DecisionIA, EvenementCausal } from "./engine.js";

export interface Courriel {
  tick: number;
  de: string;
  objet: string;
  corps: string;
}

export interface Echeance {
  tick: number;
  libelle: string;
}

const EXPEDITEURS: Record<string, string> = {
  "bascule-normative": "observatoire local",
  "bascule-norme": "institut de sondage",
  "demande-sauveur": "rédaction régionale",
};

export function genererCourriels(evenements: EvenementCausal[], decisions: DecisionIA[]): Courriel[] {
  const mails: Courriel[] = [];
  for (const e of evenements) {
    mails.push({
      tick: e.tick,
      de: EXPEDITEURS[e.type] ?? "couloir",
      objet: `Signal t${e.tick} chez ${e.groupeId}`,
      corps: `${e.type} : ${e.cause}. Valeur ${e.valeur.toFixed(2)}. À croiser avant d'agir.`,
    });
  }
  const miennes = decisions.filter((d) => d.acteurId === "joueur");
  if (miennes.length > 0) {
    const derniere = miennes[miennes.length - 1];
    mails.push({
      tick: derniere.tick,
      de: "ton mouvement",
      objet: `Coup t${derniere.tick} enregistré`,
      corps: `${derniere.optionId} vers ${derniere.groupeId}. Effets à lire dans les prochains sondages.`,
    });
  }
  return mails.sort((a, b) => a.tick - b.tick);
}

export function genererAgenda(tickActuel: number): Echeance[] {
  const base: Echeance[] = [
    { tick: 5, libelle: "Débat budgétaire local" },
    { tick: 10, libelle: "Sondage trimestriel" },
    { tick: 15, libelle: "Conseil municipal décisif" },
    { tick: 20, libelle: "Revue de presse nationale" },
  ];
  return base.filter((e) => e.tick >= tickActuel);
}
