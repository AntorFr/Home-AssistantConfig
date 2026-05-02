<!-- source: package:packages/areas/chambre_timothee.yaml -->

# Chambre de Timothée

## Présentation

La chambre de Timothée regroupe un **plafonnier**, une **veilleuse** (cadre lumineux), une **lampe de lit**, un **cadre lumineux jour/nuit**, une **horloge LED matrix** programmable, des **enceintes** (lecteur multimédia) et des **volets motorisés**. Plusieurs interrupteurs tactiles et un bouton sans fil dans le lit permettent à l'enfant de piloter sa chambre.

## Comportements automatiques

### Couvre-feu de l'enfant

<!-- source: input_boolean:curfew_timothee, automation:chambre_timothee_music_curfew, blueprint:antorfr/curfew.yaml -->

Un commutateur **« Couvre-feu Timothée »** peut être activé manuellement ou par la routine de la [journée](../routines/journee.md#couvre-feu-individuel) à l'heure de couvre-feu de Timothée.

Tant que le couvre-feu est actif, le **lecteur multimédia de la chambre** est traité de la façon suivante :

- toute lecture en cours est **arrêtée**,
- toute tentative de remise en lecture **redéclenche l'arrêt** automatique tant que le couvre-feu reste actif.

Le couvre-feu est levé soit manuellement, soit par la routine de réveil des enfants, soit temporairement par la commande de [musique douce](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant).

### Extinction automatique du plafonnier

<!-- source: automation:chambre_timothee_lumiere_auto, blueprint:antorfr/motion_light.yaml -->

Le **plafonnier** suit une variante du mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) **configurée pour ne jamais allumer** la lumière, mais seulement l'éteindre :

| Paramètre | Valeur |
|---|---|
| Mode | extinction seule |
| Délai d'extinction | **15 minutes** sans présence dans la maison |
| Avertissement avant extinction | **30 secondes** (réduction de l'intensité de 50 %) |
| Adaptation automatique pendant l'allumage manuel | oui |

### Extinction automatique de la lampe de lit

<!-- source: automation:chambre_timothee_lumiere_auto_lit, blueprint:antorfr/motion_light.yaml -->

La **lampe de lit** suit le même mécanisme d'extinction seule, avec les mêmes paramètres que le plafonnier.

### Mode fête

<!-- source: automation:chambre_timothee_party_mode -->

Le scan d'une étiquette **« mode fête »** dédiée déclenche une séquence dans la chambre :

1. la maison **annonce** sur l'enceinte : « Super, c'est la fête ! »,
2. la **lampe de lit** s'allume avec un **effet « Color Wipe »** à intensité maximale,
3. après 1 seconde, la **musique « Lolirock »** est lancée dans la chambre.

## Commandes manuelles disponibles

### Bouton sans fil dans le lit

<!-- source: automation:chambre_timothee_button_lit, blueprint:antorfr/BluButtonRC4.yaml -->

| Touche | Effet |
|---|---|
| 1 | bascule le **plafonnier** |
| 2 | met l'**horloge LED** en mode « Clock » et bascule son allumage |
| 3 | bascule l'état des **volets** de la chambre |
| 4 | si la **musique** joue : pause / reprise. Sinon : démarre la **[musique douce](../fonctions/musique.md#musique-douce-dans-une-chambre-denfant)** |

### Interrupteur tactile à côté du lit

<!-- source: automation:chambre_timothee_light_switch_bed -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule le **plafonnier** (déclenche aussi son éclairage automatique) |
| Touche 2 | bascule la **lampe de lit** (déclenche aussi son éclairage automatique) |
| Glissement à droite | bascule les **volets** |
| Glissement à gauche | bascule les **volets** |

### Interrupteur tactile à l'entrée de la chambre

<!-- source: automation:chambre_timothee_light_switch_entrance -->

| Geste | Effet |
|---|---|
| Touche 1 | bascule le **plafonnier** |
| Touche 2 | bascule la **lampe de lit** |
| Touche 3 | bascule l'**horloge LED** en mode « Clock » |
| Glissement à droite | bascule les **volets** |
| Glissement à gauche | bascule les **volets** |

## Rôle dans les scénarios maison

- **[Routine des enfants](../routines/enfants.md)** : la veilleuse cadre suit la phase de la journée (allumée à 100 % en début de soirée, 50 % au retour au calme, 10 % au coucher, 8 % en rouge fixe la nuit).
- **Routine de la [journée](../routines/journee.md)** : activation du couvre-feu, du mode nuit, désactivation au réveil. Fermeture automatique des volets en semaine d'école.
- **Routine de [départ](../routines/depart.md)** : désactivation du couvre-feu et du mode nuit, fermeture des volets, extinction des éclairages.
- **Annonces** : les annonces vocales destinées à Timothée sont diffusées sur l'enceinte de sa chambre, sous réserve qu'elle ne soit pas en mode silence (voir [notifications](../fonctions/notifications.md)).
- **Lecture par scan d'étiquette** : voir [musique](../fonctions/musique.md#lecture-par-scan-detiquette).
