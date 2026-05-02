<!-- source: package:packages/areas/salle_de_douche.yaml -->

# Salle de douche

## Présentation

La salle de douche regroupe le **dressing** et la **douche**, considérés comme un seul espace. Elle dispose de plusieurs éclairages distincts (plafonnier dressing, plafonnier salle de douche, lumière de la douche) pilotés en groupe et d'un signal lumineux d'**alerte « douche froide »**.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:salle_de_douche_motion_sensors -->

La présence est détectée par un **groupe de capteurs** combinant un capteur de présence dans la zone douche et un capteur de mouvement dans le dressing.

### Éclairage automatique sur présence

<!-- source: automation:salle_de_douche_light, blueprint:antorfr/motion_light.yaml, light:salle_de_douche_lumieres, input_boolean:auto_light_kill_switch_salle_de_douche -->

Les éclairages suivent le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)). Paramètres appliqués :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **60 lux** |
| Seuil haut de luminosité (extinction) | **280 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |
| Commutateur de neutralisation | **« Lumière mode manuel »** propre à la salle de douche |

### Commandes manuelles

<!-- source: automation:salle_de_douche_light_switch_dressing, automation:salle_de_douche_light_switch_shower -->

Deux **interrupteurs tactiles** disposent chacun de plusieurs gestes (touches, glissements, pression longue, multi-touch). L'interrupteur de la douche pilote séparément :

- la **lumière de la douche** (touche 1),
- les deux plafonniers du dressing et de la salle de douche (touche 2).

### Alerte « douche froide »

<!-- source: automation:salle_de_douche_cold_shower_warning, blueprint:antorfr/hot_water_warning.yaml -->

La **lumière de la douche** passe **en bleu** quand :

- elle est allumée **et** que la **température de la cuve d'eau chaude** est **inférieure à 35 °C**,
- ou que la température de la cuve passe sous 35 °C alors que la lumière de la douche est déjà allumée.

C'est un signal visuel pour avertir qu'il n'y a pas assez d'eau chaude pour une douche confortable.

## Rôle dans les scénarios maison

- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, arrêt de la lecture sur l'enceinte de la salle de douche.
- **Mode sommeil de l'éclairage** : la salle de douche est incluse dans la liste des pièces dont l'adaptation passe en mode sommeil au coucher (voir [routine de la journée](../routines/journee.md)).
