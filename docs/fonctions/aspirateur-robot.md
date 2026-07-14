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

### Lancer une pièce

Sur la page d'une pièce équipée, un bouton **« Nettoyer \<la pièce\> »** envoie le robot nettoyer immédiatement cette seule pièce.

### Sélectionner plusieurs pièces puis lancer

<!-- source: script:vacuum_clean_selection -->

Chaque pièce nettoyable est proposée comme **case à cocher**. On coche les pièces voulues, puis on appuie sur **« Lancer la sélection »** : le robot nettoie l'ensemble des pièces cochées, dans un ordre qu'il choisit lui-même. Les cases se **remettent à zéro** une fois le nettoyage lancé.

La sélection est propre à chaque robot : un robot ne prend en compte que les pièces qu'il sait nettoyer.

Un bouton **« Retour à la base »** renvoie le robot à sa station.

### Suivi de l'entretien

La page dédiée aux aspirateurs affiche, pour chaque robot, les informations utiles à l'entretien :

- **À vider / remplir** : réservoir d'eau sale à vider, réservoir d'eau propre à remplir, manque d'eau, niveau de liquide de nettoyage, séchage de la serpillière en cours.
- **Consommables** : durée de vie restante de la brosse principale, de la brosse latérale, du filtre, des capteurs, de la crépine et de la brosse de nettoyage du dock, avec les boutons de réinitialisation.
- **Réglages** : volume des annonces, mode « ne pas déranger », intensité de frottement, parcours de lavage du sol, recharge en heures creuses.
- **État en direct** : état courant, pièce en cours, progression, surface et durée du nettoyage.

## Cas particuliers

- **Passage automatique à midi** : en mode absence, la maison lance d'elle-même un nettoyage. Voir la [routine de départ](../routines/depart.md).
- **Bouton du salon** : le bouton physique du salon lance le nettoyage de la salle à manger et de la cuisine, ou renvoie le robot à sa base s'il est déjà en train de nettoyer. Voir la page [salon](../pieces/salon.md).

## Utilisée par

- la routine de [départ](../routines/depart.md) — déclenche le passage automatique de midi en mode absence,
- la pièce [salon](../pieces/salon.md) — bouton physique et vue synthétique de lancement par pièce.
