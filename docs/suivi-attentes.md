# Suivi des attentes

## Attentes en cours

- Mandat d'Aaron (2026-09-16, soir) : appliquer à fond les DEUX visions, gameplay (docs/vision-gameplay-fm-politique.md) et design (docs/vision-design-fm-politique.md, copie vérifiée de l'auteur). Plan d'application acté dans docs/plan-application-vision.md : six phases P1 à P6, une à la fois, tests et build à chaque phase, tensions portraits/paliers/fins laissées à l'arbitrage. P1 a été démarrée le 2026-09-16 soir puis coupée par un bug avant clôture : brouillon de référence ui/sim/monde-social.ts, non intégré, non testé ; clôture faite le 2026-09-17, dépôt rendu vert (172 tests, tsc propre, build 6 pages). La prochaine action est l'intégration de P1 (brancher le graphe dans creerPartie et la sauvegarde, carte visible pilotée par le palier, tests dédiés), en corrigeant au passage les résidus p3.1.0.

- Nouveau retour prioritaire d'Aaron (2026-09-16, après p3.1.0) : sortir de la page unique, ressources concrètes en euros avec portefeuille et flux, temps intelligible, interactions plus riches, conséquences expliquées et consultables dans des dossiers reliés. Diagnostic et plan enregistrés dans docs/retours-joueur-2026-09-16.md et journal design. Pas de code exécuté pour ce nouveau périmètre. Prochaine proposition : boucle complète inbox → dossier → financement/rendez-vous → résultat → suites, pas un simple découpage de composants en pages. Audit de conformité à la vision à reprendre avec renvois de sections vérifiés.

- État final vérifié du correctif p3.1.0 (2026-09-16) : 172 tests passés sur 34 fichiers, build Next.js aboutie. C1/C2/C4 sont PARTIELS, contrairement aux mentions « livrés » plus bas : plafond écran de 12 et répétition interdite, contrôle des moyens non cumulatif, aperçu des risques approximatif et total visible incomplet. Une seule interaction humaine et seule la première action transmise au monde. Ces limites doivent être corrigées avant de déclarer le rythme conforme à la vision. Pas de commit ni de push effectué pour ce chantier.

- Audit sécurité sim : à lancer avant tout déploiement (audit parcours fait le 2026-09-16, verdict publiable avec retouches).
- Tutoriel par courrier (J5 restant), puis déploiement GitHub et Vercel par Aaron avec Root Directory ui.
- Arbitrage demandé : étude des jeux comparables (2026-09-16) propose quatre jalons d'enrichissement J11 info incarnée, J12 le monde te répond, J13 profondeur de carrière, J14 causalité profonde, recommandation J11 d'abord. Aucun ne démarre sans oui d'Aaron.
- Arbitrage demandé : recherche gameplay hors politique (2026-09-16) propose trois jalons J15 richesse de semaine, J16 dilemmes et personnalités, J17 information et remontée, recommandation J15 d'abord. À arbitrer avec J11 à J14, les deux familles ne se recouvrent que sur l'information (E1 et F7 se croisent).

- Arbitrage soldé le 2026-09-16 : GO d'Aaron pour une session unique de transformation, priorité au document vision (docs/vision-gameplay-fm-politique.md) puis aux jalons J11 à J14 (étude jeux comparables) et J15 à J17 (recherche hors politique). Consigne : tout appliquer dans la même session, commit et push seulement à la fin, une fois le jeu transformé. Exécuté : partie p3.0.0, 159 tests verts, build vert.
- Restant dû après la transformation : file d'effets chiffrés retardés (J14 complet), revue adversariale des règles neuves (dilemmes, frappe adverse, investiture), vérification visuelle des nouveaux blocs par le pôle design.
- Arbitrage soldé le 2026-09-16 (même session) : revue adversariale gameplay livrée (docs/revue-adversariale-gameplay-2026-09-16.md, G1 à G10 contre vision sections 1 à 63), puis exécution immédiate sur consigne d'Aaron : « une action principale par semaine, c'est une connerie, suivre voire dépasser le document vision ». C1 multi coups, C2 risque affiché avant le clic, C4 agenda comme file avec total, C5 fatigue intra-semaine : livrés, partie p3.1.0, 171 tests verts, tsc propre, build vert. Reste du chantier ordonné : C3 réunions, C6 initiatives de personnages, C7 vie interne d'organisation, C8 scandales nommés, C9 processus de réforme, C10 mouvements sociaux.


## Réglées

- 2026-09-16 : retouches 1 à 5 de l'audit parcours livrées (bouton remonté, sondage débité, libellés français, mémoire visible en fiche, traces de fins avec module traces.ts et tests). Fin retour-ordinaire réparée (>= au 2026-04-02). 137 tests verts, tsc propre (réparation d'un import manquant en fin de session, ui/sim/carriere.ts).
- 2026-09-16 : étude des jeux comparables livrée dans docs/etude-jeux-comparables-2026-09-16.md (12 jeux, E1 à E14, J11 à J14 proposés). FM politique garde une avance sur trois points que personne du corpus ne fait : information imparfaite documentée à l'écran, dicibilité comme échelle explicite, calibration par graine.

> Lu en ouverture de chaque session, mis à jour avant fermeture. Une ligne réglée part en Réglées avec date, jamais effacée.

## En attente

| Ajoutée | Sujet | Source | Responsable | Échéance |
|---|---|---|---|---|
| 2026-09-15 | Choisir le nom définitif du jeu (FM politique reste le nom de code) | Aaron, arbitrage session V1 V2 | Aaron | Avant la V1 publique |
| 2026-09-15 | Degré de réalisme des personnes et médias réels contre fictifs (défaut actuel : tout fictif avec noms aléatoires) | Brief section 41 | Aaron | V2 ou J3 |
| 2026-09-15 | Fiches détaillées par mécanisme requalifiées en carburant des jalons, plus jamais prérequis | Arbitrage session V1 V2 | Pôle recherche | Au fil des jalons |
| 2026-09-15 | Créer le dépôt GitHub fm-politique puis l'importer sur Vercel avec Root Directory ui, pour mettre le jeu en ligne et que chaque envoi redéploie | Choix d'Aaron session design | Aaron | Dès que possible |
| 2026-09-16 | Audit sécurité de la simulation (/audit-securite-sim) avant toute mise en ligne, revue adversariale des points sensibles incluse | Plan de session, clôture audit parcours | Pôle sécurité | Avant déploiement Vercel |
| 2026-09-16 | Tutoriel par courrier (J6), première semaine guidée dans la boîte mail | Plan d'implementation jalons | Pôles design et moteur | V1 publique |
| 2026-09-17 | Intégration P1 : brancher creerMondeSocial (ui/sim/monde-social.ts) dans creerPartie et la sauvegarde, carte visible pilotée par le palier, tests dédiés ; reprendre du brouillon supprimé la mémoire par organisation fenêtrée et les alliances et rivalités initiales | Clôture 2026-09-17, HISTORY et journal développeur | Pôles développeur et design | Prochaine session |
| 2026-09-17 | Arbitrage d'Aaron : commit et push du dépôt vert (p3.1.0 consignée, brouillon P1 monde-social.ts, docs de clôture) ou maintien en local | Clôture 2026-09-17 | Aaron | À arbitrer |

## Réglées

| Réglée le | Sujet | Où c'est consigné |
|---|---|---|
| 2026-09-16 | Cinq retouches d'audit parcours exécutées après GO d'Aaron : bouton semaine remonté, sondage commandé débité dans jouerSemaine, libellés français des groupes à l'écran et dans la dicibilité, mémoire visible en badges dans les fiches, trace des fins persistée et affichée (ui/sim/traces.ts plus test) | ui/app/partie/page.tsx, ui/sim/joueur.ts, ui/sim/courrier.ts, ui/sim/traces.ts, docs/audit-parcours-joueur-2026-09-16.md |
| 2026-09-16 | Rafale jalons J10 J7 J8 J9 J3 J4 J5 : clic semaine répondant toujours, métier d'origine dans le bandeau, paliers 1 à 5, sanctions au lieu des blocages, mise en garde en pied de page, graines expliquées, dix origines et six ambitions, carte douze territoires, sondages commandables, calibration 40 parties | ui/sim/partie.ts p2.1.0, ui/sim/carriere.ts, ui/sim/actions.ts, ui/sim/courrier.ts, ui/app/partie/page.tsx, ui/app/nouvelle-partie/page.tsx |

| Réglée le | Sujet | Où c'est consigné |
|---|---|---|
| 2026-09-15 | Valider le nom du jeu et du workspace (FM politique provisoire conservé comme nom de code, nom final reporté sans bloquer) | docs/suivi-attentes.md ligne en attente |
| 2026-09-15 | Trancher l'avertissement d'ouverture : texte de src/sim/joueur.ts enrichi de la mention des trajectoires autoritaires possibles et jamais recommandées | docs/SPEC-v0-fm-politique.md section 6, src/sim/carriere.ts |
| 2026-09-15 | Ontologie v1 validée telle quelle avec simplifications moteur assumées, v2 planifiée aux jalons | HISTORY.md, docs/vision-v1-v2.md |
| 2026-09-15 | Fiches vidéo première passe : requalifiées en carburant, l'attente d'antériorité à /ontologie est caduque (ontologie v1 déjà livrée et testée) | docs/suivi-attentes.md, HISTORY.md |
| 2026-09-15 | Poser le hook anti fuite git et la validation des fichiers de config, dépôt initialisé et testé | .githooks/pre-commit, .gitignore, commit 021a13c |
| 2026-09-15 | Stack prototype : Next.js App Router plus moteur TS pur seedé, sans Supabase ni Stripe | AGENTS.md, CLAUDE.md |
| 2026-09-15 | Primauté méthode : base transverse Wisâl instanciée, jamais dupliquée | README.md |
| 2026-09-15 | Design du jeu : recherche réelle et sourcée plutôt que copie de Football Manager ou Plague Inc, pôle design créé et doctrine écrite | docs/design-system-fm-politique.md, docs/journaux-experts/design.md |
