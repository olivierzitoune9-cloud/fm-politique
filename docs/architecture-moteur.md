# Architecture moteur (DATA, RULES, SIMULATION, AI, NARRATIVE, UI)

> Brief sections 20, 36, 37, 38. Le moteur est explicite et testable, l'IA ne fait jamais la causalité.

## Les six couches

1. DATA : acteurs, institutions, médias, populations, territoires, économie, relations, historique, seeds. Fichiers versionnés, chaque donnée datée, chaîne traçable donnée réelle vers indicateur vers normalisation vers variable interne.
2. RULES : mécanismes de la bibliothèque avec conditions, renforçateurs, atténuateurs, effets opposés, probabilités conditionnelles, contraintes, bornes anti explosion. Chaque règle a sa fiche (variable, définition, causalités, preuves, limites, sources, hypothèses).
3. SIMULATION : boucle à pas de temps multi échelles (quotidien médiatique, mensuel politique et économique, annuel démo et institutionnel). Ordre fixe : chocs exogènes seedés, décisions des acteurs, interactions, mise à jour d'état, détection d'événements, écriture mémoire.
4. AI : chaque acteur arbitre entre objectifs concurrents (popularité, coalition, scandale, base, institution, ressources, attaque, risque) selon état, croyances et relations. Pas de règle popularité supérieure à 50 donc X. Utilités explicites et journalisées.
5. NARRATIVE : transforme les transitions d'état en articles, messages, notifications, rapports, descriptions, avec sources internes au monde (tel média, tel sondage biaisé). Le narratif raconte, il ne décide jamais.
6. UI : tableaux, carte, sondages, chronologie causale, graphiques, boîte mail, agenda. Lecture du monde, pas de personnages.

## Seeds et reproductibilité

Seed plus version moteur égale même simulation. Deux seeds donnent deux trajectoires. Journal des tirages par règle pour déboguer, rejouer, comparer, tester une modification.

## Tests et garde-fous

Unitaires par règle, interactions, simulations longues, stabilité, cohérence, extrêmes, performance. Alertes d'absurdité : institution toute puissante sans raison, micro action détruisant tout, acteur sans ressources dominant toujours, variable explosive, stratégie toujours optimale, caractéristique dominant tout. Calibration qualitative sur histoire et données (élections, crises, économie) sans prétendre prédire.

## Ce qu'on ne fait pas

Pas de génération libre comme moteur, pas de scénario caché, pas de triche de difficulté, pas d'accusation non établie contre personne réelle, pas de récompense morale du pire. La difficulté vient de la complexité et de l'info imparfaite.
