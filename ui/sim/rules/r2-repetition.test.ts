import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerRepetition } from "./r2-repetition.js";

describe("R2 repetition", () => {
  it("passant : exposition repetee augmente la familiarite", () => {
    const r = appliquerRepetition({ id: "x", familiarite: 0.2, connaissancePrealable: 0.1, confianceSource: 0.8 }, 3, creerRng(1), 1);
    expect(r.delta).toBeGreaterThan(0);
    expect(r.cible.familiarite).toBeGreaterThan(0.2);
    expect(r.journal).toHaveLength(1);
  });
  it("limite : zero exposition, zero effet, zero tirage", () => {
    const r = appliquerRepetition({ id: "x", familiarite: 0.2, connaissancePrealable: 0.1, confianceSource: 0.8 }, 0, creerRng(1), 1);
    expect(r.delta).toBe(0);
    expect(r.journal).toHaveLength(0);
  });
  it("extreme : connaissance prealable forte bloque presque tout", () => {
    const r = appliquerRepetition({ id: "x", familiarite: 0.5, connaissancePrealable: 1, confianceSource: 1 }, 3, creerRng(2), 2);
    expect(r.delta).toBeLessThan(0.05);
  });
  it("seed : meme graine meme delta", () => {
    const a = appliquerRepetition({ id: "x", familiarite: 0.2, connaissancePrealable: 0.1, confianceSource: 0.8 }, 2, creerRng(9), 9);
    const b = appliquerRepetition({ id: "x", familiarite: 0.2, connaissancePrealable: 0.1, confianceSource: 0.8 }, 2, creerRng(9), 9);
    expect(a.delta).toBe(b.delta);
  });
});
