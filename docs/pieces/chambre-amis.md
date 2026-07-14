<!-- source: package:packages/areas/chambre_amis.yaml -->

# Chambre d'amis

## Présentation

La chambre d'amis est utilisée par les visiteurs ponctuels.

## Comportements automatiques

### Indicateur de température

<!-- source: template:sensor:temperature_chambre_amis -->

La maison expose un indicateur de **température courante de la chambre d'amis**, recopié depuis le thermostat associé. L'indicateur n'est disponible que lorsque le thermostat est joignable.

### Climatisation

<!-- source: automation:chambre_d_amis_clim_auto, blueprint:antorfr/clim_scheduler.yaml -->

La chambre est climatisée automatiquement **uniquement lorsque le mode invité est actif** ; sinon le climatiseur est coupé. Quand elle est active, la climatisation maintient la chambre sous **28 °C**, la pré-refroidit à **25 °C** pour l'heure de coucher des invités (réglable, **22 h 30** par défaut), puis la laisse remonter jusqu'à **28 °C** au plus pendant la nuit. Le détail des règles est décrit dans la fonction [climatisation des chambres](../fonctions/climatisation.md).

## Rôle dans les scénarios maison

- **Routine de [départ](../routines/depart.md)** : les volets et l'éclairage de la chambre d'amis sont fermés et éteints comme les autres pièces.
- **Mode invité** : tant que le mode invité est actif (un visiteur est sur place), la chambre d'amis est **exclue** des fermetures et ouvertures groupées des volets ainsi que de l'extinction des lumières en variante « nuit ».
- **Routines de soir et matin** (voir [routine de la journée](../routines/journee.md)) : les volets de la chambre d'amis sont fermés ou ouverts avec ceux des pièces de vie, sauf si le mode invité est actif.
