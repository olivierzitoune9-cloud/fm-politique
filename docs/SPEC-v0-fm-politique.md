# SPEC v0, FM politique (source de vérité du jeu)

> Statut : v0 de cadrage issue du brief du 2026-09-15, sections 1 à 56 intégrées. Tout point non tranché est marqué [À CONFIRMER] et ne structure rien.

## 1. Le produit en une page

Simulation politique émergente, France septembre 2026 comme état initial. Le joueur commence comme acteur insignifiant (employé de bureau, acteur abstrait sans représentation physique obligatoire) avec ressources, relations, réputation, organisation, influence, informations, ambitions, crédibilité, soutiens, adversaires, opportunités, contraintes. But général : obtenir du pouvoir, sans forme imposée (responsable démocratique, réformateur, président populaire, chef de parti, coalition, modéré, populiste, autoritaire progressif, dictatorial ouvert, échec, marginalisation, élimination, intermédiaires).

Le monde vit sans le joueur : partis, médias, syndicats, entreprises, administrations, associations, mouvements, réseaux, personnalités, électeurs, journalistes, fonctionnaires, forces économiques, démographie, crises, tensions, intérêts contradictoires. Chacun poursuit ses propres objectifs avec ses informations propres.

## 2. Propriétés exigées (brief sections 4, 22 à 31)

- Résultats imprévisibles mais cohérents après coup, chronologie et rapports permettant de reconstruire les chaînes causales.
- Hasard comme incertitude conditionnée (réactions humaines, contingence, info incomplète, variations statistiques, comportements stratégiques), jamais comme excuse.
- Non linéarité : petites décisions parfois déclencheuses de longues chaînes.
- Mémoire du monde : trahisons, crises, crédibilités, coalitions, effets différés sur plusieurs années.
- Multi échelles de temps : scandales et déclarations rapides, démographie et institutions lentes.
- Crises émergentes conditionnées par l'état du monde, pas scénarisées.
- Difficulté par la complexité (info imparfaite, adversaires actifs, conséquences différées, ressources limitées), jamais par triche du jeu.
- Échec possible sous formes multiples, réussite sans définition unique, stratégies sans moralité ni facilité prédéfinies, conséquences multidimensionnelles plutôt que récompenses (+popularité avec -crédibilité possibles simultanément).
- Joueur apprenant progressivement le système, comme dans Football Manager.

## 3. Joueur et information

Acteur abstrait multidimensionnel (section 11 du brief : argent, temps, information, réputation, audience, militants, relations, accès institutionnel, influence médiatique, capacité organisationnelle, légitimité, expertise, contrôle administratif, soutien populaire). Information imparfaite obligatoire (section 12) : le moteur connaît l'état exact, le joueur le découvre par sondages, rapports, médias, conseillers, statistiques, renseignements, événements, réseaux, observations, avec sources exactes, approximatives, retardées, biaisées, contradictoires, incomplètes.

## 4. Interface (brief sections 32, 33)

Pas de personnages animés requis. Interface informationnelle : tableau de bord, carte de France, données éco et démo, sondages, médias, réseaux, boîte mail, agenda, institutions, partis, acteurs, relations, chronologie, rapports, événements, graphiques, notifications, documents. Beaucoup de texte et de données : articles, rapports, messages, courriels, sondages, statistiques, publications, communiqués, débats, notes. Le joueur lit le monde.

## 5. Périmètre et jalons

- Jalon prototype : boucle minimale état du monde vers décisions des acteurs vers interactions vers évolution vers événements émergents vers nouvelle situation, sur périmètre réduit (quelques groupes, quelques médias, quelques institutions, économie simplifiée), avec seeds, tests et chronologie causale lisible. Critère de sortie : deux parties même seed donnent la même simulation, deux seeds donnent des trajectoires différentes mais chacune explicable.
- Jalons suivants : profondeur progressive (ontologie complète, France 2026 complète, IA des acteurs, narration, interface complète, calibration historique, extension).
- Hors périmètre prototype : multijoueur, 3D, personnages animés, prédiction du réel présentée comme vérité, accusations non établies contre personnes réelles (section 41 : distinguer donnée publique documentée et hypothèse du modèle, acteurs fictifs construits sur structures réelles quand sensible).

## 6. Vocabulaire et éthique du jeu

Le jeu modélise des stratégies autoritaires comme trajectoires possibles sans les recommander ni les récompenser moralement. Aucune jauge de bien ou mal, seulement des conséquences. Les limites scientifiques restent visibles (confiance, incertitude, qualité de source, désaccords).

Avertissement d'ouverture validé le 2026-09-15, affiché à la création de partie : « Simulation émergente : trajectoires possibles, jamais de prédiction du réel ni de recommandation. Certaines trajectoires d'accession au pouvoir, y compris autoritaires, sont simulées pour être comprises, jamais proposées comme des modèles. »

Mise à jour du 2026-09-16 (R8 de l'audit parcours) : la mise en garde a quitté les écrans de jeu. Elle vit en pied de page discret (MENTION_DISCRETE dans ui/sim/carriere.ts), visible sur toutes les pages, sans occuper l'espace de jeu. L'avertissement d'ouverture reste à la création de partie.

## 6.2 Gameplay du vrai jeu (validé le 2026-09-16, GO d'Aaron, partie p3.0.0)

Le prototype p2.1.0 était un MVP : une action par semaine, tout visible, un monde décor. La version p3.0.0 applique la vision (`docs/vision-gameplay-fm-politique.md`) et les jalons d'enrichissement J11 à J17 issus des deux études du 2026-09-16. Règles structurantes, toutes testées :

- **Semaine à deux étages (J15 F1)** : une action principale plus une activité de fond (repos, proches, associatif, lire et analyser). L'activité ne bloque jamais, elle déplace l'état intérieur et les compétences.
- **État intérieur (J15 F2)** : énergie et moral du personnage, qui modulent l'efficacité des actions. On ne bloque pas par manque d'énergie, on sanctionne par l'efficacité réduite (cohérent avec R7 J8).
- **Compétences (J15 F3)** : six compétences (terrain, parole, médias, relation, institution, stratégie) construites par la répétition, qui pondèrent les effets des actions et les résolutions de carrefours.
- **Dilemmes à carrefour (J16 F4, J11 E9)** : deux ou trois réponses, résultat pondéré par compétences, traits du personnage visé et contexte, effet révélé en texte, jamais chiffré à l'avance. Un carrefour reste ouvert jusqu'à ce qu'il soit tranché.
- **Personnalités qui pèsent (J16 F5)** : chaque interaction est pondérée par les traits du personnage visé (loyal, ambitieux, susceptible, idéaliste, opportuniste, cynique, rigide, empathique). Jamais un blocage, un poids.
- **Effets durables nommés (J16 F6)** : tout échec partiel laisse une trace nommée et datée (porte fermée chez un tel, réputation entamée), qui pèse chaque semaine puis s'éteint.
- **Information imparfaite sur les personnes (J17 F7, J11 E1)** : la relation ne s'affiche jamais exacte avant une connaissance mutuelle suffisante, elle s'affiche en fourchette, resserrée par les interactions. Six interactions : convaincre, promettre, demander un coup de main, trahir, recoudre, plus étudier, qui coûte du temps et n'apporte rien d'autre que mieux lire la personne.
- **Remontée longue (J17 F9, J13 E8)** : l'investiture des législatives (mai 2027) est une échéance intermédiaire décidée par ton propre camp. Sans investiture obtenue, la fin « élu député » est inaccessible, même avec les soutiens nécessaires.
- **Enjeu dominant par territoire (J11 E6)** : chaque territoire de la carte porte un enjeu dominant (chômage, usine fermée, pouvoir d'achat, sécurité, religion, écologie). Le matching entre ta marque et l'enjeu accélère ou freine l'adoption locale.
- **Promesses à échéance (J11 E10)** : toute promesse reçoit une échéance datée et une catégorie d'action attendue. Tenue, elle renforce la relation ; manquée, elle coûte relation et réputation et reste en mémoire.
- **Le monde te répond (J12 E2, E3, E11, E12)** : à partir d'un seuil de notoriété et avec des relations dégradées, un parti adverse coalisé frappe ton territoire le plus fort. Partis et médias poursuivent leurs intérêts propres sans toi. Au delà d'une organisation trop grosse, une aile déviante agit seule et crée un carrefour.
- **Profondeur de carrière (J13 E4, E5, E7, E8)** : coûts croissants par palier, corruption d'expansion (croître en soutiens sans organisation convertit la dette en risque d'enquête), dons de campagne nommés et tracés, investiture.
- **Causalité profonde (J14 E13)** : les actions de fond annoncent leurs échos retardés, le bruit d'aujourd'hui revient des semaines plus tard.
- **Saisons du calendrier (J17 F10)** : rentrée, vœux, campagne présidentielle, été politique. Chaque saison a son texte et son effet de décor.

Niveaux de preuve : chaque mécanisme porte son origine (F1 à F10 de la recherche hors politique, E1 à E14 de l'étude des jeux comparables), tous sont des hypothèses de modélisation de gameplay, jamais des faits sur la France réelle.

## 6.3 Mandat vision design (Aaron, 2026-09-16)

Aaron mandate l'application à fond de `docs/vision-gameplay-fm-politique.md` ET de `docs/vision-design-fm-politique.md` (copie fidèle vérifiée du document de l'auteur de la vision design). Le plan d'application est `docs/plan-application-vision.md` : six phases, P1 fondations du monde (graphe d'entités, mémoire des organisations), P2 boucle d'enquête (inbox, dossiers reliés, recherche, signaux faibles), P3 action riche (réunions, initiatives, délégation), P4 économie politique (euros, comptes, donneurs), P5 monde adaptatif, P6 fins racontables et stress test. Règle directrice permanente reprise du design §118 : jamais une mécanique spéciale quand une mécanique générale produit le même phénomène. Les écarts de p3.1.0 listés plus haut ne ferment rien : ils s'intègrent dans ces phases.

## 6.1 Personnages et objectif (validé le 2026-09-15, session V1 V2)

- Personnages fictifs uniquement, prénoms et noms français aléatoires seedés, jamais de personne réelle. Pas de portraits ni d'images : nom, métier, traits, relation, mémoire. Avec des personnages au delà du politique : chercheurs, historiens, ingénieurs, expertes IA, journalistes, élus, syndicalistes, entrepreneurs, fonctionnaires. Les métiers portent des hooks mécaniques (caution savante R14, amplification numérique R2, accès institutionnel, micro ciblage, fact checking).
- Les interactions humaines sont fondamentales : convoquer, convaincre, promettre, demander un coup de main, trahir, recoudre. Promesses et trahisons restent en mémoire (E6) et remontent dans les comportements.
- Le joueur choisit une ambition à la création de partie (élu, chef de parti, proposition imposée, présidentiable), évaluée sur le calendrier réel. Fins multiples, réussite sans définition unique.
