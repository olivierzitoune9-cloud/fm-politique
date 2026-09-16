import { describe, expect, it } from "vitest";
import { ajouterTrace, dedupliquerTraces, resumerTraces, traceDepuisFin, type TraceFin } from "./traces.js";

describe("traces des fins (retouche 5 audit parcours)", () => {
  it("chaque fin laisse une trace datée complète", () => {
    const t = traceDepuisFin(42, "elu", { titre: "Battu aux législatives", victoire: false, tick: 96 }, "2026-09-16");
    expect(t).toEqual({ graine: 42, ambition: "elu", titre: "Battu aux législatives", victoire: false, tick: 96, date: "2026-09-16" });
  });

  it("la même partie ne se trace pas deux fois, une autre fin si", () => {
    const t1 = traceDepuisFin(42, "elu", { titre: "Battu aux législatives", victoire: false, tick: 96 }, "2026-09-16");
    const t2 = traceDepuisFin(42, "elu", { titre: "Battu aux législatives", victoire: false, tick: 96 }, "2026-09-17");
    const t3 = traceDepuisFin(42, "elu", { titre: "Objectif atteint", victoire: true, tick: 140 }, "2026-09-17");
    expect(dedupliquerTraces([t1, t2])).toEqual([t1]);
    expect(ajouterTrace(ajouterTrace([], t1), t2)).toEqual([t1]);
    expect(ajouterTrace(ajouterTrace([], t1), t3)).toEqual([t1, t3]);
  });

  it("résumé lisible : la plus récente d'abord, plafonné à max", () => {
    let traces: TraceFin[] = [];
    for (let n = 0; n < 10; n += 1) {
      traces = ajouterTrace(traces, traceDepuisFin(10 + n, "elu", { titre: `Fin ${n}`, victoire: n === 9, tick: 90 + n }, `2026-09-${(n % 28) + 1}`));
    }
    const resume = resumerTraces(traces, 4);
    expect(resume).toHaveLength(4);
    expect(resume[0]).toContain("Fin 9");
    expect(resume[3]).toContain("Fin 6");
  });
});
