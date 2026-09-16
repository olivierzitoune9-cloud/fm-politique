import { describe, expect, it } from "vitest";
import {
  avancerEffetsDurees,
  appliquerFatigue,
  corruptionExpansion,
  coutPalier,
  creerCarriere,
  gagnerCompetence,
  type Carriere,
  type ConfigCarriere,
} from "./carriere.js";
import { matchingMarqueEnjeu, propagerTerritoires, territoiresInitiaux } from "./courrier.js";
import { estimationRelation, gagnerConnaissance, genererPersonnages, poidsTraits } from "./personnages.js";
import { frappeAdverse, relationsInitialesPartis } from "./partis.js";
import { creerRng } from "./rng.js";
import { LIBELLES_SAISON, saisonDuTick, tickDeDate } from "./temps.js";
import { creerPartie, jouerSemaine, type Partie } from "./partie.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Profond",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: -0.4, ouvertFerme: -0.2 },
  ambition: "elu",
};

describe("J15 : richesse de semaine", () => {
  it("les coûts montent avec le palier, jamais de marche arrière (E4)", () => {
    expect(coutPalier(1).temps).toBe(1);
    expect(coutPalier(3).temps).toBeCloseTo(1.3, 5);
    expect(coutPalier(5).temps).toBeCloseTo(1.6, 5);
  });

  it("l'activité de fond change l'état intérieur et les compétences", () => {
    const p0 = creerPartie(42, CONFIG);
    const p1 = jouerSemaine(p0, { actionId: "tractage-marche", activiteId: "etude" });
    expect(p1.carriere.competences.strategie).toBeGreaterThan(0);
    expect(p1.carriere.competences.terrain).toBeGreaterThan(0);
    const p2 = jouerSemaine(p0, { actionId: "tractage-marche", activiteId: "proches" });
    expect(p2.carriere.etat.moral).toBeGreaterThan(p1.carriere.etat.moral);
  });

  it("la répétition construit la compétence, la fatigue la suit", () => {
    let c: Carriere = creerCarriere(CONFIG, creerRng(5));
    const avant = c.competences.terrain;
    c = gagnerCompetence(c, "terrain");
    expect(c.competences.terrain).toBeGreaterThan(avant);
    // La fatigue se lit sur l'état intérieur : un coup lourd use l'énergie, un coup forcé use le moral.
    const fatigue = appliquerFatigue(creerCarriere(CONFIG, creerRng(5)), 0.6, true);
    expect(fatigue.etat.energie).toBeLessThan(1);
    expect(fatigue.etat.moral).toBeLessThan(0.6);
  });

  it("un carrefour ouvert se tranche à la semaine suivante et laisse une trace", () => {
    const p0 = creerPartie(42, CONFIG);
    const partieAvecCarrefour: Partie = {
      ...p0,
      dilemmeOuvert: {
        id: "dil.test-unit",
        titre: "Le choix de la salle",
        texte: "Deux portes, aucune propre.",
        tick: 1,
        origine: "monde",
        competence: "parole",
        options: [
          { id: "gauche", libelle: "Entrer par la gauche", effets: [{ champ: "soutiens", valeur: 0.04 }], effetsEchec: [] },
          { id: "droite", libelle: "Entrer par la droite", effets: [{ champ: "legitime", valeur: 0.03 }], effetsEchec: [] },
        ],
      },
    };
    const p1 = jouerSemaine(partieAvecCarrefour, {
      actionId: "tractage-marche",
      choixDilemme: { dilemmeId: "dil.test-unit", optionId: "gauche" },
    });
    expect(p1.dilemmeOuvert).toBeNull();
    expect(p1.dilemmesPasses).toContain("dil.test-unit");
    expect(p1.journal.some((j) => j.texte.includes("Le choix de la salle"))).toBe(true);
  });

  it("un choix de dilemme qui ne correspond pas au carrefour ouvert est refusé", () => {
    const p0 = creerPartie(42, CONFIG);
    const partieAvecCarrefour: Partie = {
      ...p0,
      dilemmeOuvert: {
        id: "dil.autre",
        titre: "Autre",
        texte: "x",
        tick: 1,
        origine: "monde",
        competence: "parole",
        options: [{ id: "a", libelle: "A", effets: [], effetsEchec: [] }],
      },
    };
    expect(() =>
      jouerSemaine(partieAvecCarrefour, {
        actionId: "tractage-marche",
        choixDilemme: { dilemmeId: "dil.inconnu", optionId: "a" },
      }),
    ).toThrow(/carrefour/);
  });
});

describe("J16 : effets durables, personnalités, sanction nommée", () => {
  it("un effet durable pèse chaque semaine puis s'éteint à échéance", () => {
    const c0 = creerCarriere(CONFIG, creerRng(5));
    const avec: Carriere = {
      ...c0,
      effetsDurees: [
        { id: "e1", libelle: "Porte fermée", detail: "x", tickFin: 5, risqueHebdo: 0.02, reputationHebdo: -0.01 },
      ],
    };
    const pese = avancerEffetsDurees(avec, 2);
    expect(pese.risqueEnquete).toBeGreaterThan(c0.risqueEnquete);
    expect(pese.effetsDurees).toHaveLength(1);
    const eteint = avancerEffetsDurees(avec, 5);
    expect(eteint.effetsDurees).toHaveLength(0);
  });

  it("les traits pèsent dans les interactions, jamais en blocage", () => {
    const personnages = genererPersonnages(creerRng(12));
    const loyal = { ...personnages[0], traits: ["loyal"] };
    const cynique = { ...personnages[0], traits: ["cynique"] };
    expect(poidsTraits(loyal, 0.5).graviteMemoire).toBeGreaterThan(poidsTraits(cynique, 0.5).graviteMemoire);
    expect(poidsTraits(loyal, 0.5).convaincre).toBeGreaterThan(poidsTraits(cynique, 0.5).convaincre);
    const ambitieux = poidsTraits({ ...personnages[0], traits: ["ambitieux"] }, 0.8);
    expect(ambitieux.convaincre).toBeGreaterThan(0);
  });

  it("croître en soutiens sans organisation convertit la dette en risque (E5)", () => {
    const sain = corruptionExpansion({ soutiens: 0.2, organisation: 0.3, legitime: 0, notoriete: 0, reputation: 0 });
    const fou = corruptionExpansion({ soutiens: 0.6, organisation: 0.05, legitime: 0, notoriete: 0, reputation: 0 });
    expect(sain).toBe(0);
    expect(fou).toBeGreaterThan(0);
    expect(fou).toBeLessThanOrEqual(0.05);
  });
});

describe("J17 : information imparfaite et remontée longue", () => {
  it("la fiche personnage reste en fourchette tant qu'on ne connaît pas la personne", () => {
    const personnages = genererPersonnages(creerRng(21));
    const inconnu = { ...personnages[0], connaissance: 0.1, relation: 0.6 };
    const e1 = estimationRelation(inconnu);
    expect(e1.fiabilite).toBe("vague");
    expect(e1.max - e1.min).toBeGreaterThan(0.5);
    const proche = gagnerConnaissance({ ...inconnu, connaissance: 0.95 }, 0);
    const e2 = estimationRelation(proche);
    expect(e2.fiabilite).toBe("sûre");
    expect(e2.max - e2.min).toBeLessThan(0.15);
  });

  it("les saisons du calendrier réel se sentent", () => {
    expect(saisonDuTick(1)).toBe("Rentrée : tout le monde revient");
    expect(saisonDuTick(tickDeDate(2027, 1, 4))).toBe("Vœux : la saison des promesses");
    expect(saisonDuTick(tickDeDate(2027, 3, 8))).toBe("Campagne présidentielle");
    expect(LIBELLES_SAISON["Campagne présidentielle"]).toContain("présidentielle");
    expect(saisonDuTick(tickDeDate(2027, 5, 3))).toBeNull();
  });

  it("l'investiture tombe en mai 2027 et conditionne la fin élue (F9)", () => {
    const p0 = creerPartie(42, CONFIG);
    const tickInvestiture = tickDeDate(2027, 5, 10);
    const pret: Partie = {
      ...p0,
      tick: tickInvestiture - 1,
      carriere: {
        ...p0.carriere,
        progression: { soutiens: 0.4, legitime: 0.3, organisation: 0.35, notoriete: 0.3, reputation: 0.6 },
      },
      relationsPartis: { ...relationsInitialesPartis(), "parti.modere": 0.2 },
    };
    const p1 = jouerSemaine(pret, { actionId: "tractage-marche" });
    expect(p1.carriere.investiture).toBe("obtenue");
    expect(p1.journal.some((j) => j.texte.includes("Investiture obtenue"))).toBe(true);

    const sansRien: Partie = {
      ...p0,
      tick: tickInvestiture - 1,
      carriere: {
        ...p0.carriere,
        progression: { soutiens: 0.1, legitime: 0.1, organisation: 0.1, notoriete: 0.1, reputation: 0.5 },
      },
    };
    const p2 = jouerSemaine(sansRien, { actionId: "tractage-marche" });
    expect(p2.carriere.investiture).toBe("ratee");
    expect(p2.journal.some((j) => j.texte.includes("Investiture ratée"))).toBe(true);
  });
});

describe("J11 : information incarnée sur la carte", () => {
  it("chaque territoire porte un enjeu dominant visible", () => {
    const territoires = territoiresInitiaux(42);
    expect(territoires).toHaveLength(12);
    const enjeux = new Set(territoires.map((t) => t.enjeu));
    expect(enjeux.size).toBeGreaterThanOrEqual(6);
    for (const t of territoires) expect(t.enjeu.length).toBeGreaterThan(0);
  });

  it("un même discours gagne un territoire et en freine un autre (matching marque-enjeu)", () => {
    const droite = { gaucheDroite: 0.7, ouvertFerme: 0.6 };
    const gauche = { gaucheDroite: -0.7, ouvertFerme: -0.4 };
    expect(matchingMarqueEnjeu(droite, "religion")).toBeGreaterThan(matchingMarqueEnjeu(gauche, "religion"));
    expect(matchingMarqueEnjeu(gauche, "chomage")).toBeGreaterThan(matchingMarqueEnjeu(droite, "chomage"));
    expect(matchingMarqueEnjeu(gauche, "securite")).toBeLessThan(matchingMarqueEnjeu(droite, "securite"));
  });

  it("le matching change réellement l'adoption locale", () => {
    const territoires = territoiresInitiaux(42);
    const fort = propagerTerritoires(territoires, 0.4, 0.3, 0.2, territoires.map(() => 1.4));
    const faible = propagerTerritoires(territoires, 0.4, 0.3, 0.2, territoires.map(() => 0.6));
    expect(fort[0].adoption).toBeGreaterThan(faible[0].adoption);
  });
});

describe("J12 : le monde te répond", () => {
  it("aucune frappe sans notoriété ni hostilité : le monde ne frappe pas gratuitement", () => {
    const territoires = territoiresInitiaux(7);
    const r1 = frappeAdverse(territoires, relationsInitialesPartis(), 0.1, creerRng(5));
    expect(r1.frappes).toHaveLength(0);
    const r2 = frappeAdverse(territoires, relationsInitialesPartis(), 0.9, creerRng(5));
    expect(r2.frappes).toHaveLength(0);
  });

  it("avec notoriété et relation dégradée, un parti frappe le territoire le plus fort", () => {
    const territoires = territoiresInitiaux(7);
    const plusFort = [...territoires].sort((a, b) => b.adoption - a.adoption)[0];
    const relations = { ...relationsInitialesPartis(), "parti.radical": -0.8 };
    let frappe = null as ReturnType<typeof frappeAdverse>["frappes"][number] | null;
    for (let i = 0; i < 40 && frappe === null; i += 1) {
      const r = frappeAdverse(territoires, relations, 0.8, creerRng(i));
      if (r.frappes.length > 0) frappe = r.frappes[0];
    }
    expect(frappe).not.toBeNull();
    expect(frappe?.territoireNom).toBe(plusFort.nom);
    expect(frappe?.deltaAdoption).toBeLessThan(0);
    expect(frappe?.texte).toContain("riposte");
  });
});