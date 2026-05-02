<!-- source: package:packages/areas/bureau.yaml -->

# Bureau

## Présentation

Le bureau accueille la station de travail principale de Sébastien : ordinateur, écrans, barres LED des écrans, **bureau assis-debout motorisé**, **fer à souder**, **pistolet à colle**, **filtre à fumée de soudure**, et un radiateur électrique mobile sur prise pilotée. Le bureau dispose de **stores motorisés**, d'**enceintes**, d'un **« mode réunion »** dédié et d'une **sonnette** propre.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:bureau_motion_sensors, sensor:mouvement_bureau_5min -->

La présence dans le bureau est détectée par un **groupe de capteurs** combinant trois capteurs de présence distincts. Un compteur expose la **durée de mouvement détectée sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md) — c'est le principal signal d'activité à l'étage.

### Éclairage automatique sur présence

<!-- source: automation:bureau_light_auto, blueprint:antorfr/motion_light.yaml, light:bureau_lumieres, input_boolean:auto_light_kill_switch_bureau -->

Les lampes du bureau (lampe d'ambiance et plafonnier) suivent le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **80 lux** |
| Seuil haut de luminosité (extinction) | **250 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | non |
| Commutateur de neutralisation | **« Lumière mode manuel (bureau) »** |

### Barres LED des écrans

<!-- source: automation:bureau_wled_pc_auto, blueprint:antorfr/motion_light.yaml -->

Les **barres LED des écrans** (rétroéclairage) suivent une variante du mécanisme commun configurée pour ne s'éteindre qu'automatiquement, et déclenchée par l'**état de connexion du PC** :

- elles **s'allument** quand le **PC se connecte**,
- elles **s'éteignent** quand le **PC se déconnecte** (déclencheur d'extinction explicite),
- elles s'éteignent aussi après **5 minutes** sans mouvement dans le bureau,
- avertissement à 30 secondes avant extinction,
- neutralisable par le **« Lumière mode manuel (bureau) »**.

### Extinction de l'enceinte

<!-- source: automation:bureau_turn_off -->

Quand l'absence dans le bureau dure **5 minutes consécutives**, l'enceinte du bureau est éteinte.

### Chauffage d'appoint automatique

<!-- source: automation:bureau_heater-auto -->

Le **chauffage d'appoint mobile** du bureau est piloté automatiquement, en tenant compte du jour Tempo :

| Déclencheur | Conditions | Action |
|---|---|---|
| **8h30** | jour travaillé, Sébastien à la maison, **demain non rouge** Tempo | passe en preset **« Travail »** et allume le chauffage |
| **4h30** | jour travaillé, Sébastien à la maison, **demain rouge** Tempo | met la consigne à **23 °C** et allume le chauffage (pour préchauffer pendant la nuit avant un jour rouge) |
| **Présence détectée** dans le bureau (5 min) | **demain non rouge** Tempo | si jour travaillé, preset **« Travail »** ; sinon preset **« home »** ; allume le chauffage |
| **Absence détectée** dans le bureau (5 min) | — | éteint le chauffage |

### Coupure des outils du fer à souder

<!-- source: automation:iron_auto_filter -->

Les **outils consommant de l'énergie** (fer à souder, pistolet à colle, sabre laser, filtre à fumée) sont gérés automatiquement :

- quand l'**absence** dans le bureau dure **5 minutes consécutives**, **tous ces appareils sont coupés** (sécurité),
- quand le **fer à souder** est utilisé (consommation au-dessus de 100 W pendant 2 secondes), le **filtre à fumée** est **allumé** automatiquement,
- quand le fer à souder n'est plus utilisé (consommation sous 90 W pendant 5 secondes), le filtre à fumée est **éteint**,
- la coupure manuelle du fer à souder éteint aussi le filtre à fumée.

### Bureau motorisé

Le **bureau assis-debout** est piloté par un mécanisme dédié (presets de hauteur, commande vocale « lève le bureau » / « baisse le bureau »). Voir la fonction [bureau motorisé](../fonctions/bureau-motorise.md).

### Reconnexion automatique du bureau motorisé

<!-- source: automation:reconnect_ble_desk -->

Quand une présence est détectée dans le bureau, **si le bureau motorisé est déconnecté en Bluetooth**, la maison déclenche une **reconnexion** automatique pour le rendre joignable.

### Mode réunion

<!-- source: input_boolean:meeting_mode, automation:office_meeting_mode -->

Un commutateur **« mode réunion »** est associé au bureau. Il peut être :

- activé manuellement,
- basculé via le scan d'une **étiquette physique** dédiée (« Lapin »),
- désactivé automatiquement quand l'**absence** est détectée dans le bureau.

Quand le mode réunion s'**active** :

- toute lecture sur les enceintes du bureau est **arrêtée**.

### Sonnette du bureau

<!-- source: script:office_door_bell_ring -->

Le bureau a sa propre **sonnette** (utilisée par la sonnette de l'entrée — voir [portail](../fonctions/portail.md)).

| Mode réunion | Comportement |
|---|---|
| **Inactif** | la maison joue un **son** de sonnette (musique de Harry Potter) sur l'enceinte du bureau |
| **Actif** | les **barres LED des écrans** passent à un préréglage **« DoorBell »** pendant **30 secondes**, puis reviennent au préréglage par défaut. Aucun son n'est joué |

### Lecture par scan d'étiquette « Lapin »

<!-- source: automation:scan_tag_office -->

Le scan d'une étiquette physique dédiée (« Lapin ») dans le bureau lance la **musique d'ambiance** par défaut du bureau (voir [musique](../fonctions/musique.md)).

## Commandes manuelles disponibles

### Interrupteur tactile du couloir (vers le bureau)

<!-- source: automation:bureau_couloir_light_hallway -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule la **lumière du couloir** du bureau |
| Glissement à gauche | **séquence d'arrivée** : allume la lumière du couloir, attend 3 secondes, allume les lumières du bureau, attend 3 secondes, éteint la lumière du couloir |
| Multi-touch | éteint **toutes les lumières** du bureau et **arrête la musique** |

### Interrupteur tactile à l'entrée du bureau

<!-- source: automation:bureau_light_switch_entrance -->

| Geste | Effet |
|---|---|
| Multi-touch | éteint **toutes les lumières** du bureau et **arrête la musique** |
| Glissement à droite | bascule les **stores** (gauche et droite ensemble) |
| Glissement à gauche | bascule les **stores** |

### Interrupteur tactile sur l'applique du bureau

<!-- source: automation:bureau_light_switch_desk -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule la **lampe d'ambiance** du bureau |
| Touche 2 | bascule le **plafonnier** du bureau |
| Touche 3 | bascule la **lampe d'ambiance** du bureau |
| Multi-touch | éteint **toutes les lumières** et **arrête la musique** |
| Glissement à droite ou à gauche | bascule les **stores** |

## Rôle dans les scénarios maison

- **Détection de présence à l'étage** : le bureau est la **seule pièce** dont les mouvements alimentent l'indicateur d'activité dans les pièces de vie de l'étage. Voir [présence](../fonctions/presence.md).
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, désactivation du commutateur de neutralisation, attente de fin d'impression 3D avant coupure de la prise associée.
- **Sonnette du portail** : la sonnette du bureau est déclenchée quand quelqu'un sonne à la porte d'entrée (voir [portail](../fonctions/portail.md)).
- **Annonce « À table »** : si une présence est détectée dans le bureau, l'annonce y est diffusée (voir [notifications](../fonctions/notifications.md)).
- **Suivi d'énergie** : plusieurs prises du bureau (PC, routeur, prise 1) sont suivies en énergie cumulée (voir [suivi de l'énergie](../fonctions/suivi-energie.md)).
- **Imprimante 3D** : les notifications de l'imprimante 3D installée dans le bureau sont décrites dans [imprimante 3D](../fonctions/imprimante-3d.md).
- **Cluster informatique** : les neuf machines du cluster maison sont pilotables à distance depuis Home Assistant — voir [PC distants](../fonctions/pcs-distants.md).
