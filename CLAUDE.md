# CLAUDE.md, FM politique

Ce dossier est l'atelier du jeu **FM politique** d'Aaron : simulation politique émergente, France septembre 2026 comme état initial, moteur à règles explicites, interface de lecture du monde. Distinct du Jarvis (`jarvis-starter-kit`, contexte et stratégie) et de `wisal-app` (dont on réutilise la méthode, jamais le contenu).

## Travailler avec Aaron ici

- Français, tutoiement, doux et exigeant, posture d'expert. Chaque geste technique expliqué en français simple, jamais de jargon non expliqué.
- Sparring permanent : si un choix semble mauvais pour ses contraintes réelles, le dire avec pour et contre, prendre position, ne pas céder sans argument. Multiplicateur, pas addition : signaler spontanément une architecture fragile, une donnée inventée, une règle non testable, même hors périmètre.
- Pas de tirets longs. Aucune limite posée par Aaron sur l'ambition (« on vise plus loin »), mais jamais d'invention silencieuse : tout ce qui n'est pas sourcé est marqué [hypothèse] ou [À CONFIRMER] et ne structure rien.

## Documents de référence (dans docs/)

- `docs/SPEC-v0-fm-politique.md` : LA spec, source de vérité du jeu. Ne jamais coder un système sans avoir relu la section concernée.
- `docs/bibliotheque-mecanismes-video.md` : les mécaniques de la vidéo source, toutes reprises comme bibliothèque de mécanismes possibles, jamais comme scénario linéaire.
- `docs/ontologie-v0.md` : entités, variables, relations.
- `docs/architecture-moteur.md` : les six couches DATA, RULES, SIMULATION, AI, NARRATIVE, UI, seeds, tests, calibration.
- `docs/base-documentaire.md` : registre des sources et niveaux de preuve.
- `docs/france-2026-etat-initial.md` : état initial daté et sourcé.
- `docs/plan-implementation.md` : phases 0 à 12 du brief, avec état réel d'avancement.
- `docs/suivi-attentes.md` : arbitrages pendants, lecture obligatoire en début de session.

## Mémoire Graphify (`graphify-out/`)

Lire `GRAPH_REPORT.md` ou `graphify query` avant toute recherche large, n'ouvrir ensuite que les fichiers nécessaires, `graphify update .` à chaque clôture. Ne jamais prétendre qu'un résumé vaut preuve.

## Stack prototype (figée jusqu'à arbitrage)

TypeScript, Next.js App Router, moteur `src/sim/` pur sans React, RNG seedé, Vitest, données versionnées en fichiers, Vercel pour la prévisualisation. Ni Supabase ni Stripe au prototype. Ne jamais introduire une brique hors liste sans la noter dans le plan et la faire valider.

## Sécurité des secrets

Jamais de clé en dur, tout en variables d'environnement (`.env`, jamais commité, jamais affiché). Au moindre doute, s'arrêter et signaler. Hook anti fuite à poser dès le premier dépôt git (`.githooks/pre-commit` sur le modèle wisal-app).

## Git

Sauvegarder aux points naturels avec message clair, vérifier l'absence de secrets, ne committer que sa liste annoncée. Opérations destructrices toujours soumises à confirmation explicite.
