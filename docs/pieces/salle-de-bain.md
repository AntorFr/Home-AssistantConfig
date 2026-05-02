<!-- source: package:packages/areas/salle_de_bain.yaml -->

# Salle de bain

## Présentation

La salle de bain accueille la **baignoire**. Elle dispose d'un éclairage piloté et d'un signal lumineux d'**alerte « bain froid »** indiquant que la cuve d'eau chaude ne contient pas assez d'eau à bonne température pour un bain.

## Comportements automatiques

### Éclairage automatique sur présence

<!-- source: automation:salle_de_bain_light, blueprint:antorfr/motion_light.yaml, light:salle_de_bain_lumieres, input_boolean:auto_light_kill_switch_salle_de_bain -->

L'éclairage suit le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)). Paramètres appliqués :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **1 minute** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **30 lux** |
| Seuil haut de luminosité (extinction) | **200 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui (groupe par défaut) |
| Commutateur de neutralisation | **« Lumière mode manuel »** propre à la salle de bain |

L'éclairage est aussi pilotable par un **interrupteur tactile** disposant de plusieurs gestes (touches, glissements, pression longue, multi-touch).

### Alerte « bain froid »

<!-- source: automation:salle_de_bain_cold_bath_warning, blueprint:antorfr/hot_water_warning.yaml -->

Une **lampe d'ambiance** dédiée à l'alerte passe **en bleu** quand :

- elle est allumée **et** que la **température de la cuve d'eau chaude** est **inférieure à 40 °C**,
- ou que la température de la cuve passe sous 40 °C alors que cette lampe est déjà allumée.

C'est un signal visuel pour avertir qu'il n'y a pas assez d'eau chaude pour prendre un bain confortable. Voir aussi la commande de [chauffe forcée de l'eau chaude](../fonctions/chauffage.md#eau-chaude--chauffe-forcée).

## Rôle dans les scénarios maison

- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, arrêt de la lecture sur l'enceinte de la salle de bain.
