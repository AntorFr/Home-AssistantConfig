<!-- source: package:packages/functions/3d_printer.yaml -->

# Imprimante 3D

## But

Notifier le propriétaire des **événements importants** des deux imprimantes 3D : début, fin, erreur.

## Périmètre

Deux imprimantes 3D suivies. Le détail de chacune (modèle, état, paramètres) est exposé directement par leur intégration ; cette page ne couvre que les notifications associées.

## Règles de fonctionnement

### Notification de début d'impression

<!-- source: automation:3dprint_start -->

Lorsqu'une imprimante passe d'un état **inactif** (au repos, terminée, prête) à l'état **« en impression »**, une notification est envoyée sur le téléphone de Sébastien :

> _\<nom de l'imprimante>_ — Debut impression

### Notification de fin d'impression

<!-- source: automation:3dprint_end -->

Lorsqu'une imprimante passe de **« en impression »** ou **« occupée »** à **« terminée »**, une notification est envoyée sur le téléphone de Sébastien :

> _\<nom de l'imprimante>_ — impression terminée

### Notification d'erreur

<!-- source: automation:3dprint_error -->

Lorsqu'une imprimante passe à l'état **« erreur »** ou **« attention »** depuis un état stable (au repos, terminée, prête, en impression, occupée, en pause, arrêtée), une notification est envoyée sur le téléphone de Sébastien :

> _\<nom de l'imprimante>_ — Probleme détecté

## Utilisée par

- la routine de [départ](../routines/depart.md) — la mise hors tension des prises associées aux imprimantes attend la fin d'une éventuelle impression en cours.
