<!-- source: package:packages/areas/salon.yaml -->

# Salon

## Présentation

Le salon est une pièce de vie du rez-de-chaussée. Il accueille notamment le téléviseur principal de la maison.

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:salon_motion_sensors, sensor:mouvement_salon_5min -->

La présence dans le salon est détectée par un **groupe de capteurs** combinant un capteur de présence à la bibliothèque et plusieurs capteurs autour du téléviseur.

Un compteur expose la **durée de mouvement détecté sur les 5 dernières minutes**, utilisé par la fonction [présence](../fonctions/presence.md).

### Éclairage automatique sur présence

<!-- source: automation:salon_light_auto, blueprint:antorfr/motion_light.yaml, light:salon_lumieres -->

Les éclairages du salon — **plafonnier** et **bandeau de la bibliothèque** — fonctionnent comme un ensemble. Les paramètres appliqués au mécanisme commun décrit dans [éclairage](../fonctions/eclairage.md) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Seuil bas de luminosité (allumage) | **80 lux** |
| Seuil haut de luminosité (extinction) | **200 lux** |
| Allumage limité à la nuit | non |
| Adaptation automatique pendant l'allumage | oui |
| Commutateur de neutralisation | **mode TV** (voir ci-dessous) |

### Mode TV

<!-- source: automation:salon_mode_TV_auto, input_boolean:salon_lumiere_mode_tv -->

Le **mode TV** est un commutateur qui suit l'état du téléviseur :

- quand le téléviseur **s'allume**, le mode TV est activé,
- quand le téléviseur **s'éteint**, le mode TV est désactivé.

Tant que le mode TV est actif, l'éclairage automatique du salon ne s'allume pas sur détection de mouvement, et l'avertissement avant extinction ne se produit pas. Les commandes manuelles (interrupteurs, télécommande) restent fonctionnelles.

### Ambiances d'éclairage

<!-- source: script:light_scene_salon, scene:salon_mystic_sky, scene:salon_tokyo_2, scene:salon_fairfax, scene:salon_aurore_boreale -->

Le salon dispose de **cinq ambiances** activables à la demande :

| Ambiance | Effet |
|---|---|
| Mystic Sky | Scène Hue dynamique colorée, intensité maximale, bandeau de la bibliothèque calé sur l'effet « Mystic sky » |
| Tokyo 2 | Scène Hue colorée, intensité maximale, bandeau calé sur l'effet « Tokyo 2 » |
| Fairfax | Scène Hue, intensité maximale, bandeau calé sur l'effet « Fairfax » |
| Aurore boréale | Scène Hue, intensité maximale, bandeau calé sur l'effet « Aurore boréale » |
| Standard | Réactive l'adaptation automatique, bandeau en mode « Solid » uni, allume les éclairages du salon |

Les quatre ambiances colorées **désactivent l'adaptation automatique** des éclairages du salon le temps qu'elles sont actives. Le retour à l'ambiance « Standard » la réactive.

### Suivi d'usage

<!-- source: sensor:salon_tv_duration_today, sensor:salon_apple_tv_duration_today -->

Deux capteurs comptabilisent chaque jour, sur la plage **6h–21h** :

- la **durée d'allumage du téléviseur**,
- la **durée de lecture du décodeur multimédia** (Apple TV).

### Adaptation du volume des enceintes selon la source

L'enceinte du salon adapte automatiquement son volume selon que la source en cours est la **télévision** ou autre. Les valeurs précises sont décrites dans la fonction [musique](../fonctions/musique.md).

## Rôle dans les scénarios maison

- **Détection de présence rez-de-chaussée et du sommeil** : les capteurs de mouvement du salon et l'état du téléviseur sont des signaux pondérés à la hausse pour conclure à une présence ou, à l'inverse, au sommeil. Voir [présence](../fonctions/presence.md).
- **Routine de [départ](../routines/depart.md)** : extinction des éclairages, arrêt de la lecture sur l'enceinte du salon, désactivation du commutateur « mode TV ».
- **Routine de retour** : si le soleil est levé, le volet du salon est ouvert (rattaché au volet commun du rez-de-chaussée).

## Commandes manuelles disponibles

### Interrupteur mural à deux touches

<!-- source: automation:salon_bouton_light -->

| Touche | Effet |
|---|---|
| Gauche | bascule le **bandeau de la bibliothèque** |
| Droite | bascule le **plafonnier** |

### Télécommande à six boutons

<!-- source: automation:salon_bouton_telecommande -->

| Bouton | Effet |
|---|---|
| 1 | bascule le **bandeau de la bibliothèque** |
| 2 | bascule le **plafonnier** |
| 3 | lance la **musique d'ambiance** sur le rez-de-chaussée (voir [musique](../fonctions/musique.md)) |
| 4 | bascule lecture/pause de la musique sur le rez-de-chaussée |
| 5 | si l'**aspirateur robot** est en train de nettoyer, le renvoie à sa base ; sinon, lance le nettoyage de la **salle à manger** et de la **cuisine** (segments 17 et 22 de l'aspirateur) |
| 6 | déclenche l'annonce **« À table »** (voir [notifications](../fonctions/notifications.md)) |

### Bouton rotatif

<!-- source: automation:salon_bouton_volume -->

| Geste | Effet |
|---|---|
| Rotation vers le haut | monte le volume de l'**enceinte du salon** |
| Rotation vers le bas | baisse le volume |
| Pression simple | bascule lecture/pause sur l'enceinte du salon |
