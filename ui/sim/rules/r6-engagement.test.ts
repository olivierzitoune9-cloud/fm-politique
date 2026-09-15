import { describe, expect, it } from "vitest";
import { creerRng } from "../rng.js";
import { appliquerPetitOui } from "./r6-engagement.js";

describe("R6 engagement", () => {
  it("passant : petit oui initial rend le suivant plus probable", () => {
    let victoires = 0;
    for (let g = 0; g < 40; g += 1) {
      const r = appliquerPetitOui({ id: "a", imageDeSoi: 0.7, lassitude: 0 }, 0.1, creerRng(g + 100), g + 100);
      if (r.accepte) victoires += 1;
    }
    expect(victoires).toBeGreaterThan(15);
  });
  it("limite : demande énorme quasi refusée", () => {
    let victoires = 0;
    for (let g = 0; g < 40; g += 1) {
      const r = appliquerPetitOui({ id: "a", imageDeSoi: 0.2, lassitude: 0.8 }, 1, creerRng(g + 200), g + 200);
      if (r.accepte) victoires += 1;
    }
    expect(victoires).toBeLessThan(12);
  });
  it("seed : deterministe", () => {
    const a = appliquerPetitOui({ id: "a", imageDeSoi: 0.5, lassitude: 0.1 }, 0.3, creerRng(55), 55);
    const b = appliquerPetitOui({ id: "a", imageDeSoi: 0.5, lassitude: 0.1 }, 0.3, creerRng(55), 55);
    expect(a.accepte).toBe(b.accepte);
  });
});
