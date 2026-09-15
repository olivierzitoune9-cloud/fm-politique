import { describe, expect, it } from "vitest";
import { creerRng } from "./rng.js";
import { creerProposition, dicibiliteMoyenne, modifierStatutPreuve, pousserProposition } from "./propositions.js";

describe("propositions R9", () => {
  it("création : dicibilité 0.15 partout, statut contesté", () => {
    const p = creerProposition("conseil citoyen", "joueur", ["grp.centre", "grp.peripherie"]);
    expect(p.statutPreuve).toBe("conteste");
    expect(p.dicibilite["grp.centre"]).toBe(0.15);
    expect(dicibiliteMoyenne(p)).toBe(0.15);
  });

  it("pousser : déplacement marginal, jamais frontal, plafond 0.08", () => {
    const p0 = creerProposition("conseil citoyen", "joueur", ["grp.centre", "grp.peripherie"]);
    const r1 = pousserProposition(p0, "grp.centre", 0.9, 0.9, creerRng(1), 1);
    expect(r1.delta).toBeGreaterThan(0);
    expect(r1.delta).toBeLessThanOrEqual(0.08);
    expect(r1.proposition.dicibilite["grp.peripherie"]).toBe(0.15);
    // borne globale 0..1
    let p = r1.proposition;
    for (let i = 0; i < 30; i += 1) {
      p = pousserProposition(p, "grp.centre", 1, 1, creerRng(2 + i), 2 + i).proposition;
      expect(p.dicibilite["grp.centre"]).toBeLessThanOrEqual(1);
    }
  });

  it("contre feu fort freine, statut de preuve modifiable", () => {
    const p = creerProposition("x", "joueur", ["grp.centre"]);
    const s = modifierStatutPreuve(p, "etabli");
    expect(s.statutPreuve).toBe("etabli");
    expect(p.statutPreuve).toBe("conteste");
  });
});
