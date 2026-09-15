import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerOrdre } from "./r7-obeissance.js";

describe("R7 obeissance", () => {
  it("passant : autorité légitime et surveillance font obéir souvent", () => {
    let n = 0;
    for (let g = 0; g < 60; g += 1) {
      const r = appliquerOrdre({ legitimitePercue: 0.9, surveillance: 0.8, responsabiliteDiluee: 0.7, graviteOrdre: 0.2 }, creerRng(g + 300), g + 300);
      if (r.obeit) n += 1;
    }
    expect(n).toBeGreaterThan(30);
  });
  it("oppose : ordre gravissime et autorité nulle font refuser souvent", () => {
    let n = 0;
    for (let g = 0; g < 60; g += 1) {
      const r = appliquerOrdre({ legitimitePercue: 0.1, surveillance: 0, responsabiliteDiluee: 0, graviteOrdre: 1 }, creerRng(g + 400), g + 400);
      if (r.obeit) n += 1;
    }
    expect(n).toBeLessThan(20);
  });
  it("seed : deterministe", () => {
    const ctx = { legitimitePercue: 0.6, surveillance: 0.5, responsabiliteDiluee: 0.5, graviteOrdre: 0.4 };
    const a = appliquerOrdre(ctx, creerRng(77), 77);
    const b = appliquerOrdre(ctx, creerRng(77), 77);
    expect(a.obeit).toBe(b.obeit);
  });
});
