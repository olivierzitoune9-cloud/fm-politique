import { describe, expect, it } from "vitest";
import { dateISO, echeancesAPartirDe, ECHEANCES, electionAUtick, libelleSemaine, tickDeDate } from "./temps.js";

describe("calendrier réel", () => {
  it("le tick 1 est la semaine du 7 septembre 2026, un lundi", () => {
    expect(dateISO(1)).toBe("2026-09-07");
    expect(libelleSemaine(1)).toContain("septembre");
    expect(libelleSemaine(1)).toContain("7");
  });

  it("aller-retour tick et date", () => {
    expect(tickDeDate(2026, 9, 7)).toBe(1);
    expect(tickDeDate(2026, 9, 13)).toBe(1);
    expect(tickDeDate(2026, 9, 14)).toBe(2);
    expect(tickDeDate(2027, 4, 11)).toBeGreaterThan(30);
  });

  it("échéances 2027 et suivantes présentes et ordonnées", () => {
    const ids = ECHEANCES.map((e) => e.id);
    expect(ids).toContain("presidentielle-2027-t1");
    expect(ids).toContain("presidentielle-2027-t2");
    expect(ids).toContain("legislatives-2027-t1");
    expect(ids).toContain("europeennes-2029");
    const ticks = ECHEANCES.map((e) => e.tick);
    expect([...ticks].sort((a, b) => a - b)).toEqual(ticks);
    for (const e of ECHEANCES) {
      expect(e.statut).toBe("plausible");
      expect(e.detail.length).toBeGreaterThan(10);
    }
  });

  it("élections reconnues aux bons ticks et échéances futures filtrées", () => {
    const t1 = tickDeDate(2027, 4, 11);
    expect(electionAUtick(t1)).toBe("presidentielle-t1");
    expect(electionAUtick(t1 + 1)).toBeNull();
    const futures = echeancesAPartirDe(1);
    expect(futures.length).toBe(ECHEANCES.length);
    expect(echeancesAPartirDe(tickDeDate(2027, 6, 21)).some((e) => e.id === "legislatives-2027-t1")).toBe(false);
  });
});
