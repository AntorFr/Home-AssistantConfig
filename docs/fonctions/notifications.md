<!-- source: package:packages/functions/notification.yaml, jinja:room_functions.jinja, jinja:music_functions.jinja -->

# Notifications

## But

Faire passer un message — texte sur téléphone, voix dans une pièce, signal lumineux ou sonore — en choisissant un canal adapté au destinataire et à la situation.

## Périmètre

La fonction couvre :

- les **messages adressés à une personne** (annonce vocale dans une pièce ou message sur téléphone selon les cas),
- les **annonces dans une pièce** (TTS sur l'enceinte de la pièce, bascule téléphone si la pièce est vide),
- les **alertes lumineuses** (clignotement rouge sur des éclairages désignés),
- les **alertes sonores** (son court diffusé sur des enceintes en mode annonce),
- les **annonces planifiées** : départ de transport, repas.

Cette page ne décrit pas le **mode silence** (« quiet mode ») dans le détail — il s'agit d'une convention transverse, présentée ci-dessous.

## Mode silence d'une pièce

<!-- source: jinja:room_functions.jinja:is_area_in_quiet_mode -->

Une pièce peut être placée en **mode silence** par un commutateur logique. Le mode silence est détecté de la façon suivante :

- si un **mode silence global** est actif (commutateur sans pièce associée), toutes les pièces sont considérées en silence,
- sinon, une pièce est en silence si son **propre commutateur de silence** est actif.

Le mode silence supprime toutes les annonces vocales **destinées** à la pièce concernée.

## Règles de fonctionnement

### Message à une personne

<!-- source: script:sayto, intent:SayTo -->

Quand la maison s'adresse à **une personne précise**, elle choisit le canal selon la table suivante :

| Personne | Condition | Canal |
|---|---|---|
| Émilie | sa chambre n'est pas en mode silence | annonce vocale dans sa chambre |
| Émilie | sa chambre est en mode silence | **aucun message délivré** |
| Timothée | sa chambre n'est pas en mode silence | annonce vocale dans sa chambre |
| Timothée | sa chambre est en mode silence | **aucun message délivré** |
| Sébastien | il est à la maison **et** la pièce où il se trouve n'est pas en silence | annonce vocale dans cette pièce |
| Sébastien | tous les autres cas (pas à la maison, ou pièce en silence) | message sur son téléphone |
| Laurine | dans tous les cas | message sur son téléphone |

La pièce où se trouve Sébastien est déterminée par un capteur dédié à sa localisation interne à la maison.

Cette règle est aussi accessible par commande vocale (« dis à Émilie que… »).

### Annonce dans une pièce

<!-- source: script:room_tts_notify -->

Une annonce ciblant **une pièce** plutôt qu'une personne :

- si la pièce a une **présence active** **et** dispose d'une **enceinte associée**, le message est joué en TTS sur cette enceinte,
- sinon, le message est envoyé en notification sur le **téléphone de Sébastien**.

L'enceinte associée à une pièce et son capteur de présence sont définis par étiquette interne.

### Alerte lumineuse

<!-- source: script:light_notify_red_alarm, script:light_notify_stop -->

Pour signaler une situation à attention immédiate, la maison fait clignoter les éclairages désignés selon les paramètres suivants :

- **couleur** : rouge,
- **effet** : respiration (« breathe »),
- **intensité** : 100 %,
- **vitesse de l'effet** : 60.

L'arrêt est explicite : la maison **éteint** les éclairages concernés.

### Alerte sonore

<!-- source: script:sound_notify -->

La maison joue un fichier sonore désigné sur une ou plusieurs enceintes, en mode **annonce** : la lecture en cours sur les enceintes est temporairement interrompue puis reprend.

### TTS sur enceinte Sonos avec sauvegarde / restauration

<!-- source: script:sonos_say -->

Pour les enceintes Sonos, une variante d'annonce :

1. **enregistre** l'état courant de l'enceinte (« snapshot »),
2. la **dégroupe** d'éventuels groupes,
3. **fixe** le volume à la valeur fournie,
4. **prononce** le message via le TTS,
5. **attend** une durée fournie par l'appelant,
6. **restaure** l'état initial de l'enceinte.

### Annonce de départ pour un événement

<!-- source: script:bus_time_warning -->

À l'approche d'un horaire de calendrier, la maison annonce sur les enceintes désignées :

- si la différence entre l'heure de l'événement et l'heure courante est **inférieure à une minute** : « **c'est l'heure du** _\<intitulé>_ »,
- sinon : « _\<intitulé>_ **dans X minutes** » (X arrondi à la minute).

Le message est précédé d'un **jingle court** (sonnerie SNCF) et diffusé à **volume 0,40** (sur une échelle de 0 à 1).

### Annonce « À table »

<!-- source: script:lunchtime, intent:LunchTime -->

Une annonce dédiée prévient les enfants et un éventuel parent au bureau qu'il est l'heure de manger :

- diffusion **systématique** dans la **chambre d'Émilie** et dans la **chambre de Timothée**,
- diffusion **dans le bureau** uniquement si une présence y est détectée,
- précédée d'un **son court** d'intercom,
- voix synthétique « EloiseNeural » via le TTS cloud,
- **volume 0,40**,
- message : « À table. ».

Cette annonce est aussi accessible par commande vocale.

## Cas particuliers

- **Mode silence global** : si le mode silence global est activé, toutes les annonces vocales sont supprimées, dans toutes les pièces.
- **Aucune annonce ne tombe en pièce vide** sans bascule téléphone : pour les annonces destinées aux enfants, il n'y a pas de bascule vers un téléphone — si la pièce est en silence, le message n'est pas délivré.

## Utilisée par

- la routine de [départ](../routines/depart.md) (messages de départ, retour, absence longue, préparation),
- les [routines des enfants](../routines/enfants.md) (annonces de bus, repas, coucher),
- les pages des [pièces](../pieces/) qui exposent un déclencheur de notification (commande vocale, bouton « À table »).
