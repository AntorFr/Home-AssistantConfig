<!-- source: package:packages/areas/escalier.yaml -->

# Escalier

## Présentation

L'escalier relie le rez-de-chaussée à l'étage. Son éclairage est commun avec celui du **couloir** de l'étage.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:escaliers_motion_sensors, sensor:mouvement_escalier_5min -->

La présence dans l'escalier est détectée par un **groupe de capteurs** combinant :

- un capteur de mouvement dans le **couloir de l'étage**,
- un capteur de mouvement en **haut** de l'escalier,
- un capteur de mouvement en **bas** de l'escalier,
- un capteur de **personne** dans le couloir.

Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Éclairage automatique sur présence

<!-- source: automation:escalier_light_auto, blueprint:antorfr/motion_light.yaml -->

L'éclairage du **couloir de l'étage** et celui des **escaliers** sont pilotés ensemble. Les paramètres appliqués au mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **1 minute** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Capteur de luminosité | aucun |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |

L'éclairage est aussi pilotable par les **deux interrupteurs filaires** présents dans le couloir de l'étage : chaque pression bascule l'allumage.

## Rôle dans les scénarios maison

- **Détection de présence à l'étage** : le mouvement dans l'escalier est l'un des signaux pondérés du capteur probabiliste de présence à l'étage. Voir [présence](../fonctions/presence.md).
- **Routine de la [journée](../routines/journee.md)** : au passage en mode « Soirée - enfants couché », le **mode sommeil de l'éclairage** est activé.
