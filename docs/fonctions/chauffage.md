<!-- source: package:packages/functions/heating.yaml, package:packages/routines/away.yaml, package:packages/routines/scripts.yaml -->

# Chauffage et eau chaude

## But

Adapter le chauffage de la maison et la production d'eau chaude au **mode d'occupation** de la maison, et permettre une **chauffe forcée** ponctuelle de l'eau chaude.

## Périmètre

Le système couvre :

- le **thermostat central** de la maison, qui pilote le chauffage de la zone via la pompe à chaleur,
- un **chauffage d'appoint mobile** branché sur une prise pilotée et exposé comme un thermostat,
- l'**eau chaude sanitaire** produite par la pompe à chaleur Aquarea, et la **commande de chauffe forcée** associée.

Cette page ne décrit pas la programmation interne du thermostat ni celle de la pompe à chaleur, qui sont gérées directement par leurs propres systèmes.

## Règles de fonctionnement

### Modes du thermostat central

<!-- source: script:routine_climate_home, script:routine_climate_away, script:routine_climate_long_absence -->

Le thermostat central bascule entre trois modes prédéfinis, à la demande de la routine de [départ](../routines/depart.md).

| Mode appliqué | Quand | Effet |
|---|---|---|
| `schedule` (planification) | retour à la maison ; préparation du retour | Le thermostat reprend son mode de planification interne. |
| `away` (absence) | activation du mode absence | Le thermostat passe en mode absence, plus économique. Le chauffage d'appoint mobile est **éteint**. |
| `Frost Guard` (hors gel) | activation du mode absence longue | Le thermostat passe en mode hors gel, qui ne maintient qu'une température minimale. |

Le **chauffage d'appoint mobile** est éteint au passage en absence et **n'est pas rallumé** automatiquement au retour : c'est à l'occupant de le réenclencher si besoin.

### Eau chaude — chauffe forcée

<!-- source: script:heating_hot_water_forced -->

Une commande déclenchable à la demande exécute la séquence suivante sur la pompe à chaleur :

1. la **consigne d'eau chaude** est portée à **65 °C**,
2. le mode **« forcer la production d'eau chaude »** est activé,
3. le mode **puissance** est engagé pour **90 minutes**,
4. la maison **attend** que la température courante de l'eau chaude dépasse **50 °C** (avec un délai maximal de 90 heures par sécurité),
5. dès le seuil atteint, le mode forcé est **désactivé**,
6. la **consigne d'eau chaude** est ramenée à **55 °C**.

## Cas particuliers

### Quand le mode absence longue s'active

<!-- source: automation:routine_long_absence -->

Le thermostat passe en `Frost Guard` lors de l'activation du mode absence longue. Cette activation est elle-même soit :

- **automatique**, lorsque le mode absence reste actif pendant **24 heures consécutives**,
- **manuelle**, en activant explicitement le mode absence longue.

### Quand le retour est anticipé par une date

<!-- source: automation:routine_prepare_home -->

Si une **date de retour** est renseignée pendant une absence longue, le thermostat repasse en mode `schedule` à cette date, sans attendre que les occupants soient effectivement à la maison.

## Utilisée par

- la routine de [départ](../routines/depart.md) — c'est elle qui orchestre les bascules de mode du thermostat,
- la fonction [présence](presence.md) — qui pilote l'entrée et la sortie du mode absence.
