<!-- source: package:packages/areas/piscine.yaml -->

# Piscine

## Présentation

La piscine est une **piscine intérieure** dotée d'une **filtration**, d'une **électrolyse** au sel, d'un **chauffage de l'eau**, d'un **éclairage subaquatique** et d'un éclairage d'ambiance, ainsi que d'une **vanne d'arrivée d'eau** automatisée. Plusieurs **mesures** suivent la santé de la piscine (température, niveau d'eau, pH, oxydoréduction, puissance de la pompe), avec des alertes associées. La filtration est pilotée automatiquement selon le **tarif électrique** (heures pleines / creuses, jour Tempo rouge), la **température de l'eau** et la **présence**.

La qualité de l'eau (pH, température, oxydoréduction, salinité) est mesurée par une **sonde flottante** dont la santé fait l'objet d'une fonction dédiée — voir [sonde piscine](../fonctions/sonde-piscine.md).

## Comportements automatiques

### Détection de présence

<!-- source: binary_sensor:piscine_occupancy_sensors, sensor:mouvement_piscine_10min -->

La présence dans la piscine est détectée par un capteur de personne. Un compteur expose la **durée de mouvement détectée sur les 10 dernières minutes**, utilisé en signal pondéré du capteur probabiliste de présence à l'[extérieur](../fonctions/presence.md).

### Comptage du temps de présence et de filtration depuis 22h

<!-- source: sensor:Présence piscine depuis 22h, sensor:Filtration piscine depuis 22h -->

Deux compteurs cumulent, **depuis la dernière fois où l'horloge a passé 22h00** :

- la **durée de présence dans la piscine**,
- la **durée de filtration**.

Ces compteurs alimentent le calcul du besoin de filtration journalier.

### Compteurs sur 24 heures

<!-- source: sensor:Durée filtration piscine 24h, sensor:Durée electrolyse piscine 24h -->

Deux compteurs supplémentaires totalisent les **durées de filtration et d'électrolyse sur les 24 dernières heures**.

### Indicateur « piscine sécurisée »

<!-- source: template:binary_sensor:Piscine Sécurisée -->

L'indicateur de sécurité de la piscine est **vrai** quand :

- l'**alarme piscine** est activée,
- la **porte de la piscine** n'est pas dans un état différent de « fermée »,
- aucune **présence** n'est détectée à proximité immédiate.

### Niveau d'eau bas

<!-- source: template:binary_sensor:water_low_level_pool_problem -->

Un indicateur **« Niveau d'eau piscine bas »** s'allume si la mesure du niveau d'eau est **inférieure à 17 400** (valeur brute du capteur), avec un anti-rebond de **2 minutes** dans chaque sens.

### Filtre encrassé

<!-- source: template:binary_sensor:pool_filter_clogged_problem -->

Un indicateur **« Filtre piscine encrassé »** s'allume si, alors que la filtration est en marche, la **puissance électrique de la pompe** descend **sous 120 W** (signe d'un filtre obstrué). L'indicateur n'est valide que si la filtration tourne et que la mesure est disponible. Anti-rebond : **10 minutes** d'allumage, **2 minutes** d'extinction.

### Calcul du besoin de filtration

<!-- source: template:sensor:piscine_filtration_need, template:sensor:piscine_hp_debut -->

Le **besoin de filtration** journalier est calculé à partir de :

- la **température de l'eau** divisée par 2,
- un **bonus** lié à la présence : minimum entre **2 heures** et **0,5 × durée de présence depuis 22h**,

moins la **durée de filtration déjà réalisée depuis 22h**, sans descendre sous zéro.

L'**heure de début en heures pleines** est calculée :

- si le besoin restant est **inférieur ou égal à 6 heures** : ancrage à **12h** (la filtration en heures pleines peut commencer à 12h),
- sinon : ancrage à **18 - besoin** (mais jamais avant 9h).

### Filtration automatique

<!-- source: automation:Swimingpool_auto_filtering_hchp -->

Toutes les **30 minutes**, et à chaque changement de tarif, de température, de présence ou de température extérieure, la filtration est recalculée. Le mode dépend du contexte (la pompe est arrêtée si la piscine est en mode hivernage et que ce n'est pas l'heure planifiée — voir « Hivernage ») :

| Condition | Filtration | Électrolyse |
|---|---|---|
| **Jour Tempo rouge** | éteintes | éteintes |
| **Heures creuses** | allumée | allumée si l'oxydoréduction est sous le milieu de la plage cible |
| Brassage d'urgence (T° air > 30 °C **et** T° air > T° eau + 5 °C **ou** T° eau > 32 °C) | allumée | allumée si oxydoréduction sous milieu de plage |
| Heures pleines, **fenêtre de filtration ouverte** (besoin > 0 et heure ≥ heure de début calculée) | allumée | allumée si oxydoréduction sous milieu de plage |
| Tous les autres cas | éteinte | éteinte |

### Filtration en hivernage

<!-- source: automation:Swimingpool_auto_filtering_winter -->

Quand le **mode hivernage** est activé, la filtration et l'électrolyse suivent un **planning dédié** (créneaux horaires hebdomadaires) plutôt que le calcul de besoin journalier.

### Chauffe-eau automatique

<!-- source: automation:Swimingpool_auto_boiler_hphc -->

Le **chauffe-eau de la piscine** est piloté en fonction du tarif :

- en **heures creuses**, à condition que la maison ne soit ni en mode absence ni en hivernage : **allumé**,
- dans tous les autres cas : **éteint**.

### Arrêt automatique du remplissage

<!-- source: automation:Swimingpool_auto_stop_filling -->

La **vanne d'arrivée d'eau** est coupée automatiquement dans deux cas :

- elle a été ouverte depuis **2 heures**,
- le **niveau d'eau dépasse** une valeur cible (19 500 brute), pendant **10 minutes consécutives**, et qu'il était au-dessus de 18 500 au moment du déclenchement.

À la coupure, une **notification** est envoyée à **tous les téléphones de la maison** : « Arrosage piscine coupée. ».

### Éclairage automatique sur présence

<!-- source: automation:Swimingpool_light_auto, blueprint:antorfr/motion_light.yaml, light:piscine -->

L'éclairage de la piscine (lumière subaquatique et lumière d'ambiance) suit le mécanisme commun (voir [éclairage](../fonctions/eclairage.md)) :

| Paramètre | Valeur |
|---|---|
| Délai d'extinction sans mouvement | **10 minutes** |
| Avertissement avant extinction | désactivé |
| Capteurs de présence | porte de la piscine, capteur de personne dans la piscine |
| Allumage limité à la nuit | **oui** |
| Adaptation automatique pendant l'allumage | non |

L'éclairage est aussi pilotable par un **bouton sans fil** dédié.

## Alertes

### Porte de la piscine non sécurisée

<!-- source: alert:swiming_pool -->

Voir [système de sécurité](../fonctions/alarme-systeme-securite.md#surveillance-de-la-porte-de-la-piscine) — alerte sur tous les téléphones avec image en direct, répétée à 15, 30 puis 60 minutes.

### Pas de filtration depuis 24 heures

<!-- source: alert:pool_flitering_alert -->

Si la durée de filtration cumulée sur 24 heures retombe à **zéro**, une alerte est envoyée toutes les **3 heures** (180 minutes), sur le canal de notification par défaut. Acquittement possible.

### pH anormal

<!-- source: alert:pool_ph_alert -->

Si l'indicateur dédié au pH passe en alerte, une notification est envoyée chaque **24 heures**, indiquant la valeur courante. Acquittement possible. La première occurrence est sautée.

### Chlore (oxydoréduction) anormal

<!-- source: alert:pool_clore_alert -->

Si l'oxydoréduction sort de sa plage cible (trop bas ou trop haut), une notification est envoyée chaque **24 heures**, indiquant la valeur et le sens du dépassement. Acquittement possible. La première occurrence est sautée.

### Niveau d'eau bas

<!-- source: alert:pool_low_level -->

Si l'indicateur de niveau d'eau bas est actif, une notification est envoyée chaque **24 heures**. Acquittement possible. La première occurrence est sautée.

### Filtre encrassé

<!-- source: alert:pool_filter_clogged -->

Si l'indicateur de filtre encrassé est actif, une notification est envoyée à **tous les téléphones** chaque **30 minutes**, en détaillant la puissance courante de la pompe et le seuil de référence. Acquittement possible.

## Rôle dans les scénarios maison

- **Détection de présence à l'extérieur** : le mouvement à la piscine est l'un des signaux pondérés du capteur probabiliste de présence à l'extérieur.
- **[Système de sécurité](../fonctions/alarme-systeme-securite.md)** : la porte de la piscine déclenche son alerte spécifique, et l'extérieur est surveillé en mode armée nuit / armée absence.
- **[Suivi de l'eau](../fonctions/suivi-eau.md)** : la consommation d'eau de la piscine est mesurée via la vanne d'arrivée.
- **[Tarif Tempo](../fonctions/tarif-tempo.md)** : la filtration et le chauffe-eau sont éteints en jour Tempo rouge.
