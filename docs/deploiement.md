# Déploiement, FM politique

Statut : procédure arrêtée le 2026-09-15 avec Aaron. Chemin retenu : GitHub puis Vercel, pour que chaque envoi de code redéploie tout seul.

## Ce qui rend le déploiement possible

Le moteur vit dans `ui/sim/` et non plus à la racine. C'est la conséquence directe du choix d'hébergement : Vercel ne construit que le dossier de l'application, ici `ui/`. Un moteur resté dans `src/` à la racine aurait cassé tous les imports en production.

- Application Next.js : `ui/`
- Moteur de simulation : `ui/sim/` en TypeScript pur, sans React
- Polices embarquées : `ui/public/polices/` en woff2, licences OFL à côté, jamais servies par un tiers
- Tests du moteur : lancés depuis la racine, ils lisent `ui/sim/`

## Réglages Vercel, à faire une fois

À l'écran d'importation du dépôt, deux champs comptent et un seul est indispensable :

1. **Root Directory** : `ui`. Indispensable, sans lui Vercel cherche une application à la racine et échoue.
2. Framework Preset : Next.js, détecté automatiquement.
3. Variables d'environnement : aucune. Le monde vit en fichiers, la sauvegarde en local dans le navigateur, aucun secret.

Rien d'autre. Un `vercel.json` n'est pas nécessaire et son absence évite un réglage de trop qui pourrait se contredire avec le champ Root Directory.

## Étapes, dans l'ordre

1. Créer un dépôt vide sur GitHub, sans README ni gitignore, public ou privé au choix. Le nom proposé : `fm-politique`.
2. Dans le dossier du projet, brancher le dépôt distant et envoyer la branche principale :
   `git remote add origin https://github.com/TON-COMPTE/fm-politique.git`
   `git push -u origin master`
   La première fois, Git demande de s'authentifier dans le navigateur. C'est normal et ça ne se reproduit plus ensuite.
3. Sur Vercel, Add New Project, importer le dépôt, régler Root Directory sur `ui`, Deploy.
4. L'adresse publique prend la forme `fm-politique.vercel.app` et ouvre directement l'écran de création de personnage.

## Ensuite, à chaque fois

Un `git push` suffit. Vercel reconstruit et republie. Les parties enregistrées dans le navigateur d'Aaron survivent aux redéploiements, puisque la sauvegarde est locale et non côté serveur.

## Points de vigilance connus

- **Node** : Next 14 demande Node 18 ou plus, Vercel fournit Node 20 par défaut. Rien à régler.
- **Nom du jeu** : le sous-domaine reprend le nom du projet Vercel. Renommer plus tard changera l'adresse. Aaron n'a pas encore tranché le nom définitif, le nom de code FM politique fait donc l'affaire en attendant, sans que ce soit un engagement.
- **Parties locales** : chaque navigateur a ses propres sauvegardes. Deux appareils ne partagent pas une partie, et c'est assumé à ce stade.