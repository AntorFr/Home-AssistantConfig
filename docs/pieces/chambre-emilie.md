<!-- source: package:packages/areas/chambre_emilie.yaml -->

# Chambre d'Émilie

## Présentation

La chambre d'Émilie est équipée d'un **plafonnier**, d'une **horloge LED** programmable, d'une **prise pilotée** sur le bureau, d'**enceintes** (lecteur multimédia) et de **volets motorisés**. Plusieurs interrupteurs tactiles et un bouton sans fil dans le lit permettent à l'enfant de piloter sa chambre.

## Comportements automatiques

### Indicateur de température

<!-- source: template:sensor:temperature_chambre_emilie -->

La maison expose un indicateur de **température courante** de la chambre, recopié depuis le thermostat associé.

### Couvre-feu de l'enfant

<!-- source: input_boolean:curfew_emilie, automation:chambre_emilie_music_curfew, blueprint:antorfr/curfew.yaml -->

Un commutateur **« Couvre-feu Émilie »** peut être activé manuellement ou par la routine de la [journée](../routines/journee.md#couvre-feu-individuel) à l'heure de couvre-feu d'Émilie.

Tant que le couvre-feu est actif, le **lecteur multimédia de la chambre** est traité de la façon suivante :

- toute lecture en cours est **arrêtée**,
- toute tentative de remise en lecture **redéclenche l'arrêt** automatique tant que le couvre-feu reste actif.

Le couvre-feu est levé soit manuellement, soit par la routine de réveil des enfants, soit temporairement par la commande de [musique douce](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant).

### Extinction automatique de l'éclairage

<!-- source: automation:chambre_emilie_lumiere_auto, blueprint:antorfr/motion_light.yaml -->

L'éclairage de la chambre suit une variante du mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) **configurée pour ne jamais allumer** la lumière, mais seulement l'éteindre :

| Paramètre | Valeur |
|---|---|
| Mode | extinction seule (jamais d'allumage automatique) |
| Délai d'extinction | **15 minutes** sans présence dans la maison |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Adaptation automatique pendant l'allumage manuel | oui |

L'éclairage ne s'allume **que sur action manuelle** (interrupteur tactile, bouton lit, commande vocale).

## Commandes manuelles disponibles

### Bouton sans fil dans le lit

<!-- source: automation:chambre_emilie_button_lit, blueprint:antorfr/BluButtonRC4.yaml -->

| Touche | Effet |
|---|---|
| 1 | bascule le **plafonnier** |
| 2 | met l'**horloge LED** en mode « Clock » et bascule son allumage |
| 3 | bascule l'état des **volets** de la chambre |
| 4 | si la **musique** joue : pause / reprise. Sinon : démarre la **[musique douce](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant)** dans la chambre |

### Interrupteur tactile à l'entrée de la chambre

<!-- source: automation:chambre_emilie_light_switch -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule l'**horloge LED** en mode « Clock » |
| Touche 2 | bascule la **prise du bureau** |
| Glissement à droite | bascule les **volets** |
| Glissement à gauche | bascule les **volets** |
| Multi-touch | éteint **toutes les lumières**, **coupe la prise du bureau**, **arrête la musique** |

### Interrupteur tactile au-dessus du bureau

<!-- source: automation:chambre_emilie_light_switch_desk -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule la **prise du bureau** |
| Glissement à droite | bascule les **volets** |
| Glissement à gauche | bascule les **volets** |
| Multi-touch | éteint **toutes les lumières**, **coupe la prise du bureau**, **arrête la musique** |

## Rôle dans les scénarios maison

- **[Routine des enfants](../routines/enfants.md)** : l'horloge LED suit la phase de la journée (orange en début de soirée, rouge atténué au coucher, éteinte la nuit, blanche le matin scolaire).
- **Routine de la [journée](../routines/journee.md)** : activation du couvre-feu, du mode nuit, désactivation au réveil.
- **Routine de [départ](../routines/depart.md)** : désactivation du couvre-feu et du mode nuit, fermeture des volets, extinction des éclairages.
- **Annonces** : les annonces vocales destinées à Émilie sont diffusées sur l'enceinte de sa chambre, sous réserve qu'elle ne soit pas en mode silence (voir [notifications](../fonctions/notifications.md)).
- **Lecture par scan d'étiquette** : voir [musique](../fonctions/musique.md#lecture-par-scan-detiquette).
- **Suivi d'énergie** : la prise du bureau est l'une des prises mesurées (voir [suivi de l'énergie](../fonctions/suivi-energie.md)).
