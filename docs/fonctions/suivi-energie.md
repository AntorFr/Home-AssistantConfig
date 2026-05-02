<!-- source: package:packages/functions/energy_monitor.yaml -->

# Suivi de l'énergie

## But

Mesurer la **consommation cumulée d'énergie** d'un certain nombre de **prises pilotées** de la maison, et **adapter le fonctionnement** de la maison aux **jours rouges Tempo** (basculement de mode du chauffage, de l'eau chaude, des batteries de stockage, et coupure des appareils non essentiels en heure pleine).

## Périmètre

- mesure d'énergie pour un ensemble de prises individuelles (ordinateurs du bureau, télévision du salon, mezzanine, prises diverses du bureau, prise du bureau dans la chambre d'Émilie, etc.),
- orchestration automatique des équipements lors des transitions liées au tarif **Tempo Rouge**.

## Règles de fonctionnement

### Mesure d'énergie par prise

<!-- source: sensor:energy_bureau_prise_pc_1_power, sensor:energy_bureau_prise_pc_2_power, sensor:energy_bureau_prise_pc_3_power, sensor:energy_salon_prise_tv_power, sensor:energy_bureau_prise_1_power, sensor:energy_bureau_prise_routeur_power, sensor:energy_chambre_emilie_prise_bureau_power, sensor:energy_mezzanine_prise_1_power -->

Pour chaque prise pilotée surveillée, la maison **intègre dans le temps** la puissance instantanée mesurée pour produire une **consommation cumulée**, exprimée en kilowattheures.

Les prises actuellement suivies couvrent : trois prises d'ordinateurs et une prise « routeur » dans le bureau, la prise du téléviseur du salon, la prise du bureau dans la chambre d'Émilie, et une prise dans la mezzanine.

### Orchestration automatique aux transitions Tempo Rouge

<!-- source: automation:energie_change_tarif -->

L'orchestration automatique se déclenche sur les **changements de période tarifaire** (HP / HC), confirmés pendant 10 secondes pour ignorer les bascules brèves. Trois cas distincts sont traités :

#### Préparation de la veille (passage en heures creuses la veille d'un jour rouge)

<!-- source: script:energy_tempo_red_before -->

Quand la maison passe en **heures creuses** **et** que la couleur Tempo du **lendemain** est **rouge**, la maison se prépare :

- notification **« Tempo rouge Preparation »** sur le téléphone de Sébastien,
- **réalimentation** de toutes les prises portant l'étiquette « à allumer par défaut »,
- réglage des **batteries de stockage** :
    - capacité **maximale** ramenée à **100 %**, **minimale** à **10 %**,
    - **limite d'entrée** réglée à **900 W**,
- réglage de la **batterie photovoltaïque** :
    - capacité maximale à **100 %**,
    - **limite d'entrée** à **600 W**,
    - **mode de fonctionnement AC** : entrée (charge depuis le réseau),
- bascule du **convecteur prise « petit Mars »** en mode « Tempo rouge »,
- **allumage** du chauffage de la pompe à chaleur,
- réglage de la **consigne d'eau chaude** à **65 °C** en mode performance.

Les bascules de la pompe à chaleur sont **réessayées jusqu'à 10 fois**, à 1 minute d'intervalle, pour absorber les éventuelles indisponibilités temporaires.

#### Pendant le jour rouge (passage en heures pleines)

<!-- source: script:energy_tempo_red_hp -->

Quand la maison passe en **heures pleines** **et** que la couleur Tempo du **jour en cours** est **rouge**, la maison réduit fortement sa consommation :

- notification **« Tempo rouge HP »** sur le téléphone de Sébastien,
- **mise hors tension** des prises non essentielles (mêmes étiquettes que la routine de départ),
- **mise hors tension** des prises portant l'étiquette « à couper en jour rouge »,
- réglage des **batteries de stockage** :
    - **limite d'entrée** ramenée à **0 W** (plus de charge depuis le réseau),
- réglage de la **batterie photovoltaïque** :
    - **limite de sortie** à **200 W**,
    - **mode de fonctionnement AC** : sortie (décharge sur le réseau),
- **extinction** du chauffage d'appoint mobile,
- bascule du **convecteur prise « petit Mars »** en mode « Tempo rouge »,
- **extinction** du chauffage de la pompe à chaleur,
- **abaissement** de la consigne d'eau chaude à **40 °C** en mode performance.

Les bascules de la pompe à chaleur sont **réessayées jusqu'à 10 fois**, à 1 minute d'intervalle.

#### Fin du jour rouge (passage en heures creuses, lendemain non rouge)

<!-- source: script:energy_tempo_red_end -->

Quand la maison passe en **heures creuses**, que le **jour en cours est rouge** **et** que le **lendemain n'est pas rouge**, la maison revient à un fonctionnement normal :

- notification **« Fin Tempo rouge »** sur le téléphone de Sébastien,
- **réalimentation** des prises « à allumer par défaut »,
- réglage des **batteries de stockage** :
    - capacité maximale ramenée à **80 %**, minimale à **10 %**,
    - **limite d'entrée** revenue à **900 W**,
- réglage de la **batterie photovoltaïque** :
    - capacité maximale à **80 %**,
    - **limite de sortie** à **200 W**,
    - **mode de fonctionnement AC** : entrée,
- bascule du **convecteur prise « petit Mars »** en mode « Normal »,
- **allumage** du chauffage de la pompe à chaleur,
- réglage de la **consigne d'eau chaude** à **55 °C** en mode performance (la maison vérifie que la consigne lue est revenue à 53 °C, à 2 °C près).

## Utilisée par

- la fonction [tarif Tempo](tarif-tempo.md) — c'est cette page qui décrit le contexte tarifaire ; l'orchestration ci-dessus en est l'application.
- la routine de [départ](../routines/depart.md) — partage la fonction de mise hors tension utilisée pendant un jour rouge en heure pleine.
