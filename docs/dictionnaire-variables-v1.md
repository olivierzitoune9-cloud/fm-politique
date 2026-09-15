# Dictionnaire des variables v1 (justification, échelle, défaut, ignorance)

> Toute règle ne peut lire que ces variables. Échelle interne 0..1 sauf mention. null = inconnu. Affichage x100 arrondi.

## Population

| Variable | Entité | Échelle | Défaut | Niveau | Justification |
|---|---|---|---|---|---|
| taillePart | GroupePopulation | 0..1 | null | [hypothèse] | besoin de pondération, Phase 6 seulement |
| satisfactionEco | GroupePopulation | 0..1 | 0.5 | [plausible] | M1 détresse et demande de sauveur |
| perteControle | GroupePopulation | 0..1 | 0.5 | [plausible] | M1 sentiment de perte de contrôle |
| menacePercue | GroupePopulation | 0..1 | 0.5 | [plausible] | M3 Stenner menace normative |
| predispoAutoritaire | GroupePopulation | 0..1 | 0.5 | [plausible] | M3 sans tripartition chiffrée |
| identiteActive | GroupePopulation | 0..1 | 0.2 | [établi] | M4 Tajfel 1971 différence maximale |
| normeAdoptee | GroupePopulation | string/null | null | [plausible] | M12 Centola 2018 seuil non universel |
| mefianceInfo | GroupePopulation | 0..1 | 0.5 | [hypothèse] | atténuateur M11, à tester |

## Acteur

| Variable | Échelle | Défaut | Niveau | Justification |
|---|---|---|---|---|
| ambition | 0..1 | 0.5 | [hypothèse] | arbitrage AI, architecture couche AI |
| ideologie.gaucheDroite, ouvertFerme | -1..1 | 0,0 | [hypothèse] | positionnement sans bord fixe M3 |
| experience, competence, persuasion, organisation | 0..1 | 0.3 | [hypothèse] | coûts M2 préparation silencieuse |
| popularite | 0..1 | 0.05 | [plausible] | M22 rally avec décroissance |
| credibilite | 0..1 | 0.5 | [plausible] | M7 M10 caution et contre feu |
| reputation | 0..1 | 0.5 | [hypothèse] | coûts M5 M7 |
| legitimite | 0..1 | 0.3 | [plausible] | M13 voie légale contre force |
| reseau | 0..1 | 0.1 | [hypothèse] | M2 marque et réseau avant fenêtre |
| argent, information, audience, militants, accesInstitutionnel, influenceMediatique, soutienPopulaire | 0..1 | 0.1 sauf temps 0.5 | [hypothèse] sauf information [plausible] | SPEC section 3, pas de somme en pouvoir |
| marque.simplicite, reproductibilite, respectabilite, lectureCachee | 0..1 | 0.2 | [plausible] | M6 dog whistle et déni plausible |
| lexique | liste | vide | [plausible] | M8 Klemperer, Bandura euphémisme |
| croyances.{valeur, confiance, source} | 0..1, 0..1, string | vide | [plausible] | SPEC section 3 info imparfaite |
| memoire.{type, gravite} | enum, 0..1 | vide | [hypothèse] | SPEC mémoire trahisons |

## Media

| Variable | Échelle | Défaut | Niveau | Justification |
|---|---|---|---|---|
| audienceTaille | 0..1 | 0.1 | [hypothèse] | besoin de portée, Phase 6 |
| credibilite | 0..1 | 0.5 | [plausible] | M10 caution savante et débunkage |
| ligneEditoriale | -1..1 | 0,0 | [hypothèse] | cadrage M7 |
| polarisation | 0..1 | 0.3 | [plausible] | bulles et vitesse, M11 |
| vitesse | 0..1 | 0.5 | [hypothèse] | multi échelles architecture |
| capaciteEnquete | 0..1 | 0.3 | [plausible] | M16 enquête sur origine de crise |
| dependances.intensite | 0..1 | vide | [plausible] | M14 pressions et modèle éco |
| posture | enum | neutre | [plausible] | M7 fusibles et relais à déni |

## Institution

| Variable | Échelle | Défaut | Niveau | Justification |
|---|---|---|---|---|
| legitimite, ressources, autonomie, cohesion | 0..1 | 0.5 | [plausible] sauf ressources [hypothèse] | M14 Rákosi, Pologne, Hongrie |
| etat | enum 10 états | renforcee | [plausible] | M14 tranches fines |
| reglesCarriere | nombres/null | null | [donnée observée en Phase 6] | Pologne 65 ans, jamais en dur ici |

## Relation et Proposition

| Variable | Échelle | Défaut | Niveau | Justification |
|---|---|---|---|---|
| relation.intensite | -1..1 | 0 | [hypothèse] | coalitions M5 M21 |
| relation.visibilite | 0..1 | 0.5 | [hypothèse] | secret contre public M15 |
| relation.memoire.gravite | 0..1 | vide | [hypothèse] | SPEC mémoire du monde |
| proposition.dicibilite | 0..1 par groupe | 0.3 | [plausible] | M7 Overton case par case |
| proposition.statutPreuve | enum | conteste | [hypothèse] | M9 sophismes, M10 caution |
| proposition.coutReputation | 0..1 | 0.3 | [hypothèse] | contre feu M7 |

## Ignorance assumée

- Tout champ null est affiché inconnu dans l'UI, jamais zéro.
- Le moteur connaît l'état exact, le joueur ne voit que croyances, sondages et médias (SPEC section 3).
- Normalisation : données réelles vers 0..1 documentées en Phase 6 avec chaîne traçable, jamais ici.
