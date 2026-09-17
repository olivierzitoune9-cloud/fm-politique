import { describe, expect, it } from "vitest";
import { creerPartie, jouerSemaine } from "./partie.js";
import { lancerMission, piloterMission } from "./missions.js";
import { deserialiser, serialiser } from "./sauvegarde.js";
import type { ConfigCarriere } from "./carriere.js";
const config: ConfigCarriere = { nom: "Missions", origine: "bureau", traits: ["empathique"], ideologie: { gaucheDroite: 0, ouvertFerme: 0 }, ambition: "elu" };
const ordre = { objectif: "recrutement" as const, responsableId: "pers.associative", budget: 0.12 };
describe("P3 missions persistantes", () => {
  it("avance sans recliquer, se sauvegarde et finit sans dépasser le budget", () => {
    const initial = creerPartie(42, config);
    let p = lancerMission(initial, ordre);
    expect(initial.missions).toEqual([]);
    expect(p.missions).toHaveLength(1);
    // Le joueur reste actif sur le terrain pendant que la mission suit son cours.
    for (let i = 0; i < 8; i++) p = jouerSemaine(deserialiser(serialiser(p)), { actionId: "tractage-marche" });
    expect(p.missions[0].statut).not.toBe("en-cours");
    expect(p.missions[0].depense).toBeLessThanOrEqual(ordre.budget + 1e-9);
    expect(p.missions[0].rapports.length).toBeGreaterThan(0);
    expect(p.missions[0].progression).toBeGreaterThan(0);
  });
  it("reprend le contrôle sans perdre l'avancement, pause sans coût puis redélègue", () => {
    const initial = lancerMission(creerPartie(7, config), ordre);
    const id = initial.missions[0].id;
    let p = piloterMission(initial, id, { responsableId: null });
    expect(p.missions[0].responsableId).toBeNull();
    p = piloterMission(p, id, { statut: "pause" });
    const pause = jouerSemaine(p, { actionId: "preparer-silencieux" });
    expect(pause.missions[0].depense).toBe(0);
    expect(pause.missions[0].progression).toBe(0);
    p = piloterMission(pause, id, { statut: "en-cours", responsableId: "pers.elue" });
    expect(jouerSemaine(p, { actionId: "preparer-silencieux" }).missions[0].progression).toBeGreaterThan(0);
  });
  it("refuse consignes invalides, responsable absent et double affectation", () => {
    const p = creerPartie(42, config);
    expect(() => lancerMission(p, { ...ordre, budget: NaN })).toThrow();
    expect(() => lancerMission(p, { ...ordre, responsableId: "absent" })).toThrow();
    expect(() => lancerMission(lancerMission(p, ordre), ordre)).toThrow();
  });
  it("un budget insuffisant suspend sans débiter ni produire de progrès gratuit", () => {
    const p = lancerMission(creerPartie(42, config), { ...ordre, budget: 0 });
    const suite = jouerSemaine(p, { actionId: "preparer-silencieux" });
    expect(suite.missions[0].statut).toBe("pause");
    expect(suite.missions[0].depense).toBe(0);
    expect(suite.missions[0].progression).toBe(0);
  });
});
