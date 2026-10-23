<!-- source: package:packages/functions/tv.yaml -->

# Téléviseur

## But

Piloter le **téléviseur principal du salon** depuis Home Assistant : allumage à distance via le réseau.

## Périmètre

Le téléviseur principal (salon).

## Règles de fonctionnement

### Allumage à distance par Wake-on-LAN

<!-- source: automation:function_tv_turn_on -->

Lorsqu'une commande d'allumage est envoyée au téléviseur depuis Home Assistant, la maison **émet un paquet Wake-on-LAN** sur l'adresse réseau du téléviseur, ce qui le réveille même quand il est en veille profonde.
