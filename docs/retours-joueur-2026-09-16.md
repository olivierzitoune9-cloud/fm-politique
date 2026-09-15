# Retours de jeu d'Aaron, recueil du 2026-09-16

> Recueil intégral des retours d'Aaron en fin de session, pour ne rien perdre. Chaque point est un défaut constaté ou un arbitrage de design. Consigne associée : au prochain `/pilote-sim`, exécuter d'une traite tous les jalons restants, sans s'arrêter à un jalon par session.

## Défauts constatés, causes vérifiées dans le code

### R1. « Semaine suivante » ne fait rien

Symptôme, ses mots : « quand je clique sur la semaine suivante il se passe rien ».

Cause vérifiée : `jouerSemaine` lève volontairement une exception quand une ressource manque ou quand la partie est terminée (`ui/sim/partie.ts` ligne 199, et `ui/sim/partie.test.ts` attend explicitement ces jetés sur argent insuffisant, temps insuffisant et partie finie). L'appel se fait dans `avancer()` (`ui/app/partie/page.tsx`, ligne 82) et aucune erreur n'est affichée nulle part. Le clic échoue donc en silence, ce qui donne l'impression que le jeu est cassé.

Correctif en deux temps : afficher la raison immédiatement, puis changer de modèle (voir R7, sanctionner plutôt que bloquer). Un joueur ne doit jamais croire que le jeu ne répond pas.

### R2. L'origine choisie ne se retrouve pas dans le statut

Symptôme, ses mots : « je crois avoir sélectionné prof mais je finis employé de bureau ».

Cause vérifiée : `creerCarriere` (`ui/sim/carriere.ts` ligne 124) fixe `statut: "employe"` quelle que soit l'origine, et `libelleStatut("employe")` renvoie « Employé de bureau » (ligne 57). L'origine n'influe aujourd'hui que sur des hooks mécaniques, jamais sur ce qui s'affiche. Le libellé du métier existe déjà (`LIBELLES_ORIGINE`, ligne 95) mais n'est montré nulle part.

Correctif : séparer deux notions confondues. Le statut devient un palier de carrière neutre et honnête (« Citoyen sans mandat », puis militant connu localement, responsable d'antenne, conseiller, élu), et le métier d'origine s'affiche comme métier, dans le bandeau d'identité. Un enseignant doit lire « Enseignant dans un collège ».

### R8. Le texte de mise en garde n'a rien à faire dans le jeu

Ses mots : « Simulation émergente, trajectoires possibles, jamais de prédiction du réel ni de recommandation. Certaines trajectoires d'accession au pouvoir, y compris autoritaires, sont simulées pour être comprises, jamais proposées comme des modèles. Ce genre de texte n'a rien à faire dans un jeu. »

Il vit dans `ui/sim/carriere.ts` (`AVERTISSEMENT_OUVERTURE`, ligne 88), remonte dans la vue de partie (`ui/sim/partie.ts` ligne 380) et s'affiche à deux endroits : l'écran de création (`ui/app/nouvelle-partie/page.tsx` ligne 71) et l'écran de partie (`ui/app/partie/page.tsx` ligne 123).

Correctif : le sortir des écrans de jeu, le déplacer en mentions discrètes (pied de page d'accueil ou page à propos) et le garder dans la documentation interne où il a sa place. Attention, `ui/sim/carriere.test.ts` lignes 59 à 62 vérifie son contenu : le test suit le déplacement, il ne disparaît pas. Le garde-fou déontologique reste entier, il change d'endroit et de ton.

## Contenu manquant

### R3. Expliquer les graines

Question posée : « c'est quoi les graines ? faut que tu expliques un peu plus. »

Une graine est le nombre qui fixe tous les tirages du hasard du monde. Même graine, même monde, mêmes événements, mêmes gens qui écrivent. Graine différente, monde différent. C'est ce qui rend une partie reproductible et une injustice explicable plutôt qu'arbitraire.

À faire : une phrase d'explication à l'écran de création, un exemple concret, et une entrée propre dans le dictionnaire des variables. Aujourd'hui le champ existe sans un mot d'explication, c'est une faute de conception, pas un détail.

### R4. Plus d'origines et plus de rôles de base

Son jugement : le roster actuel est « déjà un bon roster » mais trop court. Il veut des rôles de base variés et surtout que le métier change la façon d'accéder au pouvoir. Ses mots : « si t'es chercheur, ça peut être grave diff ta façon d'accéder au pouvoir ».

Piste à instruire : chercheur, ingénieur ou spécialiste de l'IA, enseignant, soignant, ouvrier, commerçant, fonctionnaire, étudiant, syndicaliste, rural, quartier populaire, diaspora, militaire ou ancien militaire. Chaque origine porterait un atout de départ distinct et un vecteur privilégié : légitimité savante pour le chercheur, réseau et rapport de force pour le syndicaliste, audience pour qui sait parler aux médias, confiance de proximité pour le commerçant, accès institutionnel pour le fonctionnaire.

### R5. Plus d'objectifs, et une projection de long terme

Sa demande : davantage d'objectifs, et pouvoir se projeter loin.

Piste : objectifs à paliers adossés aux échéances réelles, du local au national (conseil municipal, département, région, députation, parti, ministère, présidence), avec des objectifs intermédiaires choisis par le joueur et une fin évaluée sur la trajectoire entière plutôt que sur un seul seuil franchi. Les échéances de 2027, 2029 et 2032 sont déjà au calendrier et structurent naturellement cette projection.

### R6. La progression doit être par étapes, jamais sautée

Reproche central, ses mots : « les actions sont pas assez progressives, tu peux pas avoir des partis adverses alors que t'es encore un jeune prof. Regarde dans la vidéo, il y a une chronologie. Là c'est pas assez adapté au rang où je suis, c'est pas du tout réaliste. Faut être step by step. »

Ce que la source fournit et qu'on n'exploite pas encore : sa chronologie M1 à M23 est précisément un escalier d'accession. M1 les conditions de détresse, M2 la patience et la préparation silencieuse, M3 la menace normative, M4 nous contre eux, M5 la masse critique, M6 l'engagement progressif, M7 l'obéissance, M8 l'impuissance apprise, M9 la fenêtre d'Overton, M10 l'euphémisme, M11 le bouc émissaire, M12 la marque, M13 le sophisme, M14 la tactique du salami, M15 l'armée, M16 le choc et les pouvoirs d'exception, M17 le désengagement moral, M19 la soupape, M20 la terreur imprévisible, M21 l'aménagement de la colère, M22 le ralliement au drapeau, M23 le culte de la personnalité.

Règle à poser : chaque règle R1 à R22 reçoit un palier d'accès, et le joueur ne voit que les actions, les cartes et les gens de son palier. Au premier palier : tractage, porte-à-porte, réunion de salle des fêtes, préparation silencieuse, étiquetage modéré, marque, euphémisme. Les partis rivaux existent en arrière-plan mais ne s'affichent pas. Les médias nationaux, les institutions et les leviers d'exception n'apparaissent qu'aux paliers suivants, quand la notoriété et la légitimité les rendent crédibles.

Note de méthode : c'est la philosophie de Plague Inc, où la carte se révèle avec la progression, croisée avec la chronologie du document source. La progression par paliers devient une règle de conception centrale, pas un habillage.

### R7. Pas de limite de choix, mais des conséquences

Sa demande, ses mots : « il devrait pas y avoir de limites de choix en revanche, il faut sanctionner les mauvaises décisions. »

Conséquence de conception : ne plus bloquer une action par manque de ressource ou de rang. Laisser faire, puis punir par les mécanismes déjà modélisés : dette d'argent, risque d'enquête, réputation entamée, soutiens perdus, occasions manquées, retour de bâton des personnages trahis, marginalisation par absence de résultats. Le joueur doit pouvoir se tromper et le payer.

## Priorité proposée pour la prochaine session

1. R1 et R2, les deux défauts qui font croire que le jeu est cassé.
2. R6, la progression par paliers, parce qu'elle conditionne tout le reste et qu'elle répond au reproche le plus lourd.
3. R7, les choix libres et sanctionnés, qui change le modèle de ressources et se fait avec R6.
4. R8, sortir le texte de mise en garde des écrans.
5. R3, expliquer les graines, puis R4 et R5, élargir les origines et les objectifs avec la projection de long terme.
6. Les jalons déjà prévus : J3 la carte et la propagation, J4 l'information imparfaite, J5 les audits et la calibration élargie.

## Ce qui a été fait en fin de session du 2026-09-16

Capture seule, aucun changement de code. Raison : le terminal de la machine est bloqué par la politique d'exécution PowerShell, donc aucune modification ne pourrait être vérifiée par un build. Corriger à l'aveugle un jeu déjà jouable serait le meilleur moyen de le casser. Les corrections attendent la prochaine session, où le build pourra être relancé avec npm.cmd.