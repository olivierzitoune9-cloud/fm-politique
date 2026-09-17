# Revue adversariale gameplay, 2026-09-16

> Consigne d'Aaron : suivre à 100 % le document vision gameplay, revue adversariale sur le gameplay surtout, enchaîner.
> Portée : vision-gameplay-fm-politique.md sections 1 à 63 contre partie p3.0.0 (moteur m0.4.0).
> Méthode : chaque écart est noté avec section vision, état réel vérifié dans le code, correctif proposé.
> Statut : revue seule, aucun code touché ici. Le chantier qui suit est noté en fin de document.

## Réserve finale, 2026-09-16

La livraison annoncée en fin de document est PARTIELLE : 172 tests verts sur 34 fichiers ne prouvent pas la conformité à la vision. Plafond écran de 12 actions et répétition interdite ; moyens vérifiés sans déduction cumulative des coûts ; une seule interaction humaine ; seule la première action envoyée à la boucle du monde. C2 estime le risque, ne garantit pas une égalité ; C4 visible omet certains engagements. Reprendre ces points avant validation de C1/C2/C4. Pas de contrôle visuel effectué.


## Verdict en une phrase

Le jeu a la densité d'un jeu de plateau (un coup par semaine) là où la vision exige la densité d'un FM
(sections 9, 10, 13, 14, 15) : une semaine de vie politique réelle contient dix micro décisions, pas une.
Tant que la semaine reste à un coup, tout le reste reste du décor posé sur un rythme faux.

## Écarts critiques (le jeu ment sur son rythme)

### G1. Une action principale par semaine, c'est faux (vision 9, 10, 13, 14, 15)

État réel : `TourSemaine.actionId: string` (ui/sim/partie.ts ligne 102), un seul coup résolu par
`jouerSemaine`. L'activité de fond (J15 F1) et l'interaction existent mais ce sont des suppléments,
pas des coups à part entière : un seul terrain par semaine, un seul visage par semaine.

Ce que la vision exige : section 9 (toujours quelque chose d'utile à faire), section 10 (décider vite
et souvent), section 13 (des réunions, pas une réunion), section 14 (un emploi du temps, pas un bouton),
section 15 (dix personnes, pas une). Sur FM on enchaîne formation, recrutement, causerie, avant-match
dans la même semaine. Dans la vie on tracte le matin, on voit un élu l'après-midi, on écrit le soir.

Correctif C1 : la semaine devient un budget à répartir. `TourSemaine` reçoit `actions: string[]`
(plusieurs coups de terrain dans la même semaine), chacun débité en temps et argent, chacun résolu
dans l'ordre avec son journal, chacun avec son risque affiché avant validation. Le temps (1.0 par
semaine, section 14) est la vraie limite, pas le nombre de coups. Le coup forcé (J8, R7) reste : on
peut dépasser, on paie en dette, fatigue, réputation.
Critère C1 : 40 parties de 24 semaines avec 1 à 3 coups par semaine restent bornées 0..1,
tests verts dont déterminisme et fatigue intra-semaine. Version p3.1.0, migration p3.0.0.

### G2. Le risque n'est jamais montré avant le clic (vision 11, 23, 24, 25)

État réel : coûts temps et argent visibles, mais risque d'enquête, exposition et coût réputation
jamais écrits avant validation. Le joueur clique puis lit le journal. Section 11 exige : avant chaque
décision, ce que je risque si ça tourne mal doit être écrit.

### G3. Les réunions n'existent pas (vision 13)

État réel : aucune action de réunion. chercher-coalition et diner-notables sont des coups instantanés
sans participants nommés, sans compte rendu. Section 13 exige : préparer, tenir, exploiter.

Correctif C3 : les deux actions coalition deviennent des réunions à participants (2 à 3 personnages
nommés, traits visibles). La préparation augmente le rendement de la réunion suivante.

### G4. L'agenda ne décide de rien (vision 14)

État réel : genererAgenda renvoie 4 échéances fixes (ticks 5, 10, 15, 20), jamais liées au calendrier
réel, jamais créées par le joueur. Section 14 exige : le joueur pose ses rendez-vous, le temps se remplit.

Correctif C4 : l'agenda devient la file des coups choisis pour la semaine, coût temps additionné affiché
avant validation.

### G5. La semaine n'a pas de dépendances internes (vision 10, 48)

État réel : l'ordre de résolution est fixe mais les coups ne se parlent pas. Section 48 exige synergies
et incompatibilités (la fatigue du matin pèse le soir).

Correctif C5 : résolution séquentielle, fatigue et efficacité mises à jour entre chaque coup (le 3e coup
d'une semaine chargée paie moins que le 1er). Test d'ordre à coups identiques.

## Écarts sérieux (le jeu est juste mais maigre)

### G6. Personnages sans vie propre visible (vision 21, 50)

Mémoire et traits qui pèsent (J16 F5), mais entre deux interactions rien de lisible. Correctif C6 :
0 à 1 initiative de personnage par semaine, tirée seedée, lue dans le courrier.

### G7. Organisations sans vie interne (vision 17, 18, 19, 20)

L'organisation est un nombre, pas de membres nommés ni de vote interne. Correctif C7 : antenne locale
avec 3 membres nommés seedés + vote interne avant chaque montée de palier.

### G8. Scandale qui n'émerge de rien (vision 51)

Le risque monte, la fin sous-enquete tombe, mais aucun scandale nommé. Correctif C8 : risque > 0.7,
un scandale nommé naît (personnage + faute + média enquêteur), avec couverture et frappe ciblée.

### G9. Réformes sans processus (vision 52, 53, 54)

La proposition monte en dicibilité (R9), jamais en texte discuté et voté. Correctif C9 : 3 étapes
(texte, négociation, vote) avec soutiens et opposants nommés, chacun avec son prix.

### G10. Mouvements sociaux absents (vision 55)

soutenir-mouvement donne +légitimité instantané, aucun cycle de vie. Correctif C10 : 1 mouvement nommé
par partie quand la détresse monte, 4 états (naissant, massif, divisé, récupéré ou éteint).

## Écarts modérés (simplifications assumées)

- G11 (vision 28, 35, 56) : 2 groupes au lieu de 6 à 8, carte abstraite.
- G12 (vision 30, 32, 33, 34) : sondages sans institut nommé, conseillers jamais en désaccord.
- G13 (vision 36 à 42) : partis à 2 sans congrès ni courant.
- G14 (vision 43 à 46) : économie sans budget de l'État, pas de crise nommée. J14 file due.
- G15 (vision 47, 49) : élections en seuils, pas de campagne au jour le jour.

## Ce que la revue épargne (conforme, ne pas casser)

- Paliers 1 à 5 avec masquage (J7, vision 31) : garder.
- Sanction plutôt que blocage (J8, vision 25) : garder, étendre au multi coups.
- Info en fourchette (J11 E1, J17 F7, vision 37) : garder, étendre aux risques.
- Investiture comme remontée longue (J13 E8, J17 F9, vision 48) : garder.
- Frappe adverse conditionnée (J12, vision 22, 26) : garder.
- Coûts croissants et corruption d'expansion (J13, vision 15, 25) : garder.

## Chantier ordonné (consigne d'Aaron : enchaîner)

1. C1 multi coups : TourSemaine.actions, résolution séquentielle, agenda = file, tests bornes
   + déterminisme + fatigue intra-semaine. Version p3.1.0, migration p3.0.0.
2. C2 risque affiché : fonction pure + affichage + test d'égalité.
3. C4 agenda comme file : total temps avant validation, test pur.
4. C5 dépendances intra-semaine : fatigue entre coups, test d'ordre.
5. Puis C3, C6, C7, C8, C9, C10, chacun avec tests, jamais deux en même temps.
6. Clôture : typecheck + 40 parties + build, HISTORY, suivi, journaux, graphe.

Correctif C2 : chaque action affiche son risque dans la liste des coups, calculé par une fonction pure
testée. Critère : le risque affiché égale le risque appliqué à efficacité 1.

Correctif C2 : chaque action affiche son risque dans la liste des coups, calculé par une fonction pure
testée. Critère : le risque affiché égale le risque appliqué à efficacité 1.

## Exécution du chantier (2026-09-16, même session)

C1, C2, C4 et C5 livrés d'une traite, partie p3.1.0, migration douce p3.0.0 conservée dans sauvegarde.ts.

- C1 : `TourSemaine.actions?: CoupSemaine[]` (ui/sim/partie.ts), l'ancien `actionId` reste le premier coup.
  `listeCoupsSemaine` ne plafonne rien : le moteur prend la file telle quelle, la limite du monde reste
  le temps et l'argent. Résolution dans l'ordre choisi : chaque coup débite
  temps et argent au palier courant, gagne sa compétence, fatigue avant le suivant, écrit son journal.
- C2 : `risqueAction(actionId, temps, argent, palier)` fonction pure, même calcul que l'application à
  efficacité 1, affiché dans la liste des coups (ui/app/partie/page.tsx) avant validation.
- C4 : `totalSemaine(tour, palier)` fonction pure, total temps et argent de la semaine affiché avant
  validation, dépassement signalé comme semaine forcée, jamais bloqué (R7 J8 conservé).
- C5 : fatigue appliquée entre deux coups (appliquerFatigue à chaque coup), efficacité recalculée par
  coup, le troisième coup d'une semaine chargée paie moins que le premier.
- Écran : file de coups réordonnable par retrait, bouton « Jouer la semaine (n coups) », total d'agenda.

Arbitrage d'Aaron, intégré en fin de chantier : le plafond de 4 coups d'abord posé a été retiré. Aucun
plafond dans le moteur : la limite réelle reste le temps (1.0 par semaine) et l'argent, le coup forcé
reste possible et sanctionné. L'écran garde un seul garde anti-spam (MAX_COUPS_ECRAN, 12) pour la liste
cliquable, hors moteur et hors sauvegarde. Un vrai calendrier hebdomadaire (C4 profond, vision 14)
remplacera ce garde.

Vérifications : 34 fichiers, 171 tests verts dont ui/sim/semaine.test.ts (neuf, 11 tests : ordre des
coups, fatigue intra-semaine, déterminisme, bornes 0..1 sur 40 parties à 1-3 coups, risque affiché
égale appliqué, total d'agenda), tsc propre, next build vert (6 pages, /partie 24,7 kB).

Limites de l'exécution : le moteur du monde ne voit que le premier coup (optionId du pas), les coups 2
à 4 restent hors boucle IA jusqu'à C6 ; le routage média est partagé par la semaine, le choix par coup
existe dans le type mais pas encore à l'écran.

