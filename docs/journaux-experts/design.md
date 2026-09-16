# Journal design, FM politique

Tenu par Inès, pôle `expert-design-sim`. Une entrée par intervention substantielle. Les erreurs restent inscrites, corrigées par une entrée ultérieure.

## Contexte courant (à lire en premier)

Situation : première session du pôle design, ouverte le 2026-09-15 sur demande directe d'Aaron. Sa consigne exacte, qui vaut mandat : « moi je ne suis pas un grand gamer, donc oublier mes inspirations, puis aller faire des recherches. L'objectif c'est de trouver le design le plus beau, classe, élégant, fonctionnel pour ce jeu en particulier. Copier pour copier ne sert à rien. »

Ce qui est acté et ne se rediscute pas sans raison neuve :
1. `docs/design-system-fm-politique.md` est la doctrine. Tokens, palette clair et sombre, échelle typographique, règles de densité par paliers, états, interdits.
2. Deux polices embarquées localement, jamais par CDN : Spectral (serif de lecture, OFL 1.1) et Public Sans (linéale d'instrument, OFL 1.1). Une serif dans un tableau et une linéale dans un courrier sont des défauts, pas des choix.
3. Accent bleu institutionnel sourd `#1f4a8c`, jamais le rouge : le rouge est sémantique et réservé au scandale, à l'enquête, à la perte.
4. Aucune image, aucun portrait, aucun emoji. Les personnages se représentent par leurs initiales dans un carré typographique.
5. Déontologie : le jeu ne peut jamais être pris pour un service officiel de l'État. Donc Marianne refusée, bloc-marque refusé, devise de la République refusée en en-tête, tricolore refusé en décoration.
6. Rien de montré n'existe sans le moteur (règle D10).

Limite portée en tête : le rendu final n'a pas encore été vérifié sur un appareil réel ni en mode sombre par un tiers. Mes conclusions restent provisoires jusqu'à la vérification visuelle.

## 2026-09-16, écrans p3.0.0 : le jeu dense sans devenir illisible

**Situation.** GO d'Aaron pour transformer le MVP en vrai jeu (jalons J11 à J17). La page de partie reçoit d'un coup : second étage de semaine, énergie et moral, six compétences, panneau de carrefour à deux ou trois réponses, badges d'effets durables, promesses et dons, saison du calendrier, coûts de palier, relation estimée, enjeux de territoire. Le risque design est clair : la densité tue la lecture.

**Ce que j'ai posé, dans la doctrine existante.**
- Le carrefour a sa propre carte, titrée « Carrefour », placée après le bandeau : un carrefour est un moment, il mérite une surface, jamais un menu déroulant noyé dans une colonne.
- La relation estimée remplace le chiffre exact : `relation estimée tiède (entre 0.12 et 0.44)` puis `connaissance 40 %`. L'information imparfaite devient lisible sans devenir floue : le badge porte le mot, la parenthèse porte la mesure.
- Les effets durables portent leur libellé entier, la promesse non tenue prend le badge grave (rouge sémantique, jamais décoratif), le don nommé prend le mauve.
- Le second étage vit dans la même section que l'action, sous un titre explicite « Activité de fond (second étage) » : deux zones, un seul geste de validation. Le joueur ne valide jamais deux semaines.
- La saison s'affiche en badge mauve dans le bandeau avec sa phrase d'ambiance, jamais en pied de page : c'est du contexte de jeu, pas une mention légale.
- Les coûts de palier et les surcoûts d'effets durables sont écrits en clair sous la ligne de ressources, en pourcentage de temps et d'argent : la difficulté croissante doit être annoncée avant d'être subie.

**Ce que je n'ai pas fait et qui reste dû.** Aucune vérification visuelle réelle de ces nouveaux blocs, ni en sombre, ni sur petit écran. La colonne de compétences ajoute six lignes de barres dans le bandeau : c'est le point le plus probable de surcharge, à surveiller au premier retour d'Aaron.

**Leçon.** La densité est acceptable quand chaque bloc a une fonction de décision. Elle devient une faute quand elle remplit pour remplir.

## 2026-09-15, ouverture du pôle, recherche au lieu de copie

**Situation.** Aaron refuse explicitement de copier Football Manager et Plague Inc, et refuse de m'y voir m'appuyer comme sources. Il demande une recherche réelle, et un pôle design au même titre que les autres pôles du projet.

**Ce que j'ai posé.** Un pôle `expert-design-sim` avec identité, rituel, périmètre et journal, sur le modèle des autres pôles. Puis une recherche réelle, datée, avec séparation stricte entre l'établi et ce que j'en déduis :

- *Practical Typography* (Butterick), « Summary of key rules » : corps web 15 à 25 px, interligne 120 à 145 % de la taille, ligne de 45 à 90 caractères, pas d'italique et gras ensemble, pas de soulignement hors lien. J'en tire une mesure de lecture de 66 caractères, chiffrée plutôt que sentie.
- GOV.UK, *Government Design Principles* : dix principes, dont « Do less » et « Be consistent, not uniform », version en vigueur depuis le 2 avril 2025 avec un onzième principe sur l'empreinte environnementale. J'en fais mes deux garde-fous opérationnels.
- Nielsen Norman Group, *10 Usability Heuristics*, revues le 30 janvier 2024 : visibilité de l'état du système, correspondance avec le monde réel, reconnaissance plutôt que rappel. Traduction directe en jeu : le joueur voit toujours où il en est de sa semaine et ce qu'il peut encore faire, et je parle en semaines, en euros, en voix, pas en points d'action.
- Charte graphique de l'État : Marianne (dessinée en 2020 par Mathieu Réguer pour l'agence 4uatre, basée sur la capitale romaine et le Garamond, usage ouvert aux administrations et opérateurs de l'État, donc non redistribuable ici) associée à Spectral comme complémentaire, par la circulaire n° 6144/SG du 17 février 2020. DSFR sous Etalab 2.0 avec usage interdit hors des sites de l'État.
- Spectral : Production Type, agence parisienne, **SIL Open Font License 1.1**, conçue au départ pour Google Docs et Slides.
- Public Sans : US Web Design System, dérivée de Libre Franklin, **SIL Open Font License 1.1**, développement arrêté, objectifs déclarés dont « strong and neutral », peu de bizarreries, et **chiffres tabulaires pour le design de données**.
- Bloomberg Terminal : interface noire et dense depuis décembre 1982, devenue un trait reconnaissable du produit. Densité légitime pour un usage expert quotidien, mais pas transposable telle quelle à un joueur qui découvre le jeu. D'où ma règle de densité **par paliers**.
- web.dev, `prefers-color-scheme` : le mode sombre répond à un usage réel en environnement peu éclairé, et comporte des pièges documentés. D'où deux palettes complètes tenues à la main, jamais une inversion automatique.

**Décision d'Aaron.** Consigne initiale tenue : chercher plutôt que copier, et traiter le design comme un chantier de plein droit.

**Suite observée.** Le design system est écrit et la recherche y est datée source par source. L'application réelle au code suit dans la même session.

**Leçon retenue.** Deux choses. D'abord que la bonne question n'était pas « quel jeu copier » mais « quel objet est-ce » : la réponse, un dossier politique tenu à jour chaque semaine, a rendu tout le reste décidable, y compris le refus du rouge partisan et le refus du portrait. Ensuite, une erreur technique que je garde : en réécrivant la section recherche du design system, j'ai écrasé par inadvertance un paragraphe déjà écrit sur le document public français et la linéale. Je l'ai repéré en relisant le fichier et je l'ai restauré sans perte. Leçon : quand je réécris un document vivant, je relis la zone entière avant d'écrire, jamais seulement la portion que je vise.

## 2026-09-15, de la doctrine au code, deux erreurs techniques à garder

**Situation.** Même session, deuxième temps : appliquer la doctrine au code réel, avec la consigne d'Aaron d'aller vite et de ne pas chronométrer.

**Ce que j'ai posé.** Les polices sont embarquées localement dans `ui/public/polices/`, avec les textes de licence OFL à côté et un script de téléchargement reproductible. Puis cinq feuilles, une par responsabilité : `globals.css` (jetons clair et sombre, polices, base, écran-titre, portes), `composants.css` (grilles, cartes, tableaux denses à chiffres tabulaires, barres de donnée), `listes.css` (métadonnées, badges sémantiques, listes, chronologie, boîte mail, états), `formulaire.css` (champs, pastilles de choix, boutons, liens d'action) et `tableau-de-bord.css` (bandeau d'identité, barres de progression, lignes d'action, fiches de personnages, écran de fin). Deux écrans repris de fond en comble, l'en-tête de dossier et l'accueil en écran-titre : une phrase, un chapeau, deux portes, aucun chiffre.

**Le seul écran de jeu, touché au scalpel.** Une modification chirurgicale, sans réécrire la logique : le titre du bandeau de semaine devient un composant d'identité à trois zones, le nom en serif, le statut en petites capitales accentuées, la semaine détachée à droite. Traduction directe de D8 : la semaine ne se cherche jamais.

**Erreurs à garder.** Deux, et elles m'ont coûté cher.
1. J'ai cru qu'un fichier existait parce que j'avais cru le créer. Deux créations avaient échoué en silence, l'une laissant un fichier réduit à une seule ligne, l'autre un fichier absent. Le build m'a démasqué : module introuvable. Leçon de méthode : un compte rendu de création n'est pas une preuve, je relis le fichier que je viens d'écrire. Et une écriture au delà de six mille caractères échoue, je découpe en feuilles cohérentes plutôt qu'en un seul bloc.
2. Trois vérifications ont échoué sans message utile et j'ai accusé le mauvais coupable avant de trouver : la politique d'exécution PowerShell du poste interdit `npm.ps1` et `npx.ps1`. Il faut appeler `npm.cmd` et `npx.cmd`. Leçon : quand une commande échoue sans message clair, je vérifie l'enveloppe (interpréteur, droits, chemin) avant de soupçonner le contenu.

**Décision d'Aaron.** Déploiement par GitHub puis Vercel, le dépôt étant créé par lui, pour que chaque envoi redéploie tout seul. Procédure écrite dans `docs/deploiement.md`. Consigne de méthode également : ne plus se servir du terminal quand on peut s'en passer.

**Suite.** Vérification du build en cours à l'écriture de cette entrée, puis commit, puis déploiement.

**Leçon retenue.** Le design n'était pas le problème quand Aaron disait que le jeu ne s'ouvrait pas : les écrans utilisaient encore des classes que la nouvelle feuille ne définissait pas, et l'écran restait donc informe. Un état intermédiaire entre deux mondes ressemble à une panne. J'aurais dû livrer la doctrine et son application d'un seul tenant, jamais l'une sans l'autre.