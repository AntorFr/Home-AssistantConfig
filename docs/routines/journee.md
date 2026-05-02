<!-- source: package:packages/routines/day.yaml, package:packages/routines/scripts.yaml -->

# Routine de la journée

## But

Faire évoluer la maison en suivant le **rythme de la journée** : réveil, aurore, matin, après-midi, soirée, retour au calme avant le coucher des enfants, coucher des enfants, nuit. Chaque phase déclenche un ensemble cohérent d'actions et de réglages.

## Phases de la journée

<!-- source: input_select:day_phase -->

La maison expose une **phase de la journée** courante, qui prend l'une des huit valeurs suivantes :

1. **Aurore** — réveil très matinal d'un occupant
2. **Matin - reveil enfants** — heure de réveil des enfants
3. **Matin** — journée commencée pour la maison
4. **Après-midi** — bascule de l'après-midi
5. **Soirée** — bascule du début de soirée
6. **Soirée - retour au calme** — début du rituel du coucher des enfants
7. **Soirée - enfants couché** — les enfants sont au lit
8. **Nuit** — la maison dort

La phase peut être changée **manuellement**. Tout changement de phase, automatique ou manuel, **déclenche un événement** que les autres parties de la maison utilisent pour s'adapter (par exemple les veilleuses des enfants, voir [routines des enfants](enfants.md)).

## Paramètres horaires

<!-- source: input_datetime:morning_time, input_datetime:morning_time_we, input_datetime:afternoon_time, input_datetime:evening_time, input_datetime:evening_time_we, input_datetime:children_morning_time, input_datetime:children_morning_time_we, input_datetime:children_evening_ritual_time, input_datetime:children_evening_ritual_time_we, input_datetime:children_night_time, input_datetime:children_night_time_we, input_datetime:children_curfew_emilie, input_datetime:children_curfew_we_emilie, input_datetime:children_curfew_timothee, input_datetime:children_curfew_we_timothee -->

Plusieurs horaires sont configurables, avec une **version semaine** et une **version week-end** distinctes :

- heure du **matin** (passage en phase Matin),
- heure du **réveil des enfants**,
- heure de l'**après-midi**,
- heure du **début de soirée**,
- heure du **retour au calme** (rituel du coucher des enfants),
- heure du **coucher des enfants**,
- heure du **couvre-feu d'Émilie**,
- heure du **couvre-feu de Timothée**.

La maison choisit la version **semaine** ou **week-end** selon le **statut du lendemain** : version semaine si demain est un jour travaillé non vacances, version week-end sinon.

## Bascules automatiques

### Après-midi

<!-- source: automation:routine_after-noon -->

À l'heure de l'après-midi, **si la maison n'est pas en mode absence**, elle passe en phase **« Après-midi »**.

### Début de soirée

<!-- source: automation:routine_evening -->

À l'heure de soirée correspondant au statut du lendemain (semaine si demain est travaillé, week-end sinon), si la maison n'est pas en mode absence :

- la phase passe à **« Soirée »**,
- l'**adaptation automatique de la salle à manger** est désactivée (pour ne pas perturber la lumière du dîner).

### Retour au calme (rituel du coucher des enfants)

<!-- source: automation:routine_children_evening_ritual, script:routine_children_cover_workday -->

À l'heure de retour au calme correspondant au statut du lendemain (jour scolaire ou non), si la maison n'est pas en mode absence :

- la phase passe à **« Soirée - retour au calme »**,
- en **semaine d'école**, les **volets des chambres des enfants** sont fermés. En vacances ou en week-end, les volets ne sont pas fermés à ce moment.

### Coucher des enfants

<!-- source: automation:routine_children_night -->

À l'heure de coucher des enfants, si la maison n'est pas en mode absence :

- la phase passe à **« Soirée - enfants couché »**,
- les **modes nuit** des chambres d'Émilie et de Timothée sont **activés**,
- l'**adaptation automatique de la salle à manger** est **réactivée**,
- le **mode sommeil de l'éclairage** du couloir de l'étage est **activé** (l'adaptation y descend à intensité minimale).

### Couvre-feu individuel

<!-- source: automation:routine_emilie_curfew, automation:routine_timothee_curfew -->

À l'heure de couvre-feu d'**Émilie**, son **commutateur de couvre-feu** est activé. Idem pour **Timothée**, indépendamment, à son propre horaire.

Ce commutateur peut être levé temporairement par la fonction de [musique douce](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant), puis remis en place à l'arrêt de la musique douce.

### Réveil des enfants

<!-- source: automation:routine_children_morning -->

À l'heure de réveil des enfants, si la maison n'est pas en mode absence et que les conditions de jour scolaire sont remplies :

- les **couvre-feux** d'Émilie et de Timothée sont **désactivés**,
- les **modes nuit** des deux enfants sont **désactivés**,
- la phase passe à **« Matin - reveil enfants »**.

## Mode nuit

<!-- source: input_boolean:night_mode -->

La maison expose un commutateur **« Mode nuit »** distinct de la phase. C'est lui qui pilote les actions du coucher et du lever.

### Détection automatique du coucher

<!-- source: automation:routine_detect_night -->

Le mode nuit s'active automatiquement dans les cas suivants, à condition que la maison ne soit pas en mode absence et que le mode nuit ne soit pas déjà actif :

| Source | Détail |
|---|---|
| **Détection probabiliste de sommeil** | l'indicateur de [sommeil détecté](../fonctions/presence.md#détection-du-sommeil) reste actif pendant **30 minutes**, **et** il est entre **22h et 6h** |
| **Filet de sécurité** | déclenchement automatique à **3h00** si le mode nuit n'a pas été enclenché entre 22h et 3h |
| **Action « Sleep »** depuis un téléphone | déclenchement manuel sans contrainte horaire |

### Détection automatique du matin

<!-- source: automation:routine_detect_morning -->

Le mode nuit se désactive automatiquement, à condition que la maison ne soit pas en mode absence et que le mode nuit soit actif :

| Source | Condition |
|---|---|
| **Activité détectée** dans la maison | l'heure courante est comprise entre l'heure du matin moins 1 heure et 18h00 (l'heure du matin utilisée dépend du jour : version semaine en jour scolaire, version week-end sinon) |
| **Heure du matin** atteinte | en semaine si la journée est un jour scolaire ; en week-end si la journée n'est pas un jour scolaire |
| **Action « Wake-up »** depuis un téléphone | sans contrainte horaire |

### Aurore

<!-- source: automation:routine_detect_aurore -->

Quand une activité est détectée dans la maison entre **5h00 et 6h29**, à condition que la maison soit en mode absence inactif **et** en mode nuit, la routine **« Aurore »** est déclenchée. Elle ne désactive pas le mode nuit (ce sera la routine du matin classique qui s'en chargera).

## Déroulé du coucher

<!-- source: automation:routine_night, script:routine_sleep_mode -->

Quand le mode nuit s'active, la maison :

- passe en phase **« Nuit »**,
- envoie un message **« Bonne nuit »** sur le téléphone de Sébastien,
- exécute en parallèle :
    - extinction des éclairages (variante nuit, qui laisse le sapin allumé en mode Noël et n'éteint pas la chambre d'amis si le mode invité est actif),
    - arrêt de la lecture sur l'ensemble des enceintes,
    - mise hors tension des prises portant l'étiquette « à couper la nuit » (avec attente fin d'impression 3D si nécessaire),
    - extinction de la couverture chauffante des deux occupants si elle est étiquetée à couper la nuit,
    - fermeture des volets (variante nuit),
    - fermeture des portes de garage,
    - verrouillage des serrures,
    - **réglages de nuit** : extinction de la lumière d'écoute du panneau d'assistant vocal de la chambre des parents,
    - réinitialisation des réglages d'éclairage (kill switches désactivés, adaptation automatique réactivée),
    - **mise en mode sommeil de l'éclairage** : activation du mode sommeil de l'adaptation automatique pour cuisine, salle à manger, salon, entrée, ensemble par défaut, couloir étage, salle de douche, chambre des parents.

## Déroulé du matin

<!-- source: automation:routine_morning, script:routine_matin -->

Quand le mode nuit se désactive, la maison :

- passe en phase **« Matin »**,
- envoie un message **« Bonjour »** sur le téléphone de Sébastien,
- exécute en parallèle :
    - **désactivation du mode sommeil de l'éclairage** (mêmes pièces que la mise en sommeil),
    - allumage du sapin de Noël si le mode Noël est actif,
    - réalimentation des prises **« à allumer par défaut »** (avec gating Tempo Rouge HP, voir [tarif Tempo](../fonctions/tarif-tempo.md)),
    - **réglages du jour** : activation de la lumière d'écoute du panneau d'assistant vocal de la chambre des parents,
- si le **soleil est levé** (entre lever de soleil moins 30 minutes et coucher de soleil), les **volets** sont ouverts (variante matin, qui n'ouvre pas la chambre d'amis si le mode invité est actif).

## Déroulé de l'aurore

<!-- source: script:routine_aurore -->

Quand la routine d'aurore se déclenche, la maison :

- passe en phase **« Aurore »**,
- envoie un message **« Bonjour, pas trop dure ? »** sur le téléphone de Sébastien,
- désactive le mode sommeil de l'éclairage (mêmes pièces que ci-dessus).

Le mode nuit reste actif. Le passage en mode jour normal se fera plus tard, par la routine du matin.

## Volets liés au soleil

<!-- source: automation:routine_sunset, automation:routine_sunrise -->

Indépendamment des phases de la journée :

- **30 minutes avant le lever du soleil**, les **volets du matin sont ouverts**, à condition que la maison ne soit pas en absence et que le mode nuit soit inactif (les volets concernés sont ceux des pièces de vie du rez-de-chaussée et la chambre d'amis si elle n'est pas occupée par un invité).
- **15 minutes après le coucher du soleil**, les **volets de nuit sont fermés** (toutes les pièces équipées hors chambre d'amis si invité, ainsi que la baie du rez-de-chaussée), à condition que la maison ne soit pas en absence **et** que la **température extérieure soit inférieure à 20 °C**. Au-delà de ce seuil, les volets ne sont pas fermés automatiquement le soir (laisser entrer la fraîcheur en été).

## Commandes vocales et scènes

<!-- source: intent:NightModeOn, intent:WakeUpModeOn, scene:scene_good_night -->

Plusieurs entrées manuelles permettent de basculer le mode nuit :

- commande vocale **« bonne nuit »** ou équivalente : active le mode nuit (réponse parlée : « très bien, passez une Bonne nuit »),
- commande vocale **« bonjour »** ou équivalente : désactive le mode nuit (réponse parlée : « Bonjour ! c'est partie pour une nouvelle journée »),
- scène **« Bonne nuit »** : active le mode nuit (équivalent script).

Les phrases vocales exactes reconnues sont récapitulées dans [commandes vocales](../fonctions/commandes-vocales.md#routines-de-la-journée).

## Pièces et fonctions impliquées

- [Présence](../fonctions/presence.md) — détection de sommeil et d'activité utilisée pour les bascules automatiques.
- [Éclairage](../fonctions/eclairage.md) — modes sommeil par pièce, kill switches, adaptation automatique.
- [Système de sécurité](../fonctions/alarme-systeme-securite.md) — armement nuit au passage en mode nuit.
- [Vacances scolaires](../fonctions/vacances-scolaires.md) — détermine la version « semaine » ou « week-end » des horaires.
- [Routines des enfants](enfants.md) — réagissent aux événements de phase pour les veilleuses.
- [Tarif Tempo](../fonctions/tarif-tempo.md) — gating des prises au matin.
- [Notifications](../fonctions/notifications.md) — messages de bonjour, bonne nuit, aurore.
