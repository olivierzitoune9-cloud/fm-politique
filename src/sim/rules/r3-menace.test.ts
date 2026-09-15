import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerMenace } from "./r3-menace.js";

describe("R3 menace", () => {
  it("passant : choc de menace fait basculer un predispose", () => {
    const r = appliquerMenace({ id: "g", predispo: 0.8, menace: 0.5, bascule: 0.1 }, 0.6, creerRng(3), 3);
    expect(r.delta).toBeGreaterThan(0);
    expect(r.etat.bascule).toBeGreaterThan(0.1);
  });
  it("limite : sans predisposition, meme menace forte bascule peu", () => {
    const r = appliquerMenace({ id: "g", predispo: 0, menace: 0.9, bascule: 0 }, 0.5, creerRng(3), 3);
    expect(r.etat.bascule).toBeLessThan(0.15);
  });
  it("extreme : hysteresis, la bascule ne s effondre pas d un coup", () => {
    const haut = appliquerMenace({ id: "g", predispo: 0.8, menace: 0.9, bascule: 0.8 }, -0.9, creerRng(4), 4);
    expect(haut.etat.bascule).toBeGreaterThan(0.3);
  });
  it("seed : deterministe", () => {
    const a = appliquerMenace({ id: "g", predispo: 0.6, menace: 0.5, bascule: 0.2 }, 0.4, creerRng(11), 11);
    const b = appliquerMenace({ id: "g", predispo: 0.6, menace: 0.5, bascule: 0.2 }, 0.4, creerRng(11), 11);
    expect(a.delta).toBe(b.delta);
  });
});
