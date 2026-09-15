// Phase 9. NARRATIVE : transforme les transitions d'état en textes lisibles.
// Le narratif raconte, il ne décide jamais. Sources internes au monde uniquement.
// Gabarits déterministes, sans API, sans génération libre.
import type { DecisionIA, EvenementCausal } from "../engine.js";

export interface TexteNarre {
  titre: string;
  corps: string;
  source: string;
  tick: number;
}

const TITRES: Record<string, string> = {
  "bascule-normative": "Le ton change",
  "bascule-norme": "Une norme bascule",
  "demande-sauveur": "La demande d'ordre monte",
};

const SOURCES: Record<string, string> = {
  "bascule-normative": "rapport d'observatoire local",
  "bascule-norme": "sondage biaisé d'un institut proche du pouvoir",
  "demande-sauveur": "éditorial d'un quotidien régional",
};

export function raconterEvenement(e: EvenementCausal): TexteNarre {
  const titre = TITRES[e.type] ?? "Signal faible";
  const source = SOURCES[e.type] ?? "rumeur de couloir";
  // Le corps cite la cause technique telle quelle, sans interprétation cachée.
  const corps = `${titre} chez ${e.groupeId} au temps ${e.tick} (${e.cause}). Valeur ${e.valeur.toFixed(2)}. Source : ${source}.`;
  return { titre, corps, source, tick: e.tick };
}

export function raconterDecision(d: DecisionIA): TexteNarre {
  const corps = `${d.acteurId} choisit ${d.optionId} vers ${d.groupeId} au temps ${d.tick}. Source : compte rendu interne du mouvement.`;
  return { titre: "Coup joué", corps, source: "compte rendu interne du mouvement", tick: d.tick };
}

export function raconterChronologie(evenements: EvenementCausal[], decisions: DecisionIA[]): TexteNarre[] {
  const textes = [
    ...evenements.map(raconterEvenement),
    ...decisions.map(raconterDecision),
  ];
  return textes.sort((a, b) => a.tick - b.tick);
}
