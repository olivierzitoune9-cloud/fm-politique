import { describe, expect, it } from "vitest";
import { creerRng } from "./rng.js";
import { creerMonde, simuler } from "./engine.js";
import { genererPersonnages } from "./personnages.js";
import { LIBELLES_OPTIONS, manoeuvresPartis, majPartis, PARTIS, relationsInitialesPartis } from "./partis.js";

describe("partis organisés", () => {
  it("deux partis, leaders nommés trouvés dans le casting, manoeuvres lisibles", () => {
    const persos = genererPersonnages(creerRng(1));
    const monde = simuler(42, 3);
    const man = manoeuvresPartis(monde, persos, false);
    expect(man.length).toBeGreaterThan(0);
    expect(LIBELLES_OPTIONS["etiquetage-agressif"]).toContain("brutalement");
    for (const m of man) {
      expect(m.leader).toContain(" ");
      expect(m.texte).toContain("(");
    }
  });

  it("relations : l'agressif séduit le radical et inquiète le modéré, borné", () => {
    let r = relationsInitialesPartis();
    r = majPartis(r, "etiquetage-agressif", 0);
    expect(r["parti.radical"]).toBeGreaterThan(0);
    expect(r["parti.modere"]).toBeLessThan(0);
    r = majPartis(r, "etiquetage-modere", 0);
    r = majPartis(r, "attaquer-institution", 2);
    for (const p of PARTIS) {
      expect(r[p.id]).toBeGreaterThanOrEqual(-1);
      expect(r[p.id]).toBeLessThanOrEqual(1);
    }
  });

  it("le monde moteur continue seul : les acteurs arbitrent sans le joueur", () => {
    const m = creerMonde(5);
    expect(m.acteurs.filter((a) => !a.estJoueur).length).toBe(2);
  });
});
