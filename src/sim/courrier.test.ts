import { describe, expect, it } from "vitest";
import { simuler } from "./engine.js";
import { genererAgenda, genererCourriels } from "./courrier.js";

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
});
