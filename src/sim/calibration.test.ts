import { describe, expect, it } from "vitest";
import { simuler, type CoupJoueur } from "./engine.js";

// Phase 11. Calibration : simulations massives, absurdités, stabilité.
// Alertes : variable explosive, NaN, état hors bornes, divergence sans cause.
describe("calibration massive", () => {
  it("200 parties de 30 pas restent bornées et causales", () => {
    for (let graine = 1; graine <= 200; graine += 1) {
      const coups: CoupJoueur[] = Array.from({ length: 30 }, (_, i) => ({
        optionId: (["preparer-silencieux", "etiquetage-modere", "etiquetage-agressif", "chercher-coalition", "attaquer-institution"] as const)[
          (graine + i) % 5
        ],
      }));
      const m = simuler(graine, 30, coups);
      expect(m.tick).toBe(30);
      expect(m.decisions).toHaveLength(90);
      for (const g of m.groupes) {
        for (const v of [g.identiteActive, g.menace, g.bascule, g.satisfactionEco, g.perteControle, g.receptiviteOrdre, g.adoption, g.exposition, g.ressourcesActeur]) {
          expect(Number.isNaN(v)).toBe(false);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
      for (const e of m.evenements) {
        expect(e.cause.length).toBeGreaterThan(0);
      }
    }
  });

  it("aucune stratégie joueur toujours optimale sur 5 seeds", () => {
    // Compare les réceptivités finales : l'agressif ne gagne pas partout.
    const scores = (["preparer-silencieux", "etiquetage-agressif"] as const).map((option) => {
      let total = 0;
      for (let graine = 1; graine <= 5; graine += 1) {
        const m = simuler(graine, 20, Array.from({ length: 20 }, () => ({ optionId: option })));
        total += m.groupes.reduce((s, g) => s + g.receptiviteOrdre, 0);
      }
      return total;
    });
    // Les deux stratégies restent dans un ordre de grandeur comparable, pas d'écrasement.
    expect(Math.abs(scores[0] - scores[1])).toBeLessThan(8);
  });
});
