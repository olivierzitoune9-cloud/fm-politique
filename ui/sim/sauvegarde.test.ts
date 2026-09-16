import { describe, expect, it } from "vitest";
import { type ConfigCarriere } from "./carriere.js";
import { creerPartie, jouerSemaine } from "./partie.js";
import { deserialiser, serialiser, VERSION_SAUVEGARDE } from "./sauvegarde.js";
import { VERSION_PARTIE } from "./partie.js";
import { VERSION_MOTEUR } from "./engine.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

describe("sauvegarde locale versionnée", () => {
  it("aller-retour : sérialiser puis charger redonne la même partie", () => {
    const p = jouerSemaine(creerPartie(42, CONFIG), { actionId: "tractage-marche" });
    const texte = serialiser(p);
    const charge = deserialiser(texte);
    expect(charge).toEqual(p);
  });

  it("refus propre des sauvegardes d'une autre version", () => {
    const p = creerPartie(42, CONFIG);
    const mauvais = JSON.parse(serialiser(p));
    mauvais.version = VERSION_SAUVEGARDE + 1;
    expect(() => deserialiser(JSON.stringify(mauvais))).toThrow(/version/);
    const mauvaisMoteur = JSON.parse(serialiser(p));
    mauvaisMoteur.moteurVersion = "autre";
    expect(() => deserialiser(JSON.stringify(mauvaisMoteur))).toThrow(/moteur/);
    expect(() => deserialiser("pas du json")).toThrow(/illisible/);
    expect(() => deserialiser(JSON.stringify({ version: VERSION_SAUVEGARDE }))).toThrow(/version de partie/);
  });

  it("la sauvegarde référence bien le moteur vivant", () => {
    const p = creerPartie(42, CONFIG);
    const s = JSON.parse(serialiser(p));
    expect(s.moteurVersion).toBe(VERSION_MOTEUR);
    expect(s.partie.monde.version).toBe(VERSION_MOTEUR);
  });

  it("migration douce p2.1.0 sans carte ni champs p3 vers p3.0.0 complète", () => {
    const p = creerPartie(42, CONFIG);
    const brut = JSON.parse(serialiser(p));
    brut.partieVersion = "p2.1.0";
    delete brut.partie.territoires;
    delete brut.partie.dilemmesPasses;
    delete brut.partie.carriere.effetsDurees;
    delete brut.partie.carriere.promesses;
    delete brut.partie.carriere.dons;
    delete brut.partie.personnages[0].connaissance;
    brut.partie.version = "p2.1.0";
    const charge = deserialiser(JSON.stringify(brut));
    expect(charge.territoires).toHaveLength(12);
    expect(charge.version).toBe(VERSION_PARTIE);
    expect(charge.dilemmesPasses).toEqual([]);
    expect(charge.carriere.effetsDurees).toEqual([]);
    expect(charge.carriere.promesses).toEqual([]);
    expect(charge.carriere.investiture).toBe("non-posee");
    expect(charge.personnages[0].connaissance).toBeGreaterThan(0);
  });
});
