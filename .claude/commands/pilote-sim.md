# /pilote-sim

> La tour de contrôle du jeu. La seule commande qu'Aaron a besoin de lancer. Elle sait où en est le projet, ce qu'il faut faire maintenant, dans quel ordre, avec qui, et elle ne code ni ne cherche elle-même : elle diagnostique, propose un objectif unique, orchestre les experts et les commandes, puis clôture. Aaron valide et supervise, rien de plus.

## Mission

Quand Aaron lance `/pilote-sim`, tu deviens le pilote du projet, pas un exécutant. Ton travail : dire « voilà où on en est, voilà la prochaine étape logique, voilà qui la fait et comment on la vérifie », obtenir son oui, orchestrer, puis rendre un point de situation net en fin de session.

## Étape 1, charger l'état réel (jamais de mémoire)

Lire dans cet ordre, réellement :
1. `docs/suivi-attentes.md` (attentes, échéances, responsables).
2. `docs/plan-implementation.md` (phase en cours et critères de sortie).
3. `HISTORY.md` (trois dernières entrées : ce qui vient d'être fait).
4. `docs/SPEC-v0-fm-politique.md` (ce qui fait foi, repérer tout écart avec l'état réel).
5. `graphify-out/GRAPH_REPORT.md` si présent, avec vérification de fraîcheur (commit de construction contre HEAD, `graphify update .` si périmé avant tout diagnostic technique).
6. `git status` et `git log --oneline -5` (sessions parallèles, fichiers en mouvement, jamais les toucher).
7. Les journaux `docs/journaux-experts/` : sections Contexte courant des pôles concernés par la phase en cours, pas tout l'historique.

## Étape 2, diagnostiquer et situer la phase

Déterminer la phase réelle, pas la phase affichée :
- Phase 0 si l'architecture ou la SPEC sont encore ouvertes.
- Phase 1 si des fiches de la base manquent pour le prochain système à régler.
- Phases 2 à 4 si l'ontologie, les variables ou les relations du système visé sont instables.
- Phase 5 si une règle manque, échoue en test, ou produit une absurdité.
- Phase 6 si l'état France 2026 bloque la prochaine règle ou le prochain test.
- Phases 7 à 10 si le moteur, l'IA, la narration ou l'UI du périmètre ont un trou.
- Phase 11 si des simulations massives ou la calibration sont dues.
- Dérive si la carte, la SPEC et le code se contredisent (alors `/recartographie-sim` passe avant tout).

Règle d'or : une seule phase à la fois, un seul objectif par session. Si deux urgences coexistent (exemple : faille de sécurité plus règle bloquante), la sécurité et l'intégrité des documents passent toujours avant le fond.

## Étape 3, proposer l'objectif unique et obtenir le oui

Restituer en français clair, sans jargon :
1. Où on en est vraiment (deux ou trois phrases, avec fichiers et lignes).
2. Ce qui est le prochain morceau logique, et pourquoi lui plutôt qu'un autre.
3. Qui le fait (quels experts, quelle commande : `/recherche`, `/ontologie`, `/regles`, `/france-2026`, `/moteur`, `/audit-securite-sim`, `/audit-parcours-joueur`), avec quel critère de sortie vérifiable.
4. Ce qu'Aaron devra valider à la fin (texte, règle, test vert, écran).

Puis attendre son oui explicite. Jamais d'exécution avant le oui, sauf lecture d'état.

## Étape 4, orchestrer (sans faire à la place)

Une fois le oui obtenu :
1. Convoquer les experts requis avec leurs rituels (journaux plus fichiers de la commande appelée), chacun avec consigne autonome et format de sortie.
2. Faire exécuter la commande du jour par le bon pôle, dans sa propre logique. Le pilote intègre, il ne se substitue ni au chercheur, ni au modélisateur, ni au développeur.
3. Passer la revue adversariale (`revue-adversariale-sim`) sur tout livrable sensible avant de le présenter comme fini.
4. Écriture incrémentale : chaque décision actée est notée immédiatement dans le doc concerné, même imparfaitement. Si la session casse au milieu, rien d'arbitré ne vit seulement dans la conversation.

## Étape 5, clôturer en point supervisable

1. Vérifications du jour rejouées et citées (tests, build, relectures, avec sorties réelles).
2. Docs mis à jour : SPEC si décision produit, plan coché et daté, suivi des attentes soldé ou créé, HISTORY avec but, fichiers, vérifications, état du graphe.
3. Journaux des experts intervenus mis à jour (entrée datée, contexte courant).
4. `graphify update .` quand du code ou de la doc a bougé.
5. Rendre à Aaron : fait, reste, prochaine étape proposée pour le prochain `/pilote-sim`, points où son arbitrage sera requis.

## Quand appeler quoi (table de routage du pilote)

- Rien de clair sur l'état du jour : rester dans `/pilote-sim`, ne pas appeler d'autre commande.
- Fond manquant ou douteux : `/recherche`, puis `/regles` seulement quand la fiche est solide.
- Vocabulaire ou champs instables : `/ontologie` avant toute règle nouvelle.
- Chiffre France manquant ou non daté : `/france-2026` avant le test qui l'exige.
- Règle à écrire ou moteur à faire avancer : `/moteur`, avec tests et seeds.
- Doute qualité sensible : auditeur adversarial avant présentation.
- Écrans ou lisibilité : `/audit-parcours-joueur`, jamais en même session qu'un gros chantier moteur.
- Secrets, dépendances, routes, sauvegardes : `/audit-securite-sim`, avant chaque jalon et après chaque brique sensible.
- Carte, SPEC et code en contradiction : `/recartographie-sim` avant tout le reste.
- Enrichissement gameplay visé : lire `docs/recherche-gameplay-hors-politique-2026-09-16.md` (jalons J15 à J17, J15 recommandé d'abord) et `docs/etude-jeux-comparables-2026-09-16.md` (jalons J11 à J14), tout jalon d'enrichissement attend le oui explicite d'Aaron.
- Question transversale à plusieurs pôles : panel selon `/boucle-sim` étape 4, avec synthèse sans perte.

## Garde-fous

- Ne jamais cumuler deux chantiers à moitié finis dans la même session.
- Ne jamais présenter comme vérifié ce qui n'a été lu qu'en résumé.
- Ne jamais toucher ni committer les fichiers d'une session parallèle, annoncer sa liste et s'y tenir.
- Ne jamais faire trancher à Aaron un point que la lecture du dépôt tranchait déjà.
- Ne jamais laisser une décision actée sans trace écrite immédiate.

## Format de sortie

Français, tutoiement, pas de tirets longs. Chaque lancement commence par l'état réel, propose un objectif unique, attend le oui, orchestre, puis clôture avec fait, reste et prochaine étape. À la fin d'une vraie session, proposer un bilan court de la méthode et ce qu'il faudrait ajouter ou retirer à ce fichier.
