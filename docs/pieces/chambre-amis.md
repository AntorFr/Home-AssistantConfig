<!-- source: package:packages/areas/chambre_amis.yaml -->

# Chambre d'amis

## Présentation

La chambre d'amis est utilisée par les visiteurs ponctuels.

## Comportements automatiques

### Indicateur de température

<!-- source: template:sensor:temperature_chambre_amis -->

La maison expose un indicateur de **température courante de la chambre d'amis**, recopié depuis le thermostat associé. L'indicateur n'est disponible que lorsque le thermostat est joignable.

## Rôle dans les scénarios maison

- **Routine de [départ](../routines/depart.md)** : les volets et l'éclairage de la chambre d'amis sont fermés et éteints comme les autres pièces.
- **Mode invité** : tant que le mode invité est actif (un visiteur est sur place), la chambre d'amis est **exclue** des fermetures et ouvertures groupées des volets ainsi que de l'extinction des lumières en variante « nuit ».
- **Routines de soir et matin** (voir [routine de la journée](../routines/journee.md)) : les volets de la chambre d'amis sont fermés ou ouverts avec ceux des pièces de vie, sauf si le mode invité est actif.
