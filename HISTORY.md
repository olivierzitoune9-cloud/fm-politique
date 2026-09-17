# Historique FM politique

Journal des décisions et changements de fonctionnement qui doivent survivre d'une session à l'autre. La SPEC garde le quoi, ce fichier garde le pourquoi.
## 2026-09-17, clôture de la session interrompue : P1 en brouillon, dépôt rendu vert

- Pourquoi : la session du 2026-09-16 soir a démarré P1 (graphe d'entités et mémoire des organisations) puis a été coupée par un bug avant tout protocole de clôture. Sur consigne d'Aaron, la clôture est faite le 2026-09-17 par une session neuve.
- Ce que la session avait laissé : deux brouillons concurrents du graphe du monde social, aucun des deux importé. `ui/sim/mondeSocial.ts` (premier jet : neuf organisations fixes avec mémoire fenêtrée, alliances et rivalités initiales datées) casse le typecheck contre les métiers réels du moteur (7 erreurs TypeScript) et faisait échouer le build Next. `ui/sim/monde-social.ts` (second jet : graphe dérivé des entités réelles, personnages et leurs organisations, MEDIAS, groupes du moteur, liens appartenance/influence/information, mémoire d'événements datée, carteVisible pilotée par le palier J7) compile proprement.
- Décision de clôture, tranchée par la lecture du dépôt sans arbitrage : `mondeSocial.ts` supprimé comme brouillon mort. Ses idées à reprendre quand P1 s'intégrera sont notées au journal développeur (mémoire par organisation en fenêtre glissante, alliances et rivalités initiales).
- Nettoyage : extrait*.txt, grep-residus.txt, racine-pkg.txt et rapports de debug de la racine supprimés (résidus du combat terminal de la session buguée).
- Vérifications rejouées via fichiers de sortie : 34 fichiers et 172 tests passés (dont 11 multi coups en semaine.test.ts) ; tsc --noEmit propre ; next build verte, 6 pages, /partie 24,7 kB.
- Reste P1 : brancher le graphe dans creerPartie et la sauvegarde, exposer la carte visible à l'écran, tests dédiés. Toujours aucun commit ni push : le chantier p3.1.0 et les consignes attendent le GO d'Aaron.

## 2026-09-16, mandat double vision et plan d'application

- Aaron mandate l'application à fond des deux documents de vision : gameplay ET design (nouveau doc de l'auteur de la vision gameplay, reçu le soir, copié fidèlement dans docs/vision-design-fm-politique.md après vérification d'intégrité, 56 626 caractères identiques, 131 sections). Pourquoi : Aaron juge les itérations précédentes trop timides, il veut que le jeu vise réellement FM politique, « le monde entier, pas une page unique ».
- Plan d'application posé dans docs/plan-application-vision.md : six phases P1 à P6 partant de la boucle §93 du doc design (observer, identifier, enquêter, imaginer, préparer, agir, attendre, observer, réévaluer). Ordre choisi : d'abord le monde (graphe d'entités, mémoire des organisations), ensuite l'enquête (inbox, dossiers, recherche), puis l'action riche, l'économie en euros, le monde adaptatif, enfin les fins racontables. Règle permanente reprise du design §118 : jamais une mécanique spéciale quand une mécanique générale suffit.
- Tensions explicitement non tranchées : portraits (doctrine sans image contre incarnation), paliers contre progression ressentie (§86-88), information cachée contre profondeur optionnelle (§31, §48, §78). Elles reviennent en arbitrage à leur phase.
- Aucun code ce soir : documentation seulement. Le code P1 attend le GO.

## Rectification finale du 2026-09-16

Les mentions de livraison p3.1.0 ci-dessous sont trop larges : 172 tests passent (34 fichiers), mais le correctif reste partiel. Le moteur accepte plus de quatre actions ; l'écran plafonne à douze, interdit la répétition, les contrôles de moyens ne suivent pas les dépenses cumulées et le monde ne reçoit que la première action. Le risque affiché est approximatif, non garanti égal au résultat. Pas de validation visuelle ni de commit/push. Le journal développeur et le suivi des attentes portent ces réserves.


## 2026-09-16, la semaine multi coups : C1 C2 C4 C5, partie p3.1.0

- Pourquoi : Aaron rejette la semaine à une action principale, sur le vif : « tu crois que sur FM on a une action par semaine ? tu crois que dans la vie on a une action par semaine ? ». La revue adversariale gameplay l'avait déjà chiffré en écart critique G1 (vision 9, 10, 13, 14, 15). Leçon de méthode actée : quand le document vision et la commodité d'implémentation se contredisent, la vision gagne.
- Livré, partie p3.1.0 (migration douce depuis p3.0.0) : la semaine devient un budget de coups. `TourSemaine.actions` reçoit de 1 à N coups de terrain, chacun résolu dans l'ordre choisi avec son journal, ses coûts au palier courant, son risque affiché avant le clic (C2), sa compétence gagnée et sa fatigue appliquée entre deux coups (C5). L'agenda additionne temps et argent avant validation (C4), le dépassement reste possible et sanctionné, jamais bloqué (R7 J8).
- Fichiers : ui/sim/partie.ts, ui/app/partie/page.tsx, ui/sim/sauvegarde.ts (migration), ui/sim/semaine.test.ts (neuf, 11 tests), ui/sim/sauvegarde.test.ts. Docs : revue adversariale complétée, suivi-attentes, plan, journal développeur.
- Vérifications réelles : 34 fichiers, 171 tests verts, tsc propre, next build vert (6 pages, /partie 24,7 kB).
- Arbitrage d'Aaron intégré en fin de chantier : le plafond de 4 coups d'abord posé a été retiré du moteur. La file de coups n'est bornée nulle part dans le monde : la vraie limite reste le temps (1.0) et l'argent, le coup forcé paie en dette et réputation (R7 J8). L'écran garde un garde anti-spam (MAX_COUPS_ECRAN = 12) pour la liste cliquable, hors moteur. Test neuf : six coups se résolvent dans l'ordre. Limites notées : le monde ne voit que le premier coup (à relier à C6), routage média partagé par semaine.
- Reste dû de la revue : C3 réunions à participants, C6 initiatives des personnages, C7 vie interne d'organisation, C8 scandales nommés, C9 processus de réforme, C10 mouvements sociaux.



## 2026-09-16, le vrai jeu : J11 à J17 appliqués d'une traite, partie p3.0.0

- But : Aaron refuse le commit proposé et demande la transformation. Consigne exacte : « je veux modifier en profondeur le jeu pour l'améliorer énormément, on est encore dans un mvp, dans une beta, je veux le vrai jeu », priorité au document vision, puis aux jalons de recherche gameplay, tout dans la même session, commit et push seulement à la fin.
- Livré, partie p3.0.0 (moteur inchangé m0.4.0, migration douce depuis p2.1.0) : semaine à deux étages (activité de fond), état intérieur énergie et moral qui module l'efficacité, six compétences construites par la répétition, carrefours à deux ou trois réponses pondérés par compétences et traits avec effet révélé en texte, traits de personnalité qui pèsent dans les interactions, effets durables nommés et datés, relation affichée en fourchette selon la connaissance mutuelle, enjeu dominant par territoire avec matching marque-enjeu, promesses à échéance datée, frappe d'un parti adverse coalisé sur ton territoire le plus fort, vie indépendante des partis et médias, aile combative au delà d'une organisation trop grosse, coûts croissants par palier, corruption d'expansion, dons nommés et tracés, investiture de mai 2027 comme échéance intermédiaire, saisons du calendrier réel, écho retardé annoncé.
- Nouvelle fin investiture-ratee, et fin élue désormais conditionnée à l'investiture obtenue : c'est la remontée longue (F9), les choix des paliers bas conditionnent l'option tardive, sans script.
- Fichiers : ui/sim/dilemmes.ts (neuf), carriere.ts, personnages.ts, interactions.ts, courrier.ts, partis.ts, temps.ts, partie.ts, sauvegarde.ts, ui/app/partie/page.tsx, dilemmes.test.ts et jeu-profond.test.ts (neufs), sauvegarde.test.ts, partie.test.ts, temps.test.ts.
- Pourquoi ces formes : chaque mécanisme transpose une source documentée (E1 à E14 de l'étude des jeux comparables, F1 à F10 de la recherche hors politique) et reste une hypothèse de gameplay. Aucun blocage par ressource n'est réintroduit, tout passe par la sanction et l'efficacité réduite, conformément à R7 J8.
- Simplification assumée : J14 est livrée en version annoncée (l'écho retardé est daté dans le journal), la file d'effets chiffrés retardés reste due.
- Vérifications réelles : typecheck propre, 33 fichiers et 159 tests verts, build Next vert (6 pages, /partie 23,2 kB). Rapports dans rapport-typecheck.txt, rapport-tests.txt, rapport-build.txt.
- Restant dû : audit sécurité avant mise en ligne, tutoriel par courrier, revue adversariale des règles neuves sensibles (dilemmes, frappe adverse, investiture), vérification visuelle des nouveaux blocs par le pôle design, déploiement par Aaron.

## 2026-09-16, retouches d'audit, typecheck réparé, deux études d'enrichissement

- Cinq retouches de l'audit parcours exécutées après GO : bouton semaine remonté, sondage commandé réellement débité dans jouerSemaine, groupes francisés à l'écran et dans la dicibilité, mémoire visible en badges dans les fiches, traces des fins persistées (ui/sim/traces.ts, clé fm-politique:traces, écran de fin « Trajectoires déjà tentées »).
- Fin retour-ordinaire réparée : la condition stricte `tick > tickDeDate(2032, 4, 1)` excluait le tick partagé par le 1er et le 2 avril, remplacée par `tick >= tickDeDate(2032, 4, 2)`. Leçon : dans un tick hebdomadaire, comparer un tick exact avec plus strict exclut toujours la semaine cible.
- Typecheck cassé en fin de session par un import manquant (CategorieAction dans ui/sim/carriere.ts, code J15 déjà écrit). Réparé, vérifié : tsc propre, 137 tests verts.
- Deux études de recherche livrées et soldées : docs/etude-jeux-comparables-2026-09-16.md (12 jeux politiques, E1 à E14, jalons J11 à J14) et docs/recherche-gameplay-hors-politique-2026-09-16.md (9 jeux hors politique, F1 à F10, jalons J15 à J17). Diagnostic d'Aaron acté : le jeu est maigre, le gameplay inintéressant, il faut apprendre des jeux qui tiennent la personne. Recommandation d'exécution : J15 richesse de semaine d'abord, puis J11 information incarnée. Aucun jalon d'enrichissement ne démarre sans GO.
- Limite terminal : la sortie PowerShell reste incapturable depuis ici, les vérifications passent par fichiers. Le build Next n'a pas été rejoué, à faire avant commit.


## 2026-09-16, audit parcours joueur p2.1.0

- Audit complet sans toucher au code : docs/audit-parcours-joueur-2026-09-16.md, journal docs/journaux-experts/parcours-joueur.md créé.
- Verdict : publiable avec retouches. Cinq retouches nommées pour GO d'Aaron, dans l'ordre : bouton semaine remonté près du bandeau, sondage débité ou coût retiré, libellés français des groupes, mémoire visible dans les fiches, trace d'échec au rejouer.
- Point dur : les groupes perçus affichent encore grp.centre et grp.peripherie, non publiable pour l'historien tant que ce n'est pas francisé.
- Méthode : retours réels d'Aaron prévalant, protocole tenu, aucune modification sans GO.

## 2026-09-16, rafale jalons J10 J7 J8 J9 J3 J4 J5 d'une traite

- J10 R1 : le clic « Semaine suivante » répond toujours. L'action et le média suivent le palier visible, toute exception de jouerSemaine s'affiche dans le bandeau d'erreur. Fini le clic silencieux.
- J10 R2 : le statut devient un palier neutre « Citoyen sans mandat », le métier d'origine s'affiche à côté dans le bandeau. Un enseignant lit « Enseignant dans un collège ».
- J10 R8 : la mise en garde sort des écrans de jeu, elle vit en pied de page discret via MENTION_DISCRETE. Le test suit le déplacement.
- J7 : chaque action porte un palier 1 à 5, le joueur ne voit que son palier. Au palier 1, figures de proximité seulement, un seul média, aucun parti rival à l'écran. Ils existent et agissent en arrière-plan.
- J8 R7 : plus de blocage par manque de ressource. On laisse faire à effet réduit, puis dette d'argent, risque d'enquête, réputation entamée, soutiens en berne, journal explicite.
- J9 R3 R4 R5 : graines expliquées avec exemple 42 contre 43, dix origines avec vecteur propre, six ambitions dont maire 2032 et européenne 2029, objectifs à paliers affichés en barres.
- J3 : carte de douze territoires types avec adoption par vecteur et réponse adverse qui monte avec la notoriété. Migration douce des sauvegardes p2.0.0 vers p2.1.0.
- J4 : trois sondages commandables, coûts croissants et biais décroissant, lecture approximative affichée après chaque semaine.
- J5 : calibration 40 parties de 24 semaines bornées avec carte et sanctions. Partie p2.1.0.
- Limite : terminal non vérifiable depuis ici (politique d'exécution et capture), tests et build à rejouer par Aaron avec npm.cmd. Revue adversariale et audits parcours plus sécurité restant dus avant mise en ligne.

## 2026-09-16, retours de jeu d'Aaron, cap vers la progression par paliers

- Recueil intégral dans docs/retours-joueur-2026-09-16.md. Deux défauts vérifiés dans le code, causes lues et non supposées : « Semaine suivante » sans effet parce que l'exception de jouerSemaine n'est affichée nulle part, et origine choisie absente du statut parce que creerCarriere fixe « employe » quelle que soit l'origine.
- Reproche central retenu comme règle de conception : la progression doit être par étapes, jamais sautée. La chronologie M1 à M23 du document source devient l'escalier d'accès des règles R1 à R22, et le joueur ne voit que son palier. Un jeune enseignant ne doit pas voir les partis rivaux à l'écran.
- Autre règle actée : aucune limite de choix, mais des conséquences. On ne bloque plus par manque de ressource, on sanctionne par la dette, le risque, la réputation et les occasions perdues.
- Le texte de mise en garde sort des écrans de jeu, sur demande explicite d'Aaron, et se réfugie en mentions discrètes et en documentation interne. Le test qui le vérifie suit le déplacement.
- Demande d'élargissement : plus d'origines avec des façons distinctes d'accéder au pouvoir, plus d'objectifs avec projection de long terme, et une explication claire des graines, qui n'existe pas encore.
- Méthode : au prochain /pilote-sim, exécuter d'une traite tous les jalons restants.

## 2026-09-15, pôle design, moteur rangé dans ui/, déploiement préparé

- Pôle design créé : agent `expert-design-sim` (Inès) et journal `docs/journaux-experts/design.md`. Doctrine dans `docs/design-system-fm-politique.md`, écrite après recherche datée et sourcée, à la demande d'Aaron qui refuse la copie de Football Manager ou de Plague Inc comme méthode.
- Décisions structurantes du design : ce jeu se consulte comme un dossier tenu à jour chaque semaine, pas comme un jeu vidéo ; Spectral (serif de lecture) et Public Sans (linéale d'instrument) embarquées localement en woff2 avec les licences OFL ; accent bleu institutionnel sourd, rouge réservé au scandale et à la perte ; aucune image ni portrait, les personnages se représentent par leurs initiales ; densité par paliers ; le temps est un composant permanent ; le jeu ne peut jamais être pris pour un service officiel de l'État.
- Application au code : cinq feuilles dans `ui/app/styles/` posées sur les jetons de `globals.css` (composants, listes, formulaire, tableau de bord), en-tête de dossier, accueil en écran-titre, création de personnage habillée, tableau de bord avec bandeau d'identité (nom, statut, semaine), barres de progression, lignes d'action, fiches de personnages et écran de fin.
- Restructuration : le moteur quitte `src/` pour `ui/sim/`. Raison : Vercel ne construit que le dossier de l'application, un moteur resté hors de `ui/` aurait cassé tous les imports en production. Les tests continuent d'être lancés depuis la racine.
- Déploiement : chemin retenu par Aaron, GitHub puis Vercel, dépôt créé par lui, Root Directory `ui`, aucun secret et aucune variable d'environnement. Procédure complète dans `docs/deploiement.md`.
- Méthode : sur cette machine, la politique d'exécution PowerShell bloque npm.ps1 et npx.ps1, il faut appeler npm.cmd et npx.cmd. Consigne d'Aaron : ne plus se servir du terminal quand on peut s'en passer.
- Vérification : 126 tests verts sur 30 fichiers, 6 pages générées, build de production vert.

## 2026-09-15, V1 et V2 : du prototype au vrai jeu (commit V1 38696cc, V2 à suivre)

- Recadrage : avertissement validé (SPEC section 6), ontologie v1 validée, fiches requalifiées en carburant, nom reporté, suivi-attentes soldé. Vision durable écrite dans docs/vision-v1-v2.md.
- V1 (moteur de partie p1, commit 38696cc) : personnages fictifs nommés seedés avec métiers et hooks mécaniques (caution R14, micro ciblage IA, info interne, contacts croisés atténuateur R1), interactions convaincre/promettre/demander/trahir/recoudre avec mémoire E6, calendrier réel semaine depuis 2026-09-07 avec échéances présidentielle et législatives 2027 (fenêtres constitutionnelles, marquées plausibles), 4 ambitions, 18 actions mappées R1 à R22, fins multiples (élu, président, chef-parti, proposition, marginalisé, brûlé, sous enquête, hors course, retour ordinaire), sauvegarde locale versionnée, /nouvelle-partie et /partie refondues. 107 tests verts, build UI vert.
- V2 (partie p2.0.0) : médias avec vigilance et audiences (routage des actions média, fact checking réel), propositions E7 avec dicibilité R9 par groupe, partis organisés (Front de l'ordre et Alliance parlementaire, fictifs) avec leaders nommés, manoeuvres lues dans le moteur et relations évolutives, économie mensuelle branchée (chômage 8,2 observé sept 2026, trajectoire suivante hypothèse marquée, dérive bornée), 20 actions, fin proposition sur dicibilité réelle. 126 tests verts sur 30 fichiers, tsc propre, build UI vert.
- Pourquoi : Aaron a demandé des personnages nommés (toute la société, pas que le politique, scientifiques, historiens, ingénieurs, IA inclus), des interactions humaines fondamentales et un objectif de joueur, inspirations FM et Plague Inc renforcées. Compromis assumé : le moteur de base garde ses 2 groupes et 3 acteurs, la partie V2 compose au-dessus (économie dérive les groupes avant le pas, manoeuvres lues après). Sauvegarde : refus propre des versions croisées.

## 2026-09-15, /pilote-sim Phase 0 clôturée puis Phase 1 ouverte

- Socle : git init, .gitignore couvrant .env*, hook .githooks/pre-commit actif via core.hooksPath et testé (blocage motif secret vérifié, .env bloqué par ignore), commit 021a13c propre, scan secrets vide, git status propre. Attente hook soldée dans docs/suivi-attentes.md.
- Recherche : première passe des primaires vidéo dans docs/base-documentaire.md. Confirmés avec nuances : Tajfel 1971 groupes minimaux, Hasher 1977 60 énoncés 3 sessions, Freedman Fraser 1966 contrôle moins de 20 contre 76 même sujet même tâche, Seligman Maier 1967 mécanisme confirmé sans coder 75, Centola 2018 seuil 25 non universel, Burger 2009 pas 2006 avec 70 contre 82,5, NSDAP 2,63 18,25 37,27, Crimée 65 vers 88 max, Mueller 1970 rally. Non retrouvés à ne jamais coder : Stenner 39 2 59. Restent Bandura, Klemperer, Aron, Hongrie, Pologne.
- Pourquoi : ta remarque sur une phase par session jugée obsolète a fait évoluer la méthode. Enchaînement séquentiel avec clôture vérifiée de Phase 0 avant ouverture de Phase 1, jamais deux chantiers à moitié finis en parallèle. Bilan méthode à porter dans .claude/commands/pilote-sim.md si validé.

## 2026-09-15, /ontologie v1 stabilisée avec revue adversariale

- Sept entités avec champs typés en 0..1, verbes et hors champ : docs/ontologie-v1.md. Dictionnaire justifié : docs/dictionnaire-variables-v1.md. Joueur comme instance d'Acteur, null pour inconnu, interdictions pour règles en fin de v1. Cinq notions proches distinguées : popularite, soutienPopulaire, legitimite, reputation, credibilite.
- Pourquoi : stabiliser avant toute règle selon /ontologie, sans coder la France en dur. Champs à risque conservés avec règle lectrice annoncée, à vérifier en Phase 5.

## 2026-09-15, Phase 12 et partie de ce soir

- Adversaires réactifs bornés, moteur m0.4.0. Serveur dev lancé sur 3123, pages / et /partie vérifiées en 200 avec contenu simulé réel.
- Pourquoi : jouer ce soir sur une base qui répond aux coups, avant toute profondeur supplémentaire.

## 2026-09-15, fin de session : UI build vert et courrier

- ui/ build Next vert, /partie jouable avec boîte mail et agenda, courrier testé. 74 tests verts sur 18 fichiers.
- Pourquoi : prototype jouable de bout en bout en local, sans réseau ni API. Reste la profondeur Phase 12.

## 2026-09-15, fin de session : partie jouable et calibration

- Page /partie avec 5 coups, vue filtrée, recommencer. Calibration 200 parties de 30 pas bornées et causales, aucune stratégie écrasante. 71 tests verts sur 17 fichiers, tsc propre.
- Pourquoi : aller au bout du prototype jouable local avant la profondeur. Reste : npm dans ui/, boîte mail et agenda, profondeur progressive Phase 12.

## 2026-09-15, joueur jouable moteur m0.3.0

- Acteur joueur insignifiant avec 5 actions mappées aux règles, coups forcés déterministes, vue filtrée arrondie et sourcée avec avertissement. 69 tests verts.
- Pourquoi : combler le trou de l'audit parcours côté moteur. Reste la page interactive et la boîte mail.

## 2026-09-15, audits sécu et parcours avant jalon

- Sécu : prod zéro vulnérabilité, dev 5 signalées sans application sauvage, secrets et hook OK.
- Parcours : lecture conforme mais joueur absent de la boucle, 4 préconisations avant prototype jouable.
- Pourquoi : auditer avant le jalon comme l'exige la méthode, sans lisser le trou joueur.

## 2026-09-15, France 2026 première passe et UI scaffold

- France : chômage 8,3 T2 et 8,1 T1, Assemblée trois blocs 2024, Lecornu depuis 2025-09-09, retraites suspendues. Données datées et testées, hypothèses marquées.
- UI : scaffold Next App Router dans ui/ avec page tableaux et chronologie lisant le moteur. Build à valider.
- Pourquoi : prouver la lecture du monde avant la profondeur. 65 tests verts.

## 2026-09-15, narration par gabarits Phase 9

- Raconteur déterministe avec sources internes au monde, sans API. 62 tests verts.
- Pourquoi : le narratif raconte après coup, il ne décide jamais. Test anti causalité inclus.

## 2026-09-15, moteur m0.2.0 avec IA branchée

- Deux acteurs (prudent et fonceur) arbitrant chaque tick avec mapping explicite vers R1 et R22, décisions journalisées. 58 tests verts, tsc propre.
- Pourquoi : le monde vit sans le joueur, les acteurs poursuivent leurs objectifs propres. Fondateur pour Phase 9 narration.

## 2026-09-15, IA des acteurs sans API

- Arbitrage explicite avec 6 objectifs et 5 options, bruit seedé, sans règle rigide. 4 tests verts.
- Pourquoi : l'IA arbitre, elle ne cause jamais à la place des règles. Aucune dépendance externe.

## 2026-09-15, /moteur boucle minimale m0.1.0

- src/sim/engine.ts avec deux groupes, ordre fixe et événements causaux. 52 tests verts, tsc propre. Échec initial sur saturation corrigé en test, leçon notée pour la vraie boucle.
- Pourquoi : prouver le critère SPEC (même seed identique, deux seeds divergents et explicables) avant IA, narration et UI.

## 2026-09-15, /regles catalogue complet R1 à R22

- 22 règles couvrant M1 à M23, codées en pur dans src/sim/rules, 48 tests Vitest verts et tsc propre. Revue globale passée, constantes interdites respectées.
- Pourquoi : finir les règles d'un trait comme demandé, en lots vérifiés, pour ouvrir /moteur sur une base complète plutôt qu'au compte gouttes.

## 2026-09-15, /regles R1 étiquetage codée et testée

- Fiche R1 dans docs/catalogue-regles.md, code pur dans src/sim/rules/r1-etiquetage.ts, RNG seedé et journalisé, 6 tests Vitest verts et tsc propre. Revue adversariale passée : pas de surpuissance, pas de stratégie optimale, pas de morale cachée.
- Pourquoi : première règle issue de M4 Tajfel, avec effets opposés et bornes, pour prouver que la boucle règles plus tests tient avant d'attaquer M11 ou la boucle moteur.

## 2026-09-15, /pilote-sim suite Phase 1 bouclée en première passe

- Cinq reliquats relus : Bandura 1999 huit mécanismes confirmés, Klemperer 1947 euphémismes documentés, Rákosi 1952 salami avec nuance Rieber 2013, Pologne 2015 à 2018 65 ans et 40 pour cent validés par Venise, Aron Clausewitz avec diversion rare selon Mueller. Base documentaire à jour, attente reformulée vers fiches détaillées.
- Pourquoi : enchaînement demandé par Aaron, toujours séquentiel et vérifié, jamais parallèle.

## 2026-09-15, création du workspace

- Sources prises en compte en totalité : doc FM politique sections 1 à 56 (idée générale, modèle FM, joueur, émergence, lois pas histoires, ontologie, acteurs, médias, institutions, relations, ressources, info imparfaite, autonomie des acteurs, décisions contextuelles, base documentaire, règle documentée, France 2026, données contre hypothèses, moteur en six couches, événements émergents, mécanismes du documentaire, échec et trajectoires multiples, conséquences contre récompenses, apprentissage, workflow, master prompt, artefacts persistants, seeds, tests, calibration, limites visibles, personnes réelles, laboratoire, interface texte et données, boucle prototype puis profondeur, architecture web, reproductibilité, validation) plus la vidéo source et sa transcription lue en entier.
- Choix technique assumé au-delà du brief : Next.js App Router pour l'UI (continuité Wisâl) avec moteur `src/sim/` pur et seedé, plutôt que React générique. Ni Supabase ni Stripe au prototype, monde local versionné.
- Mécaniques vidéo toutes reprises comme bibliothèque de mécanismes à conditions (jamais comme script) : voir `docs/bibliotheque-mecanismes-video.md`.
- Prochaine étape : Phase 0 (architecture validée), puis Phase 1 (base documentaire générale).
