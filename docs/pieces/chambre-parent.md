<!-- source: package:packages/areas/chambre_parent.yaml -->

# Chambre des parents

## Présentation

La chambre des parents est équipée d'un **plafonnier**, d'une **lampe de chevet** colorée, d'une lampe **« cœur ardent »**, de **lampes de lit gauche et droite** intégrées au lit connecté, de **volets motorisés** et de **deux couvertures chauffantes** (une par occupant). Chaque côté du lit dispose d'un **bouton sans fil** dédié, et un interrupteur tactile complète le pilotage à l'entrée.

## Comportements automatiques

### Détection de présence et présence au lit

<!-- source: binary_sensor:chambre_parents_bed_sensors, binary_sensor:chambre_parents_motion_sensors, template:binary_sensor:withing_bed_presence_1 -->

La chambre dispose de deux indicateurs distincts :

- **« Présence lit chambre parents »** : combine la présence des deux côtés du lit connecté et un indicateur de présence supplémentaire,
- **« Capteurs mouvement chambre parents »** : combine les détections de mouvement et de présence des deux côtés du lit ainsi qu'un capteur de cible mobile.

### Éclairage automatique du plafonnier

<!-- source: automation:chambre_parent_lumiere_auto, blueprint:antorfr/motion_light.yaml, input_boolean:auto_light_kill_switch_chambre_parent -->

Le **plafonnier** suit le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **15 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Capteur de luminosité | aucun |
| Allumage limité à la nuit | **oui** |
| Adaptation automatique pendant l'allumage | oui |
| Commutateurs de neutralisation | **« Lumière mode manuel (chambre parent) »**, **« Présence lit »** (allumage neutralisé tant que quelqu'un est au lit), **« Mode nuit »** de la maison |

### Éclairage automatique des lumières de lit

<!-- source: automation:chambre_parent_bed_light_auto_left, automation:chambre_parent_bed_light_auto_right, blueprint:antorfr/motion_light.yaml -->

Chaque **lumière de lit** (gauche, droite) s'allume automatiquement sur détection de mouvement de son côté du lit, **uniquement la nuit**, en **rouge à 20 %**. Elle s'éteint **5 secondes** après la fin du mouvement.

Le commutateur de neutralisation de la chambre désactive aussi cet éclairage automatique.

## Commandes manuelles disponibles

### Bouton sans fil côté Sébastien

<!-- source: automation:chambre_parent_button_seb -->

| Geste | Effet |
|---|---|
| Touche 1, simple | bascule le **plafonnier** |
| Touche 1, double | éteint **toutes les lumières** de la maison (variante nuit) |
| Touche 1, longue | bascule le **mode nuit** de la maison : **désactive** entre 5h et 19h, **active** sinon |
| Touche 2, simple | bascule la **lampe de chevet** colorée |
| Touche 2, double | allume la lampe de chevet en **rouge à 50 %** (mode nuit) |
| Touche 2, longue | allume la lampe de chevet en **rouge à 8 %** (mode veilleuse minimale) |
| Touche 3, simple | bascule l'état des **volets** de la chambre |
| Touche 4, simple | allume la **couverture chauffante de Sébastien** pendant **15 minutes** |
| Touche 4, double | allume la **couverture chauffante de Sébastien** pendant **30 minutes** |
| Touche 4, longue | bascule l'état de la **couverture chauffante de Sébastien** sans temporisation |

### Bouton sans fil côté Laurine

<!-- source: automation:chambre_parent_button_low -->

| Geste | Effet |
|---|---|
| Touche 1, simple | bascule la **lampe de chevet** en blanc, intensité maximale, mode dynamique |
| Touche 1, double | allume la lampe de chevet en **rouge à 50 %** |
| Touche 1, longue | allume la lampe de chevet en **rouge à 8 %** |
| Touche 2, simple | bascule le **plafonnier** |
| Touche 2, double | éteint **toutes les lumières** de la maison (variante nuit) |
| Touche 2, longue | bascule le **mode nuit** : désactive entre 5h et 19h, active sinon |
| Touche 3, simple | allume la **couverture chauffante de Laurine** pendant **15 minutes** |
| Touche 3, double | allume la **couverture chauffante de Laurine** pendant **30 minutes** |
| Touche 3, longue | bascule l'état de la **couverture chauffante de Laurine** sans temporisation |
| Touche 4, simple | bascule l'état des **volets** de la chambre |

### Interrupteur tactile à l'entrée

<!-- source: automation:chambre_parent_bed_light_switch -->

| Geste | Effet |
|---|---|
| Glissement à droite | allume les **lumières de lit gauche et droite** en **rouge à 30 %** pendant **15 secondes**, puis les éteint (mode « se repérer pour aller au lit ») |

## Rôle dans les scénarios maison

- **Routine de la [journée](../routines/journee.md)** : passage en mode sommeil de l'éclairage de la chambre. Le mode nuit pris en compte dans le commutateur de neutralisation du plafonnier (le plafonnier ne s'allume pas automatiquement en mode nuit).
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, fermeture des volets, désactivation du commutateur de neutralisation, **extinction des couvertures chauffantes** étiquetées à couper la nuit / en absence.
- **[Chauffe-lit](../fonctions/chauffe-lit.md)** : allumage automatique en soirée si la température extérieure est basse, extinction au bout de 2 heures.
- **[Réveil](../fonctions/reveil.md)** : allumage de la couverture chauffante de Sébastien en semaine.
- **Réglages de nuit** : la **lumière d'écoute** du panneau d'assistant vocal de la chambre est éteinte en mode nuit et rallumée le matin (voir [routine de la journée](../routines/journee.md#déroulé-du-coucher)).
