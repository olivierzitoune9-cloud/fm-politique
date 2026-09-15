# Ontologie v1 (stabilisée, avant règles)

> Part de docs/ontologie-v0.md, SPEC v0, base documentaire Phase 1 première passe. Aucune valeur France 2026 ici, seulement des structures. Échelles internes en 0..1 flottant, affichage en 0..100. null veut dire inconnu, jamais zéro.

## Conventions

- id : chaîne stable, ex `act.droit-devant`, `med.le-quotidien`, `inst.cour-supreme`.
- Toute variable porte un niveau : [établi], [plausible], [hypothèse]. Sans niveau, la variable est refusée en revue.
- Aucune jauge unique de pouvoir. Le joueur est une instance d'Acteur avec les mêmes champs, plus un champ `estJoueur`.
- Pas d'entité isolée : chaque entité déclare au moins une relation possible.

## E1. GroupePopulation (agrégat, jamais un individu)

Pourquoi : la réceptivité aux discours, la bascule normative et la masse critique ne se jouent pas individu par individu au prototype, mais par groupes aux expositions et valeurs distinctes (M1, M3, M4, M12).

Champs :
- id: string, obligatoire.
- taillePart: 0..1, part de la population totale, défaut null.
- satisfactionEco: 0..1 (0 détresse, 1 prospérité), défaut 0.5, [plausible] via M1.
- perteControle: 0..1, sentiment de perte de contrôle, défaut 0.5, [plausible] via M1.
- menacePercue: 0..1, menace normative perçue, défaut 0.5, [plausible] via M3 Stenner.
- predispoAutoritaire: 0..1, besoin d'uniformité et de sécurité, défaut 0.5, [plausible] via M3, jamais codé en 39 2 59.
- identiteActive: 0..1, activation nous contre eux, défaut 0.2, [établi] via M4 Tajfel.
- expositionMedia: map mediaId vers 0..1, défaut vide, [plausible] via M11.
- normeAdoptee: string ou null, convention dominante du groupe, défaut null, [plausible] via M12 Centola.
- mefianceInfo: 0..1, défaut 0.5, [hypothèse].

Verbes : recevoir, croire, douter, adopter, rejeter, manifester, voter, se démobiliser.
Hors champ : psychologie individuelle fine, trajectoires nominatives, prédiction électorale exacte.

## E2. Acteur (politique ou social, le joueur est un Acteur)

Pourquoi : partis, syndicats, entreprises, associations, mouvements, personnalités et joueur partagent le même besoin de simulation, arbitrer entre objectifs concurrents avec ressources limitées (SPEC sections 2, 3, architecture AI).

Champs identité :
- id: string. nom: string. estJoueur: booléen, défaut false. estFictif: booléen, défaut true (personnes réelles seulement si donnée publique documentée, SPEC section 5).
- ambition: 0..1, défaut 0.5, [hypothèse].
- ideologie: vecteur court {gaucheDroite: -1..1, ouvertFerme: -1..1}, défaut {0,0}, [hypothèse].
- experience, competence, persuasion, organisation: 0..1, défaut 0.3, [hypothèse].

Champs état (mémoire du monde) :
- popularite: 0..1, défaut 0.05 pour insignifiant, [plausible] via M22 Mueller.
- credibilite: 0..1, défaut 0.5, [plausible] via M7 M10.
- reputation: 0..1, défaut 0.5, [hypothèse].
- legitimite: 0..1, défaut 0.3, [plausible] via M13 M14.
- reseau: 0..1, taille et qualité du réseau, défaut 0.1, [hypothèse] via M2.

Champs ressources (jamais une jauge unique) :
- argent, temps, information, audience, militants, accesInstitutionnel, influenceMediatique, soutienPopulaire: 0..1 chacun, défauts 0.1 sauf temps 0.5, [hypothèse] sauf information [plausible] via SPEC section 3.
- marque: {simplicite: 0..1, reproductibilite: 0..1, respectabilite: 0..1, lectureCachee: 0..1}, défaut 0.2 partout, [plausible] via M6.
- lexique: liste de termes adoucissants en usage, défaut vide, [plausible] via M8 Klemperer et Bandura.

Champs croyances (info imparfaite) :
- croyances: map variableId vers {valeur: 0..1, confiance: 0..1, source: string}, défaut vide, [plausible] via SPEC section 3.
- memoire: liste {type, cibleId, gravite: 0..1, date}, trahisons dettes promesses, défaut vide, [hypothèse].

Verbes : publier, déclarer, allier, rompre, trahir, coopter, attaquer, discréditer, protéger, nommer, financer, enquêter, préparer (M2), euphémiser (M8).
Hors champ : états d'âme simulés pour eux-mêmes, stats physiques, accusations non établies contre personnes réelles.

## E3. Media (presse, TV, radio, site, compte d'influence)

Pourquoi : agenda, cadrage, répétition et caution savante conditionnent la dicibilité et la familiarité (M7, M10, M11). Un compte anonyme fusible est un Media à part entière.

Champs :
- id, nom, type: enum {presse, tv, radio, site, influenceur, anonyme}, défaut site.
- audienceTaille: 0..1, défaut 0.1, [hypothèse].
- audienceCompo: map groupeId vers 0..1, défaut vide, [hypothèse].
- credibilite: 0..1, défaut 0.5, [plausible] via M10.
- ligneEditoriale: {gaucheDroite: -1..1, ouvertFerme: -1..1}, défaut {0,0}, [hypothèse].
- polarisation: 0..1, défaut 0.3, [plausible].
- vitesse: 0..1, défaut 0.5, [hypothèse].
- capaciteEnquete: 0..1, défaut 0.3, [plausible] via M16 (origine réelle ou instrumentalisée à enquêter).
- dependances: liste {type, acteurId, intensite: 0..1}, modèle économique et pressions, défaut vide, [plausible] via M14.
- posture: enum {neutre, relais, fusible, attaquant, défenseur}, défaut neutre, [plausible] via M7.

Verbes : publier, taire, enquêter, relayer, ignorer, cadrer, changer de ligne, défendre, attaquer, suivre ou créer une tendance, gagner ou perdre en crédibilité, crise interne.
Hors champ : contenu rédactionnel réel généré comme vérité, audiences nominatives.

## E4. Institution (tribunal, commission, préfecture, direction, assemblée)

Pourquoi : la trajectoire salami et la capture des applicateurs passent par ressources et autonomie, pas par suppression frontale (M14, cas Pologne et Hongrie).

Champs :
- id, nom, type: enum {justice, contrôle, élection, sécurité, administration, assemblée}, défaut administration.
- legitimite: 0..1, défaut 0.5, [plausible].
- ressources: 0..1, défaut 0.5, [hypothèse].
- autonomie: 0..1, défaut 0.5, [plausible] via M14.
- cohesion: 0..1, défaut 0.5, [hypothèse].
- etat: enum {renforcee, affaiblie, contournee, capturee, reformee, discreditee, paralysée, divisee, mobilisee, protegee}, défaut renforcee, [plausible] via M14.
- dirigeants: liste acteurId, défaut vide.
- reglesCarriere: {nominationPar: string, ageRetraite: nombre ou null, dureeMandat: nombre ou null}, défaut null partout, [donnée observée] quand sourcé en Phase 6.
- memoire: liste d'événements, défaut vide.

Verbes : nommer, révoquer, réformer, contourner, capturer, protéger, discréditer, paralyser, mobiliser.
Hors champ : droit réel appliqué comme conseil juridique, organigrammes nominatifs non publics.

## E5. Territoire (commune type, département type, région type, jamais la France entière ici)

Pourquoi : ancrage des groupes, des audiences et des chocs, sans coder la France 2026 en dur.

Champs : id, nom generique, echelle: enum {local, departemental, regional, national}, groupes: liste groupeId, chocEco: 0..1 défaut 0, [hypothèse].
Verbes : subir un choc, recevoir des ressources, voter, manifester.
Hors champ : carte exacte, données INSEE (c'est Phase 6).

## E6. Relation (entité de première classe, pas un simple lien)

Pourquoi : trahisons, dettes et promesses conditionnent coalitions et vengeance (SPEC mémoire du monde, bibliothèque M5 M21).

Champs :
- id, de: id, vers: id, type: enum {politique, economique, mediatique, personnelle, institutionnelle, professionnelle, ideologique, electorale, sociale}, défaut politique.
- intensite: -1..1 (négatif hostile, positif allié), défaut 0, [hypothèse].
- direction: enum {uni, mutuelle, asymetrique}, défaut mutuelle.
- memoire: liste {type: enum {trahison, dette, promesse, attaque, soutien}, gravite: 0..1, date}, défaut vide.
- visibilite: 0..1 (publique ou secrète), défaut 0.5.

Verbes système : allier, rompre, trahir, coopter, capturer, contourner, discréditer, protéger.
Hors champ : sentiments simulés pour eux-mêmes, graphe social nominatif réel.

## E7. Proposition (énoncé politique situé sur une échelle de dicibilité)

Pourquoi : la fenêtre d'Overton avance case par case via relais à déni, jamais par saut frontal (M7, M9 sophismes).

Champs :
- id, texte: string, auteurId, dicibilite: map groupeId vers 0..1 (0 indicible, 1 dicible), défaut 0.3, [plausible] via M7.
- relais: liste {mediaId ou acteurId, rôle: enum {faux-expert, influenceur, anonyme}}, défaut vide.
- statutPreuve: enum {etabli, conteste, trompeur, faux}, défaut conteste, [hypothèse].
- coutReputation: 0..1, défaut 0.3.

Verbes : proposer, relayer, tordre sans mensonge frontal, réfuter, fact checker.
Hors champ : vérité officielle du monde, le moteur ne tranche jamais à la place des acteurs et des médias.

## Ce que v1 interdit aux règles

- Lire un champ sans niveau de preuve.
- Utiliser 39 2 59, 75 pour cent Seligman, 90 Crimée comme constantes.
- Créer une jauge pouvoir unique par somme des ressources.
- Isoler une entité sans relation.
- Coder une valeur France 2026 en dur (tout chiffre réel passe par Phase 6 avec chaîne traçable).
