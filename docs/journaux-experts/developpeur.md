# Journal du pôle développeur simulation

## 2026-09-16, le vrai jeu : J15 à J11 à J17, partie p3.0.0

### Contexte courant

GO d'Aaron : pas de commit avant la fin, une session unique de transformation, priorité au document vision puis aux jalons d'enrichissement. Livré d'une traite, partie p3.0.0 (migration douce depuis p2.1.0), moteur inchangé m0.4.0.

Nouveaux modules et mécanismes, tous testés :
- `ui/sim/dilemmes.ts` (neuf) : catalogue de cinq carrefours conditionnés (bascule normative, demande de sauveur, vœux de janvier, escalade d'antenne, passé fouillé), résolution pondérée par compétence et traits, effet durable sur échec, promesse possible. Aucun aléa gratuit : chaque dilemme a sa condition.
- `ui/sim/carriere.ts` : effets durables nommés (avancerEffetsDurees, surcoutEffetsDurees), promesses à échéance (Promesse), dons nommés (DonCampagne), coûts croissants par palier (coutPalier), corruption d'expansion (corruptionExpansion), investiture à trois états.
- `ui/sim/personnages.ts` : connaissance mutuelle par personnage, estimationRelation en fourchette (F7), poidsTraits (F5) sur onze traits.
- `ui/sim/interactions.ts` : traits pondérés dans convaincre, promettre, demander un coup de main, trahir, recoudre ; connaissance qui monte ; promesse datée créée et retournée à l'orchestrateur ; sixième interaction étudier (E1), qui coûte du temps et n'apporte que la connaissance.
- `ui/sim/courrier.ts` : enjeu dominant par territoire et matchingMarqueEnjeu (E6), propagerTerritoires accepte un vecteur de matching optionnel (comportement p2.1.0 conservé par défaut).
- `ui/sim/partis.ts` : frappeAdverse, coalition conditionnée par notoriété et relations dégradées, ciblage du territoire le plus fort.
- `ui/sim/temps.ts` : échéance investitures-2027 (mai 2027, entre les deux tours et les législatives), saisonDuTick et LIBELLES_SAISON.
- `ui/sim/partie.ts` : semaine à deux étages, efficacité issue de l'état intérieur, compétences qui pondèrent, fatigue, promesses réglées, dilemmes ouverts et tranchés, frappe adverse, investiture, saisons, enquêtes indépendantes, aile combative, écho retardé annoncé. Fins : nouvelle fin investiture-ratee, fin élue conditionnée à l'investiture obtenue.
- `ui/app/partie/page.tsx` : panneau carrefour, second étage de la semaine, énergie et moral, compétences, badges effets durables et promesses et dons, saison, coûts de palier, relation estimée, enjeux sur la carte, catégorie attendue d'une promesse.

Simplification assumée : J14 est livrée en version annoncée (l'écho retardé est daté dans le journal), la file d'effets chiffrés retardés reste à faire, elle viendra avec la causalité économique profonde.

### Vérifications du jour

- npm run typecheck : propre (rapport-typecheck.txt).
- npm test : 33 fichiers, 159 tests passés, zéro échec (rapport-tests.txt). Trois échecs initiaux traités : ordre des échéances (investitures insérées avant les législatives), test de migration mis à jour vers p3.0.0, test des fins tenant compte de l'investiture.
- next build : vert, 6 pages générées, /partie 23,2 kB (rapport-build.txt).

### Erreurs et limites

- Import `LIBELLES_ENJEU` laissé dans partie.ts après déplacement vers la page : retiré au nettoyage.
- Deux tests neufs d'abord fragiles : un cherchait un événement de bascule au hasard dans le moteur (remplacé par un événement injecté, déterministe), l'autre attendait une baisse d'énergie après régénération hebdomadaire (remplacé par un test direct de appliquerFatigue). Leçon : un test neuf doit fixer son entrée, pas l'espérer.
- Terminal toujours sans sortie capturable : toutes les vérifications passent par des fichiers de rapport, lus ensuite.

## 2026-09-16, retouches audit, fin retour-ordinaire, typecheck réparé

### Contexte courant

Retouches 1 à 5 de l'audit parcours exécutées après GO d'Aaron : bouton semaine remonté près du bandeau, sondage commandé débité en temps et argent dans jouerSemaine (y compris le sondage gratuit du bar), libelleGroupe sur toute la vue et la dicibilité, mémoire en badges dans les fiches avec trahison marquée grave, module pur ui/sim/traces.ts plus test plus branchement écran (clé fm-politique:traces, survit au rejouer même graine, parties finies retracées à la réouverture). Au passage, fin retour-ordinaire réparée (>= au 2026-04-02 au lieu de > au 2026-04-01). Import manquant CategorieAction dans carriere.ts (code J15 écrit en fin de session) réparé.

### Vérifications du jour

- npm run typecheck : propre après réparation de l'import (vérifié par fichier de sortie, terminal toujours incapturable).
- npm test : 31 fichiers, 137 tests passés, zéro échec.
- next build : non rejoué, à faire avant tout commit.

### Erreurs et limites

- Suppression des fichiers de rapport dans la même commande que la génération, avant lecture : leçon retenue, toujours lire le rapport avant de le nettoyer.
- Terminal sans sortie capturable depuis le début de la session : toute affirmation de vérification s'appuie sur les fichiers de sortie lus ensuite, jamais sur l'écho du shell.

## 2026-09-16, rafale jalons J10 J7 J8 J9 J3 J4 J5

### Contexte courant

Partie p2.1.0 en place, sans commit ni vérification terminal possible depuis ici. J10 : clic semaine répondant toujours avec raison affichée, bandeau nom plus métier d'origine plus statut neutre « Citoyen sans mandat », mise en garde en pied de page. J7 : paliers 1 à 5 sur actions, personnages, médias, manoeuvres. J8 : sanctions au lieu des blocages. J9 : dix origines avec vecteurs, six ambitions avec objectifs à paliers, graines expliquées. J3 : douze territoires avec propagation et réponse adverse, migration douce p2.0.0. J4 : trois sondages commandables. J5 : calibration 40 parties de 24 semaines. Fichiers touchés : ui/sim/partie.ts, ui/sim/carriere.ts, ui/sim/actions.ts, ui/sim/courrier.ts, ui/sim/sauvegarde.ts, ui/app/partie/page.tsx, ui/app/nouvelle-partie/page.tsx, ui/app/layout.tsx, styles tableau-de-bord, tous les tests concernés, docs suivi plan history.

### Vérifications du jour

- Relecture statique par fichiers : paliers présents sur les 20 actions, imports courrier et carriere alignés, migration sauvegarde tolérante, fins maire 2032 et européenne 2029 datées par tickDeDate.
- Non rejoué ici : npm.cmd run typecheck, vitest run, next build. À rejouer par Aaron avant tout commit.
- Revue adversariale, audits parcours et sécurité, tutoriel par courrier : restant dus avant mise en ligne.

### Erreurs et limites

- Terminal inutilisable depuis ici : politique d'exécution PowerShell plus capture sans sortie. Leçon : ne pas promettre de vérification chiffrée sans sortie réelle, l'écrire comme limite en tête.
- layout.tsx importe le moteur dans un composant serveur : acceptable Next mais à surveiller au build, repli possible en mention écrite en dur si le build râle.
- Le moteur de base garde 2 groupes et 3 acteurs, la carte compose au-dessus : la fusion complète reste un choix futur, assumé.

## 2026-09-15, V1 et V2 du prototype au vrai jeu

### Contexte courant

V1 (partie p1, commit 38696cc) et V2 (partie p2.0.0) livrées en session. Nouveaux modules : temps.ts (calendrier réel, tick égale semaine depuis 2026-09-07, échéances plausibles datées), personnages.ts (15 profils fictifs nommés seedés avec hooks métiers), carriere.ts (statuts FM, ambitions, ressources hebdo), actions.ts (20 actions mappées R1 R2 R9 R10 R11 R12 R15 R22 et coups moteur), interactions.ts (convaincre promettre demander trahir recoudre avec mémoire), partie.ts (orchestrateur : monde qui tourne, multiplicateurs, fins multiples), sauvegarde.ts (JSON versionné, refus propre), medias.ts (vigilance, audiences, amplification, fact checking), propositions.ts (R9 dicibilité), partis.ts (leaders nommés, manoeuvres, relations), data/economie.ts (chômage mensuel 2026-2028, premier point observé Insee, suite hypothèse).

### Vérifications du jour

- npx vitest run : 126 tests verts sur 30 fichiers (dont calibration 200 parties et calibration V2 40 parties de 24 semaines bornées).
- npx tsc --noEmit : propre, racine et ui/.
- next build : vert, 6 pages générées (/, /nouvelle-partie, /partie).
- Déterminisme vérifié : même seed rejoue pareil sur 12 semaines, deux seeds divergent.

### Erreurs et limites

- Quatre échecs initiaux corrigés : off-by-one tickDeDate (floor et non ceil), tick 2027 estimé à la main dans un test (remplacé par tickDeDate), divergence de seed testée sur la carrière alors que le monde ne diverge que par les chocs, message de sauvegarde.
- Le moteur de base garde 2 groupes et 3 acteurs : la V2 compose au-dessus (économie, médias, partis, proposition), la fusion complète dans la boucle est un choix de J3.
- Off-by-one dans un simulateur de date : leçon retenue, toujours écrire l'aller-retour date-tick comme test avant la fonction.


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

## 2026-09-15, Phase 12 et partie de ce soir

Moteur m0.4.0, tests ciblés verts, serveur dev 3123 vérifié 200 sur / et /partie. Full suite à rejouer au prochain point.

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
