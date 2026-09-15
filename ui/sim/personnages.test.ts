import { describe, expect, it } from "vitest";
import { creerRng } from "./rng.js";
import { effetHook, genererPersonnages, nomComplet, PROFILS } from "./personnages.js";

describe("personnages fictifs nommés", () => {
  it("génération déterministe : même seed, mêmes noms et traits", () => {
    const a = genererPersonnages(creerRng(123));
    const b = genererPersonnages(creerRng(123));
    expect(a).toEqual(b);
    expect(a).toHaveLength(PROFILS.length);
    for (const p of a) {
      expect(p.prenom.length).toBeGreaterThan(1);
      expect(p.nom.length).toBeGreaterThan(1);
      expect(p.traits).toHaveLength(2);
      expect(p.expertise).toBeGreaterThanOrEqual(0.3);
      expect(p.expertise).toBeLessThanOrEqual(0.95);
      expect(p.relation).toBeGreaterThanOrEqual(-0.2);
      expect(p.relation).toBeLessThanOrEqual(0.2);
      expect(p.memoire).toHaveLength(0);
    }
  });

  it("la société est là, pas que le politique", () => {
    const persos = genererPersonnages(creerRng(7));
    const metiers = new Set(persos.map((p) => p.metier));
    for (const m of ["chercheur", "experte-ia", "historien", "ingenieur", "journaliste", "fact-checker", "syndicaliste", "fonctionnaire", "entrepreneur", "leader-parti"]) {
      expect(metiers.has(m as never)).toBe(true);
    }
  });

  it("deux seeds donnent deux castings différents", () => {
    const a = genererPersonnages(creerRng(1)).map(nomComplet).join();
    const b = genererPersonnages(creerRng(2)).map(nomComplet).join();
    expect(a).not.toBe(b);
  });

  it("chaque métier a un hook mécanique avec effet ou détail", () => {
    for (const p of genererPersonnages(creerRng(9))) {
      const h = effetHook(p.metier);
      expect(h.detail.length).toBeGreaterThan(5);
    }
    const chercheur = effetHook("chercheur");
    expect(chercheur.caution).toBe(true);
    const experte = effetHook("experte-ia");
    expect(experte.microCiblage).toBe(true);
  });
});
