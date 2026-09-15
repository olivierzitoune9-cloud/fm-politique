# Historique FM politique

Journal des décisions et changements de fonctionnement qui doivent survivre d'une session à l'autre. La SPEC garde le quoi, ce fichier garde le pourquoi.

## 2026-09-15, création du workspace

- Sources prises en compte en totalité : doc FM politique sections 1 à 56 (idée générale, modèle FM, joueur, émergence, lois pas histoires, ontologie, acteurs, médias, institutions, relations, ressources, info imparfaite, autonomie des acteurs, décisions contextuelles, base documentaire, règle documentée, France 2026, données contre hypothèses, moteur en six couches, événements émergents, mécanismes du documentaire, échec et trajectoires multiples, conséquences contre récompenses, apprentissage, workflow, master prompt, artefacts persistants, seeds, tests, calibration, limites visibles, personnes réelles, laboratoire, interface texte et données, boucle prototype puis profondeur, architecture web, reproductibilité, validation) plus la vidéo source et sa transcription lue en entier.
- Choix technique assumé au-delà du brief : Next.js App Router pour l'UI (continuité Wisâl) avec moteur `src/sim/` pur et seedé, plutôt que React générique. Ni Supabase ni Stripe au prototype, monde local versionné.
- Mécaniques vidéo toutes reprises comme bibliothèque de mécanismes à conditions (jamais comme script) : voir `docs/bibliotheque-mecanismes-video.md`.
- Prochaine étape : Phase 0 (architecture validée), puis Phase 1 (base documentaire générale).
