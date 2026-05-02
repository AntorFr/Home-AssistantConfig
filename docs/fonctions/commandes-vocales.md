<!-- source: package:custom_sentences/fr/functions.yaml, package:custom_sentences/fr/music.yaml, package:custom_sentences/fr/notification.yaml, package:custom_sentences/fr/responses.yaml, package:custom_sentences/fr/routine.yaml -->

# Commandes vocales

## But

Récapituler les **phrases en français** que la maison reconnaît et l'**effet** de chaque commande vocale. Le détail du comportement déclenché est documenté dans la page de la fonction concernée.

## Récapitulatif

### Routines de la journée

<!-- source: intent:NightModeOn, intent:WakeUpModeOn -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « Bonne nuit », « je me couche » | active le **mode nuit** de la maison | [routine de la journée](../routines/journee.md#commandes-vocales-et-scènes) |
| « Bonjour », « je me lève », « je suis levé », « je me reveille », « je suis réveillé », « réveille-toi », « c'est l'heure de se réveiller », « c'est l'heure de se lever » | désactive le **mode nuit** | [routine de la journée](../routines/journee.md#commandes-vocales-et-scènes) |

### Musique

<!-- source: intent:MusicTurnOn, intent:MusicTurnOff -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « joue / mets / lance / change la musique \<dans la pièce> » | lance la **musique** dans la pièce indiquée | [musique](musique.md#commandes-vocales) |
| « joue / mets / lance / change la musique » sans pièce, ou « ici / dans la pièce / dans cette pièce » | lance la musique dans la **pièce courante** (ou au rez-de-chaussée si la commande vient du salon ou de la salle à manger) | [musique](musique.md#commandes-vocales) |
| « éteins / arrête / coupe / désactive / stoppe la musique \<dans la pièce> » | arrête la musique dans la pièce indiquée | [musique](musique.md#commandes-vocales) |
| « éteins la musique » sans pièce, ou « ici / dans la pièce » | arrête la musique dans la **pièce courante** (ou au rez-de-chaussée idem) | [musique](musique.md#commandes-vocales) |

À l'allumage, la maison répond : **« Ok, j'ai lancé la musique \<dans la pièce> »**. À l'extinction, elle confirme aussi.

### Notifications

<!-- source: intent:LunchTime, intent:SayTo -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « À table », « c'est l'heure d'aller à table » | déclenche l'**annonce « À table »** sur les enceintes des chambres d'enfants et du bureau si occupé | [notifications](notifications.md#annonce-à-table) |
| « dis à \<personne> \<message> » | adresse un **message à une personne** précise (annonce vocale dans sa pièce ou notification sur son téléphone selon le cas) | [notifications](notifications.md#message-à-une-personne) |

### Téléviseur et console

<!-- source: intent:tvXBoxOn -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « allume / mets / lance la Xbox » | bascule la **télévision sur la source Xbox** (allumage et navigation auto) | [téléviseur](television.md#bascule-automatique-sur-la-xbox) |

### Bureau motorisé

<!-- source: intent:StandingDeskUp, intent:StandingDeskDown -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « lève / monte le bureau », « bureau position debout », « bureau mode debout » | met le **bureau en position debout** (62) | [bureau motorisé](bureau-motorise.md) |
| « baisse le bureau », « bureau position assis », « bureau mode assis » | met le **bureau en position assis** (17) | [bureau motorisé](bureau-motorise.md) |

### Voiture

<!-- source: intent:readyTesla -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « prépare la voiture », « prépare la Tesla », « prépare l'electromobile », « fais chauffer la voiture » | déclenche la **préparation au départ** de la Tesla | [véhicule Tesla](vehicule-tesla.md) |

### Portail / livreurs

<!-- source: intent:ParcelDelivery -->

| Phrases reconnues | Effet | Voir |
|---|---|---|
| « réponds au livreur », « ouvre le portail au livreur » | déclenche la séquence de **livraison de colis** (ouverture du portail si fermé, message vocal au livreur, attente de fermeture) | [portail](portail.md#livraison-de-colis) |
