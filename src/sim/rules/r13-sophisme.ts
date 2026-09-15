// R13. Arguments invalides mais persuasifs (M9 sophismes).
// Fausse causalité, inversion de la charge, pente savonneuse, glissement de langage.
// Efficacité selon sophistication du public, crédibilité de l'émetteur, répétition. Réfutation possible à coût.
import { clamp01, type Rng } from "../rng.js";
import type { JournalTirage } from "../types.js";

export interface ContexteArgument {
  sophisticationPublic: number;
  credibiliteEmetteur: number;
  repetition: number;
  refutation: number;
}

export interface ResultatArgument {
  persuasion: number;
  journal: JournalTirage[];
}

export function appliquerSophisme(contexte: ContexteArgument, rng: Rng, graine: number): ResultatArgument {
  const journal: JournalTirage[] = [];
  const tirage = rng.next();
  journal.push({ regle: "R13", graine, rang: rng.tirageRang, valeur: tirage });
  const bruit = (tirage - 0.5) * 0.04;
  const persuasion = clamp01(
    0.15 +
      clamp01(contexte.credibiliteEmetteur) * 0.35 +
      clamp01(contexte.repetition) * 0.25 -
      clamp01(contexte.sophisticationPublic) * 0.35 -
      clamp01(contexte.refutation) * 0.4 +
      bruit,
  );
  return { persuasion, journal };
}
