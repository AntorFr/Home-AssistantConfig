<!-- source: package:packages/areas/toilettes_etage.yaml -->

# Toilettes de l'étage

## Comportements automatiques

### Détection de présence

<!-- source: sensor:mouvement_wc_floor_5min -->

La présence est détectée par un capteur de mouvement dédié. Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé en signal de support par le capteur probabiliste de présence à l'[étage](../fonctions/presence.md).

### Éclairage automatique sur présence

<!-- source: automation:toilettes_etage_light_auto, blueprint:antorfr/motion_light.yaml -->

Les paramètres appliqués au mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **3 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Capteur de luminosité | aucun |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |

L'éclairage est aussi pilotable par un **interrupteur filaire** : chaque changement d'état bascule l'éclairage automatique.

### Mode sommeil — lumière rouge nocturne

Comme défini dans la fonction [éclairage](../fonctions/eclairage.md#adaptation-automatique-de-la-lumière), tant que le mode sommeil de la maison est actif, l'éclairage des toilettes passe en **rouge** à intensité minimale.

## Rôle dans les scénarios maison

- **Détection de présence à l'étage** : le mouvement aux toilettes est l'un des signaux du capteur probabiliste, avec une pondération faible.
