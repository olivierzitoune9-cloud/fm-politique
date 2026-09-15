import { describe, expect, it } from "vitest";
import { creerCarriere, type ConfigCarriere } from "./carriere.js";
import { creerPartie, evaluerFins, jouerSemaine, vuePartie, type Partie } from "./partie.js";
import { creerRng } from "./rng.js";
import { tickDeDate } from "./temps.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique", "travailleur"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

const ACTIONS_LOOP = ["tractage-marche", "film-reseaux", "preparer-silencieux", "chercher-coalition", "etiquetage-modere"];

function partir(graine = 42): Partie {
  return creerPartie(graine, CONFIG);
}

describe("partie V1 : semaine par semaine", () => {
  it("création : monde, casting, carrière, avertissement", () => {
    const p = partir();
    expect(p.tick).toBe(0);
    expect(p.personnages.length).toBeGreaterThanOrEqual(13);
    expect(p.fin).toBeNull();
    const vue = vuePartie(p);
    expect(vue.libelleSemaine).toContain("septembre");
    expect(vue.avertissement).toContain("jamais de prédiction");
    expect(vue.groupes.length).toBe(2);
    expect(vue.echeances.length).toBeGreaterThan(0);
  });

  it("jouer une semaine : monde tourne, journal écrit, ressources régénérées, déterminisme", () => {
    const p1 = jouerSemaine(partir(), { actionId: "tractage-marche" });
    expect(p1.tick).toBe(1);
    expect(p1.journal.some((j) => j.texte.includes("Tracter au marché"))).toBe(true);
    expect(p1.carriere.ressources.temps).toBe(1);
    expect(p1.carriere.progression.soutiens).toBeGreaterThan(0.02);
    const p2 = jouerSemaine(partir(), { actionId: "tractage-marche" });
    expect(p1.carriere).toEqual(p2.carriere);
    expect(p1.personnages).toEqual(p2.personnages);
  });

  it("ressources insuffisantes : refus clair sans casser la partie", () => {
    const p1 = jouerSemaine(partir(), { actionId: "creer-cellule" });
    expect(p1.tick).toBe(1);
    const sansArgent = { ...p1, carriere: { ...p1.carriere, ressources: { ...p1.carriere.ressources, argent: 0 } } };
    expect(() => jouerSemaine(sansArgent, { actionId: "creer-cellule" })).toThrow(/argent/);
    const sansTemps = { ...p1, carriere: { ...p1.carriere, ressources: { ...p1.carriere.ressources, temps: 0.1 } } };
    expect(() => jouerSemaine(sansTemps, { actionId: "porte-a-porte" })).toThrow(/temps/);
  });

  it("interaction avec un personnage : mémoire et hook passent par la semaine", () => {
    const p = partir();
    const chercheur = p.personnages.find((x) => x.metier === "chercheur")!;
    const pAmi = {
      ...p,
      personnages: p.personnages.map((x) => (x.id === chercheur.id ? { ...x, relation: 0.9 } : x)),
    };
    const p1 = jouerSemaine(pAmi, {
      actionId: "tractage-marche",
      interaction: { persoId: chercheur.id, interactionId: "demander-coup-de-main" },
    });
    const chercheurApres = p1.personnages.find((x) => x.id === chercheur.id)!;
    expect(chercheurApres.memoire.some((m) => m.type === "dette")).toBe(true);
    expect(p1.journal.some((j) => j.texte.includes(chercheur.prenom))).toBe(true);
  });

  it("deux seeds divergent, même seed rejoue pareil sur 12 semaines", () => {
    const coups = Array.from({ length: 12 }, (_, i) => ({ actionId: ACTIONS_LOOP[i % ACTIONS_LOOP.length] }));
    const a = coups.reduce((p, c) => jouerSemaine(p, c), partir(7));
    const b = coups.reduce((p, c) => jouerSemaine(p, c), partir(7));
    expect(a.carriere).toEqual(b.carriere);
    const c = coups.reduce((p, cc) => jouerSemaine(p, cc), partir(8));
    expect(JSON.stringify(a.monde.groupes)).not.toBe(JSON.stringify(c.monde.groupes));
  });
});

describe("fins et bornes", () => {
  it("fins atteignables par construction", () => {
    const brule = creerCarriere({ ...CONFIG, ambition: "proposition" }, creerRng(1));
    brule.progression.reputation = 0.1;
    expect(evaluerFins(brule, 5)?.id).toBe("brule");
    const enquete = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    enquete.risqueEnquete = 1;
    expect(evaluerFins(enquete, 5)?.id).toBe("sous-enquete");
    const retour = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    retour.progression = { soutiens: 0.1, legitime: 0.05, organisation: 0.1, notoriete: 0.1, reputation: 0.5 };
    expect(evaluerFins(retour, 130)?.id).toBe("retour-ordinaire");
    const t1 = tickDeDate(2027, 6, 6);
    const t2 = tickDeDate(2027, 6, 20);
    const echec = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    echec.progression = { soutiens: 0.1, legitime: 0.05, organisation: 0.1, notoriete: 0.1, reputation: 0.5 };
    expect(evaluerFins(echec, t2)?.id).toBe("echec-echeance");
    const victoire = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    victoire.progression = { soutiens: 0.5, legitime: 0.4, organisation: 0.4, notoriete: 0.3, reputation: 0.6 };
    expect(evaluerFins(victoire, t1)?.id).toBe("elu");
    expect(evaluerFins(victoire, t1 - 1)).toBeNull();
    const marginal = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    marginal.semainesMarginalise = 7;
    marginal.progression = { soutiens: 0.01, legitime: 0.02, organisation: 0.02, notoriete: 0.01, reputation: 0.5 };
    expect(evaluerFins(marginal, 10)?.id).toBe("marginalise");
  });

  it("partie finie : tout coup lève", () => {
    const p0 = partir();
    const p1 = { ...p0, fin: { id: "brule" as const, tick: 3, titre: "Brûlé", detail: "", victoire: false } };
    expect(() => jouerSemaine(p1, { actionId: "tractage-marche" })).toThrow(/terminée/);
  });

  it("aucune absurdité sur 60 semaines de coups variés, bornes respectées", () => {
    let p = partir(99);
    for (let i = 0; i < 60 && p.fin === null; i += 1) {
      p = jouerSemaine(p, { actionId: ACTIONS_LOOP[i % ACTIONS_LOOP.length] });
      const pr = p.carriere.progression;
      for (const v of [pr.soutiens, pr.legitime, pr.organisation, pr.notoriete, pr.reputation, p.carriere.risqueEnquete]) {
        expect(Number.isNaN(v)).toBe(false);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
      for (const g of p.monde.groupes) {
        expect(Number.isNaN(g.identiteActive)).toBe(false);
        expect(g.bascule).toBeLessThanOrEqual(1);
      }
      for (const perso of p.personnages) {
        expect(perso.relation).toBeGreaterThanOrEqual(-1);
        expect(perso.relation).toBeLessThanOrEqual(1);
      }
    }
    expect(p.tick).toBeGreaterThan(0);
  });
});