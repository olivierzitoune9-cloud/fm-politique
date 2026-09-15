# Audit sécurité du 2026-09-15 (avant jalon boucle jouable)

## Périmètre

Moteur local, aucune route publique, aucune donnée élève, aucun paiement. Secrets, dépendances, sauvegardes.

## Constats

- Secrets : aucun fichier .env présent, historique sans .env, scan des motifs de clés vide sur docs, src et ui. [OK]
- Hook : core.hooksPath à .githooks, pre-commit présent et déjà testé bloquant. [OK]
- .gitignore : couvre .env*, node_modules, .next, dist, logs. [OK]
- Dépendances prod : npm audit prod zéro vulnérabilité. [OK]
- Dépendances dev : 5 vulnérabilités via vitest et vite et esbuild (3 modérées, 1 haute, 1 critique), correctif exigerait vitest 5 en breaking change. Décision : pas d'application sauvage, on reste en vitest 2 et on réévalue au prochain jalon. [Écart signalé]
- Routes et API : aucune route publique, page Next serveur lisant le moteur local. Pas de validation d'entrée requise à ce stade. [OK sans objet]
- Sauvegardes : monde local seedé, VERSION_MOTEUR m0.2.0 plus graine, tirages journalisés. Aucune donnée sensible, aucune personne réelle au delà du public documenté. [OK]

## Correctifs appliqués

Aucun requis ce jour, hors note dev ci dessus.

## Reste pour Aaron

Rien de bloquant. Valider le report de la montée vitest 5 au prochain jalon.
