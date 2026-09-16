# Graph Report - fm-politique  (2026-09-16)

## Corpus Check
- 126 files · ~68,305 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 944 nodes · 1540 edges · 70 communities (64 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b60884d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- rng.ts
- partie/page.tsx
- carriere.ts
- france-2026.ts
- compilerOptions
- Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »
- Catalogue des règles (testables, jamais scriptées)
- Journal du pôle développeur simulation
- ui/package.json
- Historique FM politique
- package.json
- engine.ts
- /pilote-sim
- Ontologie v1 (stabilisée, avant règles)
- compilerOptions
- partie.ts
- AGENTS.md, FM politique
- Ontologie v0 (entités, variables, relations)
- SPEC v0, FM politique (source de vérité du jeu)
- Vision v1 v2, du prototype au vrai jeu
- CLAUDE.md, FM politique
- Dictionnaire des variables v1 (justification, échelle, défaut, ignorance)
- France septembre 2026, état initial (première passe sourcée le 2026-09-15)
- Architecture moteur (DATA, RULES, SIMULATION, AI, NARRATIVE, UI)
- Audit parcours joueur du 2026-09-15 (prototype non jouable)
- Audit sécurité du 2026-09-15 (avant jalon boucle jouable)
- Base documentaire (registre des sources et niveaux de preuve)
- 2026-09-15, /pilote-sim Phase 0 puis Phase 1
- 2026-09-15, /ontologie v1
- FM politique
- /audit-parcours-joueur
- /boucle-sim
- /france-2026
- /moteur
- /ontologie
- /prime-sim
- /recherche
- /regles
- Suivi des attentes
- /audit-securite-sim
- /recartographie-sim
- Plan d'implémentation (phases 0 à 12 du brief, section 49)
- 2. Fiches par jeu
- pre-commit
- next.config.mjs
- next-env.d.ts
- personnages.ts
- vision-gameplay-fm-politique.md
- 4. Tokens
- creerPartie
- propositions.ts
- Contenu manquant
- partie.test.ts
- actions.ts
- Déploiement, FM politique
- Journal design, FM politique
- courrier.ts
- Audit parcours joueur du 2026-09-16, partie p2.1.0, sur écrans réels
- Journal du pôle parcours joueur
- **86\. Ce qu’il faut absolument éviter**
- Recherche gameplay hors politique, 2026-09-16
- **13\. Le système de réunions**
- **4\. Le monde doit être beaucoup plus grand que la politique électorale**
- **31\. Et il faut aller beaucoup plus loin que la vidéo**
- **87\. Les jeux de référence**
- **57\. Le jeu doit avoir plusieurs niveaux de zoom**
- **37\. La perception est aussi importante que la réalité**
- **PROJET — GAMEPLAY**

## God Nodes (most connected - your core abstractions)
1. `clamp01()` - 48 edges
2. `JournalTirage` - 47 edges
3. `jouerSemaine()` - 30 edges
4. `Rng` - 29 edges
5. `creerRng()` - 28 edges
6. `Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »` - 25 edges
7. `Catalogue des règles (testables, jamais scriptées)` - 24 edges
8. `Historique FM politique` - 23 edges
9. `PartiePage()` - 19 edges
10. `creerPartie()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `ChoixIA` --references--> `JournalTirage`  [EXTRACTED]
  ui/sim/ai/arbitrage.ts → ui/sim/types.ts
- `NouvellePartiePage()` --calls--> `creerRng()`  [EXTRACTED]
  ui/app/nouvelle-partie/page.tsx → ui/sim/rng.ts
- `PartiePage()` --calls--> `genererCourriels()`  [EXTRACTED]
  ui/app/partie/page.tsx → ui/sim/courrier.ts
- `PartiePage()` --calls--> `libelleGroupe()`  [EXTRACTED]
  ui/app/partie/page.tsx → ui/sim/joueur.ts
- `PartiePage()` --calls--> `raconterChronologie()`  [EXTRACTED]
  ui/app/partie/page.tsx → ui/sim/narrative/raconteur.ts

## Import Cycles
- None detected.

## Communities (70 total, 6 thin omitted)

### Community 0 - "rng.ts"
Cohesion: 0.05
Nodes (73): clamp01(), creerRng(), Rng, appliquerEuphemisme(), EtatCoutMoral, ResultatCoutMoral, appliquerBoucEmissaire(), CibleBouc (+65 more)

### Community 1 - "partie/page.tsx"
Cohesion: 0.21
Nodes (16): LIBELLES_CATEGORIE, ORDRE_CATEGORIES, PartiePage(), avancer(), libelleMetierOrigine(), libelleStatut(), objectifsPour(), palierDeStatut() (+8 more)

### Community 2 - "carriere.ts"
Cohesion: 0.08
Nodes (28): metadata, ConfigIdee, NouvellePartiePage(), ACTIVITES_SEMAINE, ActiviteSemaine, Ambition, AmbitionDef, AMBITIONS (+20 more)

### Community 3 - "france-2026.ts"
Cohesion: 0.43
Nodes (3): FRANCE_2026, Indicateur, variablesGroupesDepuisFrance()

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 5 - "Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »"
Cohesion: 0.08
Nodes (25): Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science », M10. Capture de la validation scientifique, Fischer et Nuremberg 1935 (16:20 à 17:35), M11. Vérité illusoire et répétition ambiante, Hasher 1977 (17:35 à 19:15), M12. Seuil de bascule 25 pour cent, Centola 2018 (20:34 à 21:59), M13. Légitimité électorale plutôt que coup de force (21:59 à 23:29), M14. Salami et capture des applicateurs, Rákosi, Orbán, Pologne (23:29 à 25:43), M15. Neutralisation de l'armée en 4 leviers (25:43 à 27:33), M16. Choc et pouvoirs d'exception (27:33 à 29:46) (+17 more)

### Community 6 - "Catalogue des règles (testables, jamais scriptées)"
Cohesion: 0.08
Nodes (24): Catalogue des règles (testables, jamais scriptées), R10. Langage adoucissant et déshumanisation (M8 Klemperer, M17 Bandura), R11. Bouc émissaire (M5), R12. Marque portable et double lecture (M6), R13. Sophismes productifs (M9), R14. Caution savante (M10), R15. Arbitrage légal contre force (M13), R16. Capture par tranches fines (M14 salami) (+16 more)

### Community 7 - "Journal du pôle développeur simulation"
Cohesion: 0.07
Nodes (28): 2026-09-15, catalogue complet R1 à R22, 2026-09-15, fin de session : partie jouable et calibration, 2026-09-15, fin de session : UI build vert et courrier, 2026-09-15, France 2026 et UI, 2026-09-15, IA des acteurs sans API, 2026-09-15, joueur jouable m0.3.0, 2026-09-15, /moteur boucle minimale m0.1.0, 2026-09-15, moteur m0.2.0 avec IA branchée (+20 more)

### Community 8 - "ui/package.json"
Cohesion: 0.09
Nodes (21): react, react-dom, @types/node, @types/react, dependencies, next, react, react-dom (+13 more)

### Community 9 - "Historique FM politique"
Cohesion: 0.08
Nodes (23): 2026-09-15, audits sécu et parcours avant jalon, 2026-09-15, création du workspace, 2026-09-15, fin de session : partie jouable et calibration, 2026-09-15, fin de session : UI build vert et courrier, 2026-09-15, France 2026 première passe et UI scaffold, 2026-09-15, IA des acteurs sans API, 2026-09-15, joueur jouable moteur m0.3.0, 2026-09-15, /moteur boucle minimale m0.1.0 (+15 more)

### Community 10 - "package.json"
Cohesion: 0.15
Nodes (12): devDependencies, typescript, vitest, typescript, name, private, scripts, test (+4 more)

### Community 11 - "engine.ts"
Cohesion: 0.08
Nodes (40): arbitrer(), ChoixIA, ContexteActeur, ObjectifId, OptionAction, OPTIONS_PROTOTYPE, PoidsObjectifs, POIDS_EQUILIBRE (+32 more)

### Community 12 - "/pilote-sim"
Cohesion: 0.18
Nodes (10): Format de sortie, Garde-fous, Mission, /pilote-sim, Quand appeler quoi (table de routage du pilote), Étape 1, charger l'état réel (jamais de mémoire), Étape 2, diagnostiquer et situer la phase, Étape 3, proposer l'objectif unique et obtenir le oui (+2 more)

### Community 13 - "Ontologie v1 (stabilisée, avant règles)"
Cohesion: 0.18
Nodes (10): Ce que v1 interdit aux règles, Conventions, E1. GroupePopulation (agrégat, jamais un individu), E2. Acteur (politique ou social, le joueur est un Acteur), E3. Media (presse, TV, radio, site, compte d'influence), E4. Institution (tribunal, commission, préfecture, direction, assemblée), E5. Territoire (commune type, département type, région type, jamais la France entière ici), E6. Relation (entité de première classe, pas un simple lien) (+2 more)

### Community 14 - "compilerOptions"
Cohesion: 0.18
Nodes (10): ui/sim/**/*, compilerOptions, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 15 - "partie.ts"
Cohesion: 0.14
Nodes (25): CategorieAction, clamp01b(), regenererHebdo(), STATUTS, Territoire, Monde, EffetMedia, Media (+17 more)

### Community 16 - "AGENTS.md, FM politique"
Cohesion: 0.22
Nodes (8): AGENTS.md, FM politique, Architecture logicielle (brief, sections 20 et 36, choix technique assumé), Commandes, Comment on travaille ici (méthode transverse Wisâl, adaptée), Dix principes (brief, section 55, repris tels quels), Formule centrale (brief, section 1), Structure, Équipe (fichiers dans ~/.claude/agents/)

### Community 17 - "Ontologie v0 (entités, variables, relations)"
Cohesion: 0.22
Nodes (8): Acteurs politiques et sociaux, Autres entités v0, Institutions, Médias, Ontologie v0 (entités, variables, relations), Population (agrégats, pas individus sauf échantillons), Relations, Ressources du joueur et des acteurs

### Community 18 - "SPEC v0, FM politique (source de vérité du jeu)"
Cohesion: 0.22
Nodes (8): 1. Le produit en une page, 2. Propriétés exigées (brief sections 4, 22 à 31), 3. Joueur et information, 4. Interface (brief sections 32, 33), 5. Périmètre et jalons, 6.1 Personnages et objectif (validé le 2026-09-15, session V1 V2), 6. Vocabulaire et éthique du jeu, SPEC v0, FM politique (source de vérité du jeu)

### Community 19 - "Vision v1 v2, du prototype au vrai jeu"
Cohesion: 0.20
Nodes (9): Ce que V1 et V2 livrent, Garde-fous, L'expérience voulue, Pilier 5, la progression par paliers (règle structurante, actée le 2026-09-16), Pillier 1, Football Manager : le rituel hebdomadaire, Pillier 2, Plague Inc : la propagation et la réaction du monde, Pillier 3, les personnages (exigence Aaron, fondamentale), Pillier 4, l'objectif du joueur (+1 more)

### Community 20 - "CLAUDE.md, FM politique"
Cohesion: 0.25
Nodes (7): CLAUDE.md, FM politique, Documents de référence (dans docs/), Git, Mémoire Graphify (`graphify-out/`), Stack prototype (figée jusqu'à arbitrage), Sécurité des secrets, Travailler avec Aaron ici

### Community 21 - "Dictionnaire des variables v1 (justification, échelle, défaut, ignorance)"
Cohesion: 0.25
Nodes (7): Acteur, Dictionnaire des variables v1 (justification, échelle, défaut, ignorance), Ignorance assumée, Institution, Media, Population, Relation et Proposition

### Community 22 - "France septembre 2026, état initial (première passe sourcée le 2026-09-15)"
Cohesion: 0.29
Nodes (6): France septembre 2026, état initial (première passe sourcée le 2026-09-15), Première passe observée, Règles, Tables restant à remplir en Phase 6, Tables à remplir en Phase 6, État

### Community 23 - "Architecture moteur (DATA, RULES, SIMULATION, AI, NARRATIVE, UI)"
Cohesion: 0.33
Nodes (5): Architecture moteur (DATA, RULES, SIMULATION, AI, NARRATIVE, UI), Ce qu'on ne fait pas, Les six couches, Seeds et reproductibilité, Tests et garde-fous

### Community 24 - "Audit parcours joueur du 2026-09-15 (prototype non jouable)"
Cohesion: 0.33
Nodes (5): Audit parcours joueur du 2026-09-15 (prototype non jouable), Ce que le joueur lit aujourd'hui, Points conformes, Préconisations avant prototype jouable, Trou majeur signalé

### Community 25 - "Audit sécurité du 2026-09-15 (avant jalon boucle jouable)"
Cohesion: 0.33
Nodes (5): Audit sécurité du 2026-09-15 (avant jalon boucle jouable), Constats, Correctifs appliqués, Périmètre, Reste pour Aaron

### Community 26 - "Base documentaire (registre des sources et niveaux de preuve)"
Cohesion: 0.33
Nodes (5): Base documentaire (registre des sources et niveaux de preuve), Champs couverts en Phase 1, Fiche minimale par mécanisme, Premières sources à relire en Phase 1 (issues de la vidéo, à vérifier sur primaire), Vérifications Phase 1 du 2026-09-15 (revue des primaires, avant tout codage)

### Community 27 - "2026-09-15, /pilote-sim Phase 0 puis Phase 1"
Cohesion: 0.14
Nodes (13): 2026-09-15, /pilote-sim Phase 0 puis Phase 1, 2026-09-16, recherche gameplay hors politique, 2026-09-16, étude des jeux comparables, Contexte courant, Contexte courant, Contexte courant, Erreurs et limites, Erreurs et limites (+5 more)

### Community 28 - "2026-09-15, /ontologie v1"
Cohesion: 0.33
Nodes (5): 2026-09-15, /ontologie v1, Contexte courant, Erreurs et limites, Journal du pôle ontologie, Revue adversariale du 2026-09-15

### Community 29 - "FM politique"
Cohesion: 0.40
Nodes (4): Entrer dans le projet, FM politique, Méthode héritée de Wisâl, Statut

### Community 30 - "/audit-parcours-joueur"
Cohesion: 0.50
Nodes (3): /audit-parcours-joueur, Garde-fous, Protocole

### Community 31 - "/boucle-sim"
Cohesion: 0.50
Nodes (3): /boucle-sim, Règles, Étapes

### Community 32 - "/france-2026"
Cohesion: 0.50
Nodes (3): /france-2026, Garde-fous, Protocole

### Community 33 - "/moteur"
Cohesion: 0.50
Nodes (3): Garde-fous, /moteur, Protocole

### Community 34 - "/ontologie"
Cohesion: 0.50
Nodes (3): Garde-fous, /ontologie, Protocole

### Community 35 - "/prime-sim"
Cohesion: 0.50
Nodes (3): Mission, /prime-sim, Règles

### Community 36 - "/recherche"
Cohesion: 0.50
Nodes (3): Garde-fous, Protocole, /recherche

### Community 37 - "/regles"
Cohesion: 0.50
Nodes (3): Garde-fous, Protocole, /regles

### Community 38 - "Suivi des attentes"
Cohesion: 0.33
Nodes (5): Attentes en cours, En attente, Réglées, Réglées, Suivi des attentes

### Community 42 - "2. Fiches par jeu"
Cohesion: 0.07
Nodes (26): 1. Méthode et limites, 2.10 eRepublik (eRepublik Labs, 2007, toujours en ligne), 2.11 Rebel Inc (Ndemic Creations, 2018), 2.12 Espiocracy (Ex Vivo Studios / Hooded Horse, annoncé 2027), 2.1 Democracy 3 / Democracy 4 (Positech, 2013 / 2020), 2.2 The Political Machine 2024 (Stardock, 2024, appid 2512090), 2.3 The Political Process (Verlumino, 2019, appid 1184770), 2.4 Suzerain (Long Due Games, 2020) (+18 more)

### Community 47 - "personnages.ts"
Cohesion: 0.10
Nodes (34): Carriere, persuasionJoueur(), ajouterMemoire(), appliquerInteraction(), borner01(), clampRel(), InteractionDef, interactionParId() (+26 more)

### Community 48 - "vision-gameplay-fm-politique.md"
Cohesion: 0.02
Nodes (85): **10\. Le joueur doit pouvoir recruter des personnes**, **11\. Le joueur doit construire son « staff »**, **12\. Le staff doit pouvoir être en désaccord**, **14\. L’inbox doit être centrale**, **15\. Le joueur doit pouvoir cliquer profondément**, **16\. Le joueur doit pouvoir rechercher n’importe qui**, **17\. Le recrutement ne doit pas être limité à la politique**, **18\. Construire une organisation** (+77 more)

### Community 49 - "4. Tokens"
Cohesion: 0.17
Nodes (11): 1. La thèse, en une phrase, 2. Ce que dit la recherche, 2bis. Le document public français, la linéale neutre, la densité, les thèmes, 3. Décisions actées, 4.1 Couleurs, thème clair « papier de dossier », 4.2 Couleurs, thème sombre « veille », 4.3 Typographie, 4.4 Espacement, filets, rayons (+3 more)

### Community 50 - "creerPartie"
Cohesion: 0.21
Nodes (13): recommencer(), ConfigCarriere, territoiresInitiaux(), VERSION_MOTEUR, creerPartie(), partir(), CONFIG, partir() (+5 more)

### Community 51 - "propositions.ts"
Cohesion: 0.48
Nodes (5): creerProposition(), dicibiliteMoyenne(), modifierStatutPreuve(), pousserProposition(), StatutPreuve

### Community 52 - "Contenu manquant"
Cohesion: 0.14
Nodes (13): Ce qui a été fait en fin de session du 2026-09-16, Contenu manquant, Défauts constatés, causes vérifiées dans le code, Priorité proposée pour la prochaine session, R1. « Semaine suivante » ne fait rien, R2. L'origine choisie ne se retrouve pas dans le statut, R3. Expliquer les graines, R4. Plus d'origines et plus de rôles de base (+5 more)

### Community 53 - "partie.test.ts"
Cohesion: 0.17
Nodes (16): LIBELLES_ORIGINE, creerFin(), evaluerFins(), ACTIONS_LOOP, CONFIG, dateDebutSemaine(), dateISO(), DEBUT_MS (+8 more)

### Community 54 - "actions.ts"
Cohesion: 0.43
Nodes (5): ActionJeu, actionParId(), ACTIONS_JEU, EffetsAction, ActionJouable

### Community 55 - "Déploiement, FM politique"
Cohesion: 0.29
Nodes (6): Ce qui rend le déploiement possible, Déploiement, FM politique, Ensuite, à chaque fois, Points de vigilance connus, Réglages Vercel, à faire une fois, Étapes, dans l'ordre

### Community 56 - "Journal design, FM politique"
Cohesion: 0.40
Nodes (4): 2026-09-15, de la doctrine au code, deux erreurs techniques à garder, 2026-09-15, ouverture du pôle, recherche au lieu de copie, Contexte courant (à lire en premier), Journal design, FM politique

### Community 58 - "courrier.ts"
Cohesion: 0.21
Nodes (12): adoptionMoyenne(), Courriel, Echeance, EXPEDITEURS, genererAgenda(), genererCourriels(), NOMS_TERRITOIRES, propagerTerritoires() (+4 more)

### Community 59 - "Audit parcours joueur du 2026-09-16, partie p2.1.0, sur écrans réels"
Cohesion: 0.29
Nodes (6): Audit parcours joueur du 2026-09-16, partie p2.1.0, sur écrans réels, Ce qui a été parcouru, écran et ligne, Panel testeurs, verdicts, Positions tranchées, Trous hiérarchisés, Verdict global

### Community 60 - "Journal du pôle parcours joueur"
Cohesion: 0.40
Nodes (4): 2026-09-16, audit p2.1.0 après rafale jalons, 2026-09-16, exécution des cinq retouches après GO d'Aaron, Contexte courant (à lire en premier), Journal du pôle parcours joueur

### Community 61 - "**86\. Ce qu’il faut absolument éviter**"
Cohesion: 0.18
Nodes (11): **86\. Ce qu’il faut absolument éviter**, **Un arbre de dialogues**, **Un jeu de jauges**, **Un jeu où l’IA invente les conséquences au fur et à mesure.**, **Un jeu où la recherche documentaire est uniquement décorative.**, **Un jeu où les autres acteurs attendent**, **Un jeu où les événements sont plus importants que les systèmes.**, **Un jeu où tous les personnages sont décoratifs.** (+3 more)

### Community 62 - "Recherche gameplay hors politique, 2026-09-16"
Cohesion: 0.25
Nodes (7): 1. Corpus et méthode, 2. Ce qui rend leurs semaines intéressantes (établi, sourcé), 3. Mécanismes récurrents des jeux qui tiennent la personne (établi par convergence), 4. Ce que notre jeu n'a pas (diagnostic), 5. Hypothèses de gameplay F1 à F10 (hypothèse de modélisation, à arbitrer), 6. Sources datées et limites, Recherche gameplay hors politique, 2026-09-16

### Community 63 - "**13\. Le système de réunions**"
Cohesion: 0.25
Nodes (8): **13\. Le système de réunions**, **Réunion de crise**, **Réunion institutionnelle**, **Réunion médiatique**, **Réunion organisationnelle**, **Réunion stratégique**, **Réunion économique**, **Réunion électorale**

### Community 64 - "**4\. Le monde doit être beaucoup plus grand que la politique électorale**"
Cohesion: 0.25
Nodes (8): **4\. Le monde doit être beaucoup plus grand que la politique électorale**, **Échelle individuelle**, **Échelle institutionnelle**, **Échelle internationale**, **Échelle organisationnelle**, **Échelle relationnelle**, **Échelle sociétale**, **Échelle territoriale**

### Community 65 - "**31\. Et il faut aller beaucoup plus loin que la vidéo**"
Cohesion: 0.29
Nodes (7): **31\. Et il faut aller beaucoup plus loin que la vidéo**, **Institutions**, **International**, **Médias**, **Organisations**, **Société**, **Économie**

### Community 66 - "**87\. Les jeux de référence**"
Cohesion: 0.33
Nodes (6): **87\. Les jeux de référence**, **Crusader Kings III**, **Democracy 4**, **Football Manager**, **Suzerain**, **Victoria 3**

### Community 67 - "**57\. Le jeu doit avoir plusieurs niveaux de zoom**"
Cohesion: 0.50
Nodes (4): **57\. Le jeu doit avoir plusieurs niveaux de zoom**, **Vue macro**, **Vue micro**, **Vue méso**

### Community 68 - "**37\. La perception est aussi importante que la réalité**"
Cohesion: 0.67
Nodes (3): **37\. La perception est aussi importante que la réalité**, **perception de l’état du monde.**, **état réel du monde**

### Community 69 - "**PROJET — GAMEPLAY**"
Cohesion: 0.67
Nodes (3): **PROJET — GAMEPLAY**, **Vers un véritable Football Manager politique**, **Vision centrale**

## Knowledge Gaps
- **527 isolated node(s):** `name`, `version`, `private`, `type`, `test` (+522 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Rng` connect `rng.ts` to `carriere.ts`, `engine.ts`, `personnages.ts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `creerRng()` connect `rng.ts` to `carriere.ts`, `engine.ts`, `partie.ts`, `personnages.ts`, `creerPartie`, `propositions.ts`, `partie.test.ts`, `actions.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `clamp01()` connect `rng.ts` to `engine.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _527 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rng.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05012285012285012 - nodes in this community are weakly interconnected._
- **Should `carriere.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._