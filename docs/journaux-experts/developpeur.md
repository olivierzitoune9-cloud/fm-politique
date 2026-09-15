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

## 2026-09-15, catalogue complet R1 à R22

22 règles codées couvrant M1 à M23. 48 tests verts sur 11 fichiers, tsc propre. Revue globale dans docs/catalogue-regles.md. Prochaine étape : boucle minimale /moteur avec seeds et chronologie causale.

## 2026-09-15, fin de session : UI build vert et courrier

74 tests verts sur 18 fichiers, tsc propre, next build vert. Fix chemins /partie et extensionAlias .js vers .ts.

## 2026-09-15, fin de session : partie jouable et calibration

71 tests verts sur 17 fichiers, tsc propre. Calibration 4 secondes pour 200 parties, stable.

## 2026-09-15, joueur jouable m0.3.0

69 tests verts sur 16 fichiers, tsc propre. Trois acteurs par tick, coups joueur forcés, vue arrondie à la dizaine.

## 2026-09-15, France 2026 et UI

65 tests verts sur 15 fichiers, tsc propre. UI non buildée, à valider avec npm dans ui/.

## 2026-09-15, narration par gabarits Phase 9

62 tests verts sur 14 fichiers, tsc propre. Sources internes obligatoires, chronologie triée, preuve que raconter ne modifie pas le monde.

## 2026-09-15, moteur m0.2.0 avec IA branchée

58 tests verts sur 13 fichiers, tsc propre. Mapping explicite, décisions logées par tick. Le fonceur ose autant ou plus que le prudent en test seedé.

## 2026-09-15, IA des acteurs sans API

Arbitrage dans src/sim/ai/arbitrage.ts, 4 tests verts, tsc propre. Pas de règle popularité donc X, le risque est modulé par ambition et aversion.

## 2026-09-15, /moteur boucle minimale m0.1.0

Monde à deux groupes avec ordre fixe (chocs seedés, R1, R3, R4, R5, événements, mémoire). 52 tests verts sur 12 fichiers, tsc propre. Un échec initial utile : saturation à 1 après 30 pas sur R1 constant, test recorrigé sur état complet à 12 pas. Leçon : prévoir atténuateurs et contre mobilisation dans la vraie boucle. Critère SPEC tenu : même seed même simulation, deux seeds deux trajectoires avec causes.

### Erreurs et limites

- Biais d'allocation encore sans arbitrage complet d'acteur, à brancher en Phase 8 IA.
- Contre mobilisation de l'outgroup non codée, seulement notée en fiche.
- node_modules installé localement, jamais commité.
