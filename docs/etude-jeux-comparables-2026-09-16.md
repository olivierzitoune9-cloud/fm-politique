# Étude des jeux comparables, 2026-09-16

> Commandée par Aaron le 2026-09-16 : « grosses recherches sur les jeux similaires, les étudier en détail pour enrichir énormément le jeu ». Rédigée par le pôle chercheur après une session de recherche web. Chaque fiche distingue trois niveaux : [donnée observée] ce que la source officielle du jeu décrit, [lecture critique] notre analyse du pourquoi ça marche ou pas, [hypothèse de modélisation] la transposition possible chez nous, jamais actée sans arbitrage. Sources consultées le 2026-09-16, URLs citées.

## 1. Méthode et limites

Corpus : 12 jeux étudiés par leurs sources primaires (pages Steam officielles, wikis développeur, pages de concepts). Deux jeux visés restent non étudiés malgré quatre contournements : **Power & Revolution** (Eversim, eversim.com injoignable, absent de Steam, pages Wikipédia 404) et **President Infinity** (270soft, site injoignable, MobyGames 403). À reprendre en prochaine passe de recherche, peut-être par fiches presse ou vidéos. Le corpus couvre déjà : simulateurs de gouvernement, courses électorales, carrières de bas en haut, grandes stratégies à acteurs fins, dilemmes narratifs, propagation.

Lecture croisée avec nos fondations : vision v1/v2 (paliers, personnages, propagation Plague Inc, rituel FM), bibliothèque M1 à M23, règles R1 à R22, jalons J1 à J10 livrés. Chaque proposition d'enrichissement cite ce qu'elle nourrit chez nous. Interdit respecté : ne jamais proposer de jauge unique, de chaîne scriptée, de joueur centre du monde.

## 2. Fiches par jeu

### 2.1 Democracy 3 / Democracy 4 (Positech, 2013 / 2020)

Sources : store.steampowered.com Democracy 4, wiki Positech, consultés le 2026-09-16.

Mécanismes observés. [donnée observée] Population découpée en dizaines de segments à cheval (un électeur est socialiste ET écologiste ET patrimonial), chaque politique agit sur plusieurs segments avec effet retardé sur plusieurs tours, boucles économiques interconnectées (impôt → inégalité → santé → productivité → PIB), opposition, médias et terrorisme comme réactions vivantes, D4 ajoute ministres à loyauté et dilemmes hebdo. [lecture critique] C'est le meilleur modèle commercial de causalité retardée à effets multiples : chaque politique a des retards par effet, si bien qu'une bonne décision peut te tuer deux ans plus tard. Faiblesse : tout est visible, zéro information imparfaite, et le joueur est le gouvernement. [hypothèse de modélisation] Nos groupes gagnent le retard et l'effet multiple par politique ; nos groupes ont déjà le croisement (un retraité peut être territorialisé et consommateur).

### 2.2 The Political Machine 2024 (Stardock, 2024, appid 2512090)

Source : page Steam consultée le 2026-09-16.

Mécanismes observés. [donnée observée] Course électorale rapide par État, chaque État a ses groupes d'électeurs et ses enjeux dominants, les actions de campagne dépensent du temps entre États, les traits du candidat et la cohérence de ses positions jouent, les enjeux saillants varient par territoire et dans le temps. [lecture critique] Léger mais excellent sur un point : l'adoption dépend du **matching** entre ton discours et l'enjeu dominant de chaque territoire. Un même discours gagne un État et en perd un autre. [hypothèse de modélisation] Notre carte à douze territoires reçoit un enjeu dominant par territoire (chômage local observé, fermeture d'usine, question religieuse), et l'adoption de la proposition y dépend du taux de matching marque-enjeu. Nourrit J3, M5, M6.

### 2.3 The Political Process (Verlumino, 2019, appid 1184770)

Source : page Steam consultée le 2026-09-16. Le jeu le plus proche de notre point de départ.

Mécanismes observés. [donnée observée] Carrière de bas en haut : school board, city council, législature d'État, Congrès, présidence. Les campagnes de bas niveau sont pauvres en ressources, celles de haut niveau riches et complexes, exactement notre palier. Législation écrite par le joueur, budgets à équilibrer, collecte de fonds auprès de donateurs, élections locales remportées quartier par quartier. Pas de condition de victoire, on joue la vie d'un politicien et on retire quand on veut. Assumé répétitif sur le porte-à-porte et la collecte. [lecture critique] La progression de carrière par mandats réels et élections datées est exactement notre architecture de paliers, validée par un succès commercial 95 pour cent. Leurs trois points forts à importer : la hiérarchie de mandats avec élections réelles à chaque étage, le financement avec donneurs nommés, l'absence de fin scripté. Leur faiblesse : il faut courir sous drapeau D ou R, jamais indépendant ; notre France multipartiste fait mieux. [hypothèse de modélisation] Nos municipales 2032 deviennent de vraies campagnes courables par quartier ; donateurs nommés avec mémoire de dette (nourrit nos personnages financiers et R1).

### 2.4 Suzerain (Long Due Games, 2020)

Source : page Steam et wiki consultés le 2026-09-16.

Mécanismes observés. [donnée observée] Narratif de chef d'État : réforme constitutionnelle à négocier article par article avec les blocs du parlement, chaque personnalité a ses intérêts, ses leviers et sa mémoire, les promesses faites en coulisses resurgissent aux échéances, l'économie est condensée en indicateurs qui réagissent avec retard. [lecture critique] Le meilleur modèle de la promesse comme actif incertain : promettre achète une voix maintenant et crée une dette qui se paie plus tard, exactement notre mémoire E6 incarnée. Faiblesse : entièrement scripté, une partie réelle et des branches, ce que notre formule centrale interdit. [hypothèse de modélisation] Nos promesses acquièrent une échéance et une échéance manquée coûte la relation ; négociation en deux temps pour les propositions (engagement de principe puis vote). Nourrit R1, R16.

### 2.5 Victoria 3 (Paradox, 2022)

Sources : page Wikipedia et wiki Paradox consultés le 2026-09-16.

Mécanismes observés. [donnée observée] Les groupes d'intérêt (industriels, syndicats, armée, clergé, ruralistes) sont les vrais acteurs : ils soutiennent ou bloquent chaque loi selon leur utilité propre, la légitimité du gouvernement dépend de la coalition qui le porte, les mécontents deviennent des radicaux qui nourrissent les mouvements, l'économie est modélisée au prix et au bien, l'IA de chaque groupe arbitre selon ses objectifs. [lecture critique] C'est le modèle le plus abouti de coalition instable : passer une loi nécessite d'acheter des groupes qui la haïssent, et chaque achat déplaît à un autre. Les groupes ont des objectifs indépendants du joueur, principe 4. [hypothèse de modélisation] Nos partis rivaux gagnent des utilités indépendantes journalisées (nous avons l'arbitrage IA, il faut le multiplier aux partis et médias : chaque rival poursuit son intérêt, pas notre chute générique). Nourrit M3, R11, R16, V2.

### 2.6 Crusader Kings 3 (Paradox, 2020)

Source : wiki Paradox consultée le 2026-09-16.

Mécanismes observés. [donnée observée] Personnages à traits et opinions, mémoire des torts, factions à seuil qui deviennent menaçantes quand leur force dépasse un pourcentage, secrets récoltables et utilisables pour le chantage, et surtout la perception : les caractéristiques d'un autre personnage s'affichent en fourchette approximative tant que tu ne l'as pas étudié. [lecture critique] La perception en fourchette est la meilleure info imparfaite incarnée jamais livrée : tu ne vois pas la valeur, tu vois une plage, et étudier coûte du temps. Nos fiches personnages montrent tout ; c'est notre plus grand écart à la doctrine J4. Les factions à seuil donnent aux ennemis un comportement lisible et organique. [hypothèse de modélisation] Relation et traits des personnages affichés en plages jusqu'à interaction suffisante ; partis rivaux coalisés en faction quand leur force cumulée passe un seuil contre toi. Nourrit J4, R2, R12.

### 2.7 Tropico 6 (Limbic/Kalypso, 2019)

Source : page Steam consultée le 2026-09-16.

Mécanismes observés. [donnée observée] Trajectoire autoritaire optionnelle : factions à satisfaire, élections que l'on peut gagner honnêtement, truquer ou annuler, décrets d'urgence, répression progressive. [lecture critique] Utile surtout comme garde-fou inverse : la satire assume des jauges simples et un bouc émissaire à un clic, ce que nos principes 1 et 3 interdisent. Ce qu'on retient : la sanction de l'autoritarisme est la délégitimation lente et la fragilité de la succession, pas un moral gendarme. Nos M21 soupape et M23 culte portent déjà ce dessin. [Hypothèse de modélisation] Rien à importer tel quel ; leçon d'équilibre : chaque levier lourd (M20 à M23) doit avoir son coût structurel différé, jamais un simple échange soutiens contre réputation.

### 2.8 NationStates (NationStates.net, 2002, toujours en ligne)

Source : site officiel consulté le 2026-09-16.

Mécanismes observés. [donnée observée] Le pays entier émerge d'une suite de dilemmes à deux mains : chaque dilemme se tranche sans chiffrage affiché, les effets sont décrits en texte et se cumulent dans des catégories d'État calculées après coup. [lecture critique] Minimal mais génial : le joueur ne voit jamais la formule, il voit le récit de ce qu'il a causé. C'est exactement notre doctrine « le narratif raconte, ne décide jamais » à l'envers réussi : ici le moteur décide et le narratif révèle. [hypothèse de modélisation] Nos courriels de dilemme (un militant exige, un média attaque, une trahison propose) à deux réponses, effet révélé en journal une semaine plus tard, jamais en pourcentage avant. Nourrit J4, le courrier, M1 à M23.

### 2.9 Superpower 2 (GolemLabs, 2004)

Source : page Steam consultée le 2026-09-16.

Mécanismes observés. [donnée observée] Simulation géopolitique totale : ressources, traités, démographie, politique intérieure et extérieure de tous les États. [lecture critique] Grandiose en profondeur, illisible en surface : le joueur navigue dans des tableaux interminables sans jamais percevoir ce qui compte. Leçon négative pour nous : profondeur sans hiérarchie d'information égale brume. Nos paliers et notre carte sont la bonne réponse, ne jamais s'en écarter en ajoutant de la profondeur.

### 2.10 eRepublik (eRepublik Labs, 2007, toujours en ligne)

Source : site et wiki consultés le 2026-09-16.

Mécanismes observés. [donnée observée] Multijoueur persistant : chaque joueur-citoyen peut créer ou rejoindre un parti, se présenter aux élections internes puis nationales, écrire dans la presse in-game, monter d'employé à député à président par des élections réelles entre joueurs. [lecture critique] La preuve que la carrière de bas en haut par élections datées porte une communauté entière pendant quinze ans. Le multijoueur est hors de notre périmètre prototype, mais leurs élections de parti internes (investiture entre candidats) sont un chaînon que nous n'avons pas : avant de gagner un siège, se faire investir par son propre camp. [hypothèse de modélisation] Une ambition ou échéance intermédiaire : l'investiture, où les notables locaux du palier 2 arbitrent entre toi et un concurrent fictif. Nourrit J9, M3, R16.

### 2.11 Rebel Inc (Ndemic Creations, 2018)

Source : page Steam et wiki Ndemic consultés le 2026-09-16.

Mécanismes observés. [donnée observée] Stabilisation de zones : chaque initiative a un coût croissant (rendements décroissants explicites), une crédibilité de gouverneur qui fond si on promet sans tenir, une inflation qui rend tout plus cher quand on dépense vite, une corruption qui se nourrit de l'expansion sans institutions, et l'insurrection adverse qui s'adapte et se déplace où la stabilisation est faible. [lecture critique] C'est le meilleur modèle commercial de ce que veut notre R7 sanctionnée : tout est permis, mais l'expansion sans base institutionnelle crée de la corruption qui ronge ensuite. L'adversaire qui s'adapte et frappe là où c'est faible est exactement notre barre de réponse adverse (R2, R12) mieux implémentée. [hypothèse de modélisation] Coût croissant par palier sur chaque ressource (le dixième tract coûte plus que le premier, en temps comme en argent), dette qui se convertit en corruption (risque d'enquête) si l'organisation ne suit pas l'expansion, réponse adverse qui frappe le territoire où l'adoption est la plus haute. Nourrit R7, J3, J8.

### 2.12 Espiocracy (Ex Vivo Studios / Hooded Horse, annoncé 2027)

Source : page Steam officielle consultée le 2026-09-16. Non sorti : fiches d'annonce seulement, niveau à revalider à la sortie.

Mécanismes observés. [donnée observée] Simulation de guerre froide par agences de renseignement : 34 types d'opérations, propagande pour propager des idéologies, désinformation pour discréditer un politicien, agents autonomes qui agissent selon leurs traits, histoires et biais, sous-groupes internes qui peuvent politiciser l'agence, agents retraités qui deviennent des acteurs de la société, casus belli falsifiés. [lecture critique] Même non sorti, deux idées valent de l'or pour nous : les sous-groupes déviants dans ton propre mouvement (ton mouvement te développe une aile radicale ou une aile vendue que tu ne contrôles plus), et les anciens partants qui continuent d'agir dans le monde. Nos personnages ne se dévouent pas tous à ta cause en silence. [hypothèse de modélisation] Personnages recrutés qui peuvent dévier (scission d'aile au-delà d'une taille d'organisation, personnalité contre marque), personnages partis qui continuent d'arbitrer contre ou pour toi. Nourrit principes 3 et 4, M4, R2.

## 3. Synthèse transversale

### 3.1 Ce que personne ne fait, et que nous faisons (à défendre)

Aucun des douze ne cumule : un joueur insignifiant qui émerge (tous te donnent le pouvoir ou la course dès le départ), l'information imparfaite incarnée (CK3 seul l'a, en fourchettes, jamais dans un jeu politique), une idée qui se propage comme un pathogène avec réponse du système immunitaire (Plague Inc le fait sur la maladie, personne sur le politique), des paliers de perception où le monde visible dépend du rang, et des trajectoires ouvertes de la démocratie à l'autoritarisme sans jauge morale. C'est notre singularité, il ne faut l'effacer pour rien.

### 3.2 Les pièges observés chez les autres (interdits chez nous)

Jauge unique de popularité avec tout visible (Democracy, Tropico) : viole le principe 3. Chaînes scriptées avec branches (Suzerain) : viole le principe 1. Ennemis génériques qui n'existent que pour te contrer (Political Machine sur les adversaires) : viole le principe 4. Profondeur en tableaux sans hiérarchie (Superpower 2) : leçon négative sur la lisibilité. Répétition du bas de carrière sans variation (The Political Process l'assume) : à éviter, nos paliers varient le monde visible.

### 3.3 Les mécanismes à importer, cotés

Chacun est [hypothèse de modélisation] tant qu'Aaron ne l'arbitre pas, à l'exception notée. E1 (Perception en fourchettes, CK3) : relation et traits des personnages affichés en plages jusqu'à interactions suffisantes, étudier coûte du temps. Nourrit J4, R12. E2 (Faction adverse à seuil, CK3) : quand la force cumulée des rivaux dépasse un seuil lié à ta notoriété, ils coalisent et agissent ensemble, lisible en journal. Nourrit R2, R11. E3 (Adversaire qui frappe le point faible, Rebel Inc) : la réponse adverse cible le territoire où ton adoption est la plus haute, pas le joueur génériquement. Nourrit J3, R2. E4 (Coûts croissants, Rebel Inc) : rendements décroissants explicites sur chaque ressource, le dixième hebdo coûte plus que le premier. Nourrit R7. E5 (Corruption d'expansion, Rebel Inc) : croissance de soutiens sans croissance d'organisation convertit la dette en risque d'enquête. Nourrit R7, J8. E6 (Enjeu dominant par territoire, Political Machine) : chaque territoire porte son enjeu, l'adoption dépend du matching marque-enjeu. Nourrit J3, M5, M6. E7 (Financement à mémoire, The Political Process) : donateurs nommés qui se souviennent, dons contre promesses, dette tracée. Nourrit R1, personnages financiers. E8 (Investiture, eRepublik) : échéance intermédiaire où ton propre camp arbitre entre toi et un rival fictif. Nourrit J9, M3. E9 (Dilemmes de courrier, NationStates) : courriels à deux réponses, effet révélé en journal plus tard, jamais chiffré avant. Nourrit J4, courrier. E10 (Promesse à échéance, Suzerain) : toute promesse reçoit une échéance, manquer coûte la relation et la réputation. Nourrit R1, E6 mémoire. E11 (Utilités indépendantes des rivaux, Victoria 3) : chaque parti et média poursuit son intérêt propre journalisé, pas une chute générique du joueur. Nourrit principe 4, V2. E12 (Sous-groupes déviants, Espiocracy) : au-delà d'une taille, ton organisation développe des ailes qui arbitrent seules, scission possible. Nourrit principes 3 et 4, M4. E13 (Partants vivants, Espiocracy) : personnages partis continuent d'arbitrer dans le monde, anciens associés deviennent rivaux possibles. Nourrit principe 4. E14 (Retard et effets multiples, Democracy 3) : chaque action agit avec retard et sur plusieurs groupes, une bonne décision peut coûter plus tard. Nourrit l'économie, M1.

### 3.4 Les manques du corpus (ce que nous cherchons encore)

Personne ne modélise la désinformation adverse subie par le joueur (Espiocracy le promet côté joueur seulement), personne ne fait l'élection où le corps électoral est un continuum de groupes à bascule, personne ne traite la France 2026 réelle avec ses données observées. Ces trous restent notre mine, la recherche scientifique (M1 à M23) est déjà notre unique avantage.

## 4. Plan d'enrichissement proposé, pour arbitrage

Quatre vagues proposées, chacune en jalon distinct après J5. Aaron arbitre l'ordre, aucune ne démarre sans son oui.

### Proposition J11, information incarnée (E1, E6, E9, E10)

Fiches personnages en fourchettes jusqu'à étude (une action « étudier » coûte du temps), enjeu dominant par territoire visible sur la carte, courriels de dilemme à deux réponses à effet révélé différé, promesses avec échéance datée qui tombent dans le journal quand elles manquent. Gain : l'info imparfaite quitte les sondages et devient le tissu du jeu. Coût : medium, trois modules et un écran.

### Proposition J12, le monde te répond (E2, E3, E11, E12)

Faction adverse coalisée à seuil, frappe sur ton territoire le plus fort, utilités indépendantes des partis et médias journalisées, ailes déviantes au-delà d'une taille d'organisation. Gain : le monde cesse d'être un décor, principes 4 et 5 pleins. Coût : medium à gros, il touche l'arbitrage IA existant.

### Proposition J13, profondeur de carrière (E4, E5, E7, E8)

Coûts croissants par palier, corruption d'expansion, donateurs nommés à mémoire, investiture comme échéance intermédiaire avant les grandes élections. Gain : le bas de carrière devient stratégiquement dense, la dette devient un système pas une punition. Coût : medium.

### Proposition J14, causalité profonde (E13, E14 et retour sur M1)

Retards et effets multiples sur les actions économiques, partants vivants, enrichissement de la détresse par groupe avec mémoire. Gain : les boucles émergentes des principes 1 et 2. Coût : gros, à faire après les autres car il affine ce qui existe.

### Ce que je recommande

J11 d'abord : c'est l'écart le plus criant entre notre doctrine (info imparfaite partout) et notre état actuel (tout est visible), et il prépare J12 en donnant au joueur les moyens de comprendre ce que le monde lui fait. Deuxième passe de recherche à programmer : Power & Revolution et President Infinity restent non étudiés, plus les jeux de propagande (traités non retrouvés dans le corpus).



