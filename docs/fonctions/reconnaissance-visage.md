<!-- source: package:packages/integrations/unifi_protect.yaml -->

# Reconnaissance de visage

## But

Mettre à jour la **position « à la maison »** des occupants à partir d'une **détection de visage** sur les caméras, sans attendre que leur téléphone confirme leur présence.

## Périmètre

La reconnaissance de visage s'appuie sur les **caméras Unifi Protect** de la maison. Quatre visages sont reconnus : **Sébastien**, **Laurine**, **Émilie** et **Timothée**.

## Règles de fonctionnement

### Indicateurs de visage détecté

<!-- source: template:binary_sensor:Visage Sébastien, template:binary_sensor:Visage Laurine, template:binary_sensor:Visage Émilie, template:binary_sensor:Visage Timothée -->

Quatre indicateurs **« Visage \<prénom> »** s'allument quand le système Unifi détecte le visage correspondant. Chaque indicateur est **automatiquement éteint au bout de 10 secondes** sans nouvelle détection.

### Mise à jour de la position des personnes

<!-- source: automation:integration_unifi_protect_face_detection -->

À chaque événement de reconnaissance, la maison met à jour les **positions** des personnes détectées :

- pour **chaque visage** présent dans l'événement, un **traceur dédié** est créé ou mis à jour avec la position **« home »**,
- l'identifiant du traceur est dérivé du nom du visage (accents retirés, tout en minuscules, séparé par des tirets bas).

Ce mécanisme **complète** les positions issues des téléphones et des autres traceurs, mais ne **remplace** pas leur logique propre — il les enrichit.

## Utilisée par

- la fonction [présence](presence.md) — la position des personnes pilote toute la détection de présence et le mode invité.
- la fonction [système de sécurité](alarme-systeme-securite.md) — le retour d'au moins un parent désarme la centrale.
