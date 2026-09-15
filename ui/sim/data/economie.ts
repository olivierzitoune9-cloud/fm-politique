// Économie mensuelle 2026-2028 : chômage observé au départ, trajectoire suivante hypothèse de modélisation.
// Rien n'est une prédiction : c'est un état du monde qui nourrit R4 (détresse et demande de sauveur).
import type { Monde } from "../engine.js";

export interface PointEco {
  mois: string; // "2026-09"
  chomage: number; // pourcentage BIT
  statut: "observee" | "hypothese";
  source: string;
}

// 2026-09 interpolé entre T1 (8,1, Insee 2026-05-13) et T2 (8,3, Insee 2026-08-07).
// Ensuite : trajectoire hypothèse, remontée douce puis reflux, jamais au delà des extrema connus.
const VALEURS = [
  8.2, 8.2, 8.3, 8.3, 8.4, 8.4, 8.5, 8.5, 8.5, 8.6, 8.6, 8.6,
  8.6, 8.6, 8.5, 8.5, 8.5, 8.4, 8.4, 8.4, 8.3, 8.3, 8.3, 8.3,
  8.3, 8.2, 8.2, 8.2,
];

export const TRAJECTOIRE_CHOMAGE: PointEco[] = VALEURS.map((v, i) => {
  const annee = 2026 + Math.floor((8 + i) / 12);
  const mois = ((8 + i) % 12) + 1;
  return {
    mois: `${annee}-${String(mois).padStart(2, "0")}`,
    chomage: v,
    statut: i === 0 ? "observee" : "hypothese",
    source:
      i === 0
        ? "Interpolation Insee T1 et T2 2026 (Informations rapides 113 et 192)"
        : "[hypothèse de modélisation] trajectoire plausible, non prédictive",
  };
});

export function moisDeTick(tick: number): { annee: number; mois: number } {
  const semainesEcoulees = Math.max(0, tick - 1);
  const totalMois = 8 + Math.floor(semainesEcoulees / 4.345); // sept 2026 = mois index 8
  const annee = 2026 + Math.floor(totalMois / 12);
  const mois = (totalMois % 12) + 1;
  return { annee, mois };
}

export function chomagePourTick(tick: number): PointEco {
  const { annee, mois } = moisDeTick(tick);
  const cle = `${annee}-${String(mois).padStart(2, "0")}`;
  const point = TRAJECTOIRE_CHOMAGE.find((p) => p.mois === cle);
  return point ?? TRAJECTOIRE_CHOMAGE[TRAJECTOIRE_CHOMAGE.length - 1];
}

// Dérive douce de satisfaction : vers 1 - chômage/10, plafonnée à plus ou moins 0.02 par semaine.
export function ajusterEconomie(monde: Monde, tick: number): Monde {
  const cible = 1 - chomagePourTick(tick).chomage / 10;
  return {
    ...monde,
    groupes: monde.groupes.map((g) => ({
      ...g,
      satisfactionEco: Math.max(0, Math.min(1, g.satisfactionEco + Math.max(-0.02, Math.min(0.02, (cible - g.satisfactionEco) * 0.2)))),
    })),
  };
}
