<!-- source: package:packages/areas/entree.yaml -->

# Entrée

## Présentation

L'entrée comporte **deux zones** d'éclairage distinctes : les **spots** principaux et un **vestibule**.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:entree_motion_sensors, sensor:mouvement_entree_5min -->

La présence est détectée par un **groupe de capteurs** combinant :

- un capteur de mouvement à l'**entrée du couloir**,
- un capteur de mouvement dans l'**entrée**,
- un capteur de mouvement en **bas de l'escalier**.

Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Éclairage automatique sur présence

<!-- source: automation:entree_light_auto, blueprint:antorfr/motion_light.yaml, light:entree_spots, light:entree_vestibule -->

Les **spots** de l'entrée s'allument automatiquement selon le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)). Paramètres appliqués :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **3 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **60 lux** |
| Seuil haut de luminosité (extinction) | non défini |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |

L'éclairage est aussi pilotable par les **deux interrupteurs filaires** présents à l'entrée : chaque pression bascule l'allumage.

### Bouton portail

<!-- source: automation:entree_button -->

Un **bouton** dédié dans l'entrée permet, par une **pression simple**, de **basculer l'état du portail** (l'ouvre s'il est fermé, le ferme s'il est ouvert).

## Rôle dans les scénarios maison

- **Détection de présence rez-de-chaussée** : le mouvement dans l'entrée pèse modérément dans le capteur probabiliste de présence au rez-de-chaussée.
- **Routine de [départ](../routines/depart.md)** : extinction de l'éclairage, **verrouillage** de la serrure connectée de l'entrée.
- **Routine de retour** : **déverrouillage** de la serrure connectée.
- **Portail** : le retour à la maison via une voiture détectée à l'entrée déclenche l'**ouverture automatique** du portail (voir [portail](../fonctions/portail.md)).
