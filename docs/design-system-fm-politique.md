# Design system, FM politique

Statut : doctrine de référence, écrite le 2026-09-15, autorité sur tout choix visuel du jeu.
Autorité : Inès (agente `expert-design-sim`) tient ce document. L'exécution visuelle vit dans `ui/app/**` et dans `ui/app/styles/` : `composants.css` (grilles, cartes, tableaux denses, barres), `listes.css` (métadonnées, badges, listes, chronologie, courrier, états), `formulaire.css` (champs, choix, boutons, liens d'action), `tableau-de-bord.css` (identité du joueur, progression, lignes d'action, fiches, écran de fin), le tout sur les jetons et les polices de `globals.css`. Ce document ne décrit jamais le moteur.
Portée : lecture éditoriale, densité, couleur, typographie, composants, états, accès, mouvement.

Lis d'abord `docs/vision-v1-v2.md` (ce que le jeu cherche à être) et `docs/journaux-experts/design.md` (pourquoi ces choix ont été faits, erreurs comprises). Un choix visuel ici est un choix acté, pas une préférence.

## 1. La thèse, en une phrase

**Ce jeu ne se regarde pas comme un jeu vidéo, il se consulte comme un dossier tenu à jour chaque semaine.**

Le joueur passe de longues sessions à lire : un courrier, un article, une fiche de personnage, un tableau de groupes, une échéance. Le design doit tenir trois tensions à la fois, et c'est ce triangle qui définit tout le reste :

- **lisibilité de lecture longue** : c'est un texte, d'abord ;
- **densité contrôlée** : c'est un tableau de bord politique, il porte beaucoup de chiffres ;
- **gravité institutionnelle** : le sujet est la chose publique, pas un parc d'attractions.

Ce triangle interdit deux paresses symétriques : le quiz télévisé (couleurs saturées, tout est bouton) et le site de préfecture (tout gris, rien ne ressort). Sobre dans les moyens, net dans la hiérarchie.

## 2. Ce que dit la recherche

Chaque appui ci-dessous est une source réelle, consultée le 2026-09-15. Je sépare l'**établi** (documenté par la source) de ce que j'en **déduis** (hypothèse de design, assumée comme telle).

**Typographie, règles chiffrées (établi).** Butterick, *Practical Typography*, « Summary of key rules » : sur le web, corps de texte entre 15 et 25 px, interligne entre 120 % et 145 % de la taille, longueur de ligne moyenne entre 45 et 90 caractères, capitales acceptables en dessous d'une ligne, jamais italique et gras ensemble, jamais de soulignement hors lien, éviter les polices système par défaut.
Ce que j'en retiens : mes décisions se mesurent en `ch` et en pourcentage d'interligne, pas au feeling. Mesure de référence du corps de lecture de ce jeu : **66 caractères**.

**Principes de service public (établi).** GOV.UK, *Government Design Principles*, dix principes dont « Do less », « Design with data », « Do the hard work to make it simple », « Understand context », « This is for everyone », « Be consistent, not uniform ». Version en vigueur depuis le 2 avril 2025, avec l'ajout d'un onzième principe sur l'empreinte environnementale.
Ce que j'en retiens : « Do less » et « Be consistent, not uniform » sont mes deux garde-fous opérationnels. Moins d'ornements, et une cohérence de famille plutôt qu'une uniformité mécanique.

**Heuristiques d'usage (établi).** Nielsen Norman Group, *10 Usability Heuristics for User Interface Design*, révisées le 30 janvier 2024. Celles qui gouvernent ce jeu : visibilité de l'état du système, correspondance entre le système et le monde réel, reconnaissance plutôt que rappel, cohérence et standards, design esthétique et minimaliste.
Traduction en jeu : le joueur voit à tout instant où il en est dans la semaine, ce qu'il peut encore faire ce tour-ci, et ce que le monde vient de lui faire. Et on parle en semaines, en euros, en voix, en noms de gens, jamais en « mana » ni en « points d'action ».

## 2bis. Le document public français, la linéale neutre, la densité, les thèmes

**Architecture typographique du document public français (établi).** La charte graphique de l'État associe **Marianne** (titrage, dessinée en 2020 par Mathieu Réguer pour l'agence 4uatre, basée sur la capitale romaine et le Garamond) et **Spectral** comme typographie complémentaire, selon la circulaire n° 6144/SG du 17 février 2020. Marianne n'est pas redistribuable librement : son usage est ouvert aux administrations et opérateurs de l'État. Le DSFR (Système de design de l'État) porte une licence Etalab 2.0 avec utilisation interdite hors des sites de l'État. Spectral, elle, est publiée par Production Type (agence parisienne) sous **SIL Open Font License 1.1**, conçue à l'origine pour Google Docs et Slides.
Ce que j'en retiens, point de déontologie autant que de design : **ce jeu n'usurpe jamais l'identité visuelle de l'État.** Il ne doit jamais pouvoir être pris pour un service officiel, surtout sur un sujet politique. Donc pas de Marianne, pas de bloc-marque, pas de devise de la République en en-tête. Mais l'architecture d'esprit reste juste : **linéale neutre pour l'instrument, serif éditoriale pour la lecture**. Spectral est libre et devient ma serif de lecture.

**Linéale neutre et chiffres tabulaires (établi).** Public Sans, créée par l'US Web Design System, dérivée de Libre Franklin, sous **SIL Open Font License 1.1**, développement arrêté. Objectifs déclarés : « strong and neutral », peu de bizarreries, bon comportement en titrage, texte et interface, **chiffres tabulaires pour le design de données**, métriques proches des polices système pour une amélioration progressive propre.
Ce que j'en retiens : profil exact dont ce jeu a besoin, parce qu'il est plein de nombres alignés en colonnes (semaines, euros, pourcentages, voix). Les chiffres tabulaires ne sont pas cosmétiques ici : c'est la condition pour comparer deux colonnes d'un coup d'œil.

**Densité assumée (établi).** Le Bloomberg Terminal, en service depuis décembre 1982, est réputé pour son interface noire et sa densité, devenues un trait reconnaissable du produit ; son usage suppose un utilisateur professionnel intensif et une lecture experte des données.
Ce que j'en retiens : la densité est légitime pour un usage quotidien expert, mais elle ne se copie pas telle quelle pour un joueur qui découvre le jeu. Je garde la densité **par paliers** : sobre à l'écran-titre, dense dans les vues de suivi, jamais dense partout.

**Modes clair et sombre (établi).** web.dev, *prefers-color-scheme: Hello darkness, my old friend* : le mode sombre répond à un usage réel (environnement peu éclairé), se déclare via la requête média `prefers-color-scheme` et la propriété CSS `color-scheme`, et comporte des pièges documentés (images, couleurs sémantiques, cohérence entre préférence système et préférence du site).
Traduction : ce jeu se joue le soir. Le mode sombre n'est pas un caprice, c'est une seconde palette complète, tenue avec le même soin, jamais une inversion automatique.

## 3. Décisions actées

**D1. Deux polices, deux rôles, aucun mélange.** Spectral (OFL 1.1) pour tout ce qui se lit comme un document : courriers, articles, chronologie, descriptions, dépêches. Public Sans (OFL 1.1) pour tout ce qui se lit comme un instrument : titres, libellés, tableaux, chiffres, boutons, étiquettes. Une serif dans un tableau ou une linéale dans un courrier est un défaut, pas un choix.
Les deux polices sont embarquées localement dans le projet (`ui/public/polices/`, fichiers woff2), jamais appelées à un CDN. Raison : un jeu doit s'ouvrir sans dépendre d'un tiers, et la licence OFL autorise explicitement l'embarquement.

**D2. Chiffres tabulaires partout où des nombres se comparent.** `font-variant-numeric: tabular-nums` sur les tableaux, les ressources, les dates, les pourcentages.

**D3. L'accent est un bleu institutionnel sourd, pas un rouge partisan.** `--accent: #1f4a8c`. Raison de fond, pas d'esthétique : dans un jeu politique français, le rouge porte une charge partisane et le tricolore évoque le drapeau. L'accent marque ce qui est actionnable ou décisif, il ne décore pas. Un accent unique, rare, qui ne marque qu'un point à la fois.

**D4. Le rouge devient sémantique et seulement sémantique.** `--danger: #a4232a` réservé au scandale, à l'enquête, à la menace, à la perte. Jamais un ornement, jamais un bouton neutre.

**D5. Deux thèmes complets, pas une inversion.** Clair « papier de dossier » par défaut ; sombre « veille » automatique via `prefers-color-scheme`, avec les mêmes valeurs sémantiques recomposées à la main pour tenir les contrastes.

**D6. Le liseré fin remplace l'ombre.** La profondeur vient des filets, des fonds légèrement décalés et de l'encre. Une seule ombre légère autorisée, sur les surfaces flottantes, jamais sur les cartes de contenu.

**D7. Aucune image, aucun portrait.** Les personnages sont fictifs par conception : ils se représentent par leurs initiales dans un carré typographique, jamais par un visage. Cohérent déontologiquement, et ça évite le pire travers du genre, le faux portrait de personnage réel.

**D8. Le temps est un composant.** La semaine en cours est un élément d'interface permanent, datée en clair (« Semaine du lundi 7 septembre 2026 »), et les échéances réelles du calendrier français forment un rail visible. Le joueur ne doit jamais se demander où il en est.

**D9. Le mouvement est quasi nul.** Transitions de 120 à 180 ms sur opacité et bordure uniquement, désactivées sous `prefers-reduced-motion`. Aucune animation décorative : la gravité vient de la retenue.

**D10. Rien de montré n'existe sans le moteur.** Aucun chiffre, aucune barre, aucune étiquette décorative. Si la donnée n'est pas produite par `ui/sim/**`, elle n'a pas sa place à l'écran.

**D11. La densité se donne par paliers, jamais en bloc.** Trois niveaux, et une vue appartient toujours à un seul : niveau 0 l'écran-titre (une phrase, deux portes, aucun chiffre), niveau 1 la semaine de jeu (rail du temps, ressources, courrier, densité moyenne), niveau 2 les vues de suivi (groupes, médias, propositions, chronologie, densité forte, tableaux et chiffres tabulaires). Une vue de niveau 0 qui se met à afficher des colonnes de chiffres est un défaut, pas une richesse.

**D12. Un seul accent par vue.** L'accent bleu marque le point décisif de l'écran, celui que le joueur doit regarder. Deux accents visibles dans la même vue annulent la hiérarchie.

**D13. Le rouge ne s'affiche que s'il est mérité par le monde.** `--danger` apparaît quand le moteur produit un scandale, une enquête, une perte, une trahison. Aucun élément d'interface neutre ne porte cette couleur, jamais.

## 4. Tokens

Tout ce qui suit est la seule source de vérité des valeurs. Aucun fichier de style n'introduit une couleur, une taille ou un espacement hors de cette liste : si un besoin manque, on amende ce document d'abord.

### 4.1 Couleurs, thème clair « papier de dossier »

| Token | Valeur | Usage |
| --- | --- | --- |
| `--fond` | `#f5f2ea` | fond de page, papier |
| `--fond-creux` | `#ebe6d9` | zone en creux, rail, en-tête de tableau |
| `--surface` | `#fffdf7` | cartes, blocs de contenu |
| `--encre` | `#191713` | texte principal, titres |
| `--encre-douce` | `#443f37` | corps secondaire |
| `--muted` | `#6f6a5f` | métadonnées, sources, libellés |
| `--bordure` | `#ddd5c4` | filets, séparateurs |
| `--bordure-forte` | `#c2b8a3` | survol, contours de contrôle |
| `--accent` | `#1f4a8c` | point décisif, action principale |
| `--accent-clair` | `#e5ebf6` | fond d'élément choisi |
| `--danger` | `#a4232a` | scandale, enquête, perte, trahison |
| `--danger-clair` | `#f7e7e5` | fond d'alerte grave |
| `--succes` | `#2f6b46` | gain net, relation positive, accord tenu |
| `--succes-clair` | `#e6efe8` | fond de gain |
| `--avert` | `#8a5a12` | attention moyenne, tension, dette |
| `--avert-clair` | `#f6eddb` | fond de tension |

### 4.2 Couleurs, thème sombre « veille »

Mêmes rôles, valeurs recomposées à la main pour tenir les contrastes sur fond sombre. Jamais une inversion mécanique.

| Token | Valeur |
| --- | --- |
| `--fond` | `#11131a` |
| `--fond-creux` | `#0c0e13` |
| `--surface` | `#181b23` |
| `--encre` | `#e9e5da` |
| `--encre-douce` | `#c6c1b6` |
| `--muted` | `#948e82` |
| `--bordure` | `#2a2e38` |
| `--bordure-forte` | `#3c4250` |
| `--accent` | `#87aae2` |
| `--accent-clair` | `#1c2536` |
| `--danger` | `#e2837d` |
| `--danger-clair` | `#37211f` |
| `--succes` | `#7cb894` |
| `--succes-clair` | `#16281d` |
| `--avert` | `#d9a95c` |
| `--avert-clair` | `#2e2416` |

### 4.3 Typographie

| Token | Valeur | Rôle |
| --- | --- | --- |
| `--f-serif` | `Spectral, Georgia, serif` | tout ce qui se lit comme un document |
| `--f-sans` | `Public Sans, system-ui, sans-serif` | tout ce qui se lit comme un instrument |
| `--t-xs` | `0.75rem` | étiquettes, badges, notes |
| `--t-s` | `0.8125rem` | métadonnées, sources, en-têtes de tableau |
| `--t-m` | `0.9375rem` | interface courante, boutons, formulaires |
| `--t-l` | `1.0625rem` | corps de lecture, courrier, chronologie |
| `--t-xl` | `1.375rem` | titres de bloc |
| `--t-2xl` | `1.75rem` | titres de vue |
| `--t-3xl` | `2.5rem` | écran-titre uniquement |
| `--mesure` | `66ch` | largeur maximale d'un texte de lecture |
| `--interligne-lecture` | `1.55` | corps serif |
| `--interligne-ui` | `1.35` | interface, tableaux |

Capitales réservées aux lignes courtes (moins d'une ligne), avec interlettrage de `0.08em`. Jamais d'italique et de gras ensemble. Aucun soulignement hors lien.

### 4.4 Espacement, filets, rayons

Échelle unique en multiples de 4 : `4 8 12 16 24 32 48 64`. Rayon `3px` pour les contrôles, `0` pour les blocs de contenu. La profondeur vient des filets : `1px solid var(--bordure)` en séparation interne, `2px double var(--encre)` pour un en-tête de dossier. Une seule ombre tolérée, `0 1px 0 var(--bordure)`, jamais sur une carte de contenu.

### 4.5 Mouvement

Transition de `140ms ease-out` limitée à la couleur, la bordure, l'opacité et la transformation d'un filet. Rien d'autre. Tout est annulé sous `prefers-reduced-motion: reduce`.