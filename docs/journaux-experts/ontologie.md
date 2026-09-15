# Journal du pôle ontologie

## 2026-09-15, /ontologie v1

### Contexte courant

Ontologie v1 stabilisée dans docs/ontologie-v1.md avec dictionnaire docs/dictionnaire-variables-v1.md. Sept entités : GroupePopulation, Acteur, Media, Institution, Territoire, Relation, Proposition. Échelles 0..1, null pour inconnu, joueur comme instance d'Acteur. Aucune valeur France 2026 en dur.

### Revue adversariale du 2026-09-15

- Variable sans justification : aucune, chaque ligne du dictionnaire porte [établi], [plausible], [hypothèse] ou [donnée observée en Phase 6].
- Champ jamais lu : à risque taillePart, mefianceInfo, vitesse, temps. Conservés car lus par pondération M1 M12, atténuation M11, boucle multi échelles et coûts M2. À vérifier à la première règle.
- Relation sans verbe : non, huit verbes système déclarés.
- Redondances tranchées : popularite (chaleur sondagière M22) contre soutienPopulaire (ressource mobilisable) contre legitimite (droit à commander M13) contre reputation (mémoire de fiabilité) contre credibilite (confiance épistémique M10). Cinq notions distinctes, pas de fusion.
- Jauge unique : interdite en section dédiée de v1.
- Entité isolée : aucune, Territoire lié par groupes, Proposition par auteur et groupes.
- France en dur : aucun chiffre, renvoi Phase 6.

### Erreurs et limites

- Idéologie en deux axes seulement, à élargir si une règle l'exige avec justification.
- Territoire volontairement pauvre, carte exacte en Phase 6.
- Proposition ne tranche jamais la vérité, risque de relativisme à cadrer en Phase 5 par statutPreuve et fact checking coûteux.
