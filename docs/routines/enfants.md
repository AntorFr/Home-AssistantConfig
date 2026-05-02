<!-- source: package:packages/routines/children.yaml -->

# Routines des enfants

## But

Adapter les **veilleuses** des chambres d'Émilie et de Timothée au moment de la journée, et **rappeler à l'oral** l'heure du départ pour l'école.

## Périmètre

Ces routines réagissent aux **phases de la journée** (voir [routine de la journée](journee.md)) plutôt qu'à des horaires propres. Elles ne décident pas elles-mêmes du coucher des enfants — elles s'alignent sur les bascules de phase déclenchées par la journée.

Trois comportements indépendants :

- la **veilleuse de Timothée** (cadre lumineux),
- l'**horloge d'Émilie** (matrice LED),
- les **rappels vocaux** du départ matinal pour l'école.

## Veilleuse de Timothée

<!-- source: automation:routine_daylight_light -->

La veilleuse de la chambre de Timothée évolue selon la phase de la journée :

| Phase déclencheuse | Effet sur la veilleuse |
|---|---|
| Soirée (début de soirée) | allumée à **100 %**, en mode dynamique automatique |
| Soirée - retour au calme | passe à **50 %**, mode dynamique automatique. Si le **plafonnier de la chambre** est allumé, son intensité est ramenée à **30 %** |
| Soirée - enfants couché | passe à **10 %** |
| Nuit (parents couchés) | passe à **8 %** en **rouge fixe** (pour ne pas perturber le sommeil mais permettre un repérage en cas de réveil) |
| Matin - reveil enfants | aucune action |

## Horloge d'Émilie

<!-- source: automation:routine_emilie_clock -->

L'horloge LED de la chambre d'Émilie évolue selon la phase de la journée :

| Phase déclencheuse | Effet sur l'horloge |
|---|---|
| Soirée (début de soirée) | allumée à **100 %** en **orange** |
| Soirée - retour au calme | passe à **50 %** en **rouge**. Si le **plafonnier de la chambre** est allumé, son intensité est ramenée à **10 %** |
| Soirée - enfants couché | passe à **10 %** en **rouge** |
| Nuit (parents couchés) | **éteinte** |
| Matin - reveil enfants | en **jour scolaire uniquement** : allumée à **100 %** en **blanc**. En vacances ou jour non travaillé, l'horloge n'est pas allumée |

L'horloge réagit aussi aux événements de **départ** et de **retour** de la maison, sans action particulière définie pour ces deux événements.

## Rappels vocaux du départ pour l'école

<!-- source: automation:routine_children_bus_time_warning -->

À l'approche d'un événement du **calendrier des notifications du matin**, la maison émet une annonce vocale dans les pièces des enfants et la salle à manger.

Les annonces sont émises à **5 instants** précis avant chaque événement du calendrier :

- **30 minutes** avant,
- **15 minutes** avant,
- **10 minutes** avant,
- **5 minutes** avant,
- **au moment** de l'événement.

Le contenu et le formatage des annonces (« événement dans X minutes » ou « c'est l'heure de l'événement ») sont gérés par la fonction [notifications](../fonctions/notifications.md#annonce-de-départ-pour-un-événement). Les enceintes utilisées sont celles de la **chambre d'Émilie**, de la **chambre de Timothée** et de la **salle à manger**.

## Pièces et fonctions impliquées

- [Routine de la journée](journee.md) — c'est elle qui fait évoluer les phases auxquelles ces routines réagissent.
- [Notifications](../fonctions/notifications.md) — pour les annonces de bus.
- [Musique](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant) — coordination avec le couvre-feu et la musique douce de coucher.
