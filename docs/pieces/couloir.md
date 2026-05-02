<!-- source: package:packages/areas/couloir.yaml -->

# Couloir

## Présentation

Le couloir de l'étage dessert les chambres et les toilettes du premier étage. La présence dans le couloir est utilisée comme signal pour la détection de présence à l'étage.

## Comportements automatiques

### Détection de présence

<!-- source: group:couloir_sensors, sensor:mouvement_couloir_5min -->

La présence dans le couloir est détectée par un **groupe de capteurs** combinant la caméra du couloir et un capteur de mouvement de l'étage.

Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Éclairage automatique

L'éclairage du couloir est commandé conjointement avec celui de l'**escalier**. Le détail du mécanisme et des paramètres se trouve dans la page [escalier](escalier.md).

## Rôle dans les scénarios maison

- **Détection de présence à l'étage** : le mouvement du couloir est l'un des signaux pondérés du capteur probabiliste de présence à l'étage. Voir [présence](../fonctions/presence.md).
- **Routine de la [journée](../routines/journee.md)** : au passage en mode « Soirée - enfants couché », le **mode sommeil de l'éclairage** du couloir est activé (intensité minimale et adaptation de teinte).
