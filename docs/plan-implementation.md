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
- État Phase 6 le 2026-09-15 : première passe dans src/sim/data/france-2026.ts et docs/france-2026-etat-initial.md, chômage, Assemblée, gouvernement sourcés.
- Phase 10, interface : lecture du monde.
- État Phase 10 le 2026-09-15 : scaffold Next dans ui/ avec page tableaux et chronologie, moteur m0.3.0 jouable avec vue filtrée, page interactive et boîte mail encore dues.
- Phase 7, moteur : couches DATA à SIMULATION, seeds, boucle minimale.
- État Phase 7 le 2026-09-15 : boucle m0.2.0 avec IA branchée, 58 tests verts, critère SPEC tenu.
- Phase 8, IA des acteurs : arbitrages explicites.
- État Phase 8 le 2026-09-15 : arbitrage codé dans src/sim/ai/arbitrage.ts avec 5 options prototype, utilités journalisées, sans API.
- Phase 9, événements : détection et narration.
- État Phase 9 le 2026-09-15 : raconteur par gabarits dans src/sim/narrative, 62 tests verts.
- État Phase 5 le 2026-09-15 : catalogue R1 à R22 codé et testé, puis branchement élargi en V2.
- Phase 6, France 2026 : état initial daté et sourcé.
- État Phase 6 le 2026-09-15 : première passe dans src/sim/data/france-2026.ts et docs/france-2026-etat-initial.md, chômage, Assemblée, gouvernement sourcés. Économie mensuelle branchée en V2.
- Phase 12, extension : profondeur progressive.
- État Phase 12 le 2026-09-15 : adversaires réactifs (mémoire des coups joueur, bornée), moteur m0.4.0, serveur dev vérifié ce soir sur 3123.

## Phase 13, du prototype au vrai jeu (V1 et V2, session du 2026-09-15)

Vision durable dans docs/vision-v1-v2.md. Jalons :

- J1 V1 carrière, personnages, objectif : LIVRÉE le 2026-09-15 (partie p1, commit 38696cc). Personnages fictifs nommés (15 profils : chercheur, experte IA, ingénieur, historien, journalistes, élus, syndicaliste, entrepreneur, fonctionnaire, leaders), interactions avec mémoire E6, calendrier réel depuis le 2026-09-07 avec échéances 2027-2032, 4 ambitions, 18 actions mappées R1 à R22, fins multiples, sauvegarde locale versionnée, /nouvelle-partie et /partie refondues. 107 tests verts, build UI vert.
- J2 V2 monde qui vit : LIVRÉE le 2026-09-15 (partie p2.0.0). Médias avec vigilance et audiences (fact checking réel), propositions R9 avec dicibilité par groupe, partis organisés avec leaders nommés et manoeuvres lues dans le moteur, économie mensuelle branchée (chômage observé sept 2026, suite hypothèse marquée), 20 actions, fin proposition sur dicibilité réelle, calibration V2 40 parties bornées. 126 tests verts sur 30 fichiers, tsc propre, build UI vert.
- J3 propagation et carte : carte France régions types, adoption par territoire, arbre d'améliorations à points, vecteurs, barre de réponse adverse. Session suivante.
- J4 info imparfaite à la FM : sondages commandables avec coûts et biais, rapporteurs, éditorialisation. Session suivante.
- J5 V1 complète : calibration élargie, audits, tutoriel par courrier, déploiement. Session suivante.
- J6 design et mise en ligne : LIVRÉE le 2026-09-15 (pôle design créé, doctrine écrite après recherche sourcée, appliquée au code en cinq feuilles, moteur rangé dans ui/sim pour que Vercel puisse construire, build de production vert, procédure écrite dans docs/deploiement.md). Reste la création du dépôt GitHub par Aaron pour la mise en ligne réelle.

Prochaine commande dans l'ordre : /audit-parcours-joueur, puis /moteur sur J3, /audit-securite-sim avant tout déploiement.
