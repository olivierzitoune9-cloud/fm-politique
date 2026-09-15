import { describe, expect, it } from "vitest";
import { creerRng } from "./rng.js";
import { creerCarriere, type Carriere, type ConfigCarriere } from "./carriere.js";
import { genererPersonnages, type Personnage } from "./personnages.js";
import { appliquerInteraction, INTERACTIONS } from "./interactions.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

function base(): { carriere: Carriere; persos: Personnage[] } {
  const carriere = creerCarriere(CONFIG, creerRng(1));
  const persos = genererPersonnages(creerRng(1));
  // relation haute pour les tests de succès, sauf un hostile
  const amis = persos.map((p) => ({ ...p, relation: p.id === "pers.fact-checker" ? -0.8 : 0.8 }));
  return { carriere, persos: amis };
}

describe("interactions humaines et mémoire", () => {
  it("cinq interactions déclarées avec coûts de temps", () => {
    expect(INTERACTIONS).toHaveLength(5);
    for (const i of INTERACTIONS) expect(i.coutTemps).toBeGreaterThan(0);
  });

  it("convaincre : déterministe, relation bornée", () => {
    const { carriere, persos } = base();
    const a = appliquerInteraction(carriere, persos[0], "convaincre", 1, creerRng(5), 1);
    const b = appliquerInteraction(carriere, persos[0], "convaincre", 1, creerRng(5), 1);
    expect(a.perso).toEqual(b.perso);
    expect(a.perso.relation).toBeGreaterThanOrEqual(-1);
    expect(a.perso.relation).toBeLessThanOrEqual(1);
  });

  it("promettre écrit en mémoire, demander un coup de main enregistre une dette et déclenche le hook", () => {
    const { carriere, persos } = base();
    const chercheur = persos.find((p) => p.metier === "chercheur")!;
    const p1 = appliquerInteraction(carriere, chercheur, "promettre", 1, creerRng(2), 1, "la présidence de l'asso");
    expect(p1.perso.memoire.some((m) => m.type === "promesse" && m.detail.includes("présidence"))).toBe(true);
    const p2 = appliquerInteraction(p1.carriere, p1.perso, "demander-coup-de-main", 2, creerRng(3), 1);
    expect(p2.resultat.reussi).toBe(true);
    expect(p2.perso.memoire.some((m) => m.type === "dette")).toBe(true);
    expect(p2.perso.cautionActive).not.toBeNull();
    expect(p2.resultat.effet?.caution).toBe(true);
  });

  it("trahir : cicatrice durable, refus ensuite, recoudre amortit sans effacer", () => {
    const { carriere, persos } = base();
    const journaliste = persos.find((p) => p.metier === "journaliste")!;
    const t = appliquerInteraction(carriere, journaliste, "trahir", 1, creerRng(4), 1);
    expect(t.perso.relation).toBe(-0.6);
    expect(t.perso.memoire.some((m) => m.type === "trahison" && m.gravite >= 0.5)).toBe(true);
    expect(t.carriere.progression.reputation).toBeLessThan(carriere.progression.reputation);
    const d = appliquerInteraction(t.carriere, t.perso, "demander-coup-de-main", 2, creerRng(6), 1);
    expect(d.resultat.reussi).toBe(false);
    const r = appliquerInteraction(d.carriere, d.perso, "recoudre", 3, creerRng(7), 1);
    const trahisons = r.perso.memoire.filter((m) => m.type === "trahison");
    expect(trahisons.length).toBe(1);
    expect(trahisons[0].gravite).toBeLessThan(0.8);
    expect(trahisons[0].gravite).toBeGreaterThanOrEqual(0.2);
  });

  it("personnage inconnu impossible : id inconnu lève", () => {
    const { carriere, persos } = base();
    expect(() =>
      appliquerInteraction(carriere, persos[0], "recoudre" as never, 1, creerRng(1), 1),
    ).not.toThrow();
    expect(() => appliquerInteraction(carriere, { ...persos[0] }, "vener" as never, 1, creerRng(1), 1)).toThrow();
  });
});
