<!-- source: package:packages/system/network_monitor.yaml, package:packages/system/mqtt_monitor.yaml, package:packages/system/system_monitor.yaml -->

# Supervision technique

## But

Surveiller la **disponibilité des appareils essentiels** de la maison (réseau, sécurité, portes, cluster informatique, autres équipements clés) et alerter en cas de **déconnexion** ou de **redémarrage**, pour qu'une indisponibilité matérielle ne passe pas inaperçue.

## Périmètre

- supervision des **appareils requis** (groupes d'appareils dont la maison ne peut pas se passer),
- alerte spécifique sur la **déconnexion du portail**,
- notification de **nouveaux appareils** détectés sur le réseau,
- notification de **redémarrage** de Home Assistant.

## Règles de fonctionnement

### Appareils requis

<!-- source: group:required_hub_devices, group:required_security_devices, group:required_door_devices, group:required_cluster_devices, group:required_other_devices, group:required_devices -->

La maison considère comme **« requis »** un ensemble d'appareils répartis en cinq catégories :

| Catégorie | Appareils |
|---|---|
| **Hub** | la box réseau, le thermostat central |
| **Sécurité** | les caméras Netatmo de l'entrée, du parking et les caméras de présence de la maison |
| **Portes** | les capteurs des trois portes de garage et le capteur du portail |
| **Cluster informatique** | les neuf machines du cluster maison |
| **Autres** | la couverture chauffante, la veilleuse Teddy, le relais Wi-Fi Flipr |

Le groupe global **« appareils requis »** est considéré comme dégradé dès qu'au moins un appareil d'une de ces catégories est **déconnecté**.

### Alerte de déconnexion

<!-- source: automation:required_devices_alert, automation:required_devices_alert_end -->

Quand au moins un appareil requis est déconnecté, ou au démarrage de Home Assistant, la maison émet :

- une **notification persistante** sur le tableau de bord, listant le **nombre d'appareils déconnectés** et leurs noms,
- une **notification** sur le téléphone de Sébastien avec le même contenu.

Quand tous les appareils requis sont à nouveau connectés, la **notification persistante est retirée** automatiquement.

### Alerte de déconnexion du portail

<!-- source: automation:system_gate_notification -->

Quand le portail passe à l'état **« indisponible »** pendant **1 minute consécutive**, une **double notification** est envoyée (canal général + téléphone de Sébastien) :

> Alerte Portail — Portail déconnecté

### Découverte d'un nouvel appareil

<!-- source: automation:system_notification_new_device -->

Quand Home Assistant **découvre un nouvel appareil** (typiquement quand un téléphone, une montre, une machine se présente pour la première fois), une notification est envoyée sur le téléphone de Sébastien :

> Nouvel appareil — Home Assistant a découvert un nouvel appareil : _\<identifiant de l'appareil>_

### Redémarrage de Home Assistant

<!-- source: automation:system_notification_restart -->

À chaque démarrage de Home Assistant, une notification est envoyée sur le téléphone de Sébastien :

> Home Assistant a redémarré.

## Utilisée par

- la fonction [portail](portail.md) — l'alerte de déconnexion du portail s'ajoute à ses propres alertes fonctionnelles.
