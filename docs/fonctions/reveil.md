<!-- source: package:packages/functions/alarm_clock.yaml -->

# Réveil

## But

Permettre de définir une **heure de réveil** et une **durée de montée en réveil**, et déclencher un comportement de réveil pour Sébastien les jours travaillés.

## Périmètre

Cette page couvre :

- les **paramètres** de réveil (heure, durée),
- les **indicateurs horaires** dérivés (début, milieu, fin),
- l'**automatisation de réveil de Sébastien** en semaine.

## Règles de fonctionnement

### Paramètres

<!-- source: input_datetime:wakeup_time, input_number:wakeup_duration -->

Deux réglages :

- une **heure de réveil**,
- une **durée de réveil** (de 0 à 60 minutes, par pas de 5 minutes).

### Indicateurs horaires dérivés

<!-- source: template:sensor:wakeup_time, template:sensor:wakeup_alarm_start_time, template:sensor:wakeup_alarm_midpoint -->

Trois indicateurs sont calculés à partir des paramètres :

| Indicateur | Calcul |
|---|---|
| **Heure réveil** | l'heure de réveil paramétrée, formatée en HH:MM |
| **Début réveil** | l'heure de réveil moins la durée de réveil |
| **Milieu réveil** | l'heure de réveil moins la moitié de la durée de réveil |

### Réveil de Sébastien en semaine

<!-- source: automation:function_alarm_clock_seb -->

Sur déclenchement à l'heure de réveil propre à Sébastien (paramètre dédié), à condition que la journée soit un **jour travaillé** et que **Sébastien soit à la maison** :

- la **couverture chauffante** de Sébastien est allumée,
- au bout de **45 minutes**, elle est éteinte automatiquement.

## Utilisée par

- la fonction [chauffe-lit](chauffe-lit.md) — utilise les mêmes commutateurs de couverture chauffante.
