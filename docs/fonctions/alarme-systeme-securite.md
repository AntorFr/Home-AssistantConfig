<!-- source: package:packages/functions/securtity_system.yaml -->

# Système de sécurité

## But

Détecter les intrusions et les situations dangereuses (présence anormale en absence, mouvement extérieur la nuit, **fumée**, **porte de la piscine non sécurisée**), et alerter les occupants.

## Périmètre

Le système couvre :

- une **centrale d'alarme** à plusieurs modes (au repos, armée pour absence, armée pour la nuit),
- la **détection de fumée** (trois capteurs),
- la **surveillance de la porte de la piscine**.

## Règles de fonctionnement

### Centrale d'alarme

<!-- source: alarm_control_panel:alarme_maison -->

La centrale d'alarme expose les modes suivants : **désarmée**, **armée présence (à la maison)**, **armée absence**, **armée nuit**, **déclenchée**.

Les temporisations utilisées :

| Mode | Temporisation d'armement | Temporisation d'entrée | Durée du déclenchement |
|---|---|---|---|
| Désarmée | — | — | 0 (pas de déclenchement) |
| Armée absence | 120 s | 120 s | 240 s |
| Armée présence | 0 s (immédiat) | 0 s | 240 s |
| Armée nuit | 0 s (immédiat) | 0 s | 240 s |

Aucun code de désarmement n'est requis (`code_arm_required: false`).

### Armement automatique

<!-- source: automation:function_security_arm_when_away, automation:function_security_arm_when_sleep -->

L'armement de la centrale est déclenché par les routines maison :

- au passage en mode **absence** (routine de [départ](../routines/depart.md)), la centrale passe en mode **armée absence**,
- au passage en **mode nuit**, **si la centrale est désarmée**, elle passe en mode **armée nuit**.

### Désarmement automatique

<!-- source: automation:function_security_desarm_when_home, automation:function_security_desarm_when_morning -->

Le désarmement est déclenché par :

- le **retour d'au moins un parent** à la maison, ou la désactivation du mode absence — la centrale est désarmée si elle ne l'était pas déjà,
- au **réveil** ou à l'**aurore** : la centrale est désarmée **uniquement si elle était armée nuit**.

### Déclenchement

<!-- source: automation:function_security_triger_while_armed_away, automation:function_security_triger_while_armed_night -->

Le déclenchement de l'alarme dépend du mode :

| Mode actif | Signal qui déclenche l'alarme |
|---|---|
| Armée absence | présence détectée au **rez-de-chaussée**, à l'**étage** ou à l'**extérieur** |
| Armée nuit | présence détectée à l'**extérieur** uniquement |

Voir [présence](presence.md) pour les capteurs probabilistes utilisés.

### Notification au déclenchement

<!-- source: automation:function_security_triger_acton -->

Quand l'alarme passe en état **« déclenchée »**, une notification est envoyée sur le téléphone de Sébastien indiquant **quels capteurs de présence** ont déclenché l'alarme :

> ALARME ! Mouvement detecté : _\<liste des zones>_

### Détection de fumée

<!-- source: binary_sensor:detecteurs_fumees, alert:fire_alert -->

Trois capteurs de fumée sont regroupés sous un indicateur unique :

- capteur de fumée du **couloir**,
- capteur de fumée du **salon**,
- capteur de fumée du **garage 3**.

Quand au moins un de ces capteurs détecte de la fumée :

- une **alerte** est émise toutes les **5 minutes** tant que la fumée persiste,
- le message indique **quel(s) capteur(s)** sont actifs,
- l'image en direct de la **caméra du salon** est jointe à la notification,
- l'alerte est envoyée à la fois à **Sébastien** et à **tous les téléphones de la maison**, en priorité haute, avec son d'alerte critique au volume maximal,
- l'alerte ne peut **pas être acquittée** : tant que la fumée est détectée, l'envoi continue.

À la fin de l'alerte (plus aucun capteur actif), un message « Fin d'alarme incendie » est émis.

### Surveillance de la porte de la piscine

<!-- source: alert:swiming_pool -->

Une alerte est émise lorsque la **porte de la piscine** est ouverte sans personne à proximité, ou si elle est **déconnectée** :

- le message indique précisément la situation (porte ouverte, ou capteur déconnecté),
- l'image en direct de la **caméra de la piscine** est jointe,
- l'alerte est envoyée à **tous les téléphones de la maison**, en priorité haute, avec son d'alerte critique,
- la **répétition** suit une cadence croissante : 15 minutes, 30 minutes, puis 60 minutes,
- l'alerte ne peut **pas être acquittée**, mais la **première occurrence est sautée**.

À la résolution :

- si l'alarme piscine est désactivée, le message est « Alarme désactivée »,
- sinon, « Porte Piscine sécurisée ».

## Utilisée par

- la routine de [départ](../routines/depart.md) — armement à l'activation du mode absence,
- les routines de **mode nuit** et de **réveil** — armement et désarmement nuit,
- la fonction [présence](presence.md) — capteurs probabilistes utilisés pour le déclenchement.
