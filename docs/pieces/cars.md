<!-- source: package:packages/areas/cars.yaml -->

# Véhicules

## Présentation

La maison expose un **bouton sans fil** par véhicule, embarqué dans le véhicule lui-même, qui permet d'ouvrir le portail et les portes de garage à distance. Trois véhicules sont équipés : la **Tesla**, le **Touran**, et un véhicule **invité**.

## Comportements automatiques

### Bouton dans la Tesla

<!-- source: automation:cars_tesla_bouton_portails, blueprint:antorfr/BluButtonRC1.yaml -->

Sur le bouton sans fil embarqué dans la Tesla :

| Geste | Effet |
|---|---|
| Pression simple | bascule l'état du **portail** (ouvre s'il est fermé, ferme sinon) |
| Double pression | bascule l'état de la **porte de garage 1** |
| Triple pression | bascule l'état de la **porte de garage 2** |
| Pression longue | active le **mode absence** de la maison |

### Bouton dans le Touran

<!-- source: automation:cars_touran_bouton_portails, blueprint:antorfr/BluButtonRC1.yaml -->

Mêmes effets que pour la Tesla.

### Bouton invité

<!-- source: automation:cars_invitee_bouton_portails, blueprint:antorfr/BluButtonRC1.yaml -->

Sur le bouton sans fil destiné à un véhicule invité :

| Geste | Effet |
|---|---|
| Pression simple | bascule l'état du **portail** |
| Double pression | bascule l'état de la **porte de garage 1** |

(Le bouton invité n'a pas de geste pour les autres équipements.)

### Tesla — comportements automatiques

La Tesla bénéficie de comportements dédiés au-delà de son bouton :

- **Préparation au départ** par commande vocale (climatisation, dégivrage si la température extérieure est inférieure à 5 °C, déverrouillage de la voiture et du câble de recharge),
- **Aération intelligente** des fenêtres en cas de surchauffe de l'habitacle quand la voiture est garée à la maison,
- **Verrouillage automatique** au passage en mode nuit.

Voir la fonction [véhicule Tesla](../fonctions/vehicule-tesla.md) pour le détail.

## Rôle dans les scénarios maison

- **Portail** : voir [portail](../fonctions/portail.md) pour la logique d'ouverture et de fermeture automatique.
- **Routine de [départ](../routines/depart.md)** : la pression longue du bouton de Tesla ou du Touran déclenche manuellement l'entrée en mode absence.
