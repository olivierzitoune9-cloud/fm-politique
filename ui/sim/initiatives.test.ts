import { describe, expect, it } from "vitest";
import { creerPartie, jouerSemaine } from "./partie.js";
import type { ConfigCarriere } from "./carriere.js";

const CONFIG: ConfigCarriere = {
  nom: "Test initiatives",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

describe("C6 : initiatives autonomes des personnages", () => {
  it("fait évoluer un lien entre deux personnes sans interaction du joueur et date leur mémoire", () => {
    let initiatives = 0;
    for (let graine = 1; graine <= 40; graine += 1) {
      const avant = creerPartie(graine, CONFIG);
      const copie = JSON.stringify(avant);
      const apres = jouerSemaine(avant, { actionId: "preparer-silencieux" });
      const faits = apres.mondeSocial.evenements.filter((e) => e.type === "initiative-autonome");
      expect(JSON.stringify(avant)).toBe(copie);
      expect(faits.length).toBeLessThanOrEqual(2);
      if (faits.length === 0) continue;
      initiatives += 1;
      expect(faits).toHaveLength(2);
      expect(new Set(faits.map((e) => e.noeudId)).size).toBe(2);
      for (const fait of faits) {
        expect(fait.tick).toBe(apres.tick);
        expect(avant.personnages.some((p) => p.id === fait.noeudId)).toBe(true);
      }
      const ids = faits.map((e) => e.noeudId);
      const lien = apres.mondeSocial.liens.find((l) => ids.includes(l.de) && ids.includes(l.vers));
      expect(lien).toBeDefined();
      expect(avant.mondeSocial.liens).not.toContainEqual(lien);
      expect(apres.journal.some((j) => j.tick === apres.tick && j.texte === faits[0].texte)).toBe(true);
      expect(jouerSemaine(avant, { actionId: "preparer-silencieux" })).toEqual(apres);
    }
    expect(initiatives).toBeGreaterThan(0);
    expect(initiatives).toBeLessThan(40);
  });
});
