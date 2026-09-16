# Audit parcours joueur du 2026-09-16, partie p2.1.0, sur écrans réels

> Protocole /audit-parcours-joueur. Banque de parcours : accueil, création, première semaine, première sanction, première montée de palier, carte, sondage, crise (risque d'enquête), défaite, victoire, reprise. Cinq dimensions : clarté, rythme, rejouabilité, valeur, honnêteté. Retours réels d'Aaron du 2026-09-16 prévalant sur la simulation. Aucune modification de code dans cet audit, positions tranchées et retouches nommées pour GO d'Aaron.

## Ce qui a été parcouru, écran et ligne

- Accueil `ui/app/page.tsx` : phrase, chapeau, deux portes, mentions basses lignes 22 à 26, repères France sourcés.
- Création `ui/app/nouvelle-partie/page.tsx` : origine et vecteur ligne 86, ambition, proposition, graine expliquée lignes 146 à 150, bouton ligne 152.
- Partie `ui/app/partie/page.tsx` : bandeau nom métier statut semaine lignes 147 à 151, objectifs à paliers lignes 156 à 166, barres lignes 167 à 173, fin lignes 181 à 197, erreur ligne 199, proposition lignes 201 à 219, carte lignes 221 à 238, pays au loin ou partis lignes 240 à 271, médias lignes 273 à 289, action lignes 294 à 316, sondages lignes 328 à 349, interaction, mail, journal, monde perçu, chronologie, repères.
- Pied de page `ui/app/layout.tsx` lignes 30 à 32 : mention discrète, plus aucun avertissement en écran de jeu.

## Panel testeurs, verdicts

- Nouveau venu : PUBLIABLE avec retouches. Il comprend d'où il part (métier affiché), ce qu'il vise (objectifs à paliers), ce qu'il peut faire (actions du palier comptées ligne 296). Frein : la page de partie est très longue, le bouton semaine est loin sous les barres. Retouche nommée : remonter le bouton semaine près du bandeau.
- Stratège : PUBLIABLE avec retouches. Il lit coûts, paliers, sanctions annoncées, carte, sondages biaisés. Frein : les sondages ne coûtent rien en jeu (coûts affichés lignes 344, jamais débités), donc l'arbitrage est gratuit. Retouche nommée : débiter le sondage commandé chaque semaine.
- Moraliste : PUBLIABLE. Aucune jauge de bien ou mal, conséquences seulement, mention déontologique en pied de page sans moraliser l'écran. Rien à retoucher sur ce plan.
- Troll : RETOUCHES NOMMÉES. Il peut forcer sans ressource et lire la sanction, c'est voulu (R7). Mais il peut recommencer à l'infini avec la même graine (bouton ligne 189) sans trace d'échec, et la trahison ne remonte pas visiblement dans l'écran. Retouches nommées : journaliser l'abandon de fin dans le journal, afficher la mémoire des personnages trahis dans leur fiche.
- Historien : RETRAVAILLER sur un point. Les repères France et le chômage sourcé tiennent, mais les groupes perçus s'appellent encore grp.centre et grp.peripherie (lignes 521 à 527) et la proposition affiche des ids de groupes bruts. Ce n'est pas publiable en l'état pour lui. Retouche nommée : libellés français des groupes partout dans l'écran.
- Toi, Aaron non gamer : PUBLIABLE avec retouches. R1 R2 R8 R3 traités et vérifiés en lecture. Reste le doute terminal : sans tests ni build rejoués, je ne peux pas te garantir que tout clic répond vraiment chez toi.

## Trous hiérarchisés

1. Bloquant ressenti : page de partie trop longue avant d'agir. Le bouton semaine devrait vivre près du bandeau, avec l'erreur juste en dessous. Sans cela, le nouveau venu croit encore que le jeu ne répond pas quand il ne scrolle pas.
2. Promesse non tenue : le sondage commandé affiche un coût mais ne débite rien. Soit on débite, soit on retire le coût affiché. L'honnêteté l'exige.
3. Lisibilité historienne : ids techniques grp.centre et grp.peripherie à l'écran, groupes de dicibilité bruts. À franciser avant toute démo externe.
4. Mémoire peu visible : dettes, promesses, trahisons existent dans le moteur mais ne se lisent pas dans les fiches personnages de l'écran. Le troll ne voit pas le retour de bâton venir.
5. Rejouabilité : une seule sauvegarde locale, recommencer écrase sans confirmation. À confirmer avant d'ajouter des slots.
6. Fin de partie : le bouton rejouer avec la même graine ne journalise pas l'échec, la défaite ne laisse pas de trace. Dommage pour la SPEC qui veut des chaînes causales reconstructibles.

## Positions tranchées

- Les paliers tiennent : au palier 1, aucun parti rival, un seul média, visages de proximité. C'est exactement ta demande step by step.
- Les sanctions tiennent en lecture : dette, risque, réputation, journal explicite. Reste à vérifier en jeu réel que forcer fait vraiment mal sur dix semaines.
- La carte tient : douze territoires lisibles, tension ombre contre visibilité lisible.
- L'info imparfaite tient à moitié : sondages biaisés affichés oui, mais gratuits, donc sans arbitrage. À trancher : débiter ou retirer.
- Aucun dark pattern détecté : pas d'urgence artificielle, pas de blocage déguisé, limites visibles (paliers comptés, coûts affichés).

## Verdict global

PUBLIABLE avec retouches, jamais sans rejouer tests et build. Cinq retouches nommées pour ton GO, dans l'ordre : bouton semaine remonté, sondage débité ou coût retiré, libellés français des groupes, mémoire visible dans les fiches, trace d'échec au rejouer. Le retravailler historien se règle avec les libellés, sans chantier moteur.
