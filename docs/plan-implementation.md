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
- J3 propagation et carte : carte France régions types, adoption par territoire, arbre d'améliorations à points, vecteurs, barre de réponse adverse. Session suivante. État : LIVRÉE le 2026-09-16 en rafale (douze territoires, propagation seedée, réponse adverse).
- J4 info imparfaite à la FM : sondages commandables avec coûts et biais, rapporteurs, éditorialisation. Session suivante. État : LIVRÉE le 2026-09-16 en rafale (trois sondages, lecture biaisée affichée).
- J5 V1 complète : calibration élargie, audits, tutoriel par courrier, déploiement. Session suivante. État : partiellement LIVRÉE le 2026-09-16 (calibration 40 parties). Restent dus : audits parcours et sécurité, revue adversariale, tutoriel par courrier, déploiement GitHub Vercel par Aaron.
- J6 design et mise en ligne : LIVRÉE le 2026-09-15 (pôle design créé, doctrine écrite après recherche sourcée, appliquée au code en cinq feuilles, moteur rangé dans ui/sim pour que Vercel puisse construire, build de production vert, procédure écrite dans docs/deploiement.md). Reste la création du dépôt GitHub par Aaron pour la mise en ligne réelle.
- J10 défauts et déontologie, à faire en premier : « Semaine suivante » sans effet (l'exception de jouerSemaine n'est jamais affichée) et origine choisie absente du statut (creerCarriere fixe « employe »), plus la sortie du texte de mise en garde hors des écrans de jeu. Détail et causes dans docs/retours-joueur-2026-09-16.md, R1, R2 et R8. État : LIVRÉE le 2026-09-16 en rafale (partie p2.1.0).
- J7 progression par paliers, le jalon le plus structurant : chaque règle R1 à R22 reçoit un palier d'accès adossé à la chronologie M1 à M23 du document source, et le joueur ne voit que son palier. Un jeune enseignant ne voit ni partis rivaux, ni médias nationaux, ni institutions. Ils existent en arrière-plan et apparaissent avec la notoriété et la légitimité. Référence : docs/retours-joueur-2026-09-16.md, R6. État : LIVRÉE le 2026-09-16 en rafale (paliers 1 à 5 sur actions, personnages, médias, manoeuvres).
- J8 choix libres et sanctionnés : plus de blocage par ressource ni par rang, la sanction passe par la dette d'argent, le risque d'enquête, la réputation, les soutiens perdus, les occasions manquées et le retour de bâton des personnages trahis. Référence : R7. État : LIVRÉE le 2026-09-16 en rafale.
- J9 rôles et objectifs élargis : origines multiples avec un vecteur d'accès au pouvoir propre à chaque métier, objectifs à paliers et projection longue sur les échéances réelles de 2027, 2029 et 2032, explication claire des graines. Référence : R3, R4, R5. État : LIVRÉE le 2026-09-16 en rafale (dix origines, six ambitions).
- Consigne de rythme : au prochain /pilote-sim, exécuter d'une traite tous les jalons restants (J10, J7, J8, J9, puis J3, J4 et J5), sans s'arrêter à un jalon par session. État : EXÉCUTÉE le 2026-09-16, partie p2.1.0, vérifications terminal à rejouer par Aaron.
## Phase 13 bis, le vrai jeu (session du 2026-09-16, GO d'Aaron)

Aaron a tranché : pas de commit tout de suite, une session unique de transformation. Le jeu actuel est un MVP, on applique la vision (docs/vision-gameplay-fm-politique.md) et les jalons d'enrichissement J11 à J14 (docs/etude-jeux-comparables-2026-09-16.md) et J15 à J17 (docs/recherche-gameplay-hors-politique-2026-09-16.md). Commit et push seulement en fin de session, une fois le jeu transformé. Version cible : partie p3.0.0, sauvegarde migrée depuis p2.1.0.

- J15 richesse de semaine (F1 F2 F3) : semaine à deux étages (action plus activité de fond), état intérieur énergie-moral qui module l'efficacité, compétences construites par la répétition qui pondèrent les effets. État : LIVRÉE le 2026-09-16 (partie p3.0.0, ui/sim/carriere.ts, ui/app/partie/page.tsx, tests jeu-profond.test.ts).
- J16 dilemmes et personnalités (F4 F5 F6) : carrefours à deux ou trois réponses pondérés par compétences, personnalités et contexte, effet révélé différé dans le journal ; traits qui pèsent dans les interactions ; effets durables nommés au lieu de deltas invisibles. État : LIVRÉE le 2026-09-16 (nouveau module ui/sim/dilemmes.ts, poidsTraits dans personnages.ts, effets durables dans carriere.ts, dilemmes.test.ts).
- J17 information et remontée (F7 F8 F9 F10) : fiches en fourchettes selon la connaissance mutuelle, événements monde qui créent des dilemmes, choix anciens qui conditionnent des options tardives (investiture), saisons perceptibles. État : LIVRÉE le 2026-09-16 (estimationRelation, génération conditionnelle de dilemmes, échéance investitures-2027 dans temps.ts, saisons et LIBELLES_SAISON).
- J11 information incarnée (E1 E6 E9 E10) : enjeu dominant par territoire et matching marque-enjeu, promesses à échéance datée. État : LIVRÉE le 2026-09-16 (courrier.ts enjeux et matchingMarqueEnjeu, promesses dans carriere.ts et interactions.ts).
- J12 le monde te répond (E2 E3 E11 E12) : coalition adverse à seuil et frappe sur ton territoire le plus fort, vie indépendante des partis et médias, aile déviante au delà d'une organisation trop grosse. État : LIVRÉE le 2026-09-16 (frappeAdverse dans partis.ts, enquêtes indépendantes et aile combative dans partie.ts).
- J13 profondeur de carrière (E4 E5 E7 E8) : coûts croissants par palier, corruption d'expansion, investiture comme échéance intermédiaire. État : LIVRÉE le 2026-09-16 (coutPalier et corruptionExpansion dans carriere.ts, dons nommés, investiture dans partie.ts).
- J14 causalité profonde (E13) : effets retardés des actions de fond, le bruit d'aujourd'hui revient des semaines plus tard. État : SIMPLIFIÉE et LIVRÉE le 2026-09-16 (l'écho retardé est annoncé puis daté dans le journal ; la file d'effets chiffrés est remise à plus tard, simplification assumée et notée dans le journal du pôle développeur).

Prochaine commande dans l'ordre : /audit-parcours-joueur, puis /moteur sur J3, /audit-securite-sim avant tout déploiement.
