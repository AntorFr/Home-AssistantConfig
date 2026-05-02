<!-- source: package:packages/integrations/linky.yaml, package:packages/routines/scripts.yaml -->

# Tarif Tempo et période tarifaire

## But

Exposer les **informations tarifaires** issues du compteur Linky et permettre à la maison d'**adapter son comportement** aux périodes coûteuses, en particulier pour la réalimentation des prises au retour.

## Périmètre

- la **couleur du jour Tempo** (bleu, blanc, rouge), exposée par l'intégration Linky,
- la **période tarifaire** courante (heures pleines / heures creuses), avec un planning de secours en cas d'indisponibilité de la donnée Linky,
- l'**utilisation** de ces informations dans la routine de retour pour gating des prises.

## Règles de fonctionnement

### Période tarifaire (HP / HC)

<!-- source: template:sensor:teleinfo_periode_tarifaire, schedule:backup_hp_schedule -->

La maison expose un indicateur **« Période tarifaire »** qui prend la valeur **HP** (heure pleine) ou **HC** (heure creuse).

- Si l'intégration Linky fournit une valeur valide (HP ou HC), c'est cette valeur qui est utilisée.
- **Sinon**, la maison utilise un **planning de secours** : tous les jours de la semaine, l'indicateur est **HP entre 6h et 22h** et **HC le reste du temps**.

L'origine de la valeur est exposée via un attribut indiquant `linky` ou `backup_hc_schedule`, ce qui permet de savoir à tout moment si la donnée est issue du compteur ou du planning de secours.

### Couleur du jour Tempo

La couleur du jour Tempo (bleu, blanc, rouge) est exposée directement par l'intégration Linky. Elle n'est pas calculée par la maison.

### Gating des prises au retour

<!-- source: script:routine_all_power_device_on -->

Lors de la routine de retour, la maison réalimente les prises portant l'étiquette interne **« à allumer par défaut »**. Si la **journée Tempo en cours est rouge** **et** que la maison est en **heure pleine** au moment du retour :

- la maison **n'allume pas** les prises portant en plus l'étiquette **« à couper en jour rouge »**,
- toutes les autres prises « à allumer par défaut » sont rallumées normalement.

Dans tous les autres cas (jour bleu, jour blanc, ou jour rouge en heure creuse), toutes les prises « à allumer par défaut » sont rallumées sans exception.

### Orchestration automatique aux transitions Tempo Rouge

L'arrivée et la fin d'un **jour rouge Tempo** déclenchent une orchestration automatique de la maison (chauffage, eau chaude, batteries de stockage, prises non essentielles). Cette orchestration est décrite en détail dans la fonction [suivi de l'énergie](suivi-energie.md).

## Utilisée par

- la routine de [départ](../routines/depart.md) — gating des prises lors du retour,
- la fonction [suivi de l'énergie](suivi-energie.md) — orchestration des équipements lors des transitions Tempo Rouge.
