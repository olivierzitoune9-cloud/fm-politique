# Graph Report - fm-politique  (2026-09-15)

## Corpus Check
- 114 files · ~39,198 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 662 nodes · 1200 edges · 47 communities (40 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `105d1135`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- rng.ts
- partie.ts
- carriere.ts
- engine.ts
- compilerOptions
- Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »
- Catalogue des règles (testables, jamais scriptées)
- Journal du pôle développeur simulation
- ui/package.json
- Historique FM politique
- package.json
- propositions.ts
- /pilote-sim
- Ontologie v1 (stabilisée, avant règles)
- compilerOptions
- arbitrage.ts
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
- Suivi des attentes FM politique
- /audit-securite-sim
- /recartographie-sim
- Plan d'implémentation (phases 0 à 12 du brief, section 49)
- layout.tsx
- pre-commit
- next.config.mjs
- next-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `clamp01()` - 48 edges
2. `JournalTirage` - 47 edges
3. `Rng` - 29 edges
4. `jouerSemaine()` - 27 edges
5. `creerRng()` - 27 edges
6. `Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »` - 25 edges
7. `Catalogue des règles (testables, jamais scriptées)` - 24 edges
8. `Historique FM politique` - 18 edges
9. `compilerOptions` - 16 edges
10. `creerPartie()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `PartiePage()` --calls--> `genererCourriels()`  [EXTRACTED]
  ui/app/partie/page.tsx → src/sim/courrier.ts
- `PartiePage()` --calls--> `raconterChronologie()`  [EXTRACTED]
  ui/app/partie/page.tsx → src/sim/narrative/raconteur.ts
- `PartiePage()` --calls--> `nomComplet()`  [EXTRACTED]
  ui/app/partie/page.tsx → src/sim/personnages.ts
- `NouvellePartiePage()` --calls--> `creerRng()`  [EXTRACTED]
  ui/app/nouvelle-partie/page.tsx → src/sim/rng.ts
- `ChoixIA` --references--> `JournalTirage`  [EXTRACTED]
  src/sim/ai/arbitrage.ts → src/sim/types.ts

## Import Cycles
- None detected.

## Communities (47 total, 7 thin omitted)

### Community 0 - "rng.ts"
Cohesion: 0.05
Nodes (69): clamp01(), creerRng(), Rng, appliquerEuphemisme(), EtatCoutMoral, ResultatCoutMoral, appliquerBoucEmissaire(), CibleBouc (+61 more)

### Community 1 - "partie.ts"
Cohesion: 0.06
Nodes (64): ActionJeu, actionParId(), ACTIONS_JEU, CategorieAction, EffetsAction, Carriere, clamp01b(), libelleStatut() (+56 more)

### Community 2 - "carriere.ts"
Cohesion: 0.07
Nodes (48): Ambition, AmbitionDef, AMBITIONS, AVERTISSEMENT_OUVERTURE, ConfigCarriere, creerCarriere(), LIBELLES_ORIGINE, Origine (+40 more)

### Community 3 - "engine.ts"
Cohesion: 0.08
Nodes (41): Courriel, Echeance, EXPEDITEURS, genererAgenda(), genererCourriels(), ajusterEconomie(), chomagePourTick(), moisDeTick() (+33 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, ../src/**/*.ts, **/*.ts (+19 more)

### Community 5 - "Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science »"
Cohesion: 0.08
Nodes (25): Bibliothèque de mécanismes, vidéo source « Comment devenir dictateur selon la science », M10. Capture de la validation scientifique, Fischer et Nuremberg 1935 (16:20 à 17:35), M11. Vérité illusoire et répétition ambiante, Hasher 1977 (17:35 à 19:15), M12. Seuil de bascule 25 pour cent, Centola 2018 (20:34 à 21:59), M13. Légitimité électorale plutôt que coup de force (21:59 à 23:29), M14. Salami et capture des applicateurs, Rákosi, Orbán, Pologne (23:29 à 25:43), M15. Neutralisation de l'armée en 4 leviers (25:43 à 27:33), M16. Choc et pouvoirs d'exception (27:33 à 29:46) (+17 more)

### Community 6 - "Catalogue des règles (testables, jamais scriptées)"
Cohesion: 0.08
Nodes (24): Catalogue des règles (testables, jamais scriptées), R10. Langage adoucissant et déshumanisation (M8 Klemperer, M17 Bandura), R11. Bouc émissaire (M5), R12. Marque portable et double lecture (M6), R13. Sophismes productifs (M9), R14. Caution savante (M10), R15. Arbitrage légal contre force (M13), R16. Capture par tranches fines (M14 salami) (+16 more)

### Community 7 - "Journal du pôle développeur simulation"
Cohesion: 0.10
Nodes (20): 2026-09-15, catalogue complet R1 à R22, 2026-09-15, fin de session : partie jouable et calibration, 2026-09-15, fin de session : UI build vert et courrier, 2026-09-15, France 2026 et UI, 2026-09-15, IA des acteurs sans API, 2026-09-15, joueur jouable m0.3.0, 2026-09-15, /moteur boucle minimale m0.1.0, 2026-09-15, moteur m0.2.0 avec IA branchée (+12 more)

### Community 8 - "ui/package.json"
Cohesion: 0.10
Nodes (20): react, react-dom, @types/node, @types/react, dependencies, next, react, react-dom (+12 more)

### Community 9 - "Historique FM politique"
Cohesion: 0.11
Nodes (18): 2026-09-15, audits sécu et parcours avant jalon, 2026-09-15, création du workspace, 2026-09-15, fin de session : partie jouable et calibration, 2026-09-15, fin de session : UI build vert et courrier, 2026-09-15, France 2026 première passe et UI scaffold, 2026-09-15, IA des acteurs sans API, 2026-09-15, joueur jouable moteur m0.3.0, 2026-09-15, /moteur boucle minimale m0.1.0 (+10 more)

### Community 10 - "package.json"
Cohesion: 0.15
Nodes (12): devDependencies, typescript, vitest, typescript, name, private, scripts, test (+4 more)

### Community 11 - "propositions.ts"
Cohesion: 0.29
Nodes (8): creerProposition(), dicibiliteMoyenne(), modifierStatutPreuve(), pousserProposition(), StatutPreuve, appliquerRelais(), EtatDicibilite, ResultatDicibilite

### Community 12 - "/pilote-sim"
Cohesion: 0.18
Nodes (10): Format de sortie, Garde-fous, Mission, /pilote-sim, Quand appeler quoi (table de routage du pilote), Étape 1, charger l'état réel (jamais de mémoire), Étape 2, diagnostiquer et situer la phase, Étape 3, proposer l'objectif unique et obtenir le oui (+2 more)

### Community 13 - "Ontologie v1 (stabilisée, avant règles)"
Cohesion: 0.18
Nodes (10): Ce que v1 interdit aux règles, Conventions, E1. GroupePopulation (agrégat, jamais un individu), E2. Acteur (politique ou social, le joueur est un Acteur), E3. Media (presse, TV, radio, site, compte d'influence), E4. Institution (tribunal, commission, préfecture, direction, assemblée), E5. Territoire (commune type, département type, région type, jamais la France entière ici), E6. Relation (entité de première classe, pas un simple lien) (+2 more)

### Community 14 - "compilerOptions"
Cohesion: 0.18
Nodes (10): src/**/*, compilerOptions, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 15 - "arbitrage.ts"
Cohesion: 0.25
Nodes (9): arbitrer(), ChoixIA, ContexteActeur, ObjectifId, OptionAction, OPTIONS_PROTOTYPE, PoidsObjectifs, POIDS_EQUILIBRE (+1 more)

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
Cohesion: 0.22
Nodes (8): Ce que V1 et V2 livrent, Garde-fous, L'expérience voulue, Pillier 1, Football Manager : le rituel hebdomadaire, Pillier 2, Plague Inc : la propagation et la réaction du monde, Pillier 3, les personnages (exigence Aaron, fondamentale), Pillier 4, l'objectif du joueur, Vision v1 v2, du prototype au vrai jeu

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
Cohesion: 0.33
Nodes (5): 2026-09-15, /pilote-sim Phase 0 puis Phase 1, Contexte courant, Erreurs et limites, Journal du pôle recherche et pilotage, Vérifications du jour

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

### Community 38 - "Suivi des attentes FM politique"
Cohesion: 0.50
Nodes (3): En attente, Réglées, Suivi des attentes FM politique

## Knowledge Gaps
- **306 isolated node(s):** `name`, `version`, `private`, `type`, `test` (+301 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `creerRng()` connect `rng.ts` to `partie.ts`, `carriere.ts`, `engine.ts`, `propositions.ts`, `arbitrage.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Rng` connect `rng.ts` to `propositions.ts`, `carriere.ts`, `engine.ts`, `arbitrage.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `clamp01()` connect `rng.ts` to `propositions.ts`, `engine.ts`, `arbitrage.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _306 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rng.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05293040293040293 - nodes in this community are weakly interconnected._
- **Should `partie.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `carriere.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06604324956165984 - nodes in this community are weakly interconnected._