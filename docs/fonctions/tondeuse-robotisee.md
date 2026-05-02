<!-- source: package:packages/integrations/automower.yaml -->

# Tondeuse robotisée

## But

Surveiller le bon fonctionnement de la **tondeuse robotisée** Husqvarna et alerter en cas de blocage ou d'indisponibilité prolongée.

## Périmètre

La fonction couvre uniquement la **détection d'erreur** et l'**alerte associée**. Le pilotage de la tondeuse (programmation, démarrage, retour à la base) est géré directement par son intégration native.

## Règles de fonctionnement

### Indicateur de problème

<!-- source: template:binary_sensor:Etat Robot tondeuse, input_boolean:mower_in_revision -->

L'indicateur **« État robot tondeuse »** est actif lorsque :

- la tondeuse est en état **« erreur »** ou **« indisponible »**,
- **et** la maison n'est pas en mode révision (commutateur dédié).

Le **mode révision** permet de marquer manuellement que la tondeuse est en entretien et de neutraliser temporairement les alertes.

### Alerte de problème

<!-- source: alert:automower -->

Tant que l'indicateur de problème est actif, une alerte est envoyée toutes les **12 heures** (720 minutes) sur le canal de notification par défaut. Le message dépend de la cause :

- en état **erreur** : « Robot tondeuse bloqué »,
- en état **indisponible** : « Robot tondeuse indisponible ».

L'alerte est **acquittable**. À la résolution, un message « Robot tondeuse de nouveau ok » est émis.

## Utilisée par

- la fonction [présence](presence.md) — l'**état de la tondeuse à la station de charge** est l'un des signaux du capteur probabiliste de présence à l'extérieur.
