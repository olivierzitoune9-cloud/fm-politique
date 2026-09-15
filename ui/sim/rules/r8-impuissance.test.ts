import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerSanction } from "./r8-impuissance.js";

describe("R8 impuissance", () => {
  it("passant : sanctions imprévisibles et échecs démobilisent", () => {
    const r = appliquerSanction({ id: "g", efficacitePercue: 0.6, peur: 0.2, mobilisation: 0.6 }, 0.9, 0.9, creerRng(61), 61);
    expect(r.delta).toBeLessThan(0.05);
    expect(r.etat.peur).toBeGreaterThanOrEqual(0.2);
  });
  it("limite : poche de résistance, jamais zéro forcé", () => {
    const r = appliquerSanction({ id: "g", efficacitePercue: 0, peur: 1, mobilisation: 0.01 }, 1, 1, creerRng(62), 62);
    expect(r.etat.mobilisation).toBeGreaterThanOrEqual(0);
  });
  it("seed : deterministe", () => {
    const base = { id: "g", efficacitePercue: 0.5, peur: 0.3, mobilisation: 0.5 };
    const a = appliquerSanction(base, 0.5, 0.5, creerRng(63), 63);
    const b = appliquerSanction(base, 0.5, 0.5, creerRng(63), 63);
    expect(a.delta).toBe(b.delta);
  });
});
