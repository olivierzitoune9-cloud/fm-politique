// P1 : tests du graphe du monde social. Le graphe dérive des entités réelles (personnages,
// organisations, médias, groupes), le joueur est un nœud, la mémoire de chaque nœud vit en
// fenêtre glissante, la visibilité suit le palier J7.
import { describe, expect, it } from "vitest";
import { ACTIONS_JEU } from "./actions.js";
import type { ConfigCarriere } from "./carriere.js";
import { creerMonde } from "./engine.js";
import { MEDIAS } from "./medias.js";
import {
  carteVisible,
  creerMondeSocial,
  enregistrerEvenement,
  idOrganisation,
  MEMOIRE_LIMITE,
  memoireLisible,
  noeudsVisiblesDuPalier,
  NOEUD_JOUEUR,
  voisins,
  type EvenementSocial,
} from "./monde-social.js";
import { creerPartie, jouerSemaine, vuePartie } from "./partie.js";
import { genererPersonnages } from "./personnages.js";
import { creerRng } from "./rng.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

const persos = genererPersonnages(creerRng(42));
const monde = creerMonde(42);
const ms = creerMondeSocial(persos, monde, 42);

const orgsPartis = persos
  .filter((p) => p.metier === "leader-parti")
  .map((p) => idOrganisation(p.organisation));
const orgSyndicat = idOrganisation(persos.find((p) => p.metier === "syndicaliste")!.organisation);
const orgPatronat = idOrganisation(persos.find((p) => p.metier === "entrepreneur")!.organisation);
const orgAssociatif = idOrganisation(persos.find((p) => p.metier === "figure-associative")!.organisation);
const orgAssemblee = idOrganisation(persos.find((p) => p.metier === "depute")!.organisation);

describe("monde social P1 : construction", () => {
  it("le graphe dérive des entités réelles, joueur compris, sans doublon", () => {
    const personnes = ms.noeuds.filter((n) => n.type === "personne");
    const organisations = ms.noeuds.filter((n) => n.type === "organisation");
    const medias = ms.noeuds.filter((n) => n.type === "media");
    const groupes = ms.noeuds.filter((n) => n.type === "groupe");
    expect(personnes.length).toBe(persos.length + 1); // + le joueur
    expect(organisations.length).toBe(persos.length); // quinze organisations réelles distinctes
    expect(medias.length).toBe(MEDIAS.length);
    expect(groupes.length).toBe(monde.groupes.length);
    expect(new Set(ms.noeuds.map((n) => n.id)).size).toBe(ms.noeuds.length);
    expect(personnes.some((n) => n.id === NOEUD_JOUEUR)).toBe(true);
  });

  it("chaque personne appartient à son organisation réelle, force forte", () => {
    for (const p of persos) {
      const l = ms.liens.find((x) => x.de === p.id && x.type === "appartenance");
      expect(l).toBeDefined();
      expect(l!.vers).toBe(idOrganisation(p.organisation));
      expect(l!.force).toBe(0.8);
    }
  });

  it("les collègues d'une même organisation s'informent entre eux", () => {
    const partages = persos.map((p) =>
      p.id === "pers.chercheur" ? { ...p, organisation: "Université régionale" } : p,
    );
    const ms2 = creerMondeSocial(partages, monde, 42);
    const l = ms2.liens.find(
      (x) =>
        x.type === "information" &&
        ((x.de === "pers.chercheur" && x.vers === "pers.historien") ||
          (x.de === "pers.historien" && x.vers === "pers.chercheur")),
    );
    expect(l).toBeDefined();
    expect(l!.force).toBe(0.3);
  });
});

describe("monde social P1 : influence, médias et relations initiales", () => {
  it("les leaders de partis pèsent sur les groupes, les médias les informent", () => {
    const leaders = persos.filter((p) => p.metier === "leader-parti");
    for (const l of leaders) {
      for (const g of monde.groupes) {
        expect(ms.liens.some((x) => x.de === l.id && x.vers === g.id && x.type === "influence" && x.force === 0.4)).toBe(true);
      }
    }
    for (const m of MEDIAS) {
      for (const g of monde.groupes) {
        expect(ms.liens.some((x) => x.de === m.id && x.vers === g.id && x.type === "information")).toBe(true);
      }
    }
  });

  it("alliances et rivalités initiales entre organisations réelles, datées au tick 0", () => {
    // Trois états-majors, trois rivalités par paires.
    for (let i = 0; i < orgsPartis.length; i += 1) {
      for (let j = i + 1; j < orgsPartis.length; j += 1) {
        const l = ms.liens.find(
          (x) =>
            x.type === "rivalite" &&
            ((x.de === orgsPartis[i] && x.vers === orgsPartis[j]) || (x.de === orgsPartis[j] && x.vers === orgsPartis[i])),
        );
        expect(l).toBeDefined();
      }
    }
    // Syndicat contre patronat, syndicat allié au terrain associatif, chambre liée au courant modéré.
    const paireSyndicatPatronat = ms.liens.find(
      (x) =>
        x.type === "rivalite" &&
        ((x.de === orgSyndicat && x.vers === orgPatronat) || (x.de === orgPatronat && x.vers === orgSyndicat)),
    );
    expect(paireSyndicatPatronat?.force).toBe(0.6);
    const paireSyndicatAssociatif = ms.liens.find(
      (x) =>
        x.type === "alliance" &&
        ((x.de === orgSyndicat && x.vers === orgAssociatif) || (x.de === orgAssociatif && x.vers === orgSyndicat)),
    );
    expect(paireSyndicatAssociatif?.force).toBe(0.5);
    const paireChambre = ms.liens.find((x) => x.type === "alliance" && (x.de === orgAssemblee || x.vers === orgAssemblee));
    expect(paireChambre).toBeDefined();
    // Chaque relation initiale laisse une trace datée dans la mémoire des deux organisations.
    const traces = ms.evenements.filter((e) => e.tick === 0 && e.type === "relation-initiale");
    expect(traces.length).toBeGreaterThanOrEqual(orgsPartis.length * 2);
    expect(memoireLisible(ms, orgSyndicat).some((e) => e.tick === 0 && e.type === "relation-initiale")).toBe(true);
  });

  it("le nœud du joueur porte le nom de la configuration", () => {
    const partie = creerPartie(42, CONFIG);
    const joueur = partie.mondeSocial.noeuds.find((n) => n.id === NOEUD_JOUEUR);
    expect(joueur?.nom).toBe("Test Personne");
  });

  it("la construction est déterministe à graine égale", () => {
    const ms2 = creerMondeSocial(genererPersonnages(creerRng(42)), creerMonde(42), 42);
    expect(JSON.stringify(ms2)).toBe(JSON.stringify(ms));
    const a = creerPartie(42, CONFIG);
    const b = creerPartie(42, CONFIG);
    expect(JSON.stringify(a.mondeSocial)).toBe(JSON.stringify(b.mondeSocial));
  });
});

describe("monde social P1 : mémoire fenêtrée", () => {
  it("un nœud ne garde que ses MEMOIRE_LIMITE événements les plus récents", () => {
    let ms2 = ms;
    const total = MEMOIRE_LIMITE + 5;
    for (let i = 0; i < total; i += 1) {
      const e: EvenementSocial = { tick: i + 1, noeudId: NOEUD_JOUEUR, type: "decisions", texte: `Semaine ${i + 1}.` };
      ms2 = enregistrerEvenement(ms2, e);
    }
    const memoire = memoireLisible(ms2, NOEUD_JOUEUR);
    expect(memoire.length).toBe(MEMOIRE_LIMITE);
    expect(memoire[0].tick).toBe(total); // les plus récents d'abord
    expect(memoire[memoire.length - 1].tick).toBe(total - MEMOIRE_LIMITE + 1); // les vieux sortent
    // Les autres nœuds gardent leur mémoire intacte (relations initiales du tick 0).
    expect(memoireLisible(ms2, orgSyndicat).every((e) => e.tick === 0)).toBe(true);
  });

  it("memoireLisible lit en chronologie inversée", () => {
    let ms2 = enregistrerEvenement(ms, { tick: 3, noeudId: "pers.journaliste", type: "rencontre", texte: "trois" });
    ms2 = enregistrerEvenement(ms2, { tick: 7, noeudId: "pers.journaliste", type: "rencontre", texte: "sept" });
    const memoire = memoireLisible(ms2, "pers.journaliste");
    expect(memoire.map((e) => e.tick)).toEqual([7, 3]);
  });

  it("voisins : la personne touche son organisation, le média touche les groupes", () => {
    const v1 = voisins(ms, persos[0].id);
    expect(v1.some((n) => n.id === idOrganisation(persos[0].organisation))).toBe(true);
    const v2 = voisins(ms, MEDIAS[0].id);
    expect(monde.groupes.every((g) => v2.some((n) => n.id === g.id))).toBe(true);
  });
});

describe("monde social P1 : visibilité par palier", () => {
  it("carteVisible : sous-graphe induit, lien seulement si les deux bouts sont visibles", () => {
    const vue1 = carteVisible(ms, [NOEUD_JOUEUR]);
    expect(vue1.noeuds.length).toBe(1);
    expect(vue1.liens.length).toBe(0);
    const ids = [NOEUD_JOUEUR, ...monde.groupes.map((g) => g.id), MEDIAS[0].id];
    const vue2 = carteVisible(ms, ids);
    expect(vue2.noeuds.length).toBe(ids.length);
    expect(vue2.liens.every((l) => ids.includes(l.de) && ids.includes(l.vers))).toBe(true);
    expect(vue2.liens.length).toBe(monde.groupes.length); // le média visible vers chaque groupe
  });

  it("palier 1 : proximité seulement, sans les états-majors ; palier 2 : tout le graphe", () => {
    const visibles1 = noeudsVisiblesDuPalier(
      ms,
      1,
      persos.filter((p) => p.metier === "elu-local").map((p) => p.id),
      [MEDIAS[0].id],
    );
    const ids1 = new Set(visibles1);
    expect(ids1.has(NOEUD_JOUEUR)).toBe(true);
    expect(ids1.has("pers.elue")).toBe(true);
    expect(ids1.has(idOrganisation("Conseil municipal"))).toBe(true);
    expect(ids1.has(orgsPartis[0])).toBe(false); // un état-major invisible au palier 1
    expect(ids1.has("pers.leader-radical")).toBe(false);
    const visibles2 = noeudsVisiblesDuPalier(ms, 2, [], []);
    expect(visibles2.length).toBe(ms.noeuds.length);
  });

  it("la vue de partie expose la carte pilotée par le palier", () => {
    const vue = vuePartie(creerPartie(42, CONFIG));
    expect(vue.carte.noeuds.some((n) => n.id === NOEUD_JOUEUR)).toBe(true);
    expect(vue.carte.noeuds.length).toBeLessThan(ms.noeuds.length); // employé = palier 1, vue réduite
  });
});

describe("monde social P1 : branché dans la semaine", () => {
  it("un coup média laisse une trace chez le joueur et dans la mémoire du média", () => {
    const actionMedia = ACTIONS_JEU.find((a) => a.categorie === "media");
    expect(actionMedia).toBeDefined();
    const jouee = jouerSemaine(creerPartie(7, CONFIG), {
      actionId: actionMedia!.id,
      mediaId: "med.quotidien-regional",
    });
    const chezJoueur = memoireLisible(jouee.mondeSocial, NOEUD_JOUEUR);
    expect(chezJoueur[0].type).toBe("decisions");
    expect(chezJoueur[0].tick).toBe(1);
    const chezMedia = memoireLisible(jouee.mondeSocial, "med.quotidien-regional");
    expect(chezMedia[0].type).toBe("passage-media");
    expect(chezMedia[0].tick).toBe(1);
  });

  it("une interaction humaine entre dans la mémoire du personnage et de son organisation", () => {
    const jouee = jouerSemaine(creerPartie(7, CONFIG), {
      actionId: ACTIONS_JEU[0].id,
      interaction: { persoId: "pers.chercheur", interactionId: "convaincre" },
    });
    const chezPerso = memoireLisible(jouee.mondeSocial, "pers.chercheur");
    expect(chezPerso[0].type).toBe("rencontre");
    expect(chezPerso[0].tick).toBe(1);
    const orgChercheur = idOrganisation(persos.find((p) => p.id === "pers.chercheur")!.organisation);
    const chezOrg = memoireLisible(jouee.mondeSocial, orgChercheur);
    expect(chezOrg.some((e) => e.tick === 1 && e.type === "rencontre")).toBe(true);
  });

  it("les bascules du moteur entrent en mémoire des groupes quand elles ont lieu", () => {
    const jouee = jouerSemaine(creerPartie(11, CONFIG), { actionId: ACTIONS_JEU[0].id });
    for (const ev of jouee.monde.evenements.filter((e) => e.tick === 1)) {
      const chezGroupe = memoireLisible(jouee.mondeSocial, ev.groupeId);
      expect(chezGroupe.some((e) => e.tick === 1 && e.type === "evenement-monde")).toBe(true);
    }
  });
});