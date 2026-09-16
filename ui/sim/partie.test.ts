import { describe, expect, it } from "vitest";
import { creerCarriere, LIBELLES_ORIGINE, palierDeStatut, type ConfigCarriere } from "./carriere.js";
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
  it("création : monde, casting, carrière, avertissement, carte douze territoires", () => {
    const p = partir();
    expect(p.tick).toBe(0);
    expect(p.personnages.length).toBeGreaterThanOrEqual(13);
    expect(p.fin).toBeNull();
    expect(p.territoires).toHaveLength(12);
    const vue = vuePartie(p);
    expect(vue.libelleSemaine).toContain("septembre");
    expect(vue.avertissement).toContain("jamais de prédiction");
    expect(vue.groupes.length).toBe(2);
    expect(vue.territoires).toHaveLength(12);
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

  it("ressources insuffisantes : plus de blocage, sanction par dette et journal (R7 J8)", () => {
    const p1 = jouerSemaine(partir(), { actionId: "creer-cellule" });
    expect(p1.tick).toBe(1);
    const sansArgent = { ...p1, carriere: { ...p1.carriere, ressources: { ...p1.carriere.ressources, argent: 0 } } };
    const forcee = jouerSemaine(sansArgent, { actionId: "creer-cellule" });
    expect(forcee.tick).toBe(2);
    expect(forcee.journal.some((j) => j.texte.includes("forcé"))).toBe(true);
    expect(forcee.carriere.risqueEnquete).toBeGreaterThan(sansArgent.carriere.risqueEnquete);
    const sansTemps = { ...p1, carriere: { ...p1.carriere, ressources: { ...p1.carriere.ressources, temps: 0.1 } } };
    const baclee = jouerSemaine(sansTemps, { actionId: "porte-a-porte" });
    expect(baclee.journal.some((j) => j.texte.includes("forcé"))).toBe(true);
  });

  it("J7 : palier 1 ne voit ni partis rivaux ni médias nationaux ni états-majors", () => {
    const vue = vuePartie(partir());
    expect(vue.palier).toBe(1);
    expect(vue.partisVisibles).toBe(false);
    expect(vue.manoeuvresVisibles).toHaveLength(0);
    expect(vue.mediasVisibles).toHaveLength(1);
    expect(vue.personnagesVisibles.every((p) => p.metier !== "leader-parti" && p.metier !== "depute")).toBe(true);
    expect(vue.personnagesVisibles.length).toBeGreaterThan(0);
  });

  it("J10 R2 : l'origine porte un libellé de métier distinct du statut, palier neutre", () => {
    expect(palierDeStatut("employe")).toBe(1);
    expect(LIBELLES_ORIGINE["enseignant"]).toContain("Enseignant");
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
    expect(evaluerFins(retour, tickDeDate(2032, 4, 2))?.id).toBe("retour-ordinaire");
    const t1 = tickDeDate(2027, 6, 6);
    const t2 = tickDeDate(2027, 6, 20);
    const echec = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    echec.progression = { soutiens: 0.1, legitime: 0.05, organisation: 0.1, notoriete: 0.1, reputation: 0.5 };
    expect(evaluerFins(echec, t2)?.id).toBe("echec-echeance");
    const victoire = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    victoire.progression = { soutiens: 0.5, legitime: 0.4, organisation: 0.4, notoriete: 0.3, reputation: 0.6 };
    // F9 (J17) : sans investiture, pas de banc. L'option tardive dépend des paliers précédents.
    victoire.investiture = "obtenue";
    expect(evaluerFins(victoire, t1)?.id).toBe("elu");
    expect(evaluerFins(victoire, t1 - 1)).toBeNull();
    const sansInvestiture = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    sansInvestiture.progression = { soutiens: 0.5, legitime: 0.4, organisation: 0.4, notoriete: 0.3, reputation: 0.6 };
    sansInvestiture.investiture = "ratee";
    expect(evaluerFins(sansInvestiture, t1)?.id).toBe("investiture-ratee");
    expect(evaluerFins(sansInvestiture, t1)?.victoire).toBe(false);
    const marginal = creerCarriere({ ...CONFIG, ambition: "elu" }, creerRng(1));
    marginal.semainesMarginalise = 7;
    marginal.progression = { soutiens: 0.01, legitime: 0.02, organisation: 0.02, notoriete: 0.01, reputation: 0.5 };
    expect(evaluerFins(marginal, 10)?.id).toBe("marginalise");
    const maire = creerCarriere({ ...CONFIG, ambition: "maire" }, creerRng(1));
    maire.progression = { soutiens: 0.55, legitime: 0.45, organisation: 0.4, notoriete: 0.3, reputation: 0.6 };
    expect(evaluerFins(maire, tickDeDate(2032, 3, 14))?.id).toBe("elu");
    const europeen = creerCarriere({ ...CONFIG, ambition: "europeen" }, creerRng(1));
    europeen.progression = { soutiens: 0.5, legitime: 0.4, organisation: 0.4, notoriete: 0.3, reputation: 0.6 };
    expect(evaluerFins(europeen, tickDeDate(2029, 6, 10))?.id).toBe("elu");
  });

  it("partie finie : tout coup lève", () => {
    const p0 = partir();
    const p1 = { ...p0, fin: { id: "brule" as const, tick: 3, titre: "Brûlé", detail: "", victoire: false } };
    expect(() => jouerSemaine(p1, { actionId: "tractage-marche" })).toThrow(/terminée/);
  });

  it("J5 : 40 parties de 24 semaines restent bornées avec carte et sanctions", () => {
    const boucles = ["tractage-marche", "porte-a-porte", "preparer-silencieux", "chercher-coalition", "film-reseaux"];
    for (let graine = 1; graine <= 40; graine += 1) {
      let p = creerPartie(graine, CONFIG);
      for (let i = 0; i < 24 && p.fin === null; i += 1) {
        p = jouerSemaine(p, { actionId: boucles[(graine + i) % boucles.length] });
        const pr = p.carriere.progression;
        for (const v of [pr.soutiens, pr.legitime, pr.organisation, pr.notoriete, pr.reputation, p.carriere.risqueEnquete]) {
          expect(Number.isNaN(v)).toBe(false);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
        expect(p.territoires).toHaveLength(12);
      }
      expect(p.tick).toBeGreaterThan(0);
    }
  });
});