<!-- source: package:packages/areas/toilettes_rdc.yaml -->

# Toilettes du rez-de-chaussée

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:toilettes_rdc_motion_sensors, sensor:mouvement_wc_rdc_5min -->

La présence est détectée par un capteur de mouvement dédié. Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé en signal de support par le capteur probabiliste de présence au [rez-de-chaussée](../fonctions/presence.md).

### Éclairage automatique sur présence

<!-- source: automation:toilettes_rdc_light_auto, blueprint:antorfr/motion_light.yaml -->

Les paramètres appliqués au mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **3 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Capteur de luminosité | aucun |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |

L'éclairage est aussi pilotable par un **interrupteur filaire** : chaque changement d'état de l'interrupteur bascule l'éclairage automatique.

### Mode sommeil — lumière rouge nocturne

Comme défini dans la fonction [éclairage](../fonctions/eclairage.md#adaptation-automatique-de-la-lumière), tant que le mode sommeil de la maison est actif, l'éclairage des toilettes passe en **rouge** à intensité minimale, pour ne pas perturber la vision nocturne lors d'un passage la nuit.

## Rôle dans les scénarios maison

- **Détection de présence rez-de-chaussée** : le mouvement aux toilettes est l'un des signaux du capteur probabiliste, avec une pondération faible (un passage aux toilettes ne suffit pas à conclure à une vraie présence).
