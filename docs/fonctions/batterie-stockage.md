<!-- source: package:packages/integrations/zendure.yaml -->

# Batterie de stockage

## But

Surveiller le **niveau de charge** de la batterie de stockage électrique du garage, et **basculer automatiquement** sur l'onduleur dédié quand la batterie devient critique.

## Périmètre

La fonction concerne la batterie de stockage du garage et l'onduleur de secours qui peut prendre le relais.

## Règles de fonctionnement

### Alerte sur niveau bas

<!-- source: automation:Zendur_batterie_low -->

Quand le **niveau de la batterie passe sous 15 %**, puis sous 10 %, la maison applique l'une des deux actions suivantes :

- **si l'onduleur du garage est éteint**, il est **allumé** automatiquement (la batterie de stockage cède le relais à l'onduleur),
- **si l'onduleur est déjà allumé**, une **notification** est envoyée à **tous les téléphones de la maison** :

  > Niveau batterie garage faible (\<pourcentage>%)

### Maintien forcé du switch AC

<!-- source: automation:Zendur_output_off -->

Si le **switch AC** de la batterie de stockage passe à un état différent de **« on »** (et autre que « indisponible » ou « inconnu »), la maison le **rallume immédiatement**. Cela évite que la sortie soit interrompue par une bascule intempestive.

## Utilisée par

- la fonction [suivi de l'énergie](suivi-energie.md) — l'orchestration Tempo Rouge ajuste les **limites d'entrée et de sortie** de cette batterie selon le contexte tarifaire.
