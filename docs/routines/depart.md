<!-- source: package:packages/routines/away.yaml, package:packages/routines/scripts.yaml -->

# Routine de départ

## But

Mettre la maison en sécurité et en mode économique dès que **plus personne n'y est présent**. La routine couvre la fermeture, l'extinction et la mise hors tension des équipements, ainsi que l'adaptation du chauffage. Elle gère également un sous-mode **absence longue** pour les départs de plusieurs jours, et orchestre la **préparation du retour**.

## Déclenchement

<!-- source: automation:routine_detect_away, input_boolean:away_mode -->

Le mode absence s'active dans deux cas :

- **automatiquement**, lorsque la maison constate qu'**aucun occupant n'est présent depuis 10 minutes**, à partir de l'indicateur global de présence (voir [présence](../fonctions/presence.md)),
- **manuellement**, via une action **« Depart Maison »** disponible sur les téléphones des occupants.

Le mode absence ne s'active pas si :

- le **mode invité** est actif,
- la maison est **déjà en mode absence**.

## Détection du retour

<!-- source: automation:routine_detect_home -->

Le mode absence se désactive dans deux cas :

- **automatiquement**, dès qu'un des occupants est de nouveau localisé à la maison,
- **manuellement**, via une action **« Retour Maison »** disponible sur les téléphones des occupants.

La désactivation ne se produit que si le mode absence est actuellement actif.

## Déroulé du départ

<!-- source: automation:routine_away, script:routine_away -->

À l'activation du mode absence, la maison envoie un message **« Au revoir »** sur le téléphone de Sébastien, puis exécute en parallèle les actions ci-dessous. Les actions sont menées en parallèle et tolèrent qu'un appareil isolé ne réponde pas — la routine ne s'interrompt pas pour autant.

### Extinction des éclairages

<!-- source: script:routine_all_light_turn_off -->

Les éclairages des pièces suivantes sont éteints : bureau, chambre des parents, chambre de Timothée, chambre d'Émilie, chambre d'amis, couloir étage, cuisine, entrée, vestibule, salle à manger, salle de bain, salle de douche, toilettes du rez-de-chaussée, toilettes de l'étage, mezzanine, piscine, garage, buanderie, salon, et les éclairages extérieurs (jardin avant, jardin arrière, parking).

### Arrêt de la lecture média

<!-- source: script:routine_all_media_player_off -->

La lecture est arrêtée sur les enceintes du salon, et sur celles présentes dans : bureau, chambre de Timothée, chambre d'Émilie, cuisine, salle de bain, salle de douche, salle à manger, chambre des parents.

### Mise hors tension des appareils électriques

<!-- source: script:routine_away_all_power_device_off -->

La maison coupe les prises pilotées portant les étiquettes internes **« coupable la nuit »** et **« coupable en absence »**.

Pour trois équipements à risque (imprimante 3D, machine à laver, sèche-linge), la maison **n'éteint pas brutalement** mais déclenche une procédure d'attente : la coupure se fait quand l'équipement n'a plus consommé d'énergie significative pendant la durée prévue.

### Fermeture des volets

<!-- source: script:routine_all_cover_close -->

Les volets sont fermés dans les pièces suivantes : cuisine, salon, salle à manger, chambre des parents, chambre de Timothée, chambre d'Émilie, chambre d'amis. Le volet de la baie du rez-de-chaussée est fermé en plus.

### Fermeture des portes de garage

<!-- source: script:routine_all_garage_door_close -->

Les **trois portes de garage** sont fermées.

### Verrouillage des serrures

<!-- source: script:routine_all_lock_lock -->

Les serrures connectées de l'**entrée** et de la **cuisine** sont verrouillées. Le verrouillage utilise une procédure avec **réessai** en cas d'échec ponctuel (voir [reprise après échec](../fonctions/reprise-apres-echec.md)).

### Adaptation du chauffage

<!-- source: script:routine_climate_away -->

Le thermostat central passe en mode **absence**, et le chauffage d'appoint mobile est éteint. Détails dans la fonction [chauffage](../fonctions/chauffage.md).

### Réglages d'absence

<!-- source: script:routine_away_settings -->

Quatre commutateurs liés à la routine des enfants sont remis à zéro :

- les deux **couvre-feux** des chambres d'Émilie et Timothée,
- les deux **modes nuit** d'Émilie et Timothée.

### Réinitialisation des réglages d'éclairage

<!-- source: script:routine_reset_lightning_settings -->

La maison :

- **désactive** les commutateurs de neutralisation d'éclairage automatique du salon (mode TV), de la salle à manger, du bureau, de la cuisine et du jardin,
- **réactive** l'adaptation automatique de la lumière dans toutes les zones configurées (chambre Émilie, chambre des parents, chambre de Timothée, couloir de l'étage, cuisine, ensemble par défaut, entrée, salle à manger, salle de douche, salon).

### Passage de l'aspirateur robot

<!-- source: automation:1618666809324 -->

À **midi**, si la maison est en mode absence, la maison déclenche le passage de l'**aspirateur robot** Roborock S7. Une notification est envoyée sur le téléphone de Sébastien :

> Roomba - Lancement auto

Cette action n'est pas dans la séquence de départ : elle se déclenche seulement à 12h00, en parallèle, tant que le mode absence reste actif.

## Absence longue

<!-- source: automation:routine_long_absence, input_boolean:long_absence_mode -->

Le mode **absence longue** s'active dans deux cas :

- **automatiquement**, si le mode absence reste actif **24 heures consécutives**,
- **manuellement**, via le commutateur dédié.

À l'activation, la maison :

- envoie une notification **« Mode absence longue actif »** sur le téléphone de Sébastien,
- bascule le thermostat central en mode **hors gel** (voir [chauffage](../fonctions/chauffage.md)).

## Préparation du retour

<!-- source: automation:routine_prepare_home, input_datetime:long_absence_return_date, script:routine_prepare_home -->

La préparation du retour s'enclenche dans deux cas :

- la **date de retour** renseignée dans le champ dédié arrive,
- le commutateur de **mode absence longue** est désactivé manuellement.

Cette préparation n'a lieu que si le mode absence est encore actif et que l'absence longue était engagée.

À l'activation, la maison :

- désactive le mode absence longue,
- envoie une notification **« Je prépare la maison »** sur le téléphone de Sébastien,
- bascule le thermostat central en mode **planification** (consigne maison habituelle).

Le mode absence reste actif. Il faudra que le retour soit détecté ou déclenché manuellement pour le désactiver.

## Déroulé du retour

<!-- source: automation:routine_home, script:routine_back_home -->

À la désactivation du mode absence, la maison désactive également le mode absence longue par sécurité, envoie un message **« Bienvenue à la maison »** sur le téléphone de Sébastien, puis exécute en parallèle :

### Réalimentation des appareils

<!-- source: script:routine_all_power_device_on -->

La maison réalimente les prises portant l'étiquette interne **« à allumer par défaut »**. Une nuance liée à l'**électricité Tempo** :

- si la **journée Tempo en cours est rouge** **et** que l'on est en **heure pleine**, la maison **n'allume pas** les prises portant en plus l'étiquette **« à couper en jour rouge »**,
- dans tous les autres cas, toutes les prises « à allumer par défaut » sont rallumées.

Voir [tarif Tempo](../fonctions/tarif-tempo.md).

Trois scripts d'attente (imprimante 3D, machine à laver, sèche-linge) sont arrêtés (au cas où une procédure d'extinction différée serait encore en cours).

### Déverrouillage des serrures

<!-- source: script:routine_all_lock_unlock -->

Les serrures connectées de l'**entrée** et de la **cuisine** sont déverrouillées, avec procédure de **réessai** en cas d'échec.

### Adaptation du chauffage

<!-- source: script:routine_climate_home -->

Le thermostat central repasse en mode **planification** (consigne maison habituelle). Le chauffage d'appoint mobile **n'est pas rallumé** automatiquement.

### Ouverture des volets si le soleil est levé

<!-- source: script:routine_all_cover_open -->

Si le **soleil est au-dessus de l'horizon**, les volets des pièces suivantes sont ouverts : cuisine, salon, salle à manger, chambre des parents, chambre de Timothée, chambre d'Émilie, chambre d'amis. Le volet de la baie du rez-de-chaussée est ouvert en plus.

Si le soleil est sous l'horizon, **aucun volet n'est ouvert** au retour.

## Pièces et fonctions impliquées

- [Présence](../fonctions/presence.md) — détection du départ, du retour, du mode invité.
- [Chauffage](../fonctions/chauffage.md) — bascules de mode du thermostat central et du chauffage d'appoint.
- [Éclairage](../fonctions/eclairage.md) — extinction et réinitialisation des réglages.
- [Notifications](../fonctions/notifications.md) — messages de départ, retour, absence longue, préparation.
- [Tarif Tempo](../fonctions/tarif-tempo.md) — gating des prises au retour.
- [Reprise après échec](../fonctions/reprise-apres-echec.md) — verrouillage et déverrouillage des serrures.
