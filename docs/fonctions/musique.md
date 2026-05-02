<!-- source: package:packages/functions/music_manager.yaml, jinja:music_functions.jinja, jinja:room_functions.jinja -->

# Musique

## But

Diffuser de la musique sur les enceintes des pièces, soit sur instruction explicite (titre demandé, étiquettes choisies), soit selon une **ambiance par défaut** propre à chaque pièce et au moment de la journée.

## Périmètre

La fonction couvre :

- la **lecture, l'arrêt, la pause, la reprise** dans une ou plusieurs pièces, avec variantes basculées,
- le **groupement automatique** des enceintes quand plusieurs pièces sont visées,
- la **musique douce** dans les chambres d'enfants au coucher,
- la **lecture par scan d'étiquette physique** dans les chambres d'enfants,
- le **rafraîchissement** automatique des sélecteurs de morceaux par pièce,
- l'**adaptation automatique du volume** de l'enceinte du salon selon la source en cours.

## Règles de fonctionnement

### Choix du morceau

<!-- source: script:play_mood_music -->

Trois modes, dans l'ordre de priorité :

1. **Par titre** — si un titre est fourni explicitement (paramètre ou sélection dans le sélecteur de morceaux d'une pièce), la maison cherche ce titre dans la bibliothèque.
2. **Par étiquettes** — si au moins une étiquette est fournie (propriétaire, ambiance, contexte, genre, moment, tranche d'âge), la maison choisit aléatoirement un titre correspondant.
3. **Par ambiance de pièce** — si rien n'est fourni, la maison applique l'**ambiance par défaut de la pièce** (voir plus bas) et choisit aléatoirement un titre.

#### Mode de repli

Quand aucun titre ne correspond exactement, un mode de repli détermine si la recherche est élargie :

| Repli | Effet |
|---|---|
| `none` | Aucun élargissement. Si rien n'est trouvé, rien n'est joué. |
| `soft` (par défaut) | Élargissement progressif des critères. |
| `aggressive` | Élargissement fort des critères. |
| `force` | Joue un titre du catalogue même sans aucune correspondance. |

#### Étiquettes manipulées

<!-- source: script:play_mood_music -->

Les valeurs des étiquettes acceptées par le moteur de sélection :

| Étiquette | Valeurs |
|---|---|
| Propriétaire | Sébastien, Laurine, Timothée, Émilie, enfants, famille |
| Ambiance | Calme, Concentration, Énergie, Sommeil (« Someil »), chill, focus |
| Contexte | Bain, Cuisine, Travail, Sport |
| Genre | Livre, Récit, ambient, classical, electronic, hip-hop, jazz, pop, rock |
| Moment de la journée | Matin, Après-midi, Soirée, Nuit |
| Tranche d'âge | Adulte, Enfants, Toutes |

### Ambiance par défaut d'une pièce

<!-- source: jinja:music_functions.jinja:music_mood_room -->

Quand aucune étiquette explicite n'est fournie, la pièce détermine elle-même les étiquettes à appliquer.

#### Propriétaire détecté

L'étiquette `owner` est calculée selon les présences :

| Personnes à la maison | Propriétaire utilisé |
|---|---|
| Sébastien et Laurine | famille |
| Sébastien seul | Sébastien |
| Laurine seule | Laurine |
| Aucun des deux | aucun |

#### Bureau

Pour le **bureau** :

- le propriétaire est forcé à **Sébastien** s'il est à la maison ; sinon, le propriétaire général s'applique,
- les étiquettes appliquées dépendent de l'heure :

| Condition | Étiquettes appliquées |
|---|---|
| Jour ouvré **et** heure ≤ 19 h | mood = Concentration, context = Travail |
| Heure ≤ 9 h | mood = Calme |
| Heure ≤ 10 h | mood = chill |
| Avant la fin de soirée | mood = Énergie |
| Après la fin de soirée | mood = Calme |

L'étiquette « not_genre = Récit » est toujours ajoutée pour le bureau (les contenus de type récit sont exclus).

L'« heure de fin de soirée » est définie par un horaire dédié, distinct selon que **demain est un jour travaillé ou non**.

#### Chambres des enfants

| Pièce | Avant l'heure de coucher | Après l'heure de coucher |
|---|---|---|
| Chambre de Timothée | owner = Timothée, age_group = Enfants | owner = Timothée, age_group = Enfants, mood = Sommeil |
| Chambre d'Émilie | owner = Émilie, age_group = Enfants | owner = Émilie, age_group = Enfants, mood = Sommeil |

L'**heure de coucher** est définie par un horaire dédié à chaque enfant, distinct selon que **demain est un jour travaillé ou non**.

#### Toutes les autres pièces

| Condition | Étiquettes appliquées |
|---|---|
| **Mode nuit maison** actif | mood = Sommeil |
| Heure ≤ 9 h | mood = Calme |
| Heure ≤ 10 h | mood = chill |
| Avant la fin de soirée | mood = Énergie |
| Après la fin de soirée | mood = Calme |

L'étiquette « not_genre = Récit » est toujours ajoutée pour ces pièces.

### Choix des enceintes pour une zone

<!-- source: script:play_mood_music, jinja:music_functions.jinja:sonos_in_areas, jinja:music_functions.jinja:mass_in_areas, jinja:music_functions.jinja:sonos_not_playing_tv -->

Quand une zone est demandée :

1. la maison liste d'abord les enceintes **Music Assistant** présentes dans cette zone,
2. s'il n'y en a pas, elle prend les enceintes **Sonos** de la zone, en **excluant celles qui jouent la source TV**,
3. s'il y a **plus d'une enceinte**, elle les **groupe** automatiquement avant la lecture,
4. la lecture est ensuite envoyée :
    - via le service **Music Assistant** si l'enceinte principale est gérée par cette intégration,
    - sinon via le service de lecture média générique.

### Alias de zone « RdC »

<!-- source: script:play_mood_music -->

L'alias **« RdC »** (insensible à la casse) est étendu à la liste : **salon, salle à manger, cuisine**. Il peut être combiné avec d'autres pièces dans la même demande.

### Sélecteurs de morceaux par pièce

<!-- source: input_select:music_browser_salon, automation:music_browser_refresh_lists -->

Chaque pièce qui possède un **sélecteur de morceaux** (un sélecteur dont le nom commence par « Music Browser ») est rafraîchie automatiquement :

- la maison construit, pour la pièce, une **liste de 10 titres** correspondant à son ambiance par défaut courante, avec le mode de repli `force` (le sélecteur n'est jamais vide tant que la bibliothèque contient des titres),
- le rafraîchissement est déclenché à chaque mise à jour des ambiances de pièces,
- la sélection courante est ramenée à la valeur vide après rafraîchissement,
- choisir un titre dans le sélecteur lance ce titre dans la pièce ; la sélection est ensuite ramenée à la valeur vide.

### Annonce de lancement

<!-- source: script:play_mood_music, script:room_tts_notify -->

Quand un titre est lancé, la maison annonce dans la pièce concernée :

> _média \<titre>_ lancé sur _\<noms des enceintes>_

Si la pièce est vide, l'annonce bascule en notification sur le téléphone de Sébastien (voir [notifications](notifications.md)).

### Adaptation automatique du volume du salon

<!-- source: automation:adapte_volume_salon -->

Le volume de l'enceinte du salon s'adapte à la **source** en cours :

- **source télévision** : volume fixé à **0,16**,
- **autre source (musique)** : volume fixé à **0,08**.

Le basculement est automatique à chaque changement de source.

### Modes d'action

<!-- source: script:play_mood_music -->

Outre la lecture, le système accepte les actions suivantes :

| Action | Effet |
|---|---|
| `play_media` (par défaut) | Joue un titre selon les règles de choix décrites plus haut. |
| `media_play` | Reprend la lecture sur les enceintes principales de la zone. |
| `media_pause` | Met en pause les enceintes principales de la zone. |
| `media_stop` | Arrête les enceintes principales de la zone. |
| `play_stop` | Joue si rien ne joue, arrête sinon. |
| `play_pause` | Joue si rien ne joue, met en pause sinon. |

## Cas particuliers

### Musique douce dans une chambre d'enfant

<!-- source: script:chambre_music_douce -->

Une commande dédiée déclenche, dans la chambre d'Émilie ou de Timothée :

1. la **désactivation** du commutateur de couvre-feu de la chambre **s'il était actif**,
2. le lancement d'un titre étiqueté **owner = enfant correspondant** + **mood = Sommeil**, avec **repli `none`** (rien ne joue si aucun titre adapté n'existe),
3. l'**arrêt** de la lecture après une **durée paramétrable** (par défaut **20 minutes**),
4. la **réactivation** du commutateur de couvre-feu **s'il avait été désactivé** par cette commande.

### Lecture par scan d'étiquette

Deux mécanismes coexistent.

#### Mécanisme par appareil

<!-- source: automation:handle_tag_scan -->

Sur les boîtiers de scan associés aux enceintes des chambres d'Émilie et de Timothée, le scan d'une **étiquette pré-enregistrée dans la liste des playlists** déclenche :

- la lecture sur l'enceinte de la chambre du contenu lié à l'étiquette (playlist Spotify, album, podcast, audiobook…),
- la **lecture aléatoire** activée,
- un **délai de 2 secondes** pendant lequel un nouveau scan est ignoré.

#### Mécanisme par étiquette nommée

<!-- source: automation:handle_tag_scan_new -->

Pour certaines étiquettes nommées explicitement (par exemple « Harry Potter à l'École des Sorciers »), le scan déclenche la lecture du contenu associé sur la **première enceinte Music Assistant** de la zone du boîtier scanné, avec un délai de 2 secondes avant le prochain scan.

### Commandes vocales

<!-- source: intent:MusicTurnOn, intent:MusicTurnOff -->

Les commandes vocales **« lance la musique »** et **« arrête la musique »** acceptent un nom de pièce :

- si **aucune pièce** n'est précisée, la commande s'applique au **rez-de-chaussée**,
- si la pièce précisée est **salon ou salle à manger**, la commande est étendue au **rez-de-chaussée**,
- sinon, la commande s'applique à la pièce demandée.

La maison répond en confirmant le titre lancé et la zone concernée. Les phrases reconnues sont récapitulées dans [commandes vocales](commandes-vocales.md#musique).

## Utilisée par

- toutes les [pièces](../pieces/) équipées d'enceintes,
- les [routines des enfants](../routines/enfants.md),
- la fonction [notifications](notifications.md).
