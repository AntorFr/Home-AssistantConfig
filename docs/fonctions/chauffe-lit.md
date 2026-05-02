<!-- source: package:packages/functions/bed_heater.yaml -->

# Chauffe-lit

## But

Préchauffer le lit en soirée quand il fait froid dehors et que les occupants sont à la maison, et garantir une extinction automatique pour ne pas laisser la couverture chauffante allumée toute la nuit.

## Périmètre

Deux couvertures chauffantes : celle de **Sébastien** et celle de **Laurine**.

## Règles de fonctionnement

### Allumage automatique en soirée

<!-- source: automation:function_bedheater_evening_turnon -->

Tous les soirs à **22h05**, la maison vérifie deux conditions :

- le mode absence est **inactif**,
- la **température extérieure** est **inférieure à 17 °C**.

Si les deux sont vraies :

- la couverture chauffante de **Sébastien** est allumée s'il est **à la maison**,
- la couverture chauffante de **Laurine** est allumée si elle est **à la maison**.

### Extinction automatique après 2 heures

<!-- source: automation:function_bedheater_turnoff_seb, automation:function_bedheater_turnoff_laurine -->

Chaque couverture chauffante s'éteint automatiquement après **2 heures consécutives** d'allumage, indépendamment de la cause de l'allumage.

## Utilisée par

- la fonction [réveil](reveil.md) — utilise la couverture chauffante de Sébastien comme dispositif de réveil progressif en semaine,
- la routine de [départ](../routines/depart.md) — coupe les couvertures chauffantes au passage en mode absence.
