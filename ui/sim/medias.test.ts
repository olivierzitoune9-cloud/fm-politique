import { describe, expect, it } from "vitest";
import { MEDIAS, mediaParId, routerMedia } from "./medias.js";

describe("médias du monde", () => {
  it("trois médias avec vigilance et audiences bornées", () => {
    expect(MEDIAS).toHaveLength(3);
    for (const m of MEDIAS) {
      expect(m.vigilance).toBeGreaterThanOrEqual(0);
      expect(m.vigilance).toBeLessThanOrEqual(1);
      expect(m.amplification).toBeGreaterThanOrEqual(0);
      expect(Object.keys(m.audiences).length).toBeGreaterThan(0);
    }
  });

  it("média inconnu lève, routage hors média neutre", () => {
    expect(() => mediaParId("nimporte")).toThrow();
    const neutre = routerMedia(MEDIAS[0], "terrain", 0);
    expect(neutre.multiplicateur).toBe(1);
    expect(neutre.risqueFactCheck).toBe(0);
  });

  it("routage : le flux numérique amplifie plus, le quotidien vérifie plus", () => {
    const flux = routerMedia(mediaParId("med.flux-numerique"), "media", 0, "faux");
    const quotidien = routerMedia(mediaParId("med.quotidien-regional"), "media", 0, "faux");
    expect(flux.multiplicateur).toBeGreaterThan(quotidien.multiplicateur);
    expect(quotidien.risqueFactCheck).toBeGreaterThan(flux.risqueFactCheck);
    const modeste = routerMedia(mediaParId("med.radio-matin"), "media", 0, "etabli");
    expect(modeste.risqueFactCheck).toBeLessThan(quotidien.risqueFactCheck);
    expect(flux.multiplicateur).toBeLessThanOrEqual(2.2);
  });
});
