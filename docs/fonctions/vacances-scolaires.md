<!-- source: package:packages/functions/vacances_scolaires.yaml -->

# Vacances scolaires

## But

Mettre à disposition de la maison l'information « **est-on en vacances scolaires ou en jour férié aujourd'hui ?** » et « demain ? », pour adapter les routines des enfants (lever, coucher, fermeture des volets en semaine, ambiance musicale du soir).

## Périmètre

Les vacances scolaires utilisées sont celles de la **zone correspondant à Nantes**, fournies par le portail open data de l'Éducation nationale. La maison consulte cette source toutes les **30 minutes**.

## Règles de fonctionnement

### Source des dates

<!-- source: sensor:vacances_scolaires -->

La maison récupère, depuis l'API publique de l'Éducation nationale, l'épisode de vacances **suivant ou en cours** pour la zone de Nantes. Elle expose en lecture :

- la **date de début** et la **date de fin** de cet épisode,
- une **description courte** de l'épisode (par exemple « Vacances de la Toussaint »).

L'indicateur principal est une chaîne au format :

- pendant une période de vacances : « _\<description>_ jusqu'au _\<date de fin>_ »,
- en dehors d'une période : « prochaines : _\<description>_ _\<date de début>_ ».

### Indicateur du jour

<!-- source: template:binary_sensor:vacances_scolaires_aujourdhui, template:binary_sensor:school_holliday_active -->

Deux indicateurs distincts pour la journée courante :

| Indicateur | Sens |
|---|---|
| **Vacances scolaires aujourd'hui** | la journée courante est dans la période de vacances **ou** est un jour non travaillé (week-end, jour férié) |
| **Vacances actives** | la journée courante est strictement dans la période de vacances scolaires |

Le premier indicateur est celui utilisé par les routines pour décider si les contraintes scolaires s'appliquent ; le second sert à l'affichage du nom des vacances sur le tableau de bord.

### Indicateur de demain

<!-- source: template:binary_sensor:vacances_scolaires_demain -->

Un indicateur **« vacances scolaires demain »** est vrai si **demain** est dans la période de vacances **ou** est un jour non travaillé. Il est utilisé pour décider la fermeture automatique des volets des chambres des enfants la veille au soir, et pour caler les heures de coucher utilisées par l'ambiance musicale.

## Utilisée par

- la fonction [musique](musique.md) — les heures de coucher des enfants et la fin de soirée varient selon que demain est ou non travaillé,
- la routine de [départ](../routines/depart.md) (indirectement, via la routine des enfants pour les volets en semaine).
