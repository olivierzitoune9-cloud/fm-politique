import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerDetresse } from "./r4-detresse.js";

describe("R4 detresse", () => {
  it("passant : un choc eco augmente la receptivite a l ordre", () => {
    const r = appliquerDetresse({ id: "g", satisfactionEco: 0.6, perteControle: 0.4, receptiviteOrdre: 0.2 }, 0.8, creerRng(5), 5);
    expect(r.delta).toBeGreaterThan(0);
  });
  it("limite : en prosperite, meme discours inaudible", () => {
    const r = appliquerDetresse({ id: "g", satisfactionEco: 1, perteControle: 0, receptiviteOrdre: 0.1 }, -0.5, creerRng(5), 5);
    expect(r.etat.receptiviteOrdre).toBeLessThan(0.3);
  });
  it("extreme : plafonds tenus", () => {
    const r = appliquerDetresse({ id: "g", satisfactionEco: 0, perteControle: 1, receptiviteOrdre: 0.99 }, 1, creerRng(6), 6);
    expect(r.etat.receptiviteOrdre).toBeLessThanOrEqual(1);
  });
  it("seed : deterministe", () => {
    const base = { id: "g", satisfactionEco: 0.5, perteControle: 0.5, receptiviteOrdre: 0.3 };
    const a = appliquerDetresse(base, 0.5, creerRng(21), 21);
    const b = appliquerDetresse(base, 0.5, creerRng(21), 21);
    expect(a.delta).toBe(b.delta);
  });
});
