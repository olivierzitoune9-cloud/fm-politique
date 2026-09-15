# Journal du pôle développeur simulation

## 2026-09-15, /regles R1

### Contexte courant

Scaffold posé : package.json, tsconfig, src/sim pur sans React, Vitest. R1 étiquetage codée dans src/sim/rules/r1-etiquetage.ts avec rng.ts et types.ts. Catalogue dans docs/catalogue-regles.md.

### Vérifications du jour

- npx vitest run : 1 fichier, 6 tests passés (passant, limite exposition nulle, extrême plafond 1, effet opposé réactance, non régression seed 1234, biais d'allocation).
- npx tsc --noEmit : propre, sans erreur.
- Seed et tirage journalisé avec graine et rang, exposition nulle sans tirage.

### Revue adversariale R1 du 2026-09-15

- Surpuissance : non, delta max 0.15 par pas, plafond 1.
- Domination systématique : non, atténuateurs contacts croisés et intérêts partagés, réactance possible.
- Explosion : non, clamp 0..1 partout, bruit borné à plus ou moins 0.02.
- Stratégie toujours optimale : non, grossier plus peu crédible coûte en réputation et crédibilité.
- Lecture morale cachée : non, conséquences seulement, pas de bien ni mal.

### Erreurs et limites

- Biais d'allocation encore sans arbitrage complet d'acteur, à brancher en Phase 8 IA.
- Contre mobilisation de l'outgroup non codée, seulement notée en fiche.
- node_modules installé localement, jamais commité.
