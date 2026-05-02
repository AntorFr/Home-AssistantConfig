# Conventions de rédaction de la documentation

Ce document décrit **comment écrire** la documentation de la maison. Il sert de référence pour toute personne (humain ou assistant IA) qui reprend, complète ou met à jour la doc.

## 1. Objectif de la documentation

La documentation décrit **comment fonctionne la maison**, pas **comment elle est implémentée dans Home Assistant**.

Le lecteur cible est une personne qui :

- ne connaît pas Home Assistant,
- veut comprendre ce que la maison fait, quand, pourquoi, et avec quels effets perceptibles,
- ne lira jamais le code YAML.

Si une phrase n'a de sens que pour quelqu'un qui connaît Home Assistant, elle doit être réécrite ou supprimée.

## 2. Ce qui doit apparaître

- **Comportements observables** : ce qui s'allume, s'éteint, s'ouvre, se déclenche, ce qui est annoncé, notifié, joué.
- **Conditions de déclenchement** exprimées en langage naturel : « lorsqu'il fait nuit », « quand quelqu'un rentre », « si personne n'est présent depuis 10 minutes ».
- **Règles fonctionnelles** : seuils, durées, plages horaires, priorités, exclusions.
- **Liens entre fonctions** : quand une fonction en utilise une autre (ex : la routine du matin appelle la gestion musicale), faire un lien Markdown explicite vers la page concernée.
- **Marques et types d'appareils** quand cela aide à la compréhension : « tondeuse robotisée Husqvarna », « pompe à chaleur Aquarea », « voiture électrique Tesla ». Ce sont des informations factuelles utiles, pas des détails d'implémentation.

## 3. Ce qui ne doit jamais apparaître

- **Identifiants techniques** : `light.salon_principal`, `binary_sensor.presence_couloir`, `automation.xxx`, `input_boolean.xxx`, etc.
- **Noms de fichiers, de packages, de blueprints, de templates Jinja**.
- **Syntaxe YAML, Jinja, ou expressions de templates**.
- **Noms internes Home Assistant** : « trigger », « action », « service call », « state machine », « helper », « package »…
- **Détails de stockage / d'architecture** : MQTT, InfluxDB, intégrations, structure des dossiers.
- **Captures d'écran de l'interface Home Assistant**.

> Règle simple : si un terme n'existerait pas dans une notice rédigée par un installateur domotique pour le propriétaire de la maison, il n'a pas sa place ici.

## 3 bis. Rigueur factuelle (règle absolue)

**La doc ne décrit que ce qui existe réellement dans la configuration.** Aucune inférence, aucune supposition, aucun « probablement », aucun « typiquement », aucune valeur arrondie ou inventée.

Concrètement :

- **Avant d'écrire un comportement, le retrouver dans un fichier de configuration** (package, blueprint, template Jinja). Si le comportement n'est pas trouvé, il n'est **pas documenté**.
- **Toute valeur chiffrée** (durée, seuil, température, plage horaire, pourcentage) doit être recopiée depuis la configuration, pas estimée.
- **Lire l'ensemble des sources concernées** avant d'écrire une page, y compris les blueprints utilisés et les macros Jinja appelées. Si une partie n'a pas été lue, ne pas l'évoquer.
- En cas de doute sur un comportement, **poser la question** plutôt que de combler avec une formulation vague (« la maison choisit elle-même », « selon la situation »).
- Les formulations de type « typiquement », « généralement », « selon la pièce » sont **interdites** quand elles servent à masquer une valeur non vérifiée. Elles ne sont autorisées que lorsqu'elles décrivent fidèlement une logique réellement variable d'un cas à l'autre, et chaque cas doit alors être listé avec sa valeur.

Si une fonctionnalité est partiellement comprise, documenter uniquement la partie comprise et marquer le reste explicitement par un encart **« À documenter »** plutôt que d'inventer.

## 3 ter. Traçabilité vers la configuration

Pour permettre la mise à jour, **chaque bloc fonctionnel documenté doit être traçable** à son origine dans la configuration. Cela passe par des **balises HTML invisibles** placées juste avant le bloc qu'elles concernent. Elles n'apparaissent pas dans le rendu Markdown.

### Format

```markdown
<!-- source: <type>:<id> [, <type>:<id> …] -->
```

`type` est l'un de : `automation`, `script`, `template`, `binary_sensor`, `sensor`, `input_boolean`, `input_select`, `input_datetime`, `group`, `intent`, `blueprint`, `jinja`, `scene`, `customize`, `rest_command`, `sql`, `notify`, `light`, `cover`, `adaptive_lighting`, `package` (pour pointer un fichier complet quand un bloc résume un package entier).

`id` est l'identifiant exact tel qu'il apparaît dans la configuration :

- pour une `automation` : la valeur du champ `id`,
- pour un `script` : la clé du script (sous `script:`),
- pour un `binary_sensor` / `template` / `sensor` / `intent` : son `unique_id` ou sa clé,
- pour un `blueprint` : le chemin relatif (`antorfr/motion_light.yaml`),
- pour une macro `jinja` : `<fichier>.jinja:<nom_macro>`,
- pour un `package` : le chemin relatif (`packages/functions/lights.yaml`).

### Où placer les balises

- **En tête de page**, une balise globale qui liste les packages couverts par la page.
- **Avant chaque section** (titre `##` ou `###`) qui décrit un comportement précis, une balise listant tous les éléments de configuration qui réalisent ce comportement.
- **Avant un tableau ou un paragraphe** quand celui-ci décrit un comportement réalisé par un élément différent de la section englobante.

### Exemple

```markdown
<!-- source: package:packages/routines/away.yaml -->
# Routine de départ

## Déclenchement
<!-- source: automation:routine_detect_away, automation:routine_detect_home -->
La routine s'active automatiquement lorsque…

### Action sur les éclairages
<!-- source: script:routine_all_light_turn_off -->
Tous les éclairages sont éteints…
```

### Conséquences

- Lorsqu'une `id` est renommée, supprimée ou ajoutée dans la configuration, on retrouve **immédiatement** les sections de doc impactées par recherche textuelle.
- Une page sans balises est considérée comme **non vérifiée** et doit être reprise.
- Les balises font partie intégrante du livrable : elles ne sont pas optionnelles.

## 4. Structure du dossier `docs/`

```
docs/
  CONVENTIONS.md        ← ce fichier
  index.md              ← page d'accueil : vue d'ensemble de la maison
  pieces/               ← une page par pièce (ce qui se passe DANS cette pièce)
  routines/             ← scénarios qui couvrent toute la maison ou une famille (matin, départ, nuit…)
  fonctions/            ← comportements transverses utilisés par plusieurs pièces ou routines
                          (éclairage, présence, chauffage, musique, notifications, alarmes…)
```

Pas de section dédiée aux intégrations, aux appareils, aux blueprints ni au système : ces éléments sont des moyens, pas des fonctions de la maison. Leurs effets fonctionnels sont décrits là où ils se manifestent (dans une pièce, une routine ou une fonction transverse).

## 5. Structure type d'une page

Chaque page suit la même trame, adaptée à son objet :

### Page d'une pièce

1. **Présentation** — rôle de la pièce dans la maison, occupants éventuels, particularités (extérieur, étage, sans fenêtre…).
2. **Comportements automatiques** — tout ce que la pièce fait d'elle-même, regroupé par thème (éclairage, climat, sécurité, ambiance…). L'inventaire des éléments pilotés émerge naturellement de la description : un appareil non automatisé n'a pas à figurer.
3. **Rôle dans les scénarios maison** — comment la pièce participe aux routines globales (départ, nuit, vacances…), avec liens vers les routines concernées.
4. **Commandes manuelles disponibles** — ce que l'occupant peut déclencher (interrupteurs physiques, commandes vocales, boutons mobiles), uniquement si pertinent.

### Page d'une routine

1. **But** — quel scénario de vie la routine couvre.
2. **Déclenchement** — conditions qui activent la routine (horaire, présence, événement…).
3. **Déroulé** — séquence des actions et effets, dans l'ordre, en langage clair.
4. **Conditions d'arrêt ou d'exclusion** — quand la routine ne s'exécute pas ou s'interrompt.
5. **Pièces et fonctions impliquées** — liens vers les pages concernées.

### Page d'une fonction transverse

1. **But** — ce que cette fonction garantit pour la maison.
2. **Périmètre** — où elle s'applique (toutes les pièces, certaines, certains occupants…).
3. **Règles de fonctionnement** — conditions, seuils, priorités, plages horaires.
4. **Cas particuliers** — exceptions, modes dégradés, comportements en cas d'absence ou d'invités.
5. **Utilisée par** — liens vers les pièces et routines qui s'appuient sur cette fonction.

## 6. Style rédactionnel

- **Langue** : français, présent de l'indicatif, voix active. « La lumière s'allume » plutôt que « la lumière sera allumée ».
- **Phrases courtes**. Une idée par phrase.
- **Vocabulaire concret** : « il fait nuit », « personne n'est là », « la porte d'entrée s'ouvre ».
- **Pas de jargon** technique ni domotique côté implémentation.
- **Listes à puces** dès qu'on énumère des conditions, des effets ou des appareils.
- **Tableaux** pour les seuils, plages horaires, correspondances entre situations et comportements.

## 7. Liens croisés

La maison est un système où tout est lié. Quand une page mentionne :

- une autre pièce → lien vers `pieces/<piece>.md`,
- une routine → lien vers `routines/<routine>.md`,
- une fonction transverse → lien vers `fonctions/<fonction>.md`.

Utiliser la syntaxe Markdown standard avec chemin relatif :

```markdown
Voir aussi la [routine du départ](../routines/depart.md) et la [gestion de la présence](../fonctions/presence.md).
```

## 8. Mise à jour

À chaque modification fonctionnelle de la maison (nouvelle automatisation, changement de seuil, ajout d'un appareil avec impact perceptible) :

1. Identifier les pages concernées (pièce, routine, fonction transverse).
2. Mettre à jour les sections impactées en conservant le style.
3. Vérifier les liens croisés : une nouvelle dépendance entre fonctions doit être reflétée des deux côtés.
4. Si un comportement disparaît, supprimer sa description plutôt que la barrer.

La doc doit pouvoir être lue indépendamment de l'historique : pas de mention de « avant », « depuis le changement de… », pas de date de modification dans le corps du texte.

## 9. Ce qui n'a pas sa place dans la doc fonctionnelle

- Procédures de maintenance Home Assistant.
- Notes de mise à jour, journal des modifications, TODOs.
- Décisions d'implémentation, comparaisons d'options techniques.
- Diagnostics, erreurs connues, limitations dues aux intégrations.

Ces éléments, s'ils sont utiles, vivent ailleurs (commits Git, README technique, issues), pas dans `docs/`.
