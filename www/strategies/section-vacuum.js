// section-vacuum.js
// Stratégie de section pour les aspirateurs robots de sol.
//
// Rendu (compact, comme avant) : la carte du robot, puis une rangée de pièces
// que l'on coche, et un bouton « play » qui lance le nettoyage des pièces cochées.
//
// Principe agnostique : on ne code en dur ni l'entité du robot, ni les numéros de
// segments. Les pièces nettoyables viennent du mapping natif « segments → areas »
// de HA (`options.vacuum.area_mapping`, fait dans la fiche de l'aspirateur), et le
// lancement passe par l'action native `vacuum.clean_area`. On remplace un robot ?
// on refait le mapping dans HA, rien ici ne bouge.
//
// === Usage ===
//   strategy:
//     type: custom:vacuum-section
//     rooms: [cuisine, salle_a_manger, salon, entree]   # pièces affichées (area_id|nom)
//     heading: Aspirateur                                # optionnel
//
// Options :
//   rooms             : pièces à proposer (area_id|nom). Défaut : toutes celles du robot.
//   area / floor      : périmètre (limite les robots et les pièces). Défaut : maison.
//   heading           : titre en tête (optionnel).
//   select_prefix     : préfixe des helpers de sélection. Défaut "vacuum_select_".
//   clean_script      : script de lancement. Défaut "script.vacuum_clean_selection".
//   exclude           : entité(s) aspirateur à ignorer (ex. robot décommissionné).
//   exclude_platforms : plateforme(s) supplémentaire(s) à écarter (piscine déjà exclue).
//   show_maintenance  : ajoute un bloc entretien compact (réservoirs, consommables). Défaut false.
//   all_robots        : afficher aussi les robots sans pièce à proposer (pilotage seul). Défaut false.
//
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

/* ── helpers registres ───────────────────────────────────────── */

async function getRegistries(hass) {
  const [areas, devices, entities, floors] = await Promise.all([
    hass.callWS({ type: "config/area_registry/list" }),
    hass.callWS({ type: "config/device_registry/list" }),
    hass.callWS({ type: "config/entity_registry/list" }),
    hass.callWS({ type: "config/floor_registry/list" }).catch(() => []),
  ]);
  return { areas, devices, entities, floors };
}

const resolveArea = (areas, key) =>
  !key
    ? undefined
    : areas.find((a) => a.area_id === key) ||
      areas.find((a) => a.name.toLowerCase() === String(key).toLowerCase());

const resolveFloor = (floors, key) =>
  !key
    ? undefined
    : floors.find((f) => f.floor_id === key) ||
      floors.find((f) => (f.name || "").toLowerCase() === String(key).toLowerCase());

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

const friendly = (hass, id) =>
  hass.states[id]?.attributes?.friendly_name || id;

// Plateformes d'aspirateurs qui ne sont pas des robots de sol (piscine…).
const NON_FLOOR_PLATFORMS = ["mydolphin_plus"];

/* ── entretien (optionnel, par translation_key) ──────────────── */

const roborockId = (device) =>
  device?.identifiers?.find((i) => i[0] === "roborock")?.[1] || null;

// Réservoirs / consommables les plus utiles (durées de vie + dock).
const MAINT_KEYS = [
  "dirty_box_full",
  "clean_box_empty",
  "water_shortage",
  "main_brush_time_left",
  "side_brush_time_left",
  "filter_time_left",
  "sensor_time_left",
];

/* ── stratégie ───────────────────────────────────────────────── */

class VacuumSectionStrategy {
  static async generate(config, hass) {
    const { areas, devices, entities, floors } = await getRegistries(hass);

    // Périmètre d'areas (optionnel).
    let scope = null;
    if (config?.area) {
      const a = resolveArea(areas, config.area);
      if (!a) throw new Error(`Area introuvable : ${config.area}`);
      scope = new Set([a.area_id]);
    } else if (config?.floor) {
      const f = resolveFloor(floors, config.floor);
      if (!f) throw new Error(`Floor introuvable : ${config.floor}`);
      scope = new Set(
        areas.filter((x) => x.floor_id === f.floor_id).map((x) => x.area_id)
      );
    }

    const selectPrefix = config?.select_prefix ?? "vacuum_select_";
    const cleanScript = config?.clean_script ?? "script.vacuum_clean_selection";
    const showMaint = config?.show_maintenance ?? false;

    const areaById = new Map(areas.map((a) => [a.area_id, a]));
    const deviceById = new Map(devices.map((d) => [d.id, d]));

    const excluded = new Set(asList(config?.exclude).map(String));
    const excludePlatforms = new Set([
      ...NON_FLOOR_PLATFORMS,
      ...asList(config?.exclude_platforms),
    ]);

    // Pièces demandées (dans l'ordre de la config), en area_id.
    const requestedRooms = asList(config?.rooms)
      .map((r) => resolveArea(areas, r))
      .filter(Boolean)
      .map((a) => a.area_id);

    // Robots : aspirateurs de sol disponibles, hors exclusions.
    const vacuums = entities.filter((e) => {
      if (!e.entity_id.startsWith("vacuum.")) return false;
      if (excludePlatforms.has(e.platform)) return false;
      if (e.disabled_by || e.hidden_by) return false;
      if (excluded.has(e.entity_id)) return false;
      return hass.states[e.entity_id]?.state !== "unavailable";
    });

    const robots = [];
    for (const v of vacuums) {
      const mapping = v.options?.vacuum?.area_mapping || {};
      const mapped = Object.keys(mapping).filter((aid) => areaById.has(aid));
      // Pièces à afficher : celles demandées (si fournies) sinon toutes,
      // toujours limitées à ce que CE robot sait faire et au périmètre.
      let rooms = (requestedRooms.length ? requestedRooms : mapped).filter(
        (aid) => mapped.includes(aid) && (scope ? scope.has(aid) : true)
      );
      if (!requestedRooms.length) {
        rooms.sort((a, b) =>
          areaById.get(a).name.localeCompare(areaById.get(b).name, undefined, {
            sensitivity: "base",
          })
        );
      }
      // Un robot sans pièce à proposer est masqué, sauf si all_robots.
      if (rooms.length === 0 && !config?.all_robots) continue;
      robots.push({ entity: v.entity_id, deviceId: v.device_id, rooms });
    }

    const cards = [];
    if (config?.heading) {
      cards.push({
        type: "heading",
        heading: config.heading,
        heading_style: "title",
        icon: "bha:roborock",
      });
    }

    if (robots.length === 0) {
      cards.push({
        type: "markdown",
        content: "Aucun aspirateur disponible.",
      });
      return { cards };
    }

    const multiRobot = robots.length > 1;
    for (const robot of robots) {
      cards.push(
        ...this.robotCards(robot, {
          hass,
          entities,
          deviceById,
          areaById,
          selectPrefix,
          cleanScript,
          showMaint,
          multiRobot,
        })
      );
    }

    return { cards };
  }

  static robotCards(robot, ctx) {
    const { hass, areaById, selectPrefix, cleanScript, multiRobot } = ctx;
    const cards = [];

    // Petit titre seulement s'il y a plusieurs robots.
    if (multiRobot) {
      cards.push({
        type: "custom:mushroom-title-card",
        title: "",
        subtitle: friendly(hass, robot.entity),
      });
    }

    // Carte du robot (compacte).
    cards.push({
      type: "custom:mushroom-vacuum-card",
      entity: robot.entity,
      name: friendly(hass, robot.entity),
      icon: "bha:roborock",
      icon_animation: true,
      commands: ["start_pause", "return_home", "stop"],
      layout: "horizontal",
    });

    // Rangée : pièces cochables + bouton play.
    if (robot.rooms.length) {
      const row = [];
      for (const aid of robot.rooms) {
        const area = areaById.get(aid);
        const helper = `input_boolean.${selectPrefix}${aid}`;
        if (!hass.states[helper]) continue;
        row.push({
          type: "custom:mushroom-template-card",
          primary: area.name,
          icon: area.icon || "mdi:sofa",
          layout: "vertical",
          entity: helper,
          tap_action: { action: "toggle" },
          hold_action: { action: "none" },
          double_tap_action: { action: "none" },
          icon_color: '{% if is_state(entity,"on") %}blue{% else %}grey{% endif %}',
        });
      }
      // Bouton play : lance la sélection ; appui long = retour à la base.
      row.push({
        type: "custom:mushroom-template-card",
        primary: "",
        secondary: "Lancer",
        icon: "mdi:motion-play-outline",
        icon_color: "green",
        layout: "vertical",
        tap_action: {
          action: "perform-action",
          perform_action: cleanScript,
          data: { vacuum: robot.entity, areas: robot.rooms },
        },
        hold_action: {
          action: "perform-action",
          perform_action: "vacuum.return_to_base",
          target: { entity_id: robot.entity },
        },
        double_tap_action: {
          action: "perform-action",
          perform_action: "vacuum.return_to_base",
          target: { entity_id: robot.entity },
        },
      });
      cards.push({ type: "horizontal-stack", cards: row });
    }

    // Entretien compact (optionnel).
    if (ctx.showMaint) {
      const ids = this.maintenanceEntities(robot, ctx);
      if (ids.length) {
        cards.push({
          type: "custom:mushroom-chips-card",
          chips: ids.map((id) => ({
            type: "entity",
            entity: id,
            content_info: "none",
          })),
        });
      }
    }

    return cards;
  }

  /** Entités d'entretien utiles (robot + dock), par translation_key. */
  static maintenanceEntities(robot, ctx) {
    const { hass, entities, deviceById } = ctx;
    const robotDevice = deviceById.get(robot.deviceId);
    const duid = roborockId(robotDevice);
    const deviceIds = new Set([robot.deviceId]);
    if (duid) {
      for (const d of deviceById.values()) {
        const id = roborockId(d);
        if (id && id.toLowerCase().startsWith(duid.toLowerCase()))
          deviceIds.add(d.id);
      }
    }
    const byKey = new Map();
    for (const e of entities) {
      if (!deviceIds.has(e.device_id)) continue;
      if (e.disabled_by || e.hidden_by) continue;
      if (e.translation_key) byKey.set(e.translation_key, e.entity_id);
    }
    return MAINT_KEYS.map((k) => byKey.get(k)).filter(
      (id) => id && hass.states[id]
    );
  }
}

customElements.define("ll-strategy-vacuum-section", VacuumSectionStrategy);
