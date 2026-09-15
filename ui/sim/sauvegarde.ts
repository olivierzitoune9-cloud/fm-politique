// Sauvegarde locale versionnée : JSON strict, refus de toute sauvegarde d'une autre version de partie ou de moteur.
import { VERSION_MOTEUR } from "./engine.js";
import { VERSION_PARTIE, type Partie } from "./partie.js";

export const VERSION_SAUVEGARDE = 1;

export interface Sauvegarde {
  version: number;
  partieVersion: string;
  moteurVersion: string;
  graine: number;
  tick: number;
  partie: Partie;
}

export function serialiser(partie: Partie): string {
  const s: Sauvegarde = {
    version: VERSION_SAUVEGARDE,
    partieVersion: partie.version,
    moteurVersion: partie.monde.version,
    graine: partie.graine,
    tick: partie.tick,
    partie,
  };
  return JSON.stringify(s);
}

export function deserialiser(texte: string): Partie {
  let brut: unknown;
  try {
    brut = JSON.parse(texte);
  } catch {
    throw new Error("Sauvegarde illisible.");
  }
  const s = brut as Partial<Sauvegarde>;
  if (s.version !== VERSION_SAUVEGARDE) {
    throw new Error(`Sauvegarde d'une autre version (${String(s.version)}), non chargeable.`);
  }
  if (s.partieVersion !== VERSION_PARTIE) {
    throw new Error(`Sauvegarde d'une autre version de partie (${String(s.partieVersion)}), non chargeable.`);
  }
  if (s.moteurVersion !== VERSION_MOTEUR) {
    throw new Error(`Sauvegarde d'un autre moteur (${String(s.moteurVersion)}), non chargeable.`);
  }
  const p = s.partie as Partial<Partie> | undefined;
  if (
    p === undefined ||
    typeof p.graine !== "number" ||
    typeof p.tick !== "number" ||
    !Array.isArray(p.personnages) ||
    !p.monde ||
    !p.carriere
  ) {
    throw new Error("Sauvegarde incomplète.");
  }
  return p as Partie;
}
