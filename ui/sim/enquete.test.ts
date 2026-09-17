// P2 : tests de la boucle d'enquête. Dossiers reliés au graphe, recherche interne, signaux
// faibles, courrier d'enquête. Tout est dérivé du monde social, jamais inventé.
import { describe, expect, it } from "vitest";
import type { ConfigCarriere } from "./carriere.js";
import { courrierEnquete, lireDossier, ouvrirDossier, rechercherSujets, signalFaibles, type PartieEnquete } from "./enquete.js";
import { enregistrerEvenement, idOrganisation, NOEUD_JOUEUR } from "./monde-social.js";
import { creerPartie, jouerSemaine } from "./partie.js";
import { genererPersonnages } from "./personnages.js";
import { creerRng } from "./rng.js";
import { deserialiser, serialiser } from "./sauvegarde.js";

const CONFIG: ConfigCarriere = {
  nom: "Test Personne",
  origine: "bureau",
  traits: ["empathique"],
  ideologie: { gaucheDroite: 0, ouvertFerme: 0 },
  ambition: "elu",
};

const persos = genererPersonnages(creerRng(42));
const partie0 = creerPartie(42, CONFIG);
const vue: PartieEnquete = partie0; // Partie satisfait PartieEnquete structurellement

describe("enquête P2 : dossiers", () => {
  it("ouvrir un dossier dédoublonne et persiste dans la partie", () => {
    const d1 = ouvrirDossier(partie0, "pers.chercheur", 0);
    expect(d1.dossiers).toHaveLength(1);
    expect(d1.dossiers[0].sujetId).toBe("pers.chercheur");
    const d2 = ouvrirDossier(d1, "pers.chercheur", 3);
    expect(d2.dossiers).toHaveLength(1);
    expect(d2.dossiers[0].tickOuverture).toBe(0);
    expect(() => ouvrirDossier(partie0, "nul.partout", 0)).toThrow(/Sujet inconnu/);
    // L'aller-retour de sauvegarde conserve les dossiers.
    const charge = deserialiser(serialiser(ouvrirDossier(partie0, "pers.chercheur", 2)));
    expect(charge.dossiers[0].sujetId).toBe("pers.chercheur");
  });

  it("une fiche visible porte faits datés, liens du graphe et ouverture", () => {
    let p = ouvrirDossier(partie0, "pers.chercheur", 0);
    p = jouerSemaine(p, {
      actionId: "tractage-marche",
      interaction: { persoId: "pers.chercheur", interactionId: "convaincre" },
    });
    const fiche = lireDossier(p, "pers.chercheur", p.personnages);
    expect(fiche).not.toBeNull();
    expect(fiche!.complet).toBe(true);
    expect(fiche!.tickOuverture).toBe(0);
    expect(fiche!.faits[0].tick).toBe(1);
    expect(fiche!.faits[0].source.length).toBeGreaterThan(0);
    // Les liens viennent du graphe : son organisation au moins.
    expect(
      fiche!.liens.some((l) => l.id === idOrganisation(persos.find((x) => x.id === "pers.chercheur")!.organisation)),
    ).toBe(true);
    expect(fiche!.liens.some((l) => l.type === "appartenance")).toBe(true);
  });

  it("une fiche hors de portée reste mince : nom seul, ni faits ni liens", () => {
    const fiche = lireDossier(partie0, "pers.leader-radical", partie0.personnages);
    expect(fiche).not.toBeNull();
    expect(fiche!.complet).toBe(false);
    expect(fiche!.faits).toEqual([]);
    expect(fiche!.liens).toEqual([]);
    expect(fiche!.note).not.toBeNull();
    // Un sujet visible mais jamais ouvert porte bien ses faits quand même.
    const jamais = lireDossier(partie0, "pers.elue", partie0.personnages);
    expect(jamais!.complet).toBe(true);
    expect(jamais!.tickOuverture).toBeNull();
  });
});

describe("enquête P2 : recherche interne", () => {
  it("deux lettres minimum, correspondances par nom, organisation et métier", () => {
    expect(rechercherSujets(vue, partie0.personnages, "c").length).toBe(0);
    expect(rechercherSujets(vue, partie0.personnages, "   ").length).toBe(0);
    const parMetier = rechercherSujets(vue, partie0.personnages, "syndicaliste");
    expect(parMetier.some((r) => r.id === "pers.syndicaliste")).toBe(true);
    const parOrg = rechercherSujets(vue, partie0.personnages, "préfecture");
    expect(parOrg.some((r) => r.id === idOrganisation("Préfecture"))).toBe(true);
    expect(parOrg[0].type).toBe("organisation");
    // Le joueur se trouve par son nom de configuration.
    const parNom = rechercherSujets(vue, partie0.personnages, "Test Personne");
    expect(parNom.some((r) => r.id === NOEUD_JOUEUR)).toBe(true);
  });

  it("la visibilité des résultats suit le palier, jamais la fiche", () => {
    const res = rechercherSujets(vue, partie0.personnages, "leader");
    expect(res.length).toBeGreaterThan(0);
    for (const r of res) expect(r.visible).toBe(false); // employé = palier 1, états-majors invisibles
    const proche = rechercherSujets(vue, partie0.personnages, "Conseil municipal");
    expect(proche.some((r) => r.visible)).toBe(true);
  });
});

describe("enquête P2 : signaux faibles et courrier", () => {
  it("un événement récent hors carte est un signal, un événement visible ou ancien n'en est pas un", () => {
    let p = creerPartie(42, CONFIG);
    // Un leader bouge (hors carte au palier 1) cette semaine.
    p = jouerSemaine(p, {
      actionId: "tractage-marche",
      interaction: { persoId: "pers.leader-radical", interactionId: "convaincre" },
    });
    const signaux = signalFaibles(p, p.personnages);
    const orgLeader = idOrganisation(persos.find((x) => x.id === "pers.leader-radical")!.organisation);
    const ids = signaux.map((s) => s.sujetId);
    // Le personnage ou son organisation a reçu un fait au tick 1 : un signal doit le pointer.
    const touches = ids.some((id) => id === "pers.leader-radical" || id === orgLeader);
    expect(touches).toBe(true);
    // Un événement vieux de plus de HORIZON_SIGNAL sort de l'horizon.
    const vieux = enregistrerEvenement(p.mondeSocial, {
      tick: p.tick - 20,
      noeudId: "pers.fonctionnaire",
      type: "rencontre",
      texte: "vieux souvenir",
    });
    const signauxVieux = signalFaibles({ ...p, mondeSocial: vieux }, p.personnages);
    expect(signauxVieux.some((s) => s.sujetId === "pers.fonctionnaire" && s.dernierTick === p.tick - 20)).toBe(false);
  });

  it("le courrier d'enquête relie les faits récents des nœuds visibles à leur dossier", () => {
    const p = jouerSemaine(partie0, {
      actionId: "tractage-marche",
      interaction: { persoId: "pers.chercheur", interactionId: "convaincre" },
    });
    const courriels = courrierEnquete(p, p.personnages);
    expect(courriels.length).toBeGreaterThan(0);
    expect(courriels[0].tick).toBe(1);
    expect(courriels.some((c) => c.sujetId === "pers.chercheur")).toBe(true);
    // Chaque courriel pointe vers un dossier ouvrable.
    const viaCourriel = ouvrirDossier(p, courriels[0].sujetId, p.tick);
    expect(viaCourriel.dossiers.length).toBeGreaterThan(0);
  });
  it("huit semaines de signaux : bornes, groupes exclus et aucun événement futur", () => {
    const evenements = [
      { tick: 13, noeudId: "pers.leader-radical", type: "rencontre", texte: "borne incluse" },
      { tick: 12, noeudId: "pers.leader-modere", type: "rencontre", texte: "trop ancien" },
      { tick: 21, noeudId: "pers.leader-syndical", type: "rencontre", texte: "futur" },
      { tick: 20, noeudId: "pers.chercheur", type: "rencontre", texte: "visible" },
      { tick: 20, noeudId: partie0.monde.groupes[0].id, type: "evenement-monde", texte: "groupe" },
    ];
    const p = { ...partie0, tick: 20, mondeSocial: { ...partie0.mondeSocial, evenements } };
    expect(signalFaibles(p, p.personnages).map((s) => s.sujetId)).toEqual(["pers.leader-radical"]);
  });

  it("courrier : quatre semaines, tri décroissant, plafond dix, hors carte exclu", () => {
    const evenements = [5, 6, 7, 8, 9, 10, 11].map((tick) => ({
      tick, noeudId: "pers.chercheur", type: "rencontre", texte: `fait ${tick}`,
    }));
    evenements.push({ tick: 10, noeudId: "pers.leader-radical", type: "rencontre", texte: "hors carte" });
    const p = { ...partie0, tick: 10, mondeSocial: { ...partie0.mondeSocial, evenements } };
    expect(courrierEnquete(p, p.personnages).map((c) => c.tick)).toEqual([10, 9, 8, 7]);
    const nombreux = { ...p, mondeSocial: { ...p.mondeSocial, evenements: Array.from({ length: 12 }, (_, i) => ({
      tick: 10, noeudId: "pers.chercheur", type: "rencontre", texte: `courrier ${i}`,
    })) } };
    expect(courrierEnquete(nombreux, nombreux.personnages)).toHaveLength(10);
  });

  it("recherche et signaux plafonnés à huit, dossiers accessibles après progression", () => {
    const noeuds = Array.from({ length: 12 }, (_, i) => ({ id: `org.test-${i}`, nom: `Sujet test ${i}`, type: "organisation" as const }));
    const evenements = noeuds.map((n, i) => ({ tick: 20 - i % 8, noeudId: n.id, type: "rencontre", texte: n.nom }));
    const p = { ...partie0, tick: 20, mondeSocial: { ...partie0.mondeSocial, noeuds: [...partie0.mondeSocial.noeuds, ...noeuds], evenements } };
    const res = rechercherSujets(p, p.personnages, "Sujet test");
    expect(res).toHaveLength(8);
    expect(new Set(res.map((r) => r.id)).size).toBe(8);
    expect(signalFaibles(p, p.personnages)).toHaveLength(8);
    expect(lireDossier(p, noeuds[0].id, p.personnages)!.complet).toBe(false);
    const promue = { ...p, carriere: { ...p.carriere, statut: "militant" as const } };
    expect(lireDossier(promue, noeuds[0].id, p.personnages)!.faits[0].texte).toBe(noeuds[0].nom);
    expect(signalFaibles(promue, p.personnages)).toEqual([]);
    expect(lireDossier(p, "inconnu", p.personnages)).toBeNull();
  });

});