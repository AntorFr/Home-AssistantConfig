<!-- source: package:packages/areas/garage.yaml -->

# Garage

## Présentation

La maison comporte **trois espaces de garage** distincts : **garage 1**, **garage 2** et **garage 3**. Le garage 2 et le garage 3 partagent leurs comportements (capteurs, éclairage). Le garage 1 a son propre éclairage avec un mécanisme légèrement différent (pas de capteur de mouvement déclencheur).

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:garage2_motion_sensors, binary_sensor:garage2_presence_sensors, binary_sensor:garage3_motion_sensors, binary_sensor:garage2-3_motion_sensors, sensor:mouvement_garage-2_10min, sensor:mouvement_garage-3_10min -->

Le garage 2 et le garage 3 ont chacun leur capteur de présence. Un capteur regroupé combine les deux pour la détection commune. Deux compteurs exposent la **durée de mouvement détectée sur les 10 dernières minutes** dans chaque garage. Ces compteurs sont utilisés en signaux pondérés du capteur probabiliste de présence à l'[extérieur](../fonctions/presence.md).

### Conditions du garage 2 et 3

<!-- source: sensor:garage_temperature, sensor:garage_humidity, sensor:garage_pressure -->

La maison expose la **moyenne** des températures, humidités et pressions atmosphériques des capteurs présents sur les portes des garages 2 et 3.

### État de la porte du garage 2

<!-- source: template:binary_sensor:garage2_door_virtual_sensor -->

Un indicateur dédié indique si la porte du garage 2 est **ouverte** (tout état autre que « fermée » ou « indisponible » est considéré comme ouvert).

### Éclairage du garage 1

<!-- source: automation:garage1_light_auto, blueprint:antorfr/motion_light_optional.yaml, input_boolean:auto_light_kill_switch_garage2 -->

Le plafonnier du garage 1 utilise une variante du mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

- pas de **capteur de mouvement** : l'allumage n'est jamais déclenché par une présence dans la pièce,
- **délai d'extinction sans mouvement** : 10 minutes,
- l'**allumage** se produit uniquement quand la **porte du garage 1** est en cours d'ouverture,
- **commutateur de neutralisation** : « Lumière mode manuel (garage 2) » (partagé avec les garages 2 et 3).

### Éclairage des garages 2 et 3

<!-- source: automation:garage2_light_auto, blueprint:antorfr/motion_light.yaml -->

Les plafonniers du garage 2 et du garage 3 fonctionnent en groupe selon le mécanisme commun :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **5 minutes** |
| Avertissement avant extinction | défaut |
| Seuil bas de luminosité (allumage) | **30 lux** |
| Seuil haut de luminosité (extinction) | **100 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | non |
| Commutateur de neutralisation | **« Lumière mode manuel (garage 2) »** |

L'**ouverture de la porte du garage 2** déclenche aussi un allumage explicite, mais **uniquement si la luminosité est inférieure à 30 lux** dans la zone.

### Bouton du garage 1

<!-- source: automation:garage1_bouton_portails, blueprint:antorfr/BluButtonRC4.yaml -->

Un **bouton sans fil à 4 touches** est installé dans le garage 1. Chaque pression simple n'a d'effet **que si la centrale d'alarme est désarmée** :

| Touche | Effet |
|---|---|
| 1 | bascule l'état du **portail** |
| 2 | bascule l'état de la **porte de garage 1** |
| 3 | bascule l'état de la **porte de garage 2** |
| 4 | bascule l'état de la **porte de garage 3** |

## Rôle dans les scénarios maison

- **Détection de présence à l'extérieur** : les compteurs de mouvement des garages 2 et 3 sont des signaux pondérés du capteur probabiliste de présence à l'extérieur.
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, fermeture des **trois portes de garage**.
- **Portail** : la sonnerie d'entrée diffuse une sonnerie sur l'enceinte du garage (voir [portail](../fonctions/portail.md)).
- **Système de [sécurité](../fonctions/alarme-systeme-securite.md)** : un capteur de fumée du garage 3 fait partie des détecteurs incendie.
- **Poubelles** : les balises BLE des poubelles emballages et ménagères sont positionnées dans le garage (voir [poubelles](../fonctions/poubelles.md)).
