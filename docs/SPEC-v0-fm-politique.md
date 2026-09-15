# SPEC v0, FM politique (source de vérité du jeu)

> Statut : v0 de cadrage issue du brief du 2026-09-15, sections 1 à 56 intégrées. Tout point non tranché est marqué [À CONFIRMER] et ne structure rien.

## 1. Le produit en une page

Simulation politique émergente, France septembre 2026 comme état initial. Le joueur commence comme acteur insignifiant (employé de bureau, acteur abstrait sans représentation physique obligatoire) avec ressources, relations, réputation, organisation, influence, informations, ambitions, crédibilité, soutiens, adversaires, opportunités, contraintes. But général : obtenir du pouvoir, sans forme imposée (responsable démocratique, réformateur, président populaire, chef de parti, coalition, modéré, populiste, autoritaire progressif, dictatorial ouvert, échec, marginalisation, élimination, intermédiaires).

Le monde vit sans le joueur : partis, médias, syndicats, entreprises, administrations, associations, mouvements, réseaux, personnalités, électeurs, journalistes, fonctionnaires, forces économiques, démographie, crises, tensions, intérêts contradictoires. Chacun poursuit ses propres objectifs avec ses informations propres.

## 2. Propriétés exigées (brief sections 4, 22 à 31)

- Résultats imprévisibles mais cohérents après coup, chronologie et rapports permettant de reconstruire les chaînes causales.
- Hasard comme incertitude conditionnée (réactions humaines, contingence, info incomplète, variations statistiques, comportements stratégiques), jamais comme excuse.
- Non linéarité : petites décisions parfois déclencheuses de longues chaînes.
- Mémoire du monde : trahisons, crises, crédibilités, coalitions, effets différés sur plusieurs années.
- Multi échelles de temps : scandales et déclarations rapides, démographie et institutions lentes.
- Crises émergentes conditionnées par l'état du monde, pas scénarisées.
- Difficulté par la complexité (info imparfaite, adversaires actifs, conséquences différées, ressources limitées), jamais par triche du jeu.
- Échec possible sous formes multiples, réussite sans définition unique, stratégies sans moralité ni facilité prédéfinies, conséquences multidimensionnelles plutôt que récompenses (+popularité avec -crédibilité possibles simultanément).
- Joueur apprenant progressivement le système, comme dans Football Manager.

## 3. Joueur et information

Acteur abstrait multidimensionnel (section 11 du brief : argent, temps, information, réputation, audience, militants, relations, accès institutionnel, influence médiatique, capacité organisationnelle, légitimité, expertise, contrôle administratif, soutien populaire). Information imparfaite obligatoire (section 12) : le moteur connaît l'état exact, le joueur le découvre par sondages, rapports, médias, conseillers, statistiques, renseignements, événements, réseaux, observations, avec sources exactes, approximatives, retardées, biaisées, contradictoires, incomplètes.

## 4. Interface (brief sections 32, 33)

Pas de personnages animés requis. Interface informationnelle : tableau de bord, carte de France, données éco et démo, sondages, médias, réseaux, boîte mail, agenda, institutions, partis, acteurs, relations, chronologie, rapports, événements, graphiques, notifications, documents. Beaucoup de texte et de données : articles, rapports, messages, courriels, sondages, statistiques, publications, communiqués, débats, notes. Le joueur lit le monde.

## 5. Périmètre et jalons

- Jalon prototype : boucle minimale état du monde vers décisions des acteurs vers interactions vers évolution vers événements émergents vers nouvelle situation, sur périmètre réduit (quelques groupes, quelques médias, quelques institutions, économie simplifiée), avec seeds, tests et chronologie causale lisible. Critère de sortie : deux parties même seed donnent la même simulation, deux seeds donnent des trajectoires différentes mais chacune explicable.
- Jalons suivants : profondeur progressive (ontologie complète, France 2026 complète, IA des acteurs, narration, interface complète, calibration historique, extension).
- Hors périmètre prototype : multijoueur, 3D, personnages animés, prédiction du réel présentée comme vérité, accusations non établies contre personnes réelles (section 41 : distinguer donnée publique documentée et hypothèse du modèle, acteurs fictifs construits sur structures réelles quand sensible).

## 6. Vocabulaire et éthique du jeu

Le jeu modélise des stratégies autoritaires comme trajectoires possibles sans les recommander ni les récompenser moralement. Aucune jauge de bien ou mal, seulement des conséquences. Les limites scientifiques restent visibles (confiance, incertitude, qualité de source, désaccords).

Avertissement d'ouverture validé le 2026-09-15, affiché à la création de partie : « Simulation émergente : trajectoires possibles, jamais de prédiction du réel ni de recommandation. Certaines trajectoires d'accession au pouvoir, y compris autoritaires, sont simulées pour être comprises, jamais proposées comme des modèles. »

## 6.1 Personnages et objectif (validé le 2026-09-15, session V1 V2)

- Personnages fictifs uniquement, prénoms et noms français aléatoires seedés, jamais de personne réelle. Pas de portraits ni d'images : nom, métier, traits, relation, mémoire. Avec des personnages au delà du politique : chercheurs, historiens, ingénieurs, expertes IA, journalistes, élus, syndicalistes, entrepreneurs, fonctionnaires. Les métiers portent des hooks mécaniques (caution savante R14, amplification numérique R2, accès institutionnel, micro ciblage, fact checking).
- Les interactions humaines sont fondamentales : convoquer, convaincre, promettre, demander un coup de main, trahir, recoudre. Promesses et trahisons restent en mémoire (E6) et remontent dans les comportements.
- Le joueur choisit une ambition à la création de partie (élu, chef de parti, proposition imposée, présidentiable), évaluée sur le calendrier réel. Fins multiples, réussite sans définition unique.
