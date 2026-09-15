# Catalogue des règles (testables, jamais scriptées)

> Une règle qui ne peut pas échouer en test n'est pas une règle. Chaque règle lit seulement le dictionnaire v1, porte seed et tirage journalisé, et prévoit ses effets opposés.

## R1. Étiquetage activant le favoritisme ingroup (M4 Tajfel 1971)

Variable : `identiteActive` par GroupePopulation, 0..1.
Définition : un étiquetage nous contre eux, même absurde, suffit à créer un favoritisme d'allocation en faveur de l'ingroup, avec préférence pour creuser l'écart plutôt que maximiser le gain joint.

Déclencheurs et conditions nécessaires :
- Un Acteur émet un étiquetage (discours, slogan, symbole) vers au moins un GroupePopulation avec exposition strictement positive.
- Effet seulement si le groupe est exposé (expositionMedia non vide ou contact direct). Exposition nulle veut dire effet nul.

Renforçateurs : répétition (M11), menace perçue élevée (M3), marque simple et reproductible (M6), source crédible.
Atténuateurs : contacts croisés, intérêts partagés avec l'outgroup, source peu crédible, réfutation coûteuse mais possible.
Effets avec ampleurs et délais :
- `identiteActive` augmente immédiatement, delta plafonné à 0.15 par pas, jamais au delà de 1.
- Le biais d'allocation (vote, soutien, distribution) favorise l'ingroup à hauteur de `identiteActive`, avec prime à la différence sur le profit joint.
Effets opposés (même action, résultats différents selon contexte) :
- Réactance : étiquetage grossier plus source peu crédible peut faire baisser `identiteActive` ou coûter en `reputation` et `credibilite` de l'émetteur.
- Contre mobilisation : l'outgroup exposé peut voir sa propre `identiteActive` monter contre l'émetteur.
- Coût de coalition : les alliés modérés peuvent prendre leurs distances (relation en intensité négative).
Bornes anti explosion : delta max 0.15, plafond 1, plancher 0, pas d'effet sans exposition, bruit stochastique borné à plus ou moins 0.02.
Seed et tirage : RNG mulberry32, graine = seedSession + compteurTirages, chaque tirage journalisé avec règle, graine et rang.
Sources datées : Tajfel et al. 1971 Eur. J. Soc. Psychol. 1:149-177 [établi pour l'effet minimal, plausible pour l'intensité réelle]. Bilbiothèque M4.
Limites : effet labo robuste, transposition politique conditionnelle. Ne modélise ni la haine préalable ni l'intérêt objectif.
Hypothèses de passage : contacts croisés et intérêts partagés en 0..1 par couple de groupes, défaut 0.3 et 0.3 [hypothèse]. Grossièreté de l'étiquetage en 0..1, défaut 0.3 [hypothèse].

Statut : codée et testée en `src/sim/rules/r1-etiquetage.ts`, tests `src/sim/rules/r1-etiquetage.test.ts`.

## R2. Répétition et familiarité (M11 Hasher 1977)

Exposition répétée via fictions et flux augmente la familiarité, effet modulé par connaissance préalable et confiance en la source, rendements décroissants, jamais de conversion garantie. Dose plafonnée à 3 expositions utiles par pas, delta max 0.12. Code `r2-repetition.ts`.

## R3. Menace normative et bascule (M3 Stenner 2005)

Prédisposition par groupe croisée avec menace perçue, bascule non linéaire avec seuil vers 0.4 et hystérésis (on ne redescend qu'à moitié). Sans bord politique fixe, sans tripartition 39 2 59. Delta borné à plus ou moins 0.12. Code `r3-menace.ts`.

## R4. Détresse et demande de sauveur (M1)

Chômage, faillites et perte de contrôle augmentent la réceptivité aux discours d'ordre, avec mémoire (montée vite, descente lente). Prospérité rend inaudible. Delta max 0.12. Code `r4-detresse.ts`.

## R5. Masse critique et bascule de norme (M12 Centola 2018)

Seuil paramétrable défaut 0.25, non universel. Sous le seuil quasi rien avec reflux, au delà adoption rapide vers majorité. Delta borné. Code `r5-masse-critique.ts`.

## R6. Escalade des engagements (M19 Freedman Fraser 1966)

Petit oui redéfinissant l'image de soi, probabilité d'acceptation suivante en fonction de l'image moins coût moins lassitude. Saturation et réactance incluses. Code `r6-engagement.ts`.

## R7. Obéissance à l'autorité (M18 Milgram, Burger 2009)

Probabilité d'exécution selon légitimité perçue, surveillance, responsabilité diluée, moins gravité. Refus et fuites possibles. Calibration : 70 pour cent Burger contre 82,5 Milgram après 150 V. Code `r7-obeissance.ts`.

## R8. Impuissance apprise (M20 Seligman 1967)

Prévisibilité aussi importante que l'intensité. Efficacité perçue moins peur paralysante, poches de résistance jamais à zéro forcé. 75 pour cent jamais codé. Code `r8-impuissance.ts`.

## R9. Fenêtre d'Overton case par case (M7)

Dicibilité par groupe, déplacements marginaux max 0.08 via relais à déni, contre feu crédible bloquant. Jamais de saut frontal. Code `r9-overton.ts`.

## R10. Langage adoucissant et déshumanisation (M8 Klemperer, M17 Bandura)

Euphémisme baissant le coût moral perçu, dévoilement et moquerie le remontant. Huit mécanismes Bandura en cadre, sans glorification ni récompense de l'atrocité. Code `r10-euphemisme.ts`.

## R11. Bouc émissaire (M5)

Cible petite et visible rend de la cohésion, protégée ou usée le rendement chute, coût de réputation et coalition adverse à chaque fois. Jamais automatique. Code `r11-bouc.ts`.

## R12. Marque portable et double lecture (M6)

Simplicité, reproductibilité, respectabilité et lecture cachée. Recrutement contre risque de décodage par vigilance adverse. Code `r12-marque.ts`.

## R13. Sophismes productifs (M9)

Fausse causalité, inversion de la charge, pente savonneuse, glissement de langage. Persuasion selon sophistication du public, crédibilité, répétition, moins réfutation coûteuse. Code `r13-sophisme.ts`.

## R14. Caution savante (M10)

Multiplicateur de portée 1 à 2.6 si institutions perméables, risque de débunkage selon vigilance médias et solidité. Code `r14-caution.ts`.

## R15. Arbitrage légal contre force (M13)

Voie légale choisie selon surveillance, bonus de légitimité, coût de répression et soutien international. Trajectoires mixtes possibles. Code `r15-voie-legale.ts`.

## R16. Capture par tranches fines (M14 salami)

Nominations et carrières comme vecteurs discrets, effet max 0.12 par pas, discrétion si agressivité basse et protections faibles. Résistance selon cohésion et protections croisées. Code `r16-salami.ts`.

## R17. Neutralisation de l'armée (M15)

Nominations, fragmentation, enrichissement. Loyauté modulée, risque putsch si misère ou humiliation. Code `r17-armee.ts`.

## R18. Choc et exception (M16)

Crise ouvrant brièvement la fenêtre, acceptation selon peur et confiance. Cliquet si institutions faibles et acceptation haute, sinon reflux. Origine traitée comme variable d'enquête. Code `r18-choc.ts`.

## R19. Soupapes et opposition systémique (M21)

Votes sans enjeu et boucs intermédiaires réduisant la rue à court terme au prix d'une délégitimation lente. Répression ciblée avec onde puis oubli. Code `r19-soupape.ts`.

## R20. Ralliement et frappe (M22 Mueller)

Pic selon caractère spectaculaire puis décroissance hebdomadaire, issue modulant des années de portage à la chute en semaines. Plafond Crimée 88 jamais 90. Code `r20-rally.ts`.

## R21. Culte de la personnalité (M23)

Concentration de l'image resserrant la coalition à court terme, fragilisant succession et parti. Code `r21-culte.ts`.

## R22. Préparation silencieuse (M2)

Construction de ressources et réseau avant la fenêtre, avec coûts d'entretien et risque de surexposition. Rendement borné. Code `r22-preparation.ts`.

## Revue adversariale globale du 2026-09-15

48 tests verts sur 11 fichiers, tsc propre. Aucune règle ne domine seule : R1 plafonnée, R5 à seuil, R9 marginale, R16 en tranches fines, R20 avec décroissance. Aucune stratégie toujours optimale : réactance R1, débunk R14, cliquet risqué R18, décodage R12. Aucune morale cachée : que des conséquences. Constantes interdites respectées : pas de 39 2 59, pas de 75 Seligman, pas de 90 Crimée.
