# /audit-securite-sim

> Contrôle répétable, adapté de Wisâl au jeu (pas de paiement ni données élèves au prototype, mais secrets, dépendances, routes, seeds et sauvegardes).

## Protocole

1. Graphe d'abord, update si périmé.
2. Secrets : `.gitignore` couvre `.env*`, hook actif, scan des motifs de clés, historique sans `.env`, variables listées par noms seuls.
3. Dépendances : audit prod zéro vulnérabilité, écarts signalés sans application sauvage, anti slopsquatting sur tout ajout récent.
4. Routes et API : garde quand nécessaire, entrées validées avec bornes, plafonds de débit sur tout point public ou coûteux, erreurs sans aide à l'attaquant.
5. Données et sauvegardes : seeds versionnés, sauvegardes locales sans donnée sensible, pas de personne réelle exposée au-delà du public documenté.
6. Rapport daté avec criticités, correctifs appliqués, actions Aaron restantes, comparaison à l'audit précédent. Finir par build et lint.
