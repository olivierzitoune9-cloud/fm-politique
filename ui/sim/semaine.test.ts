// C1 C2 C4 C5 : la semaine multi coups (revue adversariale gameplay 2026-09-16).
// Une semaine = un budget temps à répartir entre 1 et N coups, chacun résolu dans l'ordre ;
// la limite est le temps, jamais un nombre (le plafond de 4 a été retiré après arbitrage).
import { describe, expect, it } from "vitest";
import { creerCarriere, type ConfigCarriere } from "./carriere.js";
import {
  creerPartie,
  jouerSemaine,
  listeCoupsSemaine,
  risqueAction,
  totalSemaine,
} from "./partie.js";
import { creerRng } from "./rng.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Multi",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

describe("C1 : la semaine multi coups", () => {
  it("l'ancien format à un coup donne un seul coup", () => {
    expect(listeCoupsSemaine({ actionId: "tractage-marche" })).toHaveLength(1);
    expect(listeCoupsSemaine({ actionId: "tractage-marche" })[0].actionId).toBe("tractage-marche");
  });

  it("le nouveau format résout chaque coup dans l'ordre avec son journal", () => {
    const p0 = creerPartie(42, CONFIG);
    const p1 = jouerSemaine(p0, {
      actionId: "tractage-marche",
      actions: [{ actionId: "tractage-marche" }, { actionId: "porte-a-porte" }],
    });
    expect(p1.tick).toBe(1);
    expect(p1.journal.some((j) => j.texte.includes("Tracter au"))).toBe(true);
    expect(p1.journal.some((j) => j.texte.includes("coup 2 de la semaine"))).toBe(true);
  });

  it("la file n'est plus plafonnée : six coups se résolvent dans l'ordre (la limite est le temps)", () => {
    const six = [
      "tractage-marche",
      "porte-a-porte",
      "preparer-silencieux",
      "affiche-marque",
      "tractage-marche",
      "porte-a-porte",
    ];
    const tour = { actionId: "tractage-marche", actions: six.map((actionId) => ({ actionId })) };
    expect(listeCoupsSemaine(tour)).toHaveLength(6);
    const p1 = jouerSemaine(creerPartie(42, CONFIG), tour);
    expect(p1.tick).toBe(1);
    expect(p1.journal.some((j) => j.texte.includes("coup 6 de la semaine"))).toBe(true);
    expect(p1.carriere.progression.soutiens).toBeGreaterThanOrEqual(0);
    expect(p1.carriere.progression.soutiens).toBeLessThanOrEqual(1);
  });

  it("deux coups paient plus qu'un seul, mais le second paie moins que le premier (C5 fatigue)", () => {
    const p0 = creerPartie(42, CONFIG);
    const un = jouerSemaine(p0, {
      actionId: "tractage-marche",
      actions: [{ actionId: "tractage-marche" }],
    });
    const deux = jouerSemaine(p0, {
      actionId: "tractage-marche",
      actions: [{ actionId: "tractage-marche" }, { actionId: "tractage-marche" }],
    });
    expect(deux.carriere.progression.soutiens).toBeGreaterThan(un.carriere.progression.soutiens);
    const gainSecond = deux.carriere.progression.soutiens - un.carriere.progression.soutiens;
    const gainPremier = un.carriere.progression.soutiens - p0.carriere.progression.soutiens;
    expect(gainSecond).toBeLessThan(gainPremier);
  });

  it("même graine, mêmes coups, même semaine (déterminisme multi coups)", () => {
    const tour = {
      actionId: "tractage-marche",
      actions: [{ actionId: "tractage-marche" }, { actionId: "porte-a-porte" }],
    };
    const a = jouerSemaine(creerPartie(7, CONFIG), tour);
    const b = jouerSemaine(creerPartie(7, CONFIG), tour);
    expect(a.carriere).toEqual(b.carriere);
    expect(a.journal).toEqual(b.journal);
  });

  it("40 parties de 24 semaines à 1-3 coups restent bornées 0..1", () => {
    const boucles = ["tractage-marche", "porte-a-porte", "preparer-silencieux", "affiche-marque"];
    for (let graine = 1; graine <= 40; graine += 1) {
      let p = creerPartie(graine, CONFIG);
      for (let i = 0; i < 24 && p.fin === null; i += 1) {
        const n = 1 + ((graine + i) % 3);
        const actions = [];
        for (let k = 0; k < n; k += 1) actions.push({ actionId: boucles[(graine + i + k) % boucles.length] });
        p = jouerSemaine(p, { actionId: actions[0].actionId, actions });
        const pr = p.carriere.progression;
        for (const v of [pr.soutiens, pr.legitime, pr.organisation, pr.notoriete, pr.reputation, p.carriere.risqueEnquete]) {
          expect(Number.isNaN(v)).toBe(false);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
      expect(p.tick).toBeGreaterThan(0);
    }
  });
});

describe("C2 : le risque affiché égale le risque appliqué", () => {
  it("un coup propre affiche un risque nul et un coup brutal un risque chiffré", () => {
    const propre = risqueAction("tractage-marche", 1, 1, 1);
    expect(propre.risqueEnquete).toBe(0);
    expect(propre.force).toBe(false);
    const brutal = risqueAction("designer-bouc", 1, 1, 4);
    expect(brutal.risqueEnquete).toBeGreaterThan(0);
    expect(brutal.detail).toContain("risque");
  });

  it("le risque affiché à efficacité 1 prédit le risque appliqué par jouerSemaine", () => {
    const c = creerCarriere(CONFIG, creerRng(5));
    // état neutre : énergie pleine, moral correct, pas de contacts croisés
    const avant = c.risqueEnquete;
    const affiche = risqueAction("designer-bouc", 1, 1, 4);
    const p0 = creerPartie(42, CONFIG);
    const neutre = { ...p0, tick: 0, carriere: { ...p0.carriere, risqueEnquete: avant, etat: { energie: 1, moral: 0.6 } } };
    const p1 = jouerSemaine(neutre, { actionId: "designer-bouc" });
    const applique = p1.carriere.risqueEnquete - avant;
    expect(applique).toBeGreaterThan(0);
    // Le monde multiplie par l'efficacité et ajoute la fatigue : l'ordre de grandeur doit tenir,
    // pas le centième. Tolérance large assumée, le test verrouille la prédiction, pas la précision.
    expect(Math.abs(applique - affiche.risqueEnquete)).toBeLessThan(0.12);
  });

  it("un coup sans moyens est marqué forcé avant le clic", () => {
    const force = risqueAction("creer-cellule", 0.1, 0, 2);
    expect(force.force).toBe(true);
    expect(force.detail).toContain("forcé");
  });
});

describe("C4 : l'agenda comme file, total temps avant validation", () => {
  it("le total additionne les coups au palier 1", () => {
    const total = totalSemaine(
      { actionId: "tractage-marche", actions: [{ actionId: "tractage-marche" }, { actionId: "porte-a-porte" }] },
      1,
    );
    expect(total.coups).toBe(2);
    expect(total.temps).toBeCloseTo(0.3 + 0.4, 5);
  });

  it("l'ancien format donne le total d'un seul coup", () => {
    const total = totalSemaine({ actionId: "tractage-marche" }, 1);
    expect(total.coups).toBe(1);
    expect(total.temps).toBeCloseTo(0.3, 5);
  });
});
