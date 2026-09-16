import { describe, expect, it } from "vitest";
import { simuler } from "./engine.js";
import {
  adoptionMoyenne,
  genererAgenda,
  genererCourriels,
  propagerTerritoires,
  sondageParId,
  SONDAGES,
  territoiresInitiaux,
} from "./courrier.js";

describe("courrier et agenda", () => {
  it("un courriel par événement, plus accusé pour mes coups", () => {
    const m = simuler(42, 10, Array.from({ length: 10 }, () => ({ optionId: "preparer-silencieux" as const })));
    const mails = genererCourriels(m.evenements, m.decisions);
    expect(mails.length).toBeGreaterThanOrEqual(m.evenements.length);
    for (const mail of mails) {
      expect(mail.de.length).toBeGreaterThan(0);
      expect(mail.objet).toContain(`t${mail.tick}`);
    }
  });

  it("agenda : échéances à venir seulement", () => {
    const agenda = genererAgenda(12);
    expect(agenda.length).toBeGreaterThan(0);
    for (const e of agenda) {
      expect(e.tick).toBeGreaterThanOrEqual(12);
    }
  });

  it("déterministe", () => {
    const a = simuler(7, 8);
    const b = simuler(7, 8);
    expect(genererCourriels(a.evenements, a.decisions)).toEqual(genererCourriels(b.evenements, b.decisions));
  });

  it("J3 : douze territoires seedés, propagation bornée, déterminisme", () => {
    const a = territoiresInitiaux(42);
    const b = territoiresInitiaux(42);
    expect(a).toHaveLength(12);
    expect(a).toEqual(b);
    const c = territoiresInitiaux(43);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(c));
    const apres = propagerTerritoires(a, 0.3, 0.2, 0.1);
    for (const t of apres) {
      expect(t.adoption).toBeGreaterThanOrEqual(0);
      expect(t.adoption).toBeLessThanOrEqual(1);
      expect(t.reponseAdverse).toBeGreaterThanOrEqual(0);
      expect(t.reponseAdverse).toBeLessThanOrEqual(1);
    }
    expect(adoptionMoyenne(apres)).toBeGreaterThan(0);
  });

  it("J4 : trois sondages commandables, coûts croissants, biais décroissant", () => {
    expect(SONDAGES).toHaveLength(3);
    expect(sondageParId("sond.bar").coutArgent).toBeLessThan(sondageParId("sond.institut").coutArgent);
    expect(sondageParId("sond.bar").biais).toBeGreaterThan(sondageParId("sond.institut").biais);
    expect(() => sondageParId("n'existe-pas")).toThrow();
  });
});
