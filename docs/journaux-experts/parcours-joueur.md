# Journal du pôle parcours joueur

Tenu par le pôle parcours joueur. Une entrée par audit. Les erreurs restent inscrites.

## Contexte courant (à lire en premier)

Dernier audit : 2026-09-16 sur partie p2.1.0, rapport dans docs/audit-parcours-joueur-2026-09-16.md. Verdict : publiable avec retouches, cinq retouches nommées dans l'ordre (bouton semaine remonté, sondage débité ou coût retiré, libellés français des groupes, mémoire visible dans les fiches, trace d'échec au rejouer). Méthode : écrans réels lus ligne à ligne, retours d'Aaron prévalant, aucune modification sans son GO. Limite : tests et build non rejoués ici, terminal sans sortie.

## 2026-09-16, audit p2.1.0 après rafale jalons

**Situation.** Première intervention du pôle, après la rafale J10 J7 J8 J9 J3 J4 J5. Commande /audit-parcours-joueur lancée par Aaron.

**Ce que j'ai posé.** Rituel complet : journal absent signalé, SPEC, suivi, HISTORY, vision, plan, trois écrans relus avec lignes. Banque de parcours en onze stations. Panel à cinq voix (nouveau venu, stratège, moraliste, troll, historien) plus Aaron. Cinq dimensions notées. Six trous hiérarchisés, cinq positions tranchées.

**Suite.** Cinq retouches nommées en attente du GO d'Aaron, aucune exécutée. La SPEC section 6 reste à mettre à jour quand il tranchera (avertissement déplacé, statut neutre, paliers, sanctions, origines, carte, sondages).

**Leçon retenue.** Un audit sans exécution vaut mieux qu'un fix aveugle : les quatre retours R1 R2 R8 R3 se vérifient en lecture, le reste (bouton, sondage, libellés, mémoire, trace) demande son arbitrage avant de toucher au code.

## 2026-09-16, exécution des cinq retouches après GO d'Aaron

**Situation.** Aaron a dit go sans nuance, donc les cinq retouches partent d'une traite. Le sondage reste débité plutôt que gratuit : savoir coûte, c'était le sens de la mécanique.

**Ce qui a été vérifié en lecture.** Retouche 1 bouton remonté près du bandeau (page.tsx boutons en haut). Retouche 2 débit du sondage dans jouerSemaine (partie.ts, temps et argent prélevés à chaque semaine, y compris le sondage gratuit du bar). Retouche 3 libellés français : g.libelle dans la table des groupes, libelleGroupe sur la dicibilité. Retouche 4 mémoire en badges dans chaque fiche personnage, trahison marquée grave, trois dernières entrées affichées.

**Ce qui a été écrit.** Retouche 5 : nouveau module pur ui/sim/traces.ts (traceDepuisFin, dedupliquerTraces, ajouterTrace, resumerTraces) avec test Vitest à trois cas. Branchement écran : clé locale fm-politique:traces, trace posée à chaque fin détectée et au rechargement d'une partie déjà finie, bloc « Trajectoires déjà tentées » sur l'écran de fin. La trace survit au rejouer même graine.

**Correction moteur au passage.** Un échec hérité de la rafale : le test des fins attendait retour-ordinaire au printemps 2032 mais la condition stricte tick supérieur à tickDeDate(2032, 4, 1) renvoyait null, car le 1er et le 2 avril 2032 partagent le même tick hebdomadaire. Corrigé en tick supérieur ou égal à tickDeDate(2032, 4, 2), avec commentaire du pourquoi. Le test du moteur n'a pas été affaibli.

**Vérification réelle.** Typecheck propre (rapport sans erreur après tsc --noEmit), suite complète 31 fichiers et 137 tests passés, zéro échec. Sorties capturées par fichiers rapport-typecheck.txt et rapport-tests.txt à la racine, le terminal ne rendant pas sa sortie.

**Limite.** Le build Next.js n'a pas été rejoué ici. Le lancer avant tout commit, et supprimer les deux fichiers rapport-* de la racine avant d'envoyer.
