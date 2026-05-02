<!-- source: package:packages/functions/battery_monitor.yaml, jinja:battery_functions.jinja -->

# Surveillance des batteries

## But

Détecter les **batteries faibles ou indisponibles** parmi un ensemble de capteurs surveillés, et alerter le propriétaire pour qu'il les remplace.

## Périmètre

La maison surveille toutes les batteries des appareils marqués par une **étiquette interne dédiée** (« batteries surveillées »).

## Règles de fonctionnement

### Sélection des batteries surveillées

<!-- source: jinja:battery_functions.jinja:monitored_batteries_entity_ids -->

La liste des batteries à surveiller est constituée de :

- toutes les **mesures de niveau de batterie** des **appareils** portant l'étiquette « batteries surveillées »,
- complétée par les **capteurs individuels** portant la même étiquette.

### Seuil d'alerte

<!-- source: input_number:battery_alerte_level -->

Un **seuil d'alerte** est paramétré en pourcentage (par défaut **20 %**, ajustable de 1 à 100 %). Les batteries dont le niveau passe sous ce seuil sont considérées comme **faibles**.

### Compteur et liste des batteries faibles

<!-- source: template:sensor:number_battery_under_level, jinja:battery_functions.jinja:monitored_batteries_bellow_level -->

La maison expose un **compteur de batteries faibles**, et fournit en attribut :

- la **liste des entités** correspondantes,
- le **seuil d'alerte** courant,
- un **message synthétique** :
    - « Toutes la batteries ont un niveau normales » s'il n'y en a aucune,
    - sinon « _N_ batterie(s) faible(s) : » suivi de la liste détaillée (nom et niveau actuel).

### Indicateur global de problème

<!-- source: template:binary_sensor:battery_problem_global -->

Un indicateur **« Problème batteries »** s'allume si **au moins une batterie surveillée** est :

- **sous le seuil**,
- **ou indisponible** (état inconnu ou non joignable).

Pour éviter les fausses alertes liées à des micro-coupures de communication, la bascule est temporisée :

- l'indicateur passe à **actif** seulement après **10 minutes** consécutives de problème,
- il revient à **inactif** après **1 minute** consécutive sans problème.

L'indicateur expose en attribut la liste des batteries **faibles** (avec leur niveau) et la liste des batteries **indisponibles** (avec leur nom).

### Alerte sur batterie faible

<!-- source: alert:low_battery_alert -->

Tant que l'indicateur global est actif, la maison envoie une **alerte** détaillant les batteries faibles :

- **répétition** : toutes les **24 heures** (1440 minutes),
- **acquittement possible**,
- la **première occurrence est sautée** (l'alerte n'est envoyée qu'après une première confirmation),
- canal de notification : la voie « notify » par défaut de la maison.

À la résolution, un message « Toutes la batteries sont de nouveau normales » est émis.
