<!-- source: package:packages/functions/presence.yaml -->

# Présence

## But

Savoir, à tout moment, **qui est dans la maison, où, et dans quel état d'activité**. Cette information est utilisée par d'autres comportements automatiques de la maison (notamment la routine de [départ](../routines/depart.md)).

## Périmètre

La fonction expose plusieurs indicateurs distincts :

- une indication globale **« Quelqu'un à la maison »**,
- un groupe **« Parent à la maison »** rassemblant Sébastien et Laurine,
- une **activité globale de la maison** (rez-de-chaussée ou étage),
- une **activité dédiée aux pièces de vie du rez-de-chaussée**,
- une **activité dédiée aux pièces de vie de l'étage**,
- une **présence à l'extérieur**,
- une **détection du sommeil**.

## Règles de fonctionnement

### Quelqu'un à la maison

<!-- source: template:binary_sensor:A la maison, input_boolean:guest_mode -->

La maison considère qu'**au moins une personne est présente** dès que l'une des deux conditions suivantes est vraie :

- au moins une personne suivie par la maison est localisée **« à la maison »**,
- le **mode invité** est activé.

### Parent à la maison

<!-- source: group:parent_home -->

Un groupe dédié rassemble les positions de Sébastien et Laurine. Il permet de distinguer une maison où un parent est présent d'une maison où seuls d'autres occupants le sont.

### Activité globale

<!-- source: template:binary_sensor:maison_activite_globale, binary_sensor:maison_rdc_presence, binary_sensor:maison_floor1_presence -->

L'activité globale de la maison est vraie dès qu'une activité est détectée au **rez-de-chaussée** ou à l'**étage**.

### Activité au rez-de-chaussée

<!-- source: template:binary_sensor:activite_pieces_de_vie_rdc -->

L'activité dans les pièces de vie du rez-de-chaussée est calculée à partir des **mouvements détectés sur les 5 dernières minutes** dans :

- le **salon**,
- l'**entrée**,
- la **salle à manger**,
- la **cuisine**,

ainsi que de l'**état du téléviseur du salon** (allumé ou non).

### Activité à l'étage

<!-- source: template:binary_sensor:activite_pieces_de_vie_etage -->

L'activité dans les pièces de vie de l'étage est calculée à partir des **mouvements détectés sur les 5 dernières minutes** dans le **bureau** uniquement. Les passages au couloir, à l'escalier ou aux toilettes ne comptent pas.

### Présence détectée par évaluation probabiliste

Trois capteurs probabilistes (méthode bayésienne) combinent plusieurs signaux pour conclure à une présence dans une zone.

#### Présence au rez-de-chaussée

<!-- source: binary_sensor:maison_rdc_presence -->

Pondère les signaux suivants, avec un seuil de décision élevé :

- mouvement détecté dans le **salon** sur 5 min,
- mouvement détecté dans la **salle à manger** sur 5 min,
- mouvement détecté dans l'**entrée** sur 5 min,
- mouvement détecté dans la **cuisine** sur 5 min,
- **téléviseur du salon** allumé,
- mouvement détecté dans les **toilettes du rez-de-chaussée** sur 5 min.

Le mouvement dans le salon et dans la salle à manger pèsent le plus lourd ; le téléviseur allumé est un signal supplémentaire mais non discriminant à lui seul.

#### Présence à l'étage

<!-- source: binary_sensor:maison_floor1_presence -->

Pondère les signaux suivants :

- mouvement détecté dans le **couloir** sur 5 min,
- mouvement détecté dans l'**escalier** sur 5 min,
- mouvement détecté dans les **toilettes de l'étage** sur 5 min,
- mouvement détecté dans le **bureau** sur 5 min.

Le mouvement dans le bureau pèse plus que les autres.

#### Présence à l'extérieur

<!-- source: binary_sensor:outside_presence -->

Pondère les signaux suivants, sur des fenêtres de 10 minutes :

- mouvement sur l'**aire de jeux**,
- mouvement à proximité du **garage** (deux capteurs),
- mouvement sur le **patio**,
- mouvement à la **piscine**,
- mouvement détecté par la **caméra de l'entrée**,
- mouvement détecté par la **caméra du parking**,
- mouvement sur la **terrasse**,
- état de la **tondeuse robotisée** (à la station de charge ou non).

Le seuil de décision est très élevé : la présence extérieure n'est conclue que sur un faisceau de signaux convergents.

### Détection du sommeil

<!-- source: binary_sensor:sleep_detected -->

La maison conclut au sommeil des occupants par évaluation probabiliste, à partir des signaux suivants :

- **plus d'activité dans les pièces de vie du rez-de-chaussée** (signal fort),
- **plus d'activité dans les pièces de vie de l'étage** (signal fort),
- **téléviseur du salon éteint** (signal fort),
- **nuit tombée** (contexte),
- **heure entre 22h et 6h** (contexte fort).

Aucun signal ne décide seul.

## Cas particuliers

### Mode invité

<!-- source: input_boolean:guest_mode, automation:function_presence_car_in_front -->

Le mode invité peut être activé manuellement. Il est aussi déclenché automatiquement lorsqu'une **voiture stationne devant l'entrée pendant 10 minutes consécutives**. Il s'arrête automatiquement **5 minutes après le départ** de cette voiture. La détection automatique ne s'enclenche pas si le mode invité est déjà actif manuellement.

Tant qu'il est actif, la maison est considérée comme occupée même si aucune personne n'est localisée à la maison.

### Reconnaissance de visage

La position des occupants peut aussi être mise à jour par **reconnaissance de visage** sur les caméras. Deux mécanismes coexistent :

- les **caméras Unifi Protect** détectent les visages connus (Sébastien, Laurine, Émilie, Timothée) et mettent à jour des traceurs dédiés — voir [reconnaissance de visage](reconnaissance-visage.md),
- les **caméras Netatmo** émettent des événements de type « personne reconnue » qui mettent à jour les traceurs Netatmo correspondants (Sébastien, Laurine, Émilie, Timothée).

Ces mécanismes complètent les positions issues des téléphones et des autres traceurs.

### Synchronisation Netatmo

Quand une personne (Sébastien ou Laurine) passe à **« à la maison »** ou **« absente »**, la maison synchronise cette information vers la **caméra Netatmo du bureau** : la personne y est marquée comme présente ou absente. Cette synchronisation est **bidirectionnelle** : la reconnaissance d'un visage par la caméra met à jour la position de la personne côté maison.

Tous les événements émis par les caméras Netatmo sont par ailleurs **comptabilisés** par un compteur dédié (suivi de l'activité de l'API).

### Sources de localisation supplémentaires

La position d'un occupant peut aussi être mise à jour depuis l'extérieur :

- via un **webhook IFTTT** (utilisé pour le traceur Invoxia, qui transmet sa position GPS),
- via les **caméras Netatmo de surveillance** (entrée, parking, salon, couloir) : chaque détection de personne, mouvement, véhicule, fumée ou silence (« hush ») produit un événement qui peut alimenter d'autres comportements.

### Téléphone professionnel et enfants

<!-- source: automation:function_presence_papamobile_left_home -->

Lorsque le **téléphone professionnel** quitte la zone « maison », la maison force la position des **enfants suivis via Netatmo** (Émilie et Timothée) à « hors maison ». Cette synchronisation ne se produit qu'au moment où le téléphone professionnel passe en « hors zone ».

## Utilisée par

- la routine de [départ](../routines/depart.md),
- la fonction [éclairage](eclairage.md),
- la fonction [chauffage](chauffage.md),
- les pages des [pièces](../pieces/) qui réagissent à la présence locale.
