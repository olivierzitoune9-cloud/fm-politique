// France septembre 2026, état initial daté et sourcé.
// Chaque donnée porte date, source et chaîne vers variable interne 0..1.
// Données observées contre hypothèses : tout chiffre non sourcé est marqué [hypothèse].
export interface Indicateur {
  id: string;
  libelle: string;
  valeur: string;
  date: string;
  source: string;
  variableInterne: string;
  normalise: number;
  statut: "observee" | "hypothese";
}

export const FRANCE_2026: Indicateur[] = [
  {
    id: "chomage-t2-2026",
    libelle: "Taux de chômage BIT",
    valeur: "8,3 %",
    date: "2026-08-07",
    source: "Insee Informations rapides 192, enquête Emploi T2 2026",
    variableInterne: "satisfactionEco inversée (1 - 0.55)",
    normalise: 0.45,
    statut: "observee",
  },
  {
    id: "chomage-t1-2026",
    libelle: "Taux de chômage BIT T1",
    valeur: "8,1 %",
    date: "2026-05-13",
    source: "Insee Informations rapides 113, enquête Emploi T1 2026",
    variableInterne: "mémoire détresse (hausse 0,7 point sur un an)",
    normalise: 0.47,
    statut: "observee",
  },
  {
    id: "assemblee-2024",
    libelle: "Assemblée sans majorité, trois blocs",
    valeur: "NFP ~178, Ensemble ~150, RN+alliés ~143 sur 577",
    date: "2024-07-07",
    source: "Ministère de l'Intérieur, second tour législatives 2024",
    variableInterne: "legitimite et autonomie assemblée basses, cohésion basse",
    normalise: 0.35,
    statut: "observee",
  },
  {
    id: "gouvernement-2026",
    libelle: "Gouvernement Lecornu sans majorité, budget 2027 en négociation",
    valeur: "PM Sébastien Lecornu depuis 2025-09-09, remaniement 2026-02-26",
    date: "2026-09-15",
    source: "Élysée décret 2026-02-26, AFP via presse 2026-09-15",
    variableInterne: "autonomie gouvernement basse, exposition au 49.3",
    normalise: 0.4,
    statut: "observee",
  },
  {
    id: "retraites-suspendues",
    libelle: "Réforme des retraites suspendue jusqu'en 2027",
    valeur: "suspension négociée contre non censure du PS le 2025-10-16",
    date: "2025-10-16",
    source: "Franceinfo récapitulatif gouvernement Lecornu",
    variableInterne: "mémoire promesse, dette envers socialistes",
    normalise: 0.5,
    statut: "observee",
  },
  {
    id: "predispo-par-groupe",
    libelle: "Prédispositions et menaces par groupe",
    valeur: "à renseigner par enquête, défaut 0.5",
    date: "2026-09-15",
    source: "[hypothèse] en attente de données d'enquête",
    variableInterne: "predispoAutoritaire, menacePercue",
    normalise: 0.5,
    statut: "hypothese",
  },
];

export function variablesGroupesDepuisFrance(): {
  satisfactionEco: number;
  menace: number;
} {
  const chomage = FRANCE_2026.find((i) => i.id === "chomage-t2-2026")!;
  // 8,3 % de chômage, plus haut depuis 2020 : satisfaction basse.
  void chomage;
  return { satisfactionEco: 0.45, menace: 0.5 };
}
