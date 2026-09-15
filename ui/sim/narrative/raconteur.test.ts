import { describe, expect, it } from "vitest";
import { simuler } from "../engine.js";
import { raconterChronologie, raconterEvenement } from "./raconteur.js";

describe("narration", () => {
  it("déterministe : même événement même texte", () => {
    const e = { tick: 3, type: "bascule-normative", groupeId: "grp.centre", cause: "menace=0.70", valeur: 0.6 };
    const a = raconterEvenement(e);
    const b = raconterEvenement(e);
    expect(a).toEqual(b);
    expect(a.source.length).toBeGreaterThan(0);
  });

  it("sources internes affichées, jamais de vérité nue", () => {
    const m = simuler(42, 20);
    const textes = raconterChronologie(m.evenements, m.decisions);
    for (const t of textes) {
      expect(t.source.length).toBeGreaterThan(0);
      expect(t.corps).toContain("Source");
    }
  });

  it("jamais de causalité : la narration ne modifie pas le monde", () => {
    const a = simuler(7, 15);
    const avant = JSON.stringify(a.groupes);
    raconterChronologie(a.evenements, a.decisions);
    expect(JSON.stringify(a.groupes)).toBe(avant);
  });

  it("chronologie triée par tick", () => {
    const m = simuler(13, 25);
    const textes = raconterChronologie(m.evenements, m.decisions);
    for (let i = 1; i < textes.length; i += 1) {
      expect(textes[i].tick).toBeGreaterThanOrEqual(textes[i - 1].tick);
    }
  });
});
