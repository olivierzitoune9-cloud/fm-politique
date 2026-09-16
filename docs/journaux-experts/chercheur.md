# Journal du pôle recherche et pilotage

## 2026-09-16, recherche gameplay hors politique

### Contexte courant

Deuxième commande d'Aaron le même jour, après l'étude des jeux comparables : chercher exclusivement le gameplay, ne pas se limiter aux jeux politiques (FM lui-même n'est pas politique), diagnostic accepté que le jeu est maigre et son gameplay inintéressant. Livré dans docs/recherche-gameplay-hors-politique-2026-09-16.md : corpus de huit jeux hors politique étudiés en plus du corpus politique du matin, dix hypothèses de gameplay F1 à F10, trois jalons proposés J15 richesse de semaine, J16 dilemmes et personnalités, J17 information et remontée, recommandation J15 d'abord car les autres s'y empilent.

### Vérifications du jour

- Sources : page Steam FM24, Wikipédia anglais pour OOTP, LLTQ, Alter Ego, KoDP, EHM, Motorsport Manager, page Steam Kudos.
- Contournements : quatre pages Steam rendaient de mauvais jeux (mauvais IDs), rejouées par Wikipédia ; Alter Ego rendait une page d'homonymie, contournée pareillement.
- Discipline tenue : chaque mécanisme noté au niveau source (donnée observée de la page), les mécanismes internes de FM restent au plausible communautaire et ne sont jamais utilisés.

### Erreurs et limites

- EHM et Motorsport Manager : captures maigres (Wikipédia historique seul), leurs fiches volontairement minces, aucune hypothèse ne repose sur eux.
- Aucune source primaire de développeur (devlogs Sports Interactive, Playsport) consultée cette passe, notée comme suite possible.
- La passe précédente (étude politique) note déjà deux jeux inaccessibles (Power & Revolution, President Infinity) : inchangé, jamais contourné par invention.

## 2026-09-16, étude des jeux comparables

### Contexte courant

Mission d'Aaron : grosses recherches sur les jeux similaires, étude détaillée pour enrichir énormément le jeu sans rien oublier de la vision. Corpus de 12 jeux étudiés par sources primaires, livré dans docs/etude-jeux-comparables-2026-09-16.md avec 14 hypothèses d'enrichissement E1 à E14 et quatre jalons proposés J11 à J14, recommandation J11 d'abord.

### Vérifications du jour

- Sources : pages Steam officielles (Democracy 4, The Political Process appid 1184770, Espiocracy appid 1670650, The Political Machine 2024 appid 2512090), Wikipedia, wikis Positech et Paradox (partiellement bloqués, contournés).
- Contournements tentés pour les manquants : site Eversim (fetch failed), site 270soft (fetch failed), Wikipédia fr et en (404), DuckDuckGo HTML (captcha bot), MobyGames (403). Deux jeux restent non étudiés : Power & Revolution, President Infinity. Noté comme limite dans l'étude, aucune conclusion ne repose sur eux.
- Lecture croisée effectuée avec vision-v1-v2, bibliothèque M1-M23, jalons J1-J10 et règles R1-R22 avant rédaction. Discipline respectée : hypothèses de gameplay, jamais de paramètre inventé, interdits du brief jamais proposés.

### Erreurs et limites

- Wiki Positech et wiki Paradox partiellement bloqués : certains détails de Democracy 4 et Victoria 3 reposent sur Wikipedia seul, niveau [donnée observée] à confirmer si une règle en dépend un jour.
- Le corpus ne couvre pas les jeux de propagande ni les wargames de guerre civile, deuxième passe à programmer.
- Une double rédaction de l'étude a failli écraser le fichier : l'éditeur a refusé l'écriture trop longue, le fichier intact a été vérifié par lecture avant toute autre édition. Leçon : toujours lire avant d'écrire un doc potentiellement déjà écrit dans la session.

## 2026-09-15, /pilote-sim Phase 0 puis Phase 1

### Contexte courant

Phase 0 clôturée ce jour : dépôt git initialisé, .gitignore couvrant .env*, hook .githooks/pre-commit actif et testé (blocage .env par ignore, blocage motif sk_test vérifié), premier commit 021a13c propre, aucun secret détecté. Phase 1 ouverte dans la foulée : vérification des primaires vidéo engagée, dix références passées en revue par notices et résumés académiques.

### Vérifications du jour

- git log --oneline : 021a13c Phase 0 socle.
- git status --short : propre après commit.
- git config core.hooksPath : .githooks.
- Scan secrets sur docs et racines : aucun motif sk_live, sk_test, AKIA, PRIVATE KEY.
- Primaires : Tajfel 1971, Hasher 1977, Freedman Fraser 1966, Seligman Maier 1967, Centola 2018, Burger 2009, Stenner 2005, Mueller 1970, résultats NSDAP et Levada Crimée retrouvés. Corrections notées dans docs/base-documentaire.md.

### Erreurs et limites

- Année Burger citée 2006 dans la base, corrigée en 2009 avec données 2006.
- Chiffres Stenner 39, 2, 59 et Seligman 75 pour cent non retrouvés tels quels, jamais à coder.
- Suite du 2026-09-15 : cinq reliquats relus. Bandura huit mécanismes, Klemperer euphémismes, Rákosi salami avec mythe du plan parfait nuancé par Rieber, Pologne 65 ans et 40 pour cent via Venise, Aron Clausewitz avec diversion rare. Phase 1 première passe bouclée, fiches détaillées par mécanisme encore dues avant /ontologie.
- graphify-out/ toujours vide, graphify update à faire quand l'outil sera disponible.
