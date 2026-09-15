# Historique FM politique

Journal des décisions et changements de fonctionnement qui doivent survivre d'une session à l'autre. La SPEC garde le quoi, ce fichier garde le pourquoi.

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
