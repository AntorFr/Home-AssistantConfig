<!-- source: package:packages/areas/buanderie.yaml -->

# Buanderie

## Présentation

La buanderie accueille la **machine à laver** et le **sèche-linge**.

## Comportements automatiques

### Éclairage automatique sur présence

<!-- source: automation:buanderie_lumiere_auto, blueprint:antorfr/motion_light.yaml, light:buanderie_lumieres -->

L'éclairage de la buanderie (plafonnier de la pièce) suit le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)). Paramètres appliqués :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **15 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **60 lux** |
| Seuil haut de luminosité (extinction) | **250 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |

L'éclairage est aussi pilotable par un **interrupteur filaire** : chaque changement d'état bascule l'éclairage automatique.

### Notification de fin de la machine à laver

<!-- source: automation:buanderie_mashingmachine_end -->

Quand la prise pilotée de la machine à laver passe en état « cycle terminé », une notification est envoyée sur le téléphone de Sébastien :

> la machine à laver a terminé.

### Mode sommeil — lumière rouge nocturne

Comme défini dans la fonction [éclairage](../fonctions/eclairage.md#adaptation-automatique-de-la-lumière), tant que le mode sommeil de la maison est actif, l'éclairage de la buanderie passe en **rouge** à intensité minimale.

## Rôle dans les scénarios maison

- **Routine de [départ](../routines/depart.md)** : la mise hors tension de la **machine à laver** et du **sèche-linge** attend la fin du cycle en cours avant de couper la prise (procédure d'attente d'arrêt de consommation).
