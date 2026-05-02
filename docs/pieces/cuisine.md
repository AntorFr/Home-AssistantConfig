<!-- source: package:packages/areas/cuisine.yaml -->

# Cuisine

## Présentation

La cuisine est une pièce de vie principale du rez-de-chaussée. Elle dispose de **deux ensembles d'éclairage** distincts : un **plafonnier** (incluant des lampes Hue de la pièce) et des **spots** complémentaires.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:cuisine_motion_sensors, sensor:mouvement_cuisine_5min -->

La présence est détectée par un **groupe de capteurs** combinant :

- un capteur de présence dans la cuisine,
- un capteur de mouvement principal,
- un capteur de mouvement à l'**entrée** de la cuisine.

Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Indicateur de température

<!-- source: template:sensor:temperature_cuisine -->

La maison expose un indicateur de **température courante** de la cuisine, recopié depuis le thermostat associé.

### Éclairage automatique sur présence

<!-- source: automation:cuisine_light_auto, blueprint:antorfr/motion_light.yaml, light:cusine_plafonier, light:cusine_spot, input_boolean:auto_light_kill_switch_cuisine -->

Les éclairages du **plafonnier** et des **spots** fonctionnent comme un ensemble. Paramètres appliqués au mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **60 lux** |
| Seuil haut de luminosité (extinction) | **250 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |
| Commutateur de neutralisation | **« Lumière mode manuel »** propre à la cuisine |

## Rôle dans les scénarios maison

- **Détection de présence rez-de-chaussée** : le mouvement dans la cuisine est l'un des signaux du capteur probabiliste, avec une pondération modérée.
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, arrêt de la lecture sur les enceintes, fermeture des volets, désactivation du commutateur de neutralisation.
- **Routine de retour** : ouverture des volets si le soleil est levé.
- **Sonnerie du portail** : la sonnerie est diffusée sur l'enceinte de la cuisine (voir [portail](../fonctions/portail.md)).
