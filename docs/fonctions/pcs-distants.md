<!-- source: package:packages/devices/cluster.yaml -->

# Pilotage des PC distants

## But

Permettre à Home Assistant d'**allumer** et d'**éteindre** à distance les machines du **cluster informatique** de la maison.

## Périmètre

Neuf machines sont pilotables :

- **up01**, **up02**, **up03**,
- **odr01**, **odr02**, **odr03**,
- **nuc01**, **nuc02**, **nuc03**.

## Règles de fonctionnement

### Allumage

<!-- source: switch:up01, switch:up02, switch:up03, switch:odr01, switch:odr02, switch:odr03, switch:nuc01, switch:nuc02, switch:nuc03 -->

Chaque machine est exposée comme un **interrupteur** virtuel. Une commande d'allumage déclenche l'envoi d'un **paquet Wake-on-LAN** sur l'adresse réseau de la machine.

### Extinction

<!-- source: shell_command:turn_off_remote_pc, shell_command:suspend_remote_pc -->

Une commande d'extinction déclenche, selon la machine, l'une des deux séquences suivantes via une **connexion sécurisée** au système concerné (clé d'authentification dédiée stockée par Home Assistant) :

- **arrêt complet** (machines up01, up02, up03, odr01, nuc01, nuc02, nuc03),
- **mise en veille** (machines odr02 et odr03).

## Utilisée par

- la fonction [supervision](supervision.md) — les neuf machines font partie des **appareils requis** dont la déconnexion déclenche une alerte.
