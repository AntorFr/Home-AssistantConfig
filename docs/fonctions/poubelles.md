<!-- source: package:packages/functions/trash_box.yaml, jinja:trash_functions.jinja -->

# Poubelles

## But

Indiquer s'il faut **sortir** ou **rentrer** une poubelle au regard du **calendrier de collecte** et de la **présence effective** de la poubelle dans le garage (détectée par balise BLE).

## Périmètre

Deux poubelles suivies :

- la poubelle des **emballages** (couvercle jaune, repérée par l'emoji 🟡 dans le calendrier),
- la poubelle des **ordures ménagères** (couvercle vert, repérée par l'emoji 🟢).

Le suivi s'appuie sur :

- un **calendrier** des collectes (un événement par couleur de couvercle),
- un **détecteur de présence** (balise BLE associée à chaque poubelle dans le garage).

## Règles de fonctionnement

### État « problème » et message associé

<!-- source: template:binary_sensor:poubelle_emballage, template:binary_sensor:poubelle_menageres, jinja:trash_functions.jinja:trash_status, jinja:trash_functions.jinja:trash_message -->

Pour chaque poubelle, la maison combine deux informations :

- **« la poubelle est sortie »** : vrai si le détecteur de présence est **inactif** (la poubelle n'est plus dans le garage),
- **« la poubelle est à sortir »** : vrai si un événement du calendrier des collectes correspond à la couleur de la poubelle et est en cours.

L'indicateur de **« problème »** est actif lorsque ces deux informations **diffèrent** :

| Poubelle est sortie ? | Poubelle est à sortir ? | Problème ? | Message |
|---|---|---|---|
| oui | oui | non | « Tout va bien » |
| non | non | non | « Tout va bien » |
| non | **oui** | **oui** | « Sortir la poubelle _\<emballages \| ménagères>_ » |
| **oui** | non | **oui** | « Rentrer la poubelle _\<emballages \| ménagères>_ » |

Cet indicateur ne déclenche aucune notification automatique : il est destiné à être affiché sur le tableau de bord.
