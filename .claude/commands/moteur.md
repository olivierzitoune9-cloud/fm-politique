# /moteur

> Coder le moteur par étapes contrôlées : boucle minimale d'abord, profondeur ensuite. Gros cahier des charges plus checkpoints, jamais une seule passe aveugle.

## Protocole

1. Rituel : `/boucle-sim` relue, journaux développeur et modélisation, SPEC section concernée, architecture, catalogue des règles, graphe à jour (update si périmé).
2. Cadrer la session : périmètre annoncé (une couche, un système), objectif unique avec oui d'Aaron avant de coder.
3. Coder senior : couches séparées DATA, RULES, SIMULATION, AI, NARRATIVE, UI, petits pas vérifiables, tests avant déclaration, ordre de boucle fixe, mémoire écrite, seeds rejouables.
4. Vérifier : Vitest vert, simulations longues sans absurdité (voir architecture), build vert, parcours manuel des écrans touchés, validation sur machine réelle.
5. Sauvegarde : commit clair sans secret, plan coché, SPEC et HISTORY à jour, `graphify update .`.

## Garde-fous

Ne jamais coder un système sans relire sa section SPEC. Ne jamais faire décider la causalité par génération libre. Ne jamais monter de dépendance majeure sans validation. Ne jamais toucher les fichiers d'une session parallèle.
