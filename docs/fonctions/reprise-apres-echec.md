<!-- source: package:packages/functions/retry.yaml -->

# Reprise après échec — verrouillage et déverrouillage des serrures

## But

Garantir qu'une commande de **verrouillage** ou de **déverrouillage** d'une serrure connectée aboutisse, même si une première tentative échoue (problème de communication, état temporairement inaccessible).

## Périmètre

La fonction couvre uniquement les **serrures connectées** de la maison. Elle est utilisée par les routines qui ferment ou ouvrent les serrures en lot, par exemple la routine de [départ](../routines/depart.md) et la routine de retour.

## Règles de fonctionnement

### Réessai du déverrouillage d'une serrure

<!-- source: script:unlock_retry -->

Pour une serrure donnée, la maison répète l'opération de déverrouillage tant que :

- la serrure n'est pas dans l'état **« déverrouillée »**,
- **et** le nombre maximum de tentatives n'a pas été atteint.

Entre deux tentatives, elle attend que la serrure passe à l'état déverrouillée, jusqu'à concurrence d'un **délai d'attente** configurable.

Valeurs par défaut :

- **délai entre deux tentatives** : 1 minute,
- **nombre maximum de tentatives** : 10.

### Réessai du verrouillage d'une serrure

<!-- source: script:lock_retry -->

Symétrique au déverrouillage : la maison répète tant que la serrure n'est pas dans l'état **« verrouillée »**, avec les mêmes valeurs par défaut (1 minute entre deux tentatives, 10 tentatives au maximum).

### Application en lot

<!-- source: script:unlock_many_retry, script:lock_many_retry -->

Deux variantes prennent une **liste de serrures** plutôt qu'une seule. Chaque serrure de la liste est traitée par la procédure individuelle décrite ci-dessus, en parallèle.

## Utilisée par

- la routine de [départ](../routines/depart.md) — verrouillage en partant, déverrouillage au retour.
