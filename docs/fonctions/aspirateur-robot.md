<!-- source: package:packages/integrations/roborock.yaml -->

# Aspirateur robot

## But

Permettre de lancer le **nettoyage du sol par pièce**, dans une ou plusieurs pièces à la fois, et suivre l'**entretien** des aspirateurs robots de la maison.

## Périmètre

La maison compte plusieurs aspirateurs robots. Le robot principal (modèle **Roborock Saros 20**) couvre le rez-de-chaussée ; un second robot est dédié au **bureau**.

Chaque robot connaît les pièces de son plan. Le robot principal sait nettoyer :

- la **cuisine**,
- la **salle à manger**,
- le **salon**,
- l'**entrée**,
- la **buanderie**,
- la **salle de douche**,
- la **chambre des parents**.

Le pilotage complet (démarrage, pause, retour à la base, réglages) reste assuré par l'application du fabricant et l'intégration native ; cette fonction décrit ce que la maison ajoute par-dessus : le **lancement ciblé par pièce** et la **sélection multiple**.

## Règles de fonctionnement

### Sélectionner des pièces puis lancer

<!-- source: script:vacuum_clean_selection -->

Sur la page d'une pièce équipée, à côté de la carte du robot, une **rangée de pièces** est proposée. On coche les pièces voulues, puis on appuie sur le **bouton de lancement** : le robot nettoie l'ensemble des pièces cochées, dans un ordre qu'il choisit lui-même. Les cases se **remettent à zéro** une fois le nettoyage lancé.

Un **appui long** sur le bouton de lancement renvoie le robot à sa base.

La sélection est propre à chaque robot : un robot ne prend en compte que les pièces qu'il sait nettoyer.

### Vue d'ensemble et entretien

La page dédiée aux aspirateurs présente **tous** les robots, y compris ceux hors ligne (utile pour repérer un robot indisponible). Chaque robot en ligne est décomposé en sections séparées, disposées côte à côte :

- **Pilotage** : la carte du robot et ses commandes (marche/arrêt, pause, localiser, retour à la base…).
- **Carte** : le plan du logement.
- **Dock** : réservoir d'eau sale à vider, réservoir d'eau propre à remplir, manque d'eau, niveau de liquide de nettoyage, séchage de la serpillière.
- **Consommables** : durée de vie restante de la brosse principale, de la brosse latérale, du filtre, des capteurs, de la crépine et de la brosse de nettoyage du dock.

### Commandes vocales

<!-- source: intent:HassVacuumStart, intent:HassVacuumReturnToBase, intent:HassVacuumCleanArea -->

L'aspirateur répond à la voix (assistant local, sans IA générative) :

- **Démarrer** : « Démarre l'aspirateur du rez-de-chaussée », « Démarre l'aspirateur de l'étage », « Lance le Saros 20 Set ».
- **Retour à la base** : « Renvoie l'aspirateur à sa base », « Range l'aspirateur ».
- **Nettoyer une pièce** : « Aspire la cuisine », « Nettoie le salon », « Fais le ménage ici » (la pièce où l'on se trouve).

Le robot visé est déterminé par la **pièce** ou l'**étage** nommés, ou par l'**endroit d'où l'on parle** (le robot rattaché à cette pièce ou cet étage). Le nettoyage vocal ne vise qu'**une seule pièce** à la fois.

## Cas particuliers

- **Passage automatique à midi** : en mode absence, la maison lance d'elle-même un nettoyage. Voir la [routine de départ](../routines/depart.md).
- **Bouton du salon** : le bouton physique du salon lance le nettoyage de la salle à manger et de la cuisine, ou renvoie le robot à sa base s'il est déjà en train de nettoyer. Voir la page [salon](../pieces/salon.md).

## Utilisée par

- la routine de [départ](../routines/depart.md) — déclenche le passage automatique de midi en mode absence,
- la pièce [salon](../pieces/salon.md) — bouton physique et vue synthétique de lancement par pièce,
- les [commandes vocales](commandes-vocales.md) — démarrage, retour à la base et nettoyage d'une pièce à la voix.
