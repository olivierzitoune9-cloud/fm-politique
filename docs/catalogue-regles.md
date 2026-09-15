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
