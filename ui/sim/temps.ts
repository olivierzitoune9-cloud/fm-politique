// Calendrier réel : un tick égale une semaine, départ lundi 2026-09-07.
// Les échéances portent leur niveau de preuve : passées établies, à venir plausible
// (fenêtres constitutionnelles et calendriers sexennaux, date exacte par décret non fixée).
const MS_JOUR = 86400000;
export const DEBUT_MS = Date.UTC(2026, 8, 7); // lundi 7 septembre 2026

export const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function dateDebutSemaine(tick: number): Date {
  return new Date(DEBUT_MS + (tick - 1) * 7 * MS_JOUR);
}

export function dateISO(tick: number): string {
  return dateDebutSemaine(tick).toISOString().slice(0, 10);
}

export function libelleSemaine(tick: number): string {
  const d = dateDebutSemaine(tick);
  const f = new Date(d.getTime() + 6 * MS_JOUR);
  return `semaine du ${d.getUTCDate()} ${MOIS_FR[d.getUTCMonth()]} au ${f.getUTCDate()} ${MOIS_FR[f.getUTCMonth()]} ${f.getUTCFullYear()}`;
}

// Le tick de la semaine qui contient la date donnée (semaine 1 : du lundi 7 au dimanche 13).
export function tickDeDate(annee: number, mois: number, jour: number): number {
  const ms = Date.UTC(annee, mois - 1, jour);
  const decalage = Math.floor((ms - DEBUT_MS) / (7 * MS_JOUR));
  return Math.max(1, decalage + 1);
}

export interface EcheanceCalendaire {
  id: string;
  libelle: string;
  tick: number;
  statut: "plausible";
  detail: string;
}

export const ECHEANCES: EcheanceCalendaire[] = [
  {
    id: "dept-regionales-2027",
    libelle: "Départementales et régionales",
    tick: tickDeDate(2027, 3, 14),
    statut: "plausible",
    detail: "Calendrier sexennal depuis 2021, mars 2027. Date exacte par décret, non fixée en jeu.",
  },
  {
    id: "presidentielle-2027-t1",
    libelle: "Présidentielle, premier tour",
    tick: tickDeDate(2027, 4, 11),
    statut: "plausible",
    detail: "Fenêtre constitutionnelle entre le 11 et le 26 avril 2027, date exacte par décret non fixée en jeu.",
  },
  {
    id: "presidentielle-2027-t2",
    libelle: "Présidentielle, second tour",
    tick: tickDeDate(2027, 4, 25),
    statut: "plausible",
    detail: "Deux semaines après le premier tour.",
  },
  {
    id: "investitures-2027",
    libelle: "Investitures législatives",
    tick: tickDeDate(2027, 5, 10),
    statut: "plausible",
    detail: "Entre les deux tours de la présidentielle et les législatives, ton propre camp arbitre qui il investit. Échéance intermédiaire (E8).",
  },
  {
    id: "legislatives-2027-t1",
    libelle: "Législatives, premier tour",
    tick: tickDeDate(2027, 6, 6),
    statut: "plausible",
    detail: "Suite institutionnelle attendue après la présidentielle 2027.",
  },
  {
    id: "legislatives-2027-t2",
    libelle: "Législatives, second tour",
    tick: tickDeDate(2027, 6, 20),
    statut: "plausible",
    detail: "Deux semaines après le premier tour.",
  },
  {
    id: "europeennes-2029",
    libelle: "Européennes",
    tick: tickDeDate(2029, 6, 10),
    statut: "plausible",
    detail: "Quinquennat européen depuis juin 2024.",
  },
  {
    id: "municipales-2032",
    libelle: "Municipales",
    tick: tickDeDate(2032, 3, 14),
    statut: "plausible",
    detail: "Sexennat depuis les municipales de mars 2026.",
  },
];

export function echeancesAPartirDe(tick: number): EcheanceCalendaire[] {
  return ECHEANCES.filter((e) => e.tick >= tick);
}

export type ElectionId = "presidentielle-t1" | "presidentielle-t2" | "legislatives-t1";

export function electionAUtick(tick: number): ElectionId | null {
  if (tick === tickDeDate(2027, 4, 11)) return "presidentielle-t1";
  if (tick === tickDeDate(2027, 4, 25)) return "presidentielle-t2";
  if (tick === tickDeDate(2027, 6, 6)) return "legislatives-t1";
  return null;
}

// J17 F10 : le calendrier réel fait sentir ses saisons. Rentrée, vœux, campagne, été politique.
// Le joueur lit la semaine différemment selon où il en est de l'année française.
export function saisonDuTick(tick: number): string | null {
  const d = dateDebutSemaine(tick);
  const mois = d.getUTCMonth() + 1;
  const annee = d.getUTCFullYear();
  const tickVoeux = tickDeDate(2027, 1, 4);
  const tickCampagneDebut = tickDeDate(2027, 3, 1);
  const tickCampagneFin = tickDeDate(2027, 4, 26);
  const tickRentree = tickDeDate(annee, 9, 1);
  const tickEteDebut = tickDeDate(annee, 8, 1);
  const tickEteFin = tickDeDate(annee, 9, 1);
  if (tick >= tickCampagneDebut && tick <= tickCampagneFin) return "Campagne présidentielle";
  if (tick === tickVoeux) return "Vœux : la saison des promesses";
  if (mois === 9 && Math.abs(tick - tickRentree) <= 4) return "Rentrée : tout le monde revient";
  if (tick >= tickEteDebut && tick < tickEteFin) return "Été politique : le pays regarde ailleurs";
  return null;
}

export const LIBELLES_SAISON: Record<string, string> = {
  "Campagne présidentielle": "Le pays entier regarde la présidentielle. Une semaine vaut dix.",
  "Vœux : la saison des promesses": "Les vœux tombent : promettre coûte moins, tenir se voit plus.",
  "Rentrée : tout le monde revient": "Les associations redémarrent, les élus sont joignables, le terrain est fertile.",
  "Été politique : le pays regarde ailleurs": "Les médias n'ont plus de place pour toi. Semaine creuse, moins d'écho.",
};
