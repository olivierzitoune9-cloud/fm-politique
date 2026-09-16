# Recherche gameplay hors politique, 2026-09-16

Commande d'Aaron : chercher exclusivement le gameplay, ne pas se limiter aux jeux politiques, Football Manager n'est pas politique mais sa boucle est la nôtre. Diagnostic accepté : le jeu est maigre, le gameplay inintéressant, il faut apprendre. Le présent document ne remplace pas `docs/bibliotheque-mecanismes-video.md` ni l'étude politique du même jour : il les complète par des mécanismes transférables quel que soit le domaine du jeu source.

## 1. Corpus et méthode

Neuf jeux étudiés, même grille d'extraction : boucle de décision, information présentée au joueur, ce qui rend chaque décision intéressante, progression, sanction. Sources datées dans la section 6. Corpus :

| Jeu | Domaine | Qualité de capture |
|---|---|---|
| Football Manager 2024 | sport | bonne (page Steam) |
| Out of the Park Baseball | sport | bonne (Wikipédia, section gameplay) |
| Kudos | vie de personne | bonne (page Steam) |
| Eastside Hockey Manager | sport | maigre (Wikipédia, historique seul) |
| Motorsport Manager | sport | maigre (Wikipédia, historique seul, mauvaise page Steam) |
| Long Live the Queen | formation de souveraine | bonne (Wikipédia, section gameplay) |
| Alter Ego (1986) | vie entière | bonne (Wikipédia, section gameplay) |
| King of Dragon Pass | gestion de clan | bonne partielle (Wikipédia, section gameplay tronquée) |
| Political Process, Suzerain, Democracy 4, Victoria 3, CK3 | politique | étude du même jour, voir E1 à E14 |

## 2. Ce qui rend leurs semaines intéressantes (établi, sourcé)

**Long Live the Queen.** Semaine à deux étages : deux cours choisies (matin, après midi) plus une activité du weekend qui règle l'humeur. Quatre axes émotionnels dont la position module l'aptitude à apprendre certains sujets (volontaire aide le militaire et l'intrigue, gêne le protocolaire). Seuil de compétence qui débloque des tenues et des actions du weekend (danser ouvre les bals). Objectif brutal et lisible : survivre 40 semaines jusqu'au couronnement, avec de nombreuses morts possibles. L'intrigue politique avance chaque semaine, indépendamment des cours choisies.

**King of Dragon Pass.** Le joueur dirige un conseil de sept personnages nommés, chacun avec des opinions qui varient selon la décision ; le vote du conseil pondère le résultat. Dilemmes narrés à conséquences multiples, pondérés par les compétences, les ressources et la culture du clan, jamais par une chaîne scriptée. Calendrier saisonnier, ressources, événements récurrents re-mixés, victoires multiples possibles, aucun chemin imposé. Échecs partiels fréquents mais rarement mortels d'emblée : la sanction raconte.

**Alter Ego.** Vie entière en arbre de nœuds : sept phases de l'enfance à la vieillesse, chaque décision marque des statistiques (physique, confiance, intellectuel) qui conditionnent la réussite des nœuds futurs, y compris l'entrée à l'université ou la réussite sociale. Mort prématurée possible sur certains choix, mais pas de défaite unique : rejouer, c'est prendre d'autres chemins. Les conséquences d'un choix remontent des dizaines de nœuds plus tard.

**Football Manager 2024 et OOTP.** Boucle hebdo dense : le joueur enchaîne de petites décisions de formation, de recrutement, de gestion d'effectif et d'avant-match ; l'information incertaine vient des rapports de recruteurs et de l'attribut d'évaluation qui brouille les chiffres ; progression par paliers de compétition ; le monde tourne sans le joueur (autres clubs, transferts).

**Kudos.** Vie de personne au calendrier : relations, loisir, santé, carrière, avec tension de temps chaque semaine et événements qui rappellent que le monde ne s'arrête pas.

**EHM et Motorsport Manager.** Capture maigre : ce qui ressort de source est la progression par divisions (MM), les rapports de recruteurs incertains et la base de données de milliers d'acteurs (EHM), le monde en ligne contre d'autres dirigeants (EHM freeware). Ne pas en tirer plus que la source ne dit pas.

## 3. Mécanismes récurrents des jeux qui tiennent la personne (établi par convergence)

M1. La semaine porte plusieurs décisions de natures différentes, pas une seule (LLTQ cours matin/après/weekend ; FM formation puis match ; OOTP gestion puis série).
M2. Un état intérieur du personnage (humeur, stress, moral) module l'efficacité des actions et est réglé par des activités dédiées (LLTQ).
M3. Les compétences se construisent par le choix répété d'activités, et débloquent ensuite des options (LLTQ, Alter Ego).
M4. Les dilemmes sont pondérés par les compétences et les personnalités de personnages nommés, pas par une jauge unique (KoDP).
M5. La sanction raconte : échecs partiels fréquents, morts rares mais réelles, aucune fin unique (KoDP, LLTQ, Alter Ego).
M6. L'information sur les autres acteurs est incertaine et achetable (rapports de recruteurs, EHM, FM).
M7. Le monde tourne sans le joueur et crée des événements qui le bousculent (tous).
M8. Les conséquences remontent loin dans le temps et conditionnent des options futures (Alter Ego).

## 4. Ce que notre jeu n'a pas (diagnostic)

Confronté au corpus, le jeu actuel tient la boucle minimale (une action, une interaction, un média, un sondage par semaine) mais : une seule décision de terrain par semaine (pas de M1) ; aucune compétence du personnage qui progresse (pas de M3) ; aucune humeur ni énergie qui module (pas de M2) ; les interactions ne pondèrent pas par personnalité de façon lisible (M4 partiel) ; les dilemmes sont des courriers, pas des carrefours à choix multiples aux conséquences pondérées (M4) ; la sanction raconte peu en dehors des fins (M5 partiel) ; les conséquences ne remontent presque jamais (M8 faible).

## 5. Hypothèses de gameplay F1 à F10 (hypothèse de modélisation, à arbitrer)

Chacune transpose un mécanisme sourcé à notre France 2026, sans trahir les dix principes : aucune jauge unique, aucune chaîne scriptée, le joueur n'est pas le centre.

F1. Semaine à deux étages (M1, LLTQ). Une action de terrain plus une activité de fond (formation, soin de réseau, repos) au lieu d'une seule. Coût : l'UI gagne une seconde case. Gain direct contre la maigreur.
F2. État intérieur (M2, LLTQ). Deux axes du personnage, énergie et moral, modulent l'efficacité des actions ; le repos et les amitiés les règlent. Cohérent avec R7 : on ne bloque jamais, on sanctionne par efficacité réduite.
F3. Compétences du personnage (M3, LLTQ, Alter Ego). Éloquence, organisation, réseaux, analyse, discipline : se construisent par les activités répétées, débloquent des actions aux paliers supérieurs et pondèrent les interactions. Trois à cinq compétences, pas plus.
F4. Dilemmes à carrefour (M4, KoDP). Les courriers deviennent des carrefours à deux ou trois réponses, résultat pondéré par compétences, personnalités et contexte, jamais binaire réussite ou échec.
F5. Personnalités qui pèsent (M4, KoDP). Chaque interaction pondérée par les traits du personnage visé, rendus lisibles au fil des parties : prudent, ambitieux, rancunier, loyautés. La mémoire existe déjà, elle doit peser dans les résultats.
F6. Sanction narrative (M5). Tout échec partiel laisse une trace dans le journal et un effet durable nommé (une porte fermée, une dette de confiance) au lieu d'un simple delta invisible.
F7. Rapport d'évaluation incertain sur les personnes (M6, EHM et FM). Les fiches personnages n'affichent pas la relation exacte mais une estimation par connaissance mutuelle, affinée par les interactions ; à croiser avec l'hypothèse E1 de l'étude politique (fourchettes).
F8. Le monde bouscule (M7, déjà partiel). Les événements monde créent des dilemmes inattendus pour le joueur, pas seulement des courriers descriptifs.
F9. Remontée longue (M8, Alter Ego). Les choix des paliers 1 et 2 conditionnent des options des paliers 4 et 5 : l'étiquetage modéré de la première année peut fermer ou ouvrir une investiture en 2027. À écrire en règles explicites, jamais en script.
F10. Rythme du calendrier (M1, KoDP). Les échéances réelles de la France 2026, rentrée, vœux, campagne, élections, donnent des saisons perceptibles au fil des semaines.

**Groupement proposé en jalons.** J15 richesse de semaine (F1, F2, F3) : la réponse la plus directe au diagnostic de maigreur. J16 dilemmes et personnalités (F4, F5, F6). J17 information et remontée (F7, F8, F9, F10). Ordre recommandé : J15 d'abord, car les autres s'y empilent.

## 6. Sources datées et limites

- Football Manager 2024, page Steam, consultée 2026-09-16.
- Out of the Park Baseball, Wikipédia anglais, section gameplay, version consultée 2026-09-16.
- Kudos, page Steam, consultée 2026-09-16.
- Long Live the Queen, Wikipédia anglais, section gameplay détaillée, version 2026-08-28.
- Alter Ego (1986), Wikipédia anglais, section gameplay, version 2026-09-12.
- King of Dragon Pass, Wikipédia anglais, section gameplay partiellement lue, version 2026-09-13.
- Eastside Hockey Manager, Wikipédia anglais, version 2024-10-15 : historique seul, mécanismes non capturés, conclusion volontairement mince.
- Motorsport Manager, Wikipédia anglais version 2026-09-05 (historique seul) et page Steam erronée qui rendait un autre jeu : mécanismes fins non capturés.
- Limites : aucune source primaire de développeurs (devlogs Sports Interactive, Playsport) consultée cette fois ; les mécanismes internes d'attribution de FM relèvent du plausible communautaire, pas de l'établi, et ne sont donc pas utilisés ici.

