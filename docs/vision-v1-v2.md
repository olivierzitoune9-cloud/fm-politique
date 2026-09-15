# Vision v1 v2, du prototype au vrai jeu

> Écrite le 2026-09-15 après arbitrage d'Aaron. Ce doc est la vision de jeu durable, la SPEC garde le contrat, ce doc garde l'expérience voulue. Inspirations assumées et traduites : Football Manager pour le rituel et la carrière, Plague Inc pour la propagation et la réaction du monde.

## L'expérience voulue

Tu es un acteur insignifiant (employé de bureau) dont l'idée se propage dans un pays qui vit. La carte te dit où ça prend, le courrier te dit comment et pourquoi, les personnages te disent à qui tu dois quelque chose, l'arbre de ce que tu peux venir plus tard (J3). Aucune restriction de trajectoire, plus c'est complet et réaliste mieux c'est, sans jamais coder le réel comme vérité.

## Pillier 1, Football Manager : le rituel hebdomadaire

- Calendrier réel : tick égale semaine, démarrage lundi 2026-09-07, échéances datées du calendrier politique français (présidentielle et législatives 2027, départementales régionales 2027, européennes 2029, municipales 2032).
- Boîte mail en écran central : courrier des personnages nommés, presse, rapports, sondages. Le joueur lit le monde.
- Carrière par étapes : employé de bureau, militant, responsable local, conseiller, élu. Statut visible, progression conditionnée, jamais un simple level up.
- Ressources hebdo à allouer : temps, argent, audience. Les actions coûtent, tout ne peut pas être fait.
- Information imparfaite : l'écran ne montre que la vue filtrée, sondages approximatifs, rapports biaisés.

## Pillier 2, Plague Inc : la propagation et la réaction du monde

- L'idée se propage par vecteurs : médias, bouche à oreille, militants, réseaux. Adoption par groupe et territoire.
- Arbre d'améliorations à venir (J3) : marque, lexique, implantation, structures, payé en points gagnés par l'activité.
- Barre de réponse adverse : les médias et institutions étudient ton mouvement et révèlent progressivement tes traits (R12 décodage), la vigilance monte avec ta visibilité (R2, R11, M14, M20).
- Tension core : croître dans l'ombre (R22) contre être visible et fort mais découpé en cible.

## Pillier 3, les personnages (exigence Aaron, fondamentale)

- Personnages fictifs, prénoms noms français aléatoires seedés, jamais de personne réelle, sans image ni avatar.
- Toute la société, pas seulement le politique : chercheur économiste, experte IA, ingénieur plateforme, historien, journaliste favorable, fact checker, élus locaux, syndicaliste, entrepreneur, fonctionnaire, figure associative, leaders de partis rivaux.
- Chaque métier porte un hook mécanique réel : caution savante (R14 multiplicateur), amplification numérique (R2), micro ciblage IA (efficacité média en hausse, coût en méfiance info), respectabilité historienne (R12 respectabilité), accès institutionnel (R16), information interne (révèle l'état réel mieux que les sondages), contacts croisés (atténuateur R1), financement (argent avec mémoire de dette).
- Interactions : convaincre, promettre, demander un coup de main, trahir, recoudre. Promesses non tenues et trahisons restent en mémoire et remontent dans les comportements. C'est la mémoire du monde de la SPEC, incarnée dans des gens.

## Pillier 4, l'objectif du joueur

- Choix d'ambition à la création : être élu (législatives juin 2027 par défaut), prendre la tête d'un parti, imposer une proposition dans le débat puis dans la loi, viser la présidentielle 2027 en outsider.
- Progression observable dans une fiche de carrière FM : statut, soutiens, ressources, jalons franchis.
- Fins multiples évaluées par le moteur, jamais scriptées : objectif atteint, marginalisé, brûlé médiatiquement, sous enquête, pourrissement, fin de calendrier. Aucune jauge de bien ou mal.

## Ce que V1 et V2 livrent

- V1 (moteur m0.5.0) : personnages, interactions, calendrier, ambition, 16 à 20 actions, ressources, boîte mail, fins, sauvegarde locale versionnée, création de personnage, partie jouable de bout en bout.
- V2 (moteur m0.6.0) : partis rivaux organisés avec leaders qui arbitrent, médias avec biais et audiences, propositions avec dicibilité, économie mensuelle branchée, maximum de règles R1 à R22 branchées avec motif écrit pour les écartées.
- Plus tard : J3 propagation et carte, J4 info imparfaite profonde, J5 audits et déploiement.

## Garde-fous

Le moteur reste TypeScript pur, seedé, testé, sans React. Le narratif raconte, ne décide jamais. Les IA arbitrent avec des utilités journalisées. Le hasard est conditionné, jamais une excuse. Aucune donnée réelle codée sans source et niveau de preuve. Trajectoires autoritaires simulées, jamais recommandées ni récompensées moralement.