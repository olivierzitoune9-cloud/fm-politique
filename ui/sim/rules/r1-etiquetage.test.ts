// R1 : cas passant, cas limite, cas extrême, non régression seedée.
import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import type { Emetteur, GroupePopulation } from "../types.js";
import { appliquerEtiquetage, biaisAllocation } from "./r1-etiquetage.js";

function groupeBase(surcharge: Partial<GroupePopulation> = {}): GroupePopulation {
  return {
    id: "grp.test",
    identiteActive: 0.2,
    menacePercue: 0.5,
    exposition: 1,
    contactsCroises: 0.3,
    interetsPartages: 0.3,
    ...surcharge,
  };
}

function emetteurBase(surcharge: Partial<Emetteur> = {}): Emetteur {
  return { id: "act.test", credibilite: 0.7, reputation: 0.6, ...surcharge };
}

describe("R1 etiquetage", () => {
  it("cas passant : un etiquetage credible et expose augmente l identite", () => {
    const resultat = appliquerEtiquetage(
      groupeBase(),
      emetteurBase(),
      { grossierete: 0.2, repetition: 0.5, marqueForce: 0.5 },
      creerRng(42),
      42,
    );
    expect(resultat.deltaIdentite).toBeGreaterThan(0);
    expect(resultat.deltaIdentite).toBeLessThanOrEqual(0.15);
    expect(resultat.groupe.identiteActive).toBeGreaterThan(0.2);
    expect(resultat.journal).toHaveLength(1);
  });

  it("cas limite : exposition nulle veut dire effet nul et aucun tirage", () => {
    const resultat = appliquerEtiquetage(
      groupeBase({ exposition: 0 }),
      emetteurBase(),
      { grossierete: 0.2, repetition: 0.9, marqueForce: 0.9 },
      creerRng(7),
      7,
    );
    expect(resultat.deltaIdentite).toBe(0);
    expect(resultat.groupe.identiteActive).toBe(0.2);
    expect(resultat.journal).toHaveLength(0);
  });

  it("cas extreme : identite plafonnee a 1 meme avec renforts maximaux", () => {
    const resultat = appliquerEtiquetage(
      groupeBase({ identiteActive: 0.99, menacePercue: 1 }),
      emetteurBase({ credibilite: 1 }),
      { grossierete: 0, repetition: 1, marqueForce: 1 },
      creerRng(99),
      99,
    );
    expect(resultat.groupe.identiteActive).toBeLessThanOrEqual(1);
    expect(resultat.deltaIdentite).toBeLessThanOrEqual(0.15);
  });

  it("effet oppose : grossierete plus source peu credible coute a l emetteur", () => {
    const resultat = appliquerEtiquetage(
      groupeBase(),
      emetteurBase({ credibilite: 0.1, reputation: 0.6 }),
      { grossierete: 0.9, repetition: 0.5, marqueForce: 0.5 },
      creerRng(13),
      13,
    );
    expect(resultat.deltaIdentite).toBeLessThan(0);
    expect(resultat.emetteur.reputation).toBeLessThan(0.6);
  });

  it("non regression seedee : meme graine meme resultat", () => {
    const params = { grossierete: 0.2, repetition: 0.5, marqueForce: 0.5 };
    const a = appliquerEtiquetage(groupeBase(), emetteurBase(), params, creerRng(1234), 1234);
    const b = appliquerEtiquetage(groupeBase(), emetteurBase(), params, creerRng(1234), 1234);
    expect(a.deltaIdentite).toBe(b.deltaIdentite);
    expect(a.groupe.identiteActive).toBe(b.groupe.identiteActive);
  });

  it("biais d allocation : prime a la difference, attenue par contacts croises", () => {
    const fort = biaisAllocation(groupeBase({ identiteActive: 0.9 }), 0);
    const attenue = biaisAllocation(groupeBase({ identiteActive: 0.9 }), 1);
    expect(fort).toBeGreaterThan(0.5);
    expect(attenue).toBeLessThan(fort);
  });
});
