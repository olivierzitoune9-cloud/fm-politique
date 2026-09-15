# Historique FM politique

Journal des décisions et changements de fonctionnement qui doivent survivre d'une session à l'autre. La SPEC garde le quoi, ce fichier garde le pourquoi.

## 2026-09-15, /pilote-sim Phase 0 clôturée puis Phase 1 ouverte

- Socle : git init, .gitignore couvrant .env*, hook .githooks/pre-commit actif via core.hooksPath et testé (blocage motif secret vérifié, .env bloqué par ignore), commit 021a13c propre, scan secrets vide, git status propre. Attente hook soldée dans docs/suivi-attentes.md.
- Recherche : première passe des primaires vidéo dans docs/base-documentaire.md. Confirmés avec nuances : Tajfel 1971 groupes minimaux, Hasher 1977 60 énoncés 3 sessions, Freedman Fraser 1966 contrôle moins de 20 contre 76 même sujet même tâche, Seligman Maier 1967 mécanisme confirmé sans coder 75, Centola 2018 seuil 25 non universel, Burger 2009 pas 2006 avec 70 contre 82,5, NSDAP 2,63 18,25 37,27, Crimée 65 vers 88 max, Mueller 1970 rally. Non retrouvés à ne jamais coder : Stenner 39 2 59. Restent Bandura, Klemperer, Aron, Hongrie, Pologne.
- Pourquoi : ta remarque sur une phase par session jugée obsolète a fait évoluer la méthode. Enchaînement séquentiel avec clôture vérifiée de Phase 0 avant ouverture de Phase 1, jamais deux chantiers à moitié finis en parallèle. Bilan méthode à porter dans .claude/commands/pilote-sim.md si validé.

## 2026-09-15, /ontologie v1 stabilisée avec revue adversariale

- Sept entités avec champs typés en 0..1, verbes et hors champ : docs/ontologie-v1.md. Dictionnaire justifié : docs/dictionnaire-variables-v1.md. Joueur comme instance d'Acteur, null pour inconnu, interdictions pour règles en fin de v1. Cinq notions proches distinguées : popularite, soutienPopulaire, legitimite, reputation, credibilite.
- Pourquoi : stabiliser avant toute règle selon /ontologie, sans coder la France en dur. Champs à risque conservés avec règle lectrice annoncée, à vérifier en Phase 5.

## 2026-09-15, IA des acteurs sans API

- Arbitrage explicite avec 6 objectifs et 5 options, bruit seedé, sans règle rigide. 4 tests verts.
- Pourquoi : l'IA arbitre, elle ne cause jamais à la place des règles. Aucune dépendance externe.

## 2026-09-15, /moteur boucle minimale m0.1.0

- src/sim/engine.ts avec deux groupes, ordre fixe et événements causaux. 52 tests verts, tsc propre. Échec initial sur saturation corrigé en test, leçon notée pour la vraie boucle.
- Pourquoi : prouver le critère SPEC (même seed identique, deux seeds divergents et explicables) avant IA, narration et UI.

## 2026-09-15, /regles catalogue complet R1 à R22

- 22 règles couvrant M1 à M23, codées en pur dans src/sim/rules, 48 tests Vitest verts et tsc propre. Revue globale passée, constantes interdites respectées.
- Pourquoi : finir les règles d'un trait comme demandé, en lots vérifiés, pour ouvrir /moteur sur une base complète plutôt qu'au compte gouttes.

## 2026-09-15, /regles R1 étiquetage codée et testée

- Fiche R1 dans docs/catalogue-regles.md, code pur dans src/sim/rules/r1-etiquetage.ts, RNG seedé et journalisé, 6 tests Vitest verts et tsc propre. Revue adversariale passée : pas de surpuissance, pas de stratégie optimale, pas de morale cachée.
- Pourquoi : première règle issue de M4 Tajfel, avec effets opposés et bornes, pour prouver que la boucle règles plus tests tient avant d'attaquer M11 ou la boucle moteur.

## 2026-09-15, /pilote-sim suite Phase 1 bouclée en première passe

- Cinq reliquats relus : Bandura 1999 huit mécanismes confirmés, Klemperer 1947 euphémismes documentés, Rákosi 1952 salami avec nuance Rieber 2013, Pologne 2015 à 2018 65 ans et 40 pour cent validés par Venise, Aron Clausewitz avec diversion rare selon Mueller. Base documentaire à jour, attente reformulée vers fiches détaillées.
- Pourquoi : enchaînement demandé par Aaron, toujours séquentiel et vérifié, jamais parallèle.

## 2026-09-15, création du workspace

- Sources prises en compte en totalité : doc FM politique sections 1 à 56 (idée générale, modèle FM, joueur, émergence, lois pas histoires, ontologie, acteurs, médias, institutions, relations, ressources, info imparfaite, autonomie des acteurs, décisions contextuelles, base documentaire, règle documentée, France 2026, données contre hypothèses, moteur en six couches, événements émergents, mécanismes du documentaire, échec et trajectoires multiples, conséquences contre récompenses, apprentissage, workflow, master prompt, artefacts persistants, seeds, tests, calibration, limites visibles, personnes réelles, laboratoire, interface texte et données, boucle prototype puis profondeur, architecture web, reproductibilité, validation) plus la vidéo source et sa transcription lue en entier.
- Choix technique assumé au-delà du brief : Next.js App Router pour l'UI (continuité Wisâl) avec moteur `src/sim/` pur et seedé, plutôt que React générique. Ni Supabase ni Stripe au prototype, monde local versionné.
- Mécaniques vidéo toutes reprises comme bibliothèque de mécanismes à conditions (jamais comme script) : voir `docs/bibliotheque-mecanismes-video.md`.
- Prochaine étape : Phase 0 (architecture validée), puis Phase 1 (base documentaire générale).
