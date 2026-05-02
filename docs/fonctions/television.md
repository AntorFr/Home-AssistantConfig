<!-- source: package:packages/functions/tv.yaml -->

# Téléviseur

## But

Piloter le **téléviseur principal du salon** depuis Home Assistant : allumage à distance via le réseau, bascule automatique sur la console **Xbox** quand elle s'allume, extinction du téléviseur quand la console s'éteint.

## Périmètre

Le téléviseur principal (salon) et la console Xbox du salon.

## Règles de fonctionnement

### Allumage à distance par Wake-on-LAN

<!-- source: automation:function_tv_turn_on -->

Lorsqu'une commande d'allumage est envoyée au téléviseur depuis Home Assistant, la maison **émet un paquet Wake-on-LAN** sur l'adresse réseau du téléviseur, ce qui le réveille même quand il est en veille profonde.

### Bascule automatique sur la Xbox

<!-- source: automation:function_tv_xbox_switch_source, script:function_tv_xbox_switch_source, intent:tvXBoxOn -->

Quand la **Xbox du salon** s'allume :

1. si le téléviseur est éteint, il est **allumé** et la maison attend 8 secondes le temps de l'initialisation,
2. la touche **« Source »** de la télécommande est envoyée,
3. la maison parcourt le menu de sources de la télévision (3 fois bas, 1 fois haut, validation) pour sélectionner l'entrée Xbox.

Cette séquence est aussi accessible par commande vocale.

Quand la **Xbox s'éteint**, le téléviseur est **éteint** automatiquement.
