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
| **Normal** | Thème des interrupteurs tactiles : **Default** |
| **Noël** | Thème des interrupteurs tactiles : **Christmas** |
| **Réveillon** | Thème des interrupteurs tactiles : **Explore the Stars** |
| **Halloween** | Thème des interrupteurs tactiles : **Halloween** ; décor Halloween sur l'écran de veille des tablettes et sur les horloges à LED |

Ce réglage agit sur le **thème de tous les interrupteurs tactiles** de la maison (couleurs, effets, sons) et sur le sélecteur **« Ambiance »** de chaque tablette murale et de chaque horloge à LED (chambre d'Émilie, bibliothèque de Timothée) :

- **tablettes** : en Halloween, leur horloge de veille se décore (citrouille, chauves-souris, fantôme) et leurs écrans passent en violet nuit, heure et onglet actif en orange ;
- **horloges à LED** : en Halloween, en mode « Heure », une citrouille éclairée à la bougie remplace l'icône d'horloge. Toutes les une à deux minutes, un personnage passe sur l'heure :
    - un fantôme,
    - une chauve-souris,
    - une araignée au bout de son fil,
    - une sorcière sur son balai,
    - deux yeux verts à la place des deux-points.

  L'heure garde la couleur donnée par la [routine des enfants](../routines/enfants.md). Quand l'horloge est baissée (heure du coucher), elle reste sobre.

### Panneau de contrôle NSPanel

<!-- source: automation:1725884405348, blueprint:Blackymas/nspanel_blueprint.yaml -->

Un **panneau de contrôle physique** (écran tactile NSPanel) est exposé dans la maison. Il affiche en français, avec le format de date `lundi, jj/mm`, et présente :

- la **météo locale** (Petit-Mars),
- deux **boutons rapides** sur l'écran d'accueil :
    - **Mode nuit** (bascule l'indicateur de mode nuit de la maison),
    - **Mode absence** (bascule le mode absence ; nécessite **confirmation** pour éviter une activation accidentelle),
- les mêmes commutateurs (mode absence et mode nuit) sont également accessibles dans la grille des entités du panneau.

Ce panneau est ainsi le point d'entrée physique principal pour basculer la maison en absence ou en mode nuit sans recourir à un téléphone ou à une commande vocale.
