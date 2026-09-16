// Trace des fins de carrière : aucune défaite ni victoire ne disparaît en silence.
// Retouche 5 de l'audit parcours joueur du 2026-09-16 : la SPEC veut des chaînes causales
// reconstructibles, donc chaque fin laisse une trace datée, regroupable par graine, rejouable.
// Module pur : la page de partie tient le stockage local, ici on ne touche qu'aux données.
export interface TraceFin {
  graine: number;
  ambition: string;
  titre: string;
  victoire: boolean;
  tick: number;
  date: string;
}

export function traceDepuisFin(
  graine: number,
  ambition: string,
  fin: { titre: string; victoire: boolean; tick: number },
  date: string,
): TraceFin {
  return { graine, ambition, titre: fin.titre, victoire: fin.victoire, tick: fin.tick, date };
}

// Une même partie ne trace pas deux fois la même fin : déduplication sur graine, tick et titre.
export function dedupliquerTraces(traces: TraceFin[]): TraceFin[] {
  const vues = new Set<string>();
  return traces.filter((t) => {
    const cle = `${t.graine}|${t.tick}|${t.titre}`;
    if (vues.has(cle)) return false;
    vues.add(cle);
    return true;
  });
}

export function ajouterTrace(traces: TraceFin[], trace: TraceFin): TraceFin[] {
  return dedupliquerTraces([...traces, trace]);
}

// Lecture humaine : les trajectoires déjà tentées, la plus récente d'abord, plafonnées.
export function resumerTraces(traces: TraceFin[], max: number = 8): string[] {
  return [...traces]
    .reverse()
    .slice(0, max)
    .map((t) => `${t.date} : graine ${t.graine}, ${t.titre}, semaine ${t.tick}.`);
}
