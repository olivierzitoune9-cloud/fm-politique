# Audit parcours joueur du 2026-09-15 (prototype non jouable)

## Ce que le joueur lit aujourd'hui

Page ui/ : tableaux des groupes, repères France datés, chronologie causale avec sources. Lisible, sans jargon, sans personnage animé. Conforme SPEC section 4.

## Trou majeur signalé

Le joueur n'existe pas encore dans la boucle : deux acteurs abstraits seulement, aucune instance avec estJoueur, aucune décision entrée, aucune info imparfaite appliquée (le moteur connaît tout, le joueur devrait découvrir par sondages et rapports). La lecture du monde montre l'état exact, pas la vue filtrée du joueur.

## Points conformes

- Pas de jauge de bien ni mal, que des conséquences. [OK]
- Sources internes affichées dans chaque texte. [OK]
- Échec et trajectoires multiples prévus en SPEC, non contredits. [OK]
- Mémoire du monde écrite (décisions, événements). [OK]

## Préconisations avant prototype jouable

1. Ajouter un Acteur joueur (estJoueur) avec ressources d'insignifiant et 5 actions jouables mappées aux règles.
2. Filtrer la page en vue joueur : croyances, sondages biaisés, rapports retardés, jamais l'état exact.
3. Ajouter boîte mail et agenda minimaux comme lecture du monde.
4. Valider l'avertissement d'ouverture (attente Aaron, SPEC section 6).
