<!-- source: package:packages/integrations/plate_recognizer.yaml -->

# Reconnaissance de plaque d'immatriculation

## But

Identifier les **véhicules connus** qui se présentent au portail à partir de leur **plaque d'immatriculation**, et utiliser cette information pour ouvrir automatiquement le portail.

## Périmètre

La reconnaissance s'appuie sur la caméra de la **sonnette d'entrée** et la caméra du **portail principal**. Une liste de plaques **autorisées** est déclarée à l'intégration ; seules ces plaques produisent un signal de reconnaissance.

## Règles de fonctionnement

### Indicateur « plaque reconnue »

<!-- source: template:binary_sensor:entrance_gate_plate_detected -->

L'indicateur **« plaque détectée au portail »** est actif dès qu'une **plaque autorisée** est repérée par la reconnaissance. Il reste actif **30 secondes** après la dernière détection (anti-rebond pour stabiliser le signal).

L'indicateur expose en attribut la **liste des plaques actuellement reconnues**.

### Boucle de lecture devant le portail fermé

<!-- source: automation:integration_plate_recognizer_reading_gate -->

Quand un **véhicule arrive devant le portail** (capteur de présence à la sonnette frontale), à condition que le **portail soit fermé**, la maison déclenche une **boucle de lecture** :

- elle demande à la reconnaissance de plaque de scanner l'image de la sonnette,
- elle attend **1 seconde**, puis recommence,
- la boucle s'arrête dès qu'une de ces conditions devient vraie :
    - le **véhicule a quitté** la zone,
    - le **portail s'est ouvert**,
    - **20 essais** ont été réalisés,
    - une **plaque autorisée a été reconnue**.

### Effet de la reconnaissance

Quand une plaque autorisée est reconnue, le **portail s'ouvre automatiquement** (voir [portail](portail.md#ouverture-automatique)) — à condition que le portail soit fermé depuis au moins 2 minutes.

### Réinitialisation à la fermeture

<!-- source: automation:integration_plate_recognizer_reset_gate -->

Quand le portail repasse en état **fermé**, si le compteur de scans de la session précédente est non nul, la maison **relance un dernier scan** pour réinitialiser proprement l'état de l'indicateur.

## Utilisée par

- la fonction [portail](portail.md) — la reconnaissance d'une plaque autorisée fait partie des sources d'ouverture automatique.
