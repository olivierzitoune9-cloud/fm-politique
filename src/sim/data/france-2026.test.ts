import { describe, expect, it } from "vitest";
import { FRANCE_2026, variablesGroupesDepuisFrance } from "./france-2026.js";

describe("france 2026", () => {
  it("chaque indicateur observé porte date et source", () => {
    for (const i of FRANCE_2026.filter((x) => x.statut === "observee")) {
      expect(i.date.length).toBeGreaterThanOrEqual(10);
      expect(i.source.length).toBeGreaterThan(5);
      expect(i.normalise).toBeGreaterThanOrEqual(0);
      expect(i.normalise).toBeLessThanOrEqual(1);
    }
  });
  it("aucune donnée 2022 ne passe pour 2026", () => {
    for (const i of FRANCE_2026.filter((x) => x.statut === "observee")) {
      expect(i.date.startsWith("2024") || i.date.startsWith("2025") || i.date.startsWith("2026")).toBe(true);
    }
  });
  it("variables groupes dérivées et bornées", () => {
    const v = variablesGroupesDepuisFrance();
    expect(v.satisfactionEco).toBeLessThan(0.55);
    expect(v.menace).toBeGreaterThanOrEqual(0);
  });
});
