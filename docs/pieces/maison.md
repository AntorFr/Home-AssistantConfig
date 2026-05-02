<!-- source: package:packages/areas/maison.yaml -->

# Maison — réglages globaux

## Présentation

Cette page regroupe les **réglages globaux à toute la maison** qui ne sont pas rattachés à une pièce particulière.

## Comportements automatiques

### Ambiance de la maison

<!-- source: input_select:maison_ambiance, automation:change_ambiance_maison, script:change_tx_ultimate_night_effect -->

Un sélecteur **« Ambiance maison »** permet de choisir l'ambiance globale, parmi :

| Ambiance | Effet |
|---|---|
| **Normal** | Effet de veilleuse des interrupteurs tactiles : **Default** |
| **Noël** | Effet de veilleuse des interrupteurs tactiles : **Christmas** |
| **Réveillon** | Effet de veilleuse des interrupteurs tactiles : **Stars** |

Ce réglage agit sur le **rétroéclairage de tous les interrupteurs tactiles** de la maison qui exposent un effet de veilleuse.

### Panneau de contrôle NSPanel

<!-- source: automation:1725884405348, blueprint:Blackymas/nspanel_blueprint.yaml -->

Un **panneau de contrôle physique** (écran tactile NSPanel) est exposé dans la maison. Il affiche en français, avec le format de date `lundi, jj/mm`, et présente :

- la **météo locale** (Petit-Mars),
- deux **boutons rapides** sur l'écran d'accueil :
    - **Mode nuit** (bascule l'indicateur de mode nuit de la maison),
    - **Mode absence** (bascule le mode absence ; nécessite **confirmation** pour éviter une activation accidentelle),
- les mêmes commutateurs (mode absence et mode nuit) sont également accessibles dans la grille des entités du panneau.

Ce panneau est ainsi le point d'entrée physique principal pour basculer la maison en absence ou en mode nuit sans recourir à un téléphone ou à une commande vocale.
