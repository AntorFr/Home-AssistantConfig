# La maison

Cette documentation décrit le fonctionnement automatique de la maison : ce qu'elle fait, quand, et pourquoi. Elle s'adresse aux occupants et à toute personne qui souhaite comprendre comment vivre avec cette maison sans avoir à plonger dans sa configuration technique.

## Comment lire cette doc

Trois grandes entrées :

- **[Pièces](pieces/)** — pour comprendre ce qui se passe dans un endroit précis (le salon, la cuisine, une chambre…). Chaque pièce décrit ses comportements automatiques et son rôle dans les scénarios globaux.
- **[Routines](routines/)** — les scénarios qui couvrent toute la maison ou la vie d'une famille : le départ, le retour, la journée, la nuit, les enfants. Chaque routine décrit ce qu'elle déclenche et dans quelles conditions.
- **[Fonctions transverses](fonctions/)** — les comportements qui dépassent une pièce unique : la détection de présence, l'éclairage, le chauffage, la musique, les notifications… Chaque fonction définit des règles utilisées par les pièces et les routines.

Les pages sont reliées entre elles. Quand une pièce mentionne une fonction ou une routine, un lien permet d'aller en consulter le détail.

## Principes généraux

La maison s'appuie sur quelques idées récurrentes :

- **Présence** — la maison sait qui est là, qui est dehors, qui dort. Beaucoup de comportements en découlent : le chauffage bascule en mode économique en cas d'absence prolongée, les routines globales attendent qu'aucun occupant ne soit présent avant de se déclencher, la présence d'un invité neutralise certaines automatisations.
- **Routines de vie** — la maison réagit à des moments structurants : un départ, un retour, un coucher, un réveil, un week-end. Chaque moment déclenche un ensemble cohérent d'actions.
- **Confort par défaut** — les éclairages s'adaptent au moment de la journée et à la luminosité naturelle, l'ambiance musicale par défaut tient compte de l'heure et de l'occupant. L'occupant peut toujours reprendre la main manuellement (interrupteurs, télécommandes, commandes vocales).

## Convention de lecture

Le fonctionnement décrit dans cette documentation est celui qui est réellement programmé dans la maison. Aucune fonctionnalité n'est mentionnée si elle n'est pas effectivement configurée. Les valeurs chiffrées (durées, seuils, plages horaires) sont reprises littéralement.
