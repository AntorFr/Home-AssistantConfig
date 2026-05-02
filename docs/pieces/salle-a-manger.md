<!-- source: package:packages/areas/salle_a_manger.yaml -->

# Salle à manger

## Présentation

La salle à manger est l'une des pièces de vie principales du rez-de-chaussée. Son activité est l'un des signaux les plus pondérés de la détection de présence au [rez-de-chaussée](../fonctions/presence.md).

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:salle_a_manger_motion_sensors, sensor:mouvement_salle_a_manger_5min -->

La présence est détectée par un capteur de présence dédié. Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Indicateur de température

<!-- source: template:sensor:temperature_salle_a_manger -->

La maison expose un indicateur de **température courante** de la pièce, recopié depuis le thermostat associé. L'indicateur n'est disponible que lorsque le thermostat est joignable.

### Éclairage automatique sur présence

<!-- source: automation:salle-a-manger_light_auto, blueprint:antorfr/motion_light.yaml, input_boolean:auto_light_kill_switch_salle_a_manger -->

Les paramètres appliqués au mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **20 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **30 lux** |
| Seuil haut de luminosité (extinction) | **100 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |
| Commutateur de neutralisation | **« Lumière mode manuel »** propre à la salle à manger |

L'éclairage est aussi pilotable par un **bouton** : chaque changement d'état bascule l'éclairage automatique.

### Désactivation pendant le dîner

Au passage en phase **« Soirée »** de la routine de la [journée](../routines/journee.md), l'**adaptation automatique de l'éclairage** de la salle à manger est désactivée — la lumière reste donc fixe pendant le dîner. Elle est **réactivée** au passage en phase « Soirée - enfants couché ».

### Ambiances d'éclairage

<!-- source: script:light_scene_salle_a_manger -->

Deux ambiances activables à la demande :

| Ambiance | Effet |
|---|---|
| Lego | Scène Hue « lumineuse », intensité maximale, l'**adaptation automatique** est désactivée |
| Standard | Réactive l'adaptation automatique et allume l'éclairage |

## Rôle dans les scénarios maison

- **Détection de présence rez-de-chaussée** : le mouvement dans la salle à manger pèse fortement dans le capteur probabiliste de présence au rez-de-chaussée.
- **Routine de la [journée](../routines/journee.md)** : adaptation désactivée à l'entrée en soirée, réactivée au coucher des enfants.
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, arrêt de la lecture sur les enceintes, fermeture des volets, désactivation du commutateur de neutralisation.
