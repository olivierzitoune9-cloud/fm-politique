# AGENTS.md, FM politique

Ce workspace est le chantier du nouveau jeu d'Aaron : un **Football Manager politique**, simulation politique émergente de la France à partir de septembre 2026. Le joueur commence insignifiant (employé de bureau) et tente d'obtenir du pouvoir, sans trajectoire imposée : démocrate, réformateur, populiste, autoritaire, marginalisé ou éliminé, tout doit pouvoir émerger du système.

**Ce fichier est la fondation.** Il est chargé au début de chaque session. Le garder à jour, c'est la source de vérité sur la façon d'opérer ici.

## Formule centrale (brief, section 1)

On ne programme pas l'histoire du pays. On programme les lois du monde qui permettent à l'histoire d'émerger.

Imprévisible mais cohérent après coup : jamais de chaîne scriptée A vers B vers C vers fin D, toujours des conditions qui rendent des mécanismes plus ou moins probables.

## Dix principes (brief, section 55, repris tels quels)

1. Ne pas écrire les histoires, écrire les règles qui permettent aux histoires d'apparaître.
2. Ne pas faire une simulation de dictature, faire une simulation politique générale dont la dictature peut être une trajectoire parmi d'autres.
3. Ne pas donner à chaque entité une simple jauge, construire des profils multidimensionnels.
4. Ne pas faire du joueur le centre du monde, faire vivre les autres acteurs indépendamment de lui.
5. Ne pas utiliser le hasard comme excuse, utiliser une incertitude conditionnée par le contexte.
6. Ne pas confondre données et hypothèses, documenter chaque niveau du modèle.
7. Ne pas utiliser l'IA générative comme moteur de causalité, l'utiliser pour rechercher, coder et narrer autour d'un moteur explicite et testable.
8. Ne pas commencer par l'interface, commencer par le modèle du monde.
9. Ne pas essayer immédiatement de construire toute la France, construire d'abord une boucle fonctionnelle puis augmenter la profondeur.
10. Prendre Football Manager comme philosophie de simulation, pas comme modèle à copier.

## Architecture logicielle (brief, sections 20 et 36, choix technique assumé)

Six couches séparées, jamais fusionnées : **DATA, RULES, SIMULATION, AI, NARRATIVE, UI**.

Stack du prototype : TypeScript, Next.js App Router pour l'UI (continuité avec Wisâl, même outillage, déploiement Vercel, lecture du monde par tableaux et chronologies), moteur `src/sim/` en TypeScript pur sans React, RNG seedé et reproductible, tests Vitest, données en fichiers structurés versionnés. Ni Supabase ni Stripe au prototype : le monde vit en local et se sauvegarde en fichiers seedés. Ce choix dépasse le brief (qui proposait React générique) parce qu'il réutilise l'expertise déjà éprouvée ici et garde le moteur testable hors interface. Tout écart futur se note et se fait valider.

## Comment on travaille ici (méthode transverse Wisâl, adaptée)

- Français, tutoiement, ton doux et exigeant, posture d'expert, sparring permanent, pas de tirets longs.
- Rituel d'entrée obligatoire pour tout expert avant toute réponse substantielle : son journal puis les fichiers listés selon le sujet. Fichier absent ou périmé signalé, limite portée en tête.
- Journaux vivants dans `docs/journaux-experts/`, une entrée datée par intervention substantielle, section Contexte courant tenue, erreurs jamais effacées.
- SPEC (`docs/SPEC-v0-fm-politique.md`) fait foi sur le quoi, HISTORY garde le pourquoi, `docs/suivi-attentes.md` trace les arbitrages pendants et se lit en ouverture de session.
- Mémoire Graphify obligatoire : lecture de `graphify-out/` d'abord, `graphify update .` à chaque clôture.
- Écriture incrémentale : chaque décision actée est notée immédiatement dans le doc concerné, même imparfaitement. Sessions parallèles : annoncer sa liste de fichiers, ne jamais toucher ceux d'autrui, ne committer que sa liste.
- Discipline documentaire du brief (sections 15, 16, 19, 53) : chaque règle porte variable, définition, mécanismes causaux, conditions, renforçateurs, atténuateurs, effets opposés, résultats empiriques, qualité des preuves, limites, sources datées, hypothèses de passage à la simulation. Niveaux séparés : établi, plausible, hypothèse de modélisation, donnée observée, paramètre estimé, règle scientifique, hypothèse de gameplay, paramètre technique. Ne jamais inventer silencieusement une donnée ou une causalité.
- Le moteur central est en règles explicites et testables, jamais en génération libre. L'IA cherche, modélise, code, teste, narre. Elle ne décide pas du vrai.

## Structure

```
.
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── HISTORY.md
├── docs/
│   ├── SPEC-v0-fm-politique.md
│   ├── bibliotheque-mecanismes-video.md
│   ├── ontologie-v0.md
│   ├── architecture-moteur.md
│   ├── base-documentaire.md
│   ├── france-2026-etat-initial.md
│   ├── plan-implementation.md
│   ├── suivi-attentes.md
│   └── journaux-experts/
├── .claude/commands/
├── contenu-source/
├── src/
│   └── sim/
└── graphify-out/
```

## Commandes

- `/pilote-sim` : LA tour de contrôle, la seule à lancer en routine. Elle diagnostique l'état réel, propose l'objectif unique de la session, attend le oui d'Aaron, orchestre experts et commandes, puis clôture avec fait, reste et prochaine étape. Aaron valide et supervise, rien de plus.
- `/prime-sim` : charger le contexte complet quand on veut juste faire le point sans orchestrer.
- `/boucle-sim` : méthode de conception et d'audit adaptée de la Boucle Wisâl.
- `/recherche` : alimenter la base documentaire avec discipline des sources.
- `/ontologie` : définir entités, variables, relations.
- `/regles` : transformer un mécanisme documenté en règle testable.
- `/france-2026` : construire l'état initial daté et sourcé.
- `/moteur` : coder et tester le moteur par étapes contrôlées.
- `/audit-securite-sim` et `/audit-parcours-joueur` : contrôles répétables.
- `/recartographie-sim` : reconstruire la carte du projet quand elle dérive.

## Équipe (fichiers dans ~/.claude/agents/)

Chercheur généraliste, politiste, sociologue et psychologie sociale, économiste, médias, institutions, data France, développeur simulation, narrateur système, sécurité, parcours joueur, archiviste. L'auditeur adversarial purpose-built juge chaque règle et chaque session sensible. Les agents Wisâl restent disponibles mais ne font jamais foi ici.
