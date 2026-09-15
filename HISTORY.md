# Historique FM politique

Journal des décisions et changements de fonctionnement qui doivent survivre d'une session à l'autre. La SPEC garde le quoi, ce fichier garde le pourquoi.

## 2026-09-15, /pilote-sim Phase 0 clôturée puis Phase 1 ouverte

- Socle : git init, .gitignore couvrant .env*, hook .githooks/pre-commit actif via core.hooksPath et testé (blocage motif secret vérifié, .env bloqué par ignore), commit 021a13c propre, scan secrets vide, git status propre. Attente hook soldée dans docs/suivi-attentes.md.
- Recherche : première passe des primaires vidéo dans docs/base-documentaire.md. Confirmés avec nuances : Tajfel 1971 groupes minimaux, Hasher 1977 60 énoncés 3 sessions, Freedman Fraser 1966 contrôle moins de 20 contre 76 même sujet même tâche, Seligman Maier 1967 mécanisme confirmé sans coder 75, Centola 2018 seuil 25 non universel, Burger 2009 pas 2006 avec 70 contre 82,5, NSDAP 2,63 18,25 37,27, Crimée 65 vers 88 max, Mueller 1970 rally. Non retrouvés à ne jamais coder : Stenner 39 2 59. Restent Bandura, Klemperer, Aron, Hongrie, Pologne.
- Pourquoi : ta remarque sur une phase par session jugée obsolète a fait évoluer la méthode. Enchaînement séquentiel avec clôture vérifiée de Phase 0 avant ouverture de Phase 1, jamais deux chantiers à moitié finis en parallèle. Bilan méthode à porter dans .claude/commands/pilote-sim.md si validé.

## 2026-09-15, /pilote-sim suite Phase 1 bouclée en première passe

- Cinq reliquats relus : Bandura 1999 huit mécanismes confirmés, Klemperer 1947 euphémismes documentés, Rákosi 1952 salami avec nuance Rieber 2013, Pologne 2015 à 2018 65 ans et 40 pour cent validés par Venise, Aron Clausewitz avec diversion rare selon Mueller. Base documentaire à jour, attente reformulée vers fiches détaillées.
- Pourquoi : enchaînement demandé par Aaron, toujours séquentiel et vérifié, jamais parallèle.

## 2026-09-15, création du workspace

- Sources prises en compte en totalité : doc FM politique sections 1 à 56 (idée générale, modèle FM, joueur, émergence, lois pas histoires, ontologie, acteurs, médias, institutions, relations, ressources, info imparfaite, autonomie des acteurs, décisions contextuelles, base documentaire, règle documentée, France 2026, données contre hypothèses, moteur en six couches, événements émergents, mécanismes du documentaire, échec et trajectoires multiples, conséquences contre récompenses, apprentissage, workflow, master prompt, artefacts persistants, seeds, tests, calibration, limites visibles, personnes réelles, laboratoire, interface texte et données, boucle prototype puis profondeur, architecture web, reproductibilité, validation) plus la vidéo source et sa transcription lue en entier.
- Choix technique assumé au-delà du brief : Next.js App Router pour l'UI (continuité Wisâl) avec moteur `src/sim/` pur et seedé, plutôt que React générique. Ni Supabase ni Stripe au prototype, monde local versionné.
- Mécaniques vidéo toutes reprises comme bibliothèque de mécanismes à conditions (jamais comme script) : voir `docs/bibliotheque-mecanismes-video.md`.
- Prochaine étape : Phase 0 (architecture validée), puis Phase 1 (base documentaire générale).
