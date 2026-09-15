# Plan d'implémentation (phases 0 à 12 du brief, section 49)

> Le master prompt (section 50) est la constitution du projet, l'exécution reste par étapes contrôlées avec checkpoints (section 51). Artefacts persistants obligatoires (section 52) : base, registre, ontologie, dictionnaire des variables, catalogue des règles, architecture, tests, état du projet, journal des décisions.

- Phase 0, compréhension : vision, objectifs, philosophie FM, contraintes. Sortie : cette SPEC v0 et cette architecture. État : clôturée le 2026-09-15 (git init, hook actif et testé, commit 021a13c).
- Phase 1, recherche générale : base documentaire et fiches par mécanisme. État : en cours depuis le 2026-09-15, première passe vidéo vérifiée dans docs/base-documentaire.md.
- Phase 2, ontologie : entités stabilisées. Sortie : `docs/ontologie-v0.md` puis v1.
- Phase 3, variables : dictionnaire avec justifications.
- Phase 4, relations : interactions possibles et verbes système.
- État Phases 2 à 4 le 2026-09-15 : v1 livrée dans docs/ontologie-v1.md plus docs/dictionnaire-variables-v1.md avec revue adversariale, en attente de validation par Aaron avant règles.
- Phase 5, règles : catalogue testable issu de la bibliothèque vidéo et de la littérature.
- État Phase 5 le 2026-09-15 : catalogue complet R1 à R22 codé et testé (48 tests verts, tsc propre) dans docs/catalogue-regles.md. Prochaine commande : /moteur pour la boucle minimale.
- Phase 6, France 2026 : état initial daté et sourcé.
- Phase 7, moteur : couches DATA à SIMULATION, seeds, boucle minimale.
- État Phase 7 le 2026-09-15 : boucle m0.2.0 avec IA branchée, 58 tests verts, critère SPEC tenu.
- Phase 8, IA des acteurs : arbitrages explicites.
- État Phase 8 le 2026-09-15 : arbitrage codé dans src/sim/ai/arbitrage.ts avec 5 options prototype, utilités journalisées, sans API.
- Phase 9, événements : détection et narration.
- État Phase 9 le 2026-09-15 : raconteur par gabarits dans src/sim/narrative, 62 tests verts.
- Phase 10, interface : lecture du monde.
- Phase 11, tests : simulations massives, absurdités, calibration.
- Phase 12, extension : profondeur progressive.

Prochaines commandes à utiliser dans l'ordre : `/recherche`, `/ontologie`, `/regles`, `/france-2026`, `/moteur`.
