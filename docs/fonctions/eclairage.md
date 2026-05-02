<!-- source: package:packages/functions/lights.yaml, blueprint:antorfr/motion_light.yaml -->

# Éclairage

## But

Faire en sorte que la lumière s'allume et s'éteigne **automatiquement** dans les pièces équipées, en s'adaptant au moment de la journée et à la luminosité ambiante. Cette page décrit le **mécanisme commun** utilisé par les pièces. Les seuils, durées et particularités propres à chaque pièce sont indiqués dans la page de la pièce concernée.

## Périmètre

L'éclairage automatique s'appuie sur deux mécanismes complémentaires :

- une **logique d'allumage et d'extinction** basée sur la détection de mouvement, la luminosité ambiante et l'éventuelle inactivité,
- une **adaptation continue** de la couleur et de l'intensité lorsque l'éclairage est allumé.

Les deux sont configurés au cas par cas dans chaque pièce qui les utilise.

## Règles de fonctionnement

### Allumage et extinction par mouvement

<!-- source: blueprint:antorfr/motion_light.yaml -->

Chaque pièce automatisée s'appuie sur un mécanisme commun, paramétré par les valeurs propres à la pièce. Le mécanisme combine plusieurs déclencheurs.

**Allumage** : la lumière s'allume lorsqu'un **mouvement est détecté** dans la pièce, à la condition que :

- l'allumage automatique soit **activé** dans la pièce (pas de neutralisation en cours, voir ci-dessous),
- si la pièce est configurée pour ne s'allumer **que la nuit**, le soleil soit couché,
- l'une au moins des conditions suivantes soit vraie :
  - la pièce ne dispose **pas de capteur de luminosité**, ou la valeur n'est pas disponible,
  - la **luminosité mesurée** est **inférieure ou égale au seuil bas** propre à la pièce,
  - une lumière du groupe est **déjà allumée**.

**Allumage par chute de luminosité** : si la luminosité passe **sous le seuil bas** alors qu'une présence est active dans la pièce, la lumière s'allume — sauf si l'éclairage vient d'être éteint moins de 10 secondes auparavant (pour éviter un re-déclenchement immédiat après extinction manuelle).

**Extinction par excès de lumière** : si la luminosité dépasse le **seuil haut** propre à la pièce, la lumière s'éteint. Ce seuil correspond typiquement à l'apparition du soleil dans la pièce.

**Extinction par absence de mouvement** : passé un **délai d'attente** propre à la pièce sans aucun mouvement, la lumière s'éteint.

**Avertissement avant extinction** : si la pièce est configurée pour, l'intensité est **réduite de 50 %** un certain temps avant l'extinction. L'avertissement n'a lieu que si aucune nouvelle présence n'est détectée pendant la temporisation. Un mouvement annule l'avertissement.

**Sécurité « capteur indisponible »** : si tous les capteurs de mouvement de la pièce passent en indisponible alors que la lumière reste allumée trop longtemps, la lumière est éteinte automatiquement.

### Neutralisation par interrupteur logique

<!-- source: blueprint:antorfr/motion_light.yaml -->

Chaque pièce peut être associée à un ou plusieurs **interrupteurs logiques** (« kill switch »). Tant qu'au moins un de ces interrupteurs est actif :

- l'allumage automatique sur mouvement est désactivé,
- l'avertissement avant extinction est désactivé,
- les **commandes manuelles** déclarées dans la pièce (interrupteurs physiques, télécommandes) restent fonctionnelles et permettent d'allumer, éteindre ou basculer la lumière indépendamment.

L'usage de ce mécanisme est propre à chaque pièce (par exemple un mode TV qui suspend l'allumage automatique tant que le téléviseur est allumé).

### Adaptation automatique de la lumière

<!-- source: adaptive_lighting:Salon, adaptive_lighting:Salle a manger, adaptive_lighting:Cuisine, adaptive_lighting:Couloir etage, adaptive_lighting:default, adaptive_lighting:entree, adaptive_lighting:Chambre Emilie, adaptive_lighting:Chambre Timothée, adaptive_lighting:Salle de douche, adaptive_lighting:Chambre parent -->

Lorsqu'un éclairage piloté est allumé, l'**intensité** et la **température de couleur** sont ajustées automatiquement en fonction du moment de la journée. Cette adaptation est configurée par groupe d'éclairages.

**Forçage manuel respecté** : tous les groupes sont configurés en mode « take over control ». Si l'occupant force manuellement une intensité ou une couleur (interrupteur physique, application, télécommande), l'adaptation **cesse de modifier** cet éclairage tant qu'il reste dans cet état forcé.

**Démarrage manuel pris en compte** : pour le salon, l'adaptation ne se déclenche que sur un allumage « simple » (sans paramètres). Un allumage avec une couleur ou une scène explicite est laissé tel quel.

**Intensité minimale** : chaque groupe a une intensité minimale en dessous de laquelle l'adaptation ne descend pas en pleine nuit.

| Groupe d'éclairages | Intensité minimale | Particularité |
|---------------------|-------------------|---------------|
| Salon | 20 % | l'adaptation ne ramène pas l'éclairage à sa teinte « soir » avant 19 h |
| Salle à manger | 35 % | idem 19 h |
| Cuisine | 35 % | idem 19 h |
| Couloir étage et escalier | 15 % | descend à 5 % en mode sommeil |
| Toilettes du rez-de-chaussée, toilettes de l'étage, buanderie | 10 % | en mode sommeil, lumière forcée en **rouge** |
| Entrée (spots et vestibule) | par défaut | aucun réglage spécifique |
| Chambre d'Émilie | par défaut | la transition de teinte « soir » est calée au plus tard à 21 h |
| Chambre de Timothée | par défaut | la transition de teinte « soir » est calée au plus tard à 21 h |
| Salle de douche (plafonnier dressing, plafonnier salle de douche, lumière douche) | par défaut | aucun réglage spécifique |
| Chambre parents (plafonnier et deux lampes Hue Go) | 10 % | descend à 5 % en mode sommeil |

## Cas particuliers

- **Toilettes en mode sommeil** : lorsque la maison est en mode sommeil, la lumière des toilettes (RDC et étage) et de la buanderie passe en **rouge**, à intensité minimale.
- **Variante « extinction seule »** : le mécanisme commun peut être configuré pour ne **jamais allumer** la lumière, mais seulement l'éteindre quand l'absence de mouvement est constatée. Cet usage est propre à certaines pièces et précisé dans leur page.

## Utilisée par

- toutes les [pièces](../pieces/) équipées d'éclairages automatisés.
