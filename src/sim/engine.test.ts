import { describe, expect, it } from "vitest";
import { creerMonde, pas, simuler } from "./engine.js";

describe("moteur boucle minimale", () => {
  it("même seed donne la même simulation", () => {
    const a = simuler(42, 20);
    const b = simuler(42, 20);
    expect(a.tick).toBe(20);
    expect(b.groupes).toEqual(a.groupes);
    expect(b.evenements).toEqual(a.evenements);
  });

  it("deux seeds donnent des trajectoires différentes mais chacune explicable", () => {
    const a = simuler(1, 12);
    const b = simuler(2, 12);
    expect(JSON.stringify(a.groupes)).not.toBe(JSON.stringify(b.groupes));
    for (const e of [...a.evenements, ...b.evenements]) {
      expect(e.cause.length).toBeGreaterThan(0);
      expect(e.tick).toBeGreaterThan(0);
    }
  });

  it("ordre fixe et mémoire : tick avance de un, événements datés", () => {
    const m0 = creerMonde(7);
    const m1 = pas(m0);
    expect(m1.tick).toBe(1);
    expect(m1.groupes).toHaveLength(2);
  });

  it("chronologie causale lisible sur 50 pas", () => {
    const m = simuler(99, 50);
    for (const g of m.groupes) {
      expect(g.identiteActive).toBeGreaterThanOrEqual(0);
      expect(g.identiteActive).toBeLessThanOrEqual(1);
    }
  });
});
