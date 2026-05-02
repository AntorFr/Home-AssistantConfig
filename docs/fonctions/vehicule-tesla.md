<!-- source: package:packages/integrations/tesla.yaml -->

# Véhicule Tesla

## But

Préparer la voiture **avant un départ** (climat, dégivrage, déverrouillage) et **protéger l'habitacle** d'une surchauffe quand la voiture est garée à la maison.

## Périmètre

Le véhicule Tesla principal de la maison.

## Règles de fonctionnement

### Préparation au départ

<!-- source: script:integration_tesla_ready_to_leave, intent:readyTesla -->

Une commande dédiée — déclenchable manuellement ou par **commande vocale** (« prépare la voiture ») — exécute la séquence suivante :

1. la maison annonce vocalement « **Préparation de la voiture en cours.** »,
2. la **climatisation** de l'habitacle est réglée à **23 °C** en mode chauffage/climatisation automatique, en preset **« keep »** (maintien continu),
3. **si la température extérieure est inférieure à 5 °C**, le **dégivrage** est activé,
4. **si la voiture est à la maison**, la **voiture est déverrouillée**,
5. **si le câble de recharge est verrouillé**, il est **déverrouillé**,
6. la maison **attend pendant 10 minutes** que l'utilisateur monte dans la voiture (signal « utilisateur présent »),
7. **si l'utilisateur monte avant la fin du délai**, la séquence s'arrête (la voiture est prête à partir),
8. **si l'utilisateur ne monte pas dans les 10 minutes**, la maison **annule la préparation** :
    - le **dégivrage** est désactivé,
    - la **climatisation** est éteinte (preset off, mode hvac off, consigne 23 °C),
    - la **voiture est reverrouillée**.

### Aération intelligente en cas de surchauffe

<!-- source: automation:integration_tesla_smart_overheat -->

Quand la voiture est **garée à la maison** et qu'**aucun utilisateur n'est à bord**, la maison surveille la température intérieure de l'habitacle :

| Déclencheur | Action |
|---|---|
| **T° intérieure > 40 °C** | les **fenêtres sont ouvertes**. **Si le câble de recharge est encore verrouillé**, la **ventilation forcée** est activée (mode « fan only » de la protection contre la surchauffe) |
| **T° intérieure < 35 °C** | si les fenêtres étaient ouvertes, elles sont **fermées** et la ventilation forcée est éteinte |
| **Mode nuit** de la maison s'active | si les fenêtres sont ouvertes, elles sont **fermées**, la ventilation est éteinte, et la voiture est **verrouillée** |

## Utilisée par

- la page [véhicules](../pieces/cars.md) — boutons embarqués qui pilotent le portail et les portes de garage.
- la fonction [système de sécurité](alarme-systeme-securite.md) — le verrouillage automatique de la voiture en mode nuit s'inscrit dans la mise en sécurité globale.
