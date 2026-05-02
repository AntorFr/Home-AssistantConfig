<!-- source: package:packages/areas/jardin.yaml -->

# Jardin

## Présentation

Le jardin est l'espace extérieur de la propriété : **devant** (entrée, parking), **derrière** (terrasse, aire de jeux), et un **patio** intermédiaire. Plusieurs zones distinctes sont surveillées et éclairées indépendamment.

## Comportements automatiques

### Indicateur de température extérieure

<!-- source: template:sensor:Temperature Exterieur -->

La maison expose la **température extérieure** courante, recopiée depuis la station météo locale. Cet indicateur est utilisé par d'autres comportements (par exemple le [chauffe-lit](../fonctions/chauffe-lit.md) ou la fermeture des volets au coucher du soleil dans la routine de la [journée](../routines/journee.md)).

### Détection de présence par zone

<!-- source: binary_sensor:jardin_devant_presence, binary_sensor:jardin_parking_presence, binary_sensor:jardin_derriere_presence, binary_sensor:jardin_presence -->

Trois zones de présence distinctes :

- **Jardin devant** : combine les capteurs de personne devant l'entrée, le capteur de voiture dans l'allée, la caméra de l'entrée, le **portail venant de s'ouvrir** (signal valable une minute), le capteur de personne au portail, le capteur de voiture au portail, et le capteur de personne sur la sonnette de l'entrée,
- **Jardin parking** : combine la caméra du parking et le capteur de personne du parking,
- **Jardin derrière** : combine les capteurs de personne sur l'aire de jeux et la terrasse.

Une présence dans le jardin (toutes zones confondues) est détectée si l'une au moins de ces zones est active.

### Compteurs de mouvement par zone

<!-- source: sensor:mouvement_patio_10min, sensor:mouvement_air_de_jeux_10min, sensor:mouvement_camera_entree_10min, sensor:mouvement_camera_parking_10min, sensor:mouvement_terasse_10min -->

Cinq compteurs exposent la **durée de mouvement détectée sur les 10 dernières minutes** dans : le **patio**, l'**aire de jeux**, devant la **caméra de l'entrée**, devant la **caméra du parking**, sur la **terrasse**. Ces compteurs alimentent le capteur probabiliste de présence à l'[extérieur](../fonctions/presence.md).

### Signal « Portail vient de s'ouvrir »

<!-- source: template:binary_sensor:Portail just open -->

Quand le portail passe à l'état **ouvert**, un signal éphémère est activé pendant **1 minute** puis revient automatiquement à inactif. Ce signal est inclus dans la zone « Jardin devant » pour considérer le jardin comme momentanément occupé après une ouverture du portail.

### Éclairage automatique — devant et parking

<!-- source: automation:jardin_front_light_auto, blueprint:antorfr/motion_light.yaml -->

L'éclairage **devant** la maison (lumière de la façade et lumière du parking) s'allume sur détection dans la zone « Jardin devant », **uniquement la nuit** :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **2 minutes** |
| Avertissement avant extinction | désactivé |
| Allumage limité à la nuit | **oui** |
| Adaptation automatique pendant l'allumage | non |
| Commutateur de neutralisation | **« Lumière mode manuel (jardin) »** |

### Éclairage automatique — parking

<!-- source: automation:jardin_front_light2_auto, blueprint:antorfr/motion_light.yaml -->

La lumière du **parking** s'allume aussi sur détection dans la zone « Jardin parking », **uniquement la nuit** :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **3 minutes** |
| Avertissement avant extinction | désactivé |
| Allumage limité à la nuit | **oui** |
| Commutateur de neutralisation | **« Lumière mode manuel (jardin) »** |

### Éclairage automatique — arrière

<!-- source: automation:jardin_back_light_auto, blueprint:antorfr/motion_light.yaml -->

La lumière **arrière du jardin** s'allume sur détection sur la **terrasse**, **uniquement la nuit** :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | désactivé |
| Allumage limité à la nuit | **oui** |
| Commutateur de neutralisation | **« Lumière mode manuel (jardin) »** |

### Guirlandes de Noël

<!-- source: automation:jardin_xmas-light_auto -->

Quand le **mode Noël** est actif, les **guirlandes du jardin** sont pilotées automatiquement :

| Événement | Condition supplémentaire | Effet |
|---|---|---|
| Coucher du soleil | mode absence inactif, mode Noël actif | **allumage** |
| Réveil de la maison (matin) | maison hors absence, soleil sous l'horizon, mode Noël actif | **allumage** |
| Retour à la maison | maison hors absence, soleil sous l'horizon, mode Noël actif | **allumage** |
| Lever du soleil | — | **extinction** |
| Coucher (mode nuit) | — | **extinction** |
| Départ de la maison | — | **extinction** |

## Rôle dans les scénarios maison

- **Détection de présence à l'extérieur** : les compteurs de mouvement du jardin alimentent le capteur probabiliste de présence à l'[extérieur](../fonctions/presence.md).
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages du jardin (façade, parking, arrière), désactivation du commutateur de neutralisation propre au jardin.
- **Volets liés au soleil** : la **température extérieure** mesurée ici détermine si les volets se ferment au coucher du soleil (voir [routine de la journée](../routines/journee.md#volets-liés-au-soleil)).
