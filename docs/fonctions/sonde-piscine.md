<!-- source: package:packages/integrations/ico.yaml -->

# Sonde piscine

## But

Surveiller en continu la **qualité de l'eau de la piscine** (pH, température, oxydoréduction, salinité) et l'**état de la sonde** elle-même (réception des données, niveau de pile), avec des alertes dédiées en cas de dépassement des seuils ou de panne.

## Périmètre

La sonde flottante mesure plusieurs paramètres remontés à la maison. Cette page décrit les **indicateurs de problème** dérivés de ces mesures et les **alertes** associées. Les valeurs courantes sont utilisées par la fonction [piscine](../pieces/piscine.md) pour piloter la filtration et l'électrolyse.

Tous les indicateurs de problème sont **désactivés en mode hivernage**, sauf les indicateurs de réception de données et de pile.

## Règles de fonctionnement

### Indicateurs de problème

<!-- source: template:binary_sensor:ico_data_freshness, template:binary_sensor:ico_ph, template:binary_sensor:ico_temperature, template:binary_sensor:ico_redox, template:binary_sensor:ico_salt, template:binary_sensor:ico_battery -->

Six indicateurs de problème sont calculés en continu :

| Indicateur | Condition d'alerte |
|---|---|
| **Réception des données** | la dernière mesure d'oxydoréduction date de **plus de 12 heures** |
| **pH** | la valeur est **inférieure à 7,0** ou **supérieure à 7,5** |
| **Température** | la valeur est **inférieure à 26 °C** ou **supérieure à 34 °C** |
| **Oxydoréduction** | la valeur est **hors de la plage** définie par les seuils bas (650) et haut (750) propres à la sonde |
| **Salinité** | la valeur est **inférieure à 3000** ou **supérieure à 5000** |
| **Pile** | la valeur est **inférieure à 15 %** |

Tous les indicateurs sauf **« Réception des données »** et **« Pile »** sont neutralisés en **mode hivernage** (la qualité de l'eau n'est pas surveillée hors saison).

### Alerte de déconnexion

<!-- source: alert:ico_disconnected_alert -->

Tant que l'indicateur **« Réception des données »** est actif, une alerte est émise toutes les **3 heures** (180 minutes), indiquant depuis quand la sonde est silencieuse :

> Ico déconnecté depuis _\<durée>_

L'alerte est **acquittable**. La première occurrence est sautée. À la résolution : « Ico de nouveau connecté ».

### Alerte de pile faible

<!-- source: alert:ico_battery_alert -->

Tant que l'indicateur **« Pile »** est actif, une alerte est émise toutes les **24 heures** (1440 minutes), indiquant le niveau courant :

> niveau de pile Ico faible _\<niveau>_

L'alerte est **acquittable**. La première occurrence est sautée. À la résolution : « Ico à de nouveau des piles ».

### Pas d'alerte automatique pour pH, température, oxydoréduction, salinité

Les indicateurs de pH, de température et d'oxydoréduction de cette page **alimentent les alertes** de la page [piscine](../pieces/piscine.md), mais sans alerte propre dans cette page.

## Utilisée par

- la page [piscine](../pieces/piscine.md) — utilise les valeurs courantes pour piloter la filtration et l'électrolyse, et expose les alertes pH, oxydoréduction, niveau d'eau associées.
