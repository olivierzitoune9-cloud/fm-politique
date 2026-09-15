// Types minimaux issus de l'ontologie v1, sans React. null = inconnu.
export interface GroupePopulation {
  id: string;
  identiteActive: number;
  menacePercue: number;
  exposition: number;
  contactsCroises: number;
  interetsPartages: number;
}

export interface Emetteur {
  id: string;
  credibilite: number;
  reputation: number;
}

export interface EtiquetageParams {
  grossierete: number;
  repetition: number;
  marqueForce: number;
}

export interface JournalTirage {
  regle: string;
  graine: number;
  rang: number;
  valeur: number;
}
