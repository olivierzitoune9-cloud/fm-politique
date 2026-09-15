import { describe, expect, it } from "vitest";
import { creerMonde, pas, simuler, ACTIONS_JOUABLES } from "./engine.js";
import { filtrerVueJoueur } from "./joueur.js";

describe("joueur jouable", () => {
  it("le joueur existe, insignifiant, avec 5 actions", () => {
    const m = creerMonde(1);
    const joueur = m.acteurs.find((a) => a.estJoueur);
    expect(joueur).toBeDefined();
    expect(joueur!.credibilite).toBeLessThan(0.5);
    expect(ACTIONS_JOUABLES).toHaveLength(5);
  });

  it("coup joueur déterministe et journalisé", () => {
    const a = pas(creerMonde(42), { optionId: "etiquetage-modere" });
    const b = pas(creerMonde(42), { optionId: "etiquetage-modere" });
    expect(a.decisions).toEqual(b.decisions);
    expect(a.decisions.some((d) => d.acteurId === "joueur" && d.optionId === "etiquetage-modere")).toBe(true);
  });

  it("coups différents peuvent diverger", () => {
    const a = simuler(9, 10, Array.from({ length: 10 }, () => ({ optionId: "preparer-silencieux" as const })));
    const b = simuler(9, 10, Array.from({ length: 10 }, () => ({ optionId: "etiquetage-agressif" as const })));
    expect(JSON.stringify(a.groupes)).not.toBe(JSON.stringify(b.groupes));
  });

  it("vue filtrée : arrondie, sourcée, sans état exact adverse", () => {
    const m = simuler(42, 5, [{ optionId: "preparer-silencieux" }]);
    const vue = filtrerVueJoueur(m);
    expect(vue.tick).toBe(5);
    for (const g of vue.groupes) {
      expect(g.source.length).toBeGreaterThan(0);
      // Arrondi à la dizaine : pas plus d'une décimale.
      expect(g.identiteAffichee * 10).toBe(Math.round(g.identiteAffichee * 10));
    }
    // Le joueur ne voit que ses décisions, pas celles des deux IA.
    for (const d of vue.mesDecisions) {
      expect(d.acteurId).toBe("joueur");
    }
    expect(vue.avertissement.length).toBeGreaterThan(0);
  });
});
