<!-- source: blueprint:antorfr/clim_scheduler.yaml, package:packages/areas/chambre_emilie.yaml, package:packages/areas/chambre_timothee.yaml, package:packages/areas/chambre_amis.yaml -->

# Climatisation des chambres

## But

Garder les chambres climatisées confortables : fraîches au moment du coucher, sans surconsommer le reste du temps. La maison rafraîchit chaque chambre juste avant l'heure du coucher, puis laisse la température remonter doucement pendant la nuit.

## Périmètre

Trois chambres disposent d'un climatiseur piloté automatiquement :

- la chambre d'[Émilie](../pieces/chambre-emilie.md),
- la chambre de [Timothée](../pieces/chambre-timothee.md),
- la chambre d'[amis](../pieces/chambre-amis.md).

Ces climatiseurs ne font que **rafraîchir** : ils ne chauffent jamais. Le chauffage des chambres est assuré séparément (voir [chauffage](chauffage.md)).

## Règles de fonctionnement

<!-- source: blueprint:antorfr/clim_scheduler.yaml -->

Chaque chambre suit le même déroulé au fil de la journée :

| Moment | Température visée | Effet |
|---|---|---|
| Journée et nuit | **28 °C** maximum | La chambre est rafraîchie seulement si elle dépasse 28 °C. |
| Avant l'heure du coucher (avance adaptative) | **25 °C** | La chambre est pré-refroidie pour être fraîche à l'heure du coucher. |
| À partir de l'heure du coucher | **28 °C** maximum | La climatisation cesse de rafraîchir : la température remonte lentement et se stabilise à 28 °C au plus. |

Le rafraîchissement ne se déclenche que lorsque la température de la pièce dépasse la consigne du moment ; en dehors des périodes chaudes, le climatiseur reste donc à l'arrêt.

### Avance de pré-refroidissement adaptative

<!-- source: blueprint:antorfr/clim_scheduler.yaml -->

Le moment où débute le pré-refroidissement n'est pas fixe : il **dépend de la température de la chambre**. Plus la pièce est chaude au regard de l'objectif de 25 °C, plus la climatisation s'y prend tôt ; si la pièce est déjà proche de 25 °C, elle démarre au dernier moment. L'avance est estimée à partir de l'écart de température (environ **20 minutes par degré** à retirer), avec une avance d'au moins **15 minutes** et d'au plus **3 heures**. Le but est d'atteindre 25 °C pile à l'heure du coucher sans rafraîchir plus longtemps que nécessaire.

### Heure du coucher retenue

<!-- source: package:packages/areas/chambre_emilie.yaml, package:packages/areas/chambre_timothee.yaml -->

Pour les chambres d'Émilie et de Timothée, l'heure du coucher utilisée pour le pré-refroidissement est l'**heure de coucher des enfants** définie dans la routine de la [journée](../routines/journee.md). Deux réglages existent :

- l'heure des soirs de semaine,
- l'heure des veilles de vacances scolaires ou de week-end.

La maison choisit automatiquement l'heure applicable selon que **le lendemain est un jour d'école ou non**.

<!-- source: package:packages/areas/chambre_amis.yaml, input_datetime:night_time, input_datetime:night_time_we -->

Pour la chambre d'amis, l'heure du coucher retenue est l'**heure de nuit de la maison** définie dans la routine de la [journée](../routines/journee.md) : un couple d'heures (une pour les veilles de jour d'école, une pour les veilles de vacances ou de week-end), avec le même choix automatique selon que le lendemain est travaillé ou non. Valeurs par défaut : **22 h 30** en semaine, **23 h 30** les veilles de repos.

## Cas particuliers

### Chambre d'amis : uniquement en présence d'invités

<!-- source: package:packages/areas/chambre_amis.yaml -->

Le climatiseur de la chambre d'amis n'est piloté que lorsque le **mode invité** est actif. En l'absence d'invité, il est **coupé**.

### Absence

<!-- source: package:packages/areas/chambre_emilie.yaml, package:packages/areas/chambre_timothee.yaml, package:packages/areas/chambre_amis.yaml -->

Quand la maison est en **mode absence**, les climatiseurs des chambres sont **coupés**. Ils reprennent leur fonctionnement automatique au retour.

### Reprise en main manuelle

<!-- source: package:packages/areas/chambre_emilie.yaml, package:packages/areas/chambre_timothee.yaml, package:packages/areas/chambre_amis.yaml -->

La régulation automatique d'une chambre peut être **désactivée** pièce par pièce. Une fois désactivée, la maison ne touche plus au climatiseur de cette chambre, qui reste alors entièrement sous contrôle manuel jusqu'à réactivation.

## Utilisée par

- la chambre d'[Émilie](../pieces/chambre-emilie.md),
- la chambre de [Timothée](../pieces/chambre-timothee.md),
- la chambre d'[amis](../pieces/chambre-amis.md).

S'appuie sur les heures de coucher de la routine de la [journée](../routines/journee.md), sur le [mode invité](presence.md) et sur le mode absence de la fonction [présence](presence.md).
