<!-- source: package:packages/functions/portail.yaml -->

# Portail

## But

Piloter automatiquement le **portail d'entrée** de la propriété : ouverture sur reconnaissance des occupants ou des véhicules, fermeture automatique, gestion de la **sonnette** et accueil des **livraisons de colis**.

## Périmètre

La fonction couvre uniquement le portail de la propriété (`cover.portail_2`). Elle ne couvre pas les portes de garage, traitées séparément par la [routine de départ](../routines/depart.md).

## Règles de fonctionnement

### Détection groupée d'un véhicule devant le portail

<!-- source: binary_sensor:entrance_car_occupancy -->

La maison considère qu'un **véhicule est aux abords du portail** dès qu'au moins une de ces détections est active :

- caméra de l'allée (côté intérieur),
- caméra du portail (côté intérieur),
- détecteur de véhicule du portail (côté intérieur),
- caméra de la sonnette, côté rue (extérieur),
- sonnette vidéo du portail, côté rue (extérieur), en **secours**.

Cette détection groupée commande la **fermeture automatique** : le portail ne se referme que lorsqu'aucun véhicule n'est détecté. La détection de secours côté rue garantit que, même si l'analyse d'image principale devient indisponible, le portail **continue de se refermer automatiquement**.

### Ouverture automatique

<!-- source: automation:function_portail_auto-open -->

Le portail s'ouvre automatiquement, **uniquement s'il est fermé depuis au moins 2 minutes**, dans les cas suivants :

| Déclencheur | Détail |
|---|---|
| Véhicule détecté dans l'allée | un véhicule est garé dans l'allée |
| Véhicule détecté au portail (caméra) | un véhicule est devant le portail |
| Véhicule détecté au portail (détecteur) | un véhicule est devant le portail |
| **Sébastien** rentre dans la zone domicile | détection par téléphone |
| **Laurine** rentre dans la zone domicile | détection par téléphone |
| **Badge BLE d'Émilie** détecté | présent depuis 10 secondes |
| Action **« Retour Maison »** depuis un téléphone | déclenchement manuel |
| Étiquette physique **« Lapin bureau »** scannée | scan dans le bureau |

Le délai minimal de fermeture (2 minutes) évite les ré-ouvertures intempestives juste après une fermeture.

### Fermeture automatique

<!-- source: automation:function_portail_auto-close -->

Le portail se ferme automatiquement dans les cas suivants, à condition qu'il soit ouvert et qu'aucun véhicule ne soit détecté devant :

| Déclencheur | Détail |
|---|---|
| Portail ouvert depuis **3 minutes** | le portail reste ouvert sans raison |
| Véhicule **vient de quitter** la zone | plus de détection depuis **30 secondes** |

### Ouverture par identification biométrique ou NFC

<!-- source: automation:function_portail_nfc_fingerprint -->

La sonnette du portail dispose d'un lecteur **d'empreinte digitale** et d'un lecteur **NFC**. Le portail s'ouvre automatiquement quand l'un de ces lecteurs identifie un membre de la famille (Sébastien, Émilie, Timothée, Laurine).

L'événement est ignoré si l'état du capteur revenait d'un état d'indisponibilité (évite les fausses détections au démarrage).

### Sonnette

<!-- source: automation:function_portail_sonette -->

Quand quelqu'un sonne (à la sonnette du portail ou de l'entrée) :

**Si la maison est occupée** (mode absence inactif) :

- diffusion d'une **sonnerie** (musique de Harry Potter) sur les enceintes : cuisine, salon, salle à manger, cuisine mobile, bureau, garage,
- déclenchement de la sonnerie de la porte du bureau.

**Dans tous les cas** (occupé ou en absence) :

- envoi d'une **notification** sur le téléphone de **Sébastien** et sur celui de **Laurine**, comportant :
    - le message « Quelqu'un sonne à la porte d'entrée » ou « Quelqu'un sonne au portail » selon la sonnette,
    - l'**image en direct** de la caméra de la sonnette,
    - une **action rapide** pour ouvrir la sonnette en vidéo dans l'application,
    - une **action rapide « Ouvrir le portail »** (sonnette du portail uniquement).

La notification est envoyée **indépendamment à chaque personne**, avec un niveau d'urgence qui dépend de **sa propre présence** :

| Situation de la personne | Notification reçue |
|---|---|
| **À la maison** | notification **critique** : sonne fort même si le téléphone est en silencieux |
| **Absente** | notification **normale** : respecte le mode silencieux du téléphone |

Ainsi, si Sébastien est absent et Laurine à la maison, seul le téléphone de Laurine sonne de façon critique ; celui de Sébastien reçoit une notification discrète.

#### Ouverture du portail depuis la notification

<!-- source: automation:function_portail_sonette_action_notif -->

Si l'occupant appuie sur l'action **« Ouvrir le portail »** dans la notification reçue (téléphone iOS), le portail s'ouvre.

### Livraison de colis

<!-- source: script:parcel_delivery, intent:ParcelDelivery -->

Une commande dédiée — déclenchable manuellement ou par commande vocale — gère l'accueil d'un livreur quand les occupants ne peuvent pas répondre :

1. la maison **affiche** sur l'écran de la sonnette le message **« Déposer sous le porche d'entré »**,
2. **si le portail est fermé**, elle l'ouvre,
3. elle prononce un message vocal sur la sonnette via la voix « MauriceNeural » :

   > « Bonjour, je suis Nestor, l'assistant de la maison. Mes occupants ne sont pas disponibles. Je vais vous ouvrir le portail (uniquement si le portail était fermé). Vous pouvez déposer les colis sous le porche devant la porte d'entrée. Merci. »

4. elle attend que le portail soit refermé, jusqu'à **1 heure**,
5. elle remet le message d'accueil par défaut sur l'écran de la sonnette.

## Utilisée par

- la routine de [départ](../routines/depart.md) — l'ouverture par action « Retour Maison » est partagée avec le déclenchement du retour.
- la fonction [notifications](notifications.md) — pour la notification de sonnette.
