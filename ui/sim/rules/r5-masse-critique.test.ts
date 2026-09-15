import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerMasseCritique } from "./r5-masse-critique.js";

describe("R5 masse critique", () => {
  it("passant : au delà du seuil, bascule rapide", () => {
    const r = appliquerMasseCritique({ id: "n", partMinorite: 0.3, adoption: 0.1, seuil: 0.25 }, creerRng(7), 7);
    expect(r.delta).toBeGreaterThan(0);
  });
  it("limite : sous le seuil, quasi rien", () => {
    const r = appliquerMasseCritique({ id: "n", partMinorite: 0.1, adoption: 0.1, seuil: 0.25 }, creerRng(7), 7);
    expect(r.etat.adoption).toBeLessThan(0.2);
  });
  it("extreme : seuil non universel, parametrable", () => {
    const bas = appliquerMasseCritique({ id: "n", partMinorite: 0.2, adoption: 0.05, seuil: 0.15 }, creerRng(8), 8);
    expect(bas.delta).toBeGreaterThan(0);
  });
  it("seed : deterministe", () => {
    const base = { id: "n", partMinorite: 0.3, adoption: 0.1, seuil: 0.25 };
    const a = appliquerMasseCritique(base, creerRng(31), 31);
    const b = appliquerMasseCritique(base, creerRng(31), 31);
    expect(a.delta).toBe(b.delta);
  });
});
