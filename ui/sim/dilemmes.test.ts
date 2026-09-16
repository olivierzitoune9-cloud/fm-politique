import { describe, expect, it } from "vitest";
import { creerCarriere, type ConfigCarriere } from "./carriere.js";
import { genererDilemmes, promesseDepuisDilemme, resoudreDilemme, type Dilemme } from "./dilemmes.js";
import { creerMonde } from "./engine.js";
import { genererPersonnages } from "./personnages.js";
import { creerRng } from "./rng.js";
import { tickDeDate } from "./temps.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Dilemme",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

function carriere(): ReturnType<typeof creerCarriere> {
  return creerCarriere(CONFIG, creerRng(7));
}

describe("dilemmes : carrefours nés du monde, jamais d'un aléa gratuit", () => {
  it("aucun dilemme sans condition remplie au départ", () => {
    const monde = creerMonde(42);
    const c = carriere();
    const personnages = genererPersonnages(creerRng(42));
    expect(genererDilemmes(1, monde, c, personnages, [])).toHaveLength(0);
  });

  it("la bascule normative fait naître le dilemme de la peur, une seule fois", () => {
    const base = creerMonde(11);
    // On injecte l'événement plutôt que de le chercher au hasard : le test doit rester déterministe.
    const monde: typeof base = {
      ...base,
      tick: 12,
      evenements: [
        ...base.evenements,
        { tick: 12, type: "bascule-normative", groupeId: "grp.centre", cause: "test", valeur: 0.6 },
      ],
    };
    const personnages = genererPersonnages(creerRng(11));
    const c = carriere();
    const dilemmes = genererDilemmes(13, monde, c, personnages, []);
    expect(dilemmes.map((d) => d.id)).toContain("dil.bascule");
    const apres = genererDilemmes(13, monde, c, personnages, ["dil.bascule"]);
    expect(apres.map((d) => d.id)).not.toContain("dil.bascule");
  });
});

describe("dilemmes : résolution pondérée et sanction nommée", () => {
  const dilemme: Dilemme = {
    id: "dil.test",
    titre: "Dilemme de test",
    texte: "Deux voies, aucune propre.",
    tick: 10,
    origine: "monde",
    persoId: "pers.journaliste",
    competence: "medias",
    options: [
      {
        id: "a",
        libelle: "Voie A",
        effets: [{ champ: "notoriete", valeur: 0.05 }],
        effetsEchec: [{ champ: "reputation", valeur: -0.04 }],
      },
      {
        id: "b",
        libelle: "Voie B",
        effets: [{ champ: "legitime", valeur: 0.03 }],
        effetsEchec: [],
      },
    ],
  };

  it("un choix produit un texte qualitatif et un delta borné, jamais un chiffre affiché", () => {
    const personnages = genererPersonnages(creerRng(3));
    const c = carriere();
    const perso = personnages.find((p) => p.id === "pers.journaliste");
    const r = resoudreDilemme(dilemme, "a", c, perso, 10, creerRng(99));
    expect(r.texteChoix).toContain("Dilemme de test");
    expect(r.texteChoix).not.toMatch(/0\.\d/);
    const valeurs = Object.values(r.delta) as number[];
    for (const v of valeurs) expect(Math.abs(v)).toBeLessThanOrEqual(0.08);
  });

  it("la compétence augmente la probabilité de réussite sur un grand nombre de tirages", () => {
    const personnages = genererPersonnages(creerRng(3));
    const perso = personnages.find((p) => p.id === "pers.journaliste");
    const faible = carriere();
    const fort = { ...carriere(), competences: { ...carriere().competences, medias: 1 } };
    let reussisFaible = 0;
    let reussisFort = 0;
    for (let i = 0; i < 200; i += 1) {
      if (!resoudreDilemme(dilemme, "a", faible, perso, 10, creerRng(i)).delta.reputation) reussisFaible += 1;
      if (!resoudreDilemme(dilemme, "a", fort, perso, 10, creerRng(i)).delta.reputation) reussisFort += 1;
    }
    expect(reussisFort).toBeGreaterThan(reussisFaible);
  });

  it("un échec laisse un effet durable nommé, jamais un delta invisible", () => {
    const personnages = genererPersonnages(creerRng(3));
    const perso = personnages.find((p) => p.id === "pers.journaliste");
    let trouve = false;
    for (let i = 0; i < 60 && !trouve; i += 1) {
      const r = resoudreDilemme(dilemme, "a", carriere(), perso, 10, creerRng(i));
      if (r.effetDurable !== null) {
        expect(r.effetDurable.libelle).toContain("Porte entrouverte fermée chez");
        expect(r.effetDurable.tickFin).toBe(20);
        trouve = true;
      }
    }
    expect(trouve).toBe(true);
  });

  it("les vœux de janvier peuvent contracter une promesse à échéance", () => {
    const voeux: Dilemme = { ...dilemme, id: "dil.voeux", tick: tickDeDate(2027, 1, 4) };
    const p = promesseDepuisDilemme(voeux, "gros", "pers.journaliste", voeux.tick);
    expect(p).not.toBeNull();
    expect(p?.tickEcheance).toBe(voeux.tick + 10);
    expect(promesseDepuisDilemme(voeux, "prudent", "pers.journaliste", voeux.tick)).toBeNull();
  });
});