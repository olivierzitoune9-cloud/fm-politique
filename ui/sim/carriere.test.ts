import { describe, expect, it } from "vitest";
import { creerRng } from "./rng.js";
import {
  creerCarriere,
  persuasionJoueur,
  regenererHebdo,
  statutCible,
  AVERTISSEMENT_OUVERTURE,
  type ConfigCarriere,
} from "./carriere.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique", "travailleur"],
  ideologie: { gaucheDroite: 0.2, ouvertFerme: -0.4 },
  ambition: "elu",
};

describe("carrière du joueur", () => {
  it("départ insignifiant : employé de bureau, ressources faibles", () => {
    const c = creerCarriere(CONFIG, creerRng(1));
    expect(c.statut).toBe("employe");
    expect(c.progression.soutiens).toBeLessThan(0.05);
    expect(c.ressources.temps).toBe(1);
    expect(c.nom).toBe("Test Personne");
  });

  it("nom aléatoire seedé si non fourni, bornes d'idéologie", () => {
    const a = creerCarriere({ ...CONFIG, nom: undefined }, creerRng(3));
    const b = creerCarriere({ ...CONFIG, nom: undefined }, creerRng(3));
    expect(a.nom).toBe(b.nom);
    expect(a.nom).toContain(" ");
    const horsBornes = creerCarriere(
      { ...CONFIG, ideologie: { gaucheDroite: 5, ouvertFerme: -5 } },
      creerRng(1),
    );
    expect(horsBornes.ideologie.gaucheDroite).toBe(1);
    expect(horsBornes.ideologie.ouvertFerme).toBe(-1);
  });

  it("statuts : progression franchit les seuils dans l'ordre", () => {
    expect(statutCible({ soutiens: 0.05, legitime: 0, organisation: 0, notoriete: 0, reputation: 0.5 })).toBe("employe");
    expect(statutCible({ soutiens: 0.11, legitime: 0, organisation: 0.06, notoriete: 0, reputation: 0.5 })).toBe("militant");
    expect(statutCible({ soutiens: 0.42, legitime: 0.41, organisation: 0.41, notoriete: 0, reputation: 0.5 })).toBe("elu");
  });

  it("persuasion bornée et sensible aux traits, régénération hebdo usure", () => {
    const c = creerCarriere(CONFIG, creerRng(2));
    const p0 = persuasionJoueur(c);
    expect(p0).toBeGreaterThan(0.1);
    expect(p0).toBeLessThanOrEqual(0.9);
    const usée = regenererHebdo({ ...c, ressources: { temps: 0, argent: 0.2, audience: 1, militants: 1 } });
    expect(usée.ressources.temps).toBe(1);
    expect(usée.ressources.audience).toBeLessThan(1);
    expect(usée.ressources.militants).toBeLessThan(1);
  });

  it("avertissement d'ouverture validé présent", () => {
    expect(AVERTISSEMENT_OUVERTURE).toContain("jamais de prédiction du réel");
    expect(AVERTISSEMENT_OUVERTURE).toContain("autoritaires");
  });
});
