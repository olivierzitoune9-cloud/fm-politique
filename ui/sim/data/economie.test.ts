import { describe, expect, it } from "vitest";
import { creerMonde } from "../engine.js";
import { ajusterEconomie, chomagePourTick, TRAJECTOIRE_CHOMAGE } from "./economie.js";

describe("économie branchée", () => {
  it("départ sourcé : septembre 2026 observé, suite hypothèse marquée", () => {
    const premier = TRAJECTOIRE_CHOMAGE[0];
    expect(premier.mois).toBe("2026-09");
    expect(premier.chomage).toBe(8.2);
    expect(premier.statut).toBe("observee");
    expect(premier.source).toContain("Insee");
    expect(TRAJECTOIRE_CHOMAGE[5].statut).toBe("hypothese");
    expect(TRAJECTOIRE_CHOMAGE[5].source).toContain("hypothèse");
  });

  it("chômage par tick et dérive douce de satisfaction, bornée", () => {
    expect(chomagePourTick(1).chomage).toBe(8.2);
    expect(chomagePourTick(40).chomage).toBeGreaterThan(8);
    expect(chomagePourTick(900).chomage).toBeGreaterThan(7);
    const monde = creerMonde(42);
    const derive = ajusterEconomie(monde, 10);
    for (const g of derive.groupes) {
      const base = monde.groupes.find((x: { id: string }) => x.id === g.id)!.satisfactionEco;
      expect(Math.abs(g.satisfactionEco - base)).toBeLessThanOrEqual(0.02 + 1e-9);
      expect(g.satisfactionEco).toBeGreaterThanOrEqual(0);
      expect(g.satisfactionEco).toBeLessThanOrEqual(1);
    }
  });
});
