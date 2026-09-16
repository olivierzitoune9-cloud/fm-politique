# Suivi des attentes

## Attentes en cours

- Audit sécurité sim : à lancer avant tout déploiement (audit parcours fait le 2026-09-16, verdict publiable avec retouches).
- Tutoriel par courrier (J5 restant), puis déploiement GitHub et Vercel par Aaron avec Root Directory ui.
- Arbitrage demandé : étude des jeux comparables (2026-09-16) propose quatre jalons d'enrichissement J11 info incarnée, J12 le monde te répond, J13 profondeur de carrière, J14 causalité profonde, recommandation J11 d'abord. Aucun ne démarre sans oui d'Aaron.
- Arbitrage demandé : recherche gameplay hors politique (2026-09-16) propose trois jalons J15 richesse de semaine, J16 dilemmes et personnalités, J17 information et remontée, recommandation J15 d'abord. À arbitrer avec J11 à J14, les deux familles ne se recouvrent que sur l'information (E1 et F7 se croisent).

- Arbitrage soldé le 2026-09-16 : GO d'Aaron pour une session unique de transformation, priorité au document vision (docs/vision-gameplay-fm-politique.md) puis aux jalons J11 à J14 (étude jeux comparables) et J15 à J17 (recherche hors politique). Consigne : tout appliquer dans la même session, commit et push seulement à la fin, une fois le jeu transformé. Exécuté : partie p3.0.0, 159 tests verts, build vert.
- Restant dû après la transformation : file d'effets chiffrés retardés (J14 complet), revue adversariale des règles neuves (dilemmes, frappe adverse, investiture), vérification visuelle des nouveaux blocs par le pôle design.

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
