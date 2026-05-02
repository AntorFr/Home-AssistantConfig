<!-- source: package:packages/integrations/ikea_idasen_desk.yaml -->

# Bureau motorisé

## But

Permettre de **monter ou baisser** le bureau motorisé (Ikea Idasen) en un geste, via une commande vocale ou une commande manuelle, en s'appuyant sur deux **presets de hauteur** prédéfinis.

## Périmètre

Le bureau motorisé installé dans le bureau de Sébastien.

## Règles de fonctionnement

### Presets de hauteur

<!-- source: script:move_desk_preset -->

Deux positions prédéfinies sont disponibles :

| Position | Hauteur (paramètre du moteur) |
|---|---|
| Assis | **17** |
| Debout | **62** |

L'envoi d'un preset déclenche le déplacement automatique du bureau jusqu'à la hauteur correspondante.

### Commandes vocales

<!-- source: intent:StandingDeskUp, intent:StandingDeskDown -->

Deux commandes vocales sont reconnues :

- **« lève le bureau »** (variantes : « monte le bureau », « bureau position debout », « bureau mode debout ») : la maison annonce **« Ok, je leve le bureau »** et applique le preset **debout**.
- **« baisse le bureau »** (variantes : « bureau position assis », « bureau mode assis ») : la maison annonce **« Ok, je baisse le bureau »** et applique le preset **assis**.

### Indicateurs

<!-- source: template:binary_sensor:idasen_ble_desk_connection, template:sensor:idasen_ble_desk_relative_height -->

Deux indicateurs sont exposés :

- **Connexion BLE** : indique si le bureau est joignable en Bluetooth,
- **Hauteur relative** : la hauteur courante du bureau, exprimée en **centimètres au-dessus de la position assise** (calculée comme la hauteur courante moins 62 cm de référence, en valeur entière).

## Cas particuliers

### Reconnexion automatique

Quand une présence est détectée dans le bureau, la maison vérifie l'état de la connexion BLE du bureau et **déclenche une reconnexion** s'il est déconnecté. Cette logique est décrite dans [bureau](../pieces/bureau.md).

## Utilisée par

- la page [bureau](../pieces/bureau.md).
