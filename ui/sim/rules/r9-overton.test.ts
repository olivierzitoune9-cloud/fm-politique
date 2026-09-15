import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerRelais } from "./r9-overton.js";

describe("R9 overton", () => {
  it("passant : relais avec déni déplace un peu", () => {
    const r = appliquerRelais({ id: "p", dicibilite: 0.3, contreFeu: 0 }, 0.8, 0.8, creerRng(71), 71);
    expect(r.delta).toBeGreaterThan(0);
    expect(r.delta).toBeLessThanOrEqual(0.08);
  });
  it("oppose : contre feu fort bloque", () => {
    const r = appliquerRelais({ id: "p", dicibilite: 0.3, contreFeu: 1 }, 0.8, 0.8, creerRng(71), 71);
    expect(r.delta).toBeLessThan(0.03);
  });
  it("limite : jamais de saut frontal", () => {
    const r = appliquerRelais({ id: "p", dicibilite: 0.3, contreFeu: 0 }, 1, 1, creerRng(72), 72);
    expect(r.delta).toBeLessThanOrEqual(0.08);
  });
  it("seed : deterministe", () => {
    const base = { id: "p", dicibilite: 0.3, contreFeu: 0.2 };
    const a = appliquerRelais(base, 0.6, 0.6, creerRng(73), 73);
    const b = appliquerRelais(base, 0.6, 0.6, creerRng(73), 73);
    expect(a.delta).toBe(b.delta);
  });
});
