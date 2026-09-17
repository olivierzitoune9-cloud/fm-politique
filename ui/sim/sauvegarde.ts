// Sauvegarde locale versionnée : JSON strict, refus de toute sauvegarde d'une autre version de partie ou de moteur.
// Migration douce p2.x vers p3.0.0, p3.1.0 (C1 multi coups), p3.2.0 (P1 graphe social) et
// p3.3.0 (P2 dossiers d'enquête) : les champs manquants reçoivent leurs valeurs initiales.
import { VERSION_MOTEUR } from "./engine.js";
import { VERSION_PARTIE, type Partie } from "./partie.js";
import { territoiresInitiaux } from "./courrier.js";
import { creerMondeSocial, type MondeSocial } from "./monde-social.js";
import type { Carriere } from "./carriere.js";
import type { Personnage } from "./personnages.js";

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
    // Migration douce : une p2.x, p3.0.0 ou p3.1.0 sans les champs récents reçoit ses valeurs initiales.
    if (s.partieVersion === "p2.1.0" || s.partieVersion === "p2.0.0" || s.partieVersion === "p3.0.0" || s.partieVersion === "p3.1.0" || s.partieVersion === "p3.2.0" || s.partieVersion === "p3.3.0") {
      const p = s.partie as Partial<Partie> | undefined;
      if (p !== undefined && typeof p.graine === "number" && typeof p.tick === "number") {
        if (!Array.isArray((p as { territoires?: unknown }).territoires)) {
          (p as Partie).territoires = territoiresInitiaux(p.graine);
        }
        // P1 : une sauvegarde d'avant le graphe social le voit reconstruit depuis ses entités.
        // L'historique d'événements d'avant la migration n'est pas reconstituable, il repart vide.
        if (!mondeSocialValide(p.mondeSocial) && Array.isArray(p.personnages) && p.monde !== undefined) {
          (p as Partie).mondeSocial = creerMondeSocial(
            p.personnages,
            p.monde,
            p.graine,
            p.carriere?.nom ?? "Toi",
          );
        }
        // P2 : les dossiers d'enquête n'existaient pas avant p3.3.0, ils repartent vides.
        if (!Array.isArray((p as { dossiers?: unknown }).dossiers)) {
          (p as Partie).dossiers = [];
        }
        if (!Array.isArray((p as { dilemmesPasses?: unknown }).dilemmesPasses)) {
          (p as Partie).dilemmesPasses = [];
        }
        if (!Array.isArray(p.missions)) p.missions = [];
        if (!Array.isArray(p.reunions)) p.reunions = [];
        if (p.dilemmeOuvert === undefined) p.dilemmeOuvert = null;
        (p as Partie).version = VERSION_PARTIE;
        const c = p.carriere as Partial<Carriere> | undefined;
        if (c !== undefined) {
          if (c.etat === undefined) c.etat = { energie: 1, moral: 0.6 };
          if (c.competences === undefined)
            c.competences = { terrain: 0, parole: 0, medias: 0, relation: 0, institution: 0, strategie: 0 };
          if (!Array.isArray(c.effetsDurees)) c.effetsDurees = [];
          if (!Array.isArray(c.promesses)) c.promesses = [];
          if (c.investiture === undefined) c.investiture = "non-posee";
          if (!Array.isArray(c.dons)) c.dons = [];
        }
        for (const pers of p.personnages ?? []) {
          const perso = pers as Partial<Personnage>;
          if (perso.connaissance === undefined) perso.connaissance = 0.15;
        }
        return p as Partie;
      }
    }
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
  // Tolérance : une sauvegarde sans carte la voit recréée à la graine, sans rien perdre d'autre.
  if (!Array.isArray((p as { territoires?: unknown }).territoires)) {
    (p as Partie).territoires = territoiresInitiaux(p.graine);
  }
  // Tolérance P1 : une sauvegarde sans graphe social le voit recréé depuis ses entités réelles.
  if (!mondeSocialValide(p.mondeSocial)) {
    (p as Partie).mondeSocial = creerMondeSocial(
      p.personnages,
      p.monde,
      p.graine,
      p.carriere?.nom ?? "Toi",
    );
  }
  // Tolérance P2 : une sauvegarde sans dossiers les voit recréés vides.
  if (!Array.isArray((p as { dossiers?: unknown }).dossiers)) {
    (p as Partie).dossiers = [];
  }
  if (!Array.isArray(p.missions)) p.missions = [];
  if (!Array.isArray(p.reunions)) p.reunions = [];
  return p as Partie;
}

// Le graphe est valide s'il existe et porte des nœuds : un objet partiel ou vide est reconstruit.
function mondeSocialValide(ms: unknown): ms is MondeSocial {
  return ms !== null && typeof ms === "object" && Array.isArray((ms as MondeSocial).noeuds) && (ms as MondeSocial).noeuds.length > 0;
}
