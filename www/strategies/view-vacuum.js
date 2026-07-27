// view-vacuum.js
// Stratégie de VUE : génère toute la page « Aspirateurs ».
//
// Pour chaque aspirateur de sol découvert, elle produit plusieurs sections
// séparées qui se répartissent en colonnes (affichage large plutôt qu'une seule
// longue colonne) :
//   - « Pilotage »      : carte du robot (avec ses commandes) ;
//   - « Carte »         : plan du logement (image) ;
//   - « Dock »          : réservoirs et état de la base ;
//   - « Consommables »  : durées de vie (brosses, filtre, capteurs…).
//
// Les robots indisponibles sont affichés eux aussi (utile de voir qu'ils sont
// hors ligne) ; leurs sections annexes (carte/dock/entretien) sont alors omises.
//
// Tout est agnostique : robots découverts à la volée, entités d'entretien
// retrouvées par le device du robot + son dock. Aucun entity_id en dur.
//
// === Usage (au niveau d'une VUE) ===
//   strategy:
//     type: custom:vacuum-view
//     exclude: vacuum.roborock_s7      # optionnel
//     max_columns: 3                   # optionnel (défaut 3)
//
// Options :
//   exclude           : entité(s) aspirateur à ignorer (ex. robot décommissionné).
//   exclude_platforms : plateforme(s) supplémentaire(s) à écarter (piscine déjà exclue).
//   max_columns       : nombre de colonnes de la vue. Défaut 3.
//
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

/* ── helpers ─────────────────────────────────────────────────── */

async function getRegistries(hass) {
  const [devices, entities] = await Promise.all([
    hass.callWS({ type: "config/device_registry/list" }),
    hass.callWS({ type: "config/entity_registry/list" }),
  ]);
  return { devices, entities };
}

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const friendly = (hass, id) =>
  hass.states[id]?.attributes?.friendly_name || id;
const isAvailable = (hass, id) =>
  hass.states[id] && hass.states[id].state !== "unavailable";

const NON_FLOOR_PLATFORMS = ["mydolphin_plus"];
const roborockId = (device) =>
  device?.identifiers?.find((i) => i[0] === "roborock")?.[1] || null;

// Réservoirs / état du dock (base).
const DOCK_KEYS = [
  "dirty_box_full",
  "clean_box_empty",
  "clean_fluid_empty",
  "water_shortage",
  "mop_drying_status",
];
// Consommables (durée de vie).
const CONSUMABLE_KEYS = [
  "main_brush_time_left",
  "side_brush_time_left",
  "filter_time_left",
  "sensor_time_left",
  "strainer_time_left",
  "cleaning_brush_time_left",
];

/* ── stratégie de vue ────────────────────────────────────────── */

class VacuumViewStrategy {
  static async generate(config, hass) {
    const { devices, entities } = await getRegistries(hass);
    const deviceById = new Map(devices.map((d) => [d.id, d]));

    const excluded = new Set(asList(config?.exclude).map(String));
    const excludePlatforms = new Set([
      ...NON_FLOOR_PLATFORMS,
      ...asList(config?.exclude_platforms),
    ]);

    // Robots : aspirateurs de sol, y compris indisponibles (hors exclusions).
    let vacuums = entities.filter((e) => {
      if (!e.entity_id.startsWith("vacuum.")) return false;
      if (excludePlatforms.has(e.platform)) return false;
      if (e.disabled_by || e.hidden_by) return false;
      if (excluded.has(e.entity_id)) return false;
      return !!hass.states[e.entity_id];
    });
    // Disponibles d'abord, puis par nom.
    vacuums.sort((a, b) => {
      const av = isAvailable(hass, a.entity_id) ? 0 : 1;
      const bv = isAvailable(hass, b.entity_id) ? 0 : 1;
      if (av !== bv) return av - bv;
      return friendly(hass, a.entity_id).localeCompare(
        friendly(hass, b.entity_id),
        undefined,
        { sensitivity: "base" }
      );
    });

    const ctx = { hass, entities, deviceById };
    const sections = [];

    for (const v of vacuums) {
      const robot = { entity: v.entity_id, deviceId: v.device_id };
      const name = friendly(hass, robot.entity);
      const multi = vacuums.length > 1;

      sections.push(this.pilotageSection(robot, name, ctx));

      // Sections annexes seulement si le robot est en ligne.
      if (isAvailable(hass, robot.entity)) {
        const { image, dock, consumables } = this.gather(robot, ctx);
        if (image) sections.push(this.mapSection(image, name, multi));
        if (dock.length) sections.push(this.tilesSection("Dock", "mdi:water-alert", dock, name, multi));
        if (consumables.length)
          sections.push(
            this.tilesSection("Consommables", "mdi:wrench-clock", consumables, name, multi)
          );
      }
    }

    if (sections.length === 0) {
      sections.push({
        type: "grid",
        cards: [{ type: "markdown", content: "Aucun aspirateur." }],
      });
    }

    return {
      type: "sections",
      max_columns: config?.max_columns ?? 3,
      sections,
    };
  }

  static heading(text, icon, style = "title") {
    return { type: "heading", heading: text, heading_style: style, icon };
  }

  /* Pilotage : une seule carte du robot avec ses commandes. */
  static pilotageSection(robot, name, ctx) {
    return {
      type: "grid",
      cards: [
        this.heading(name, "bha:roborock"),
        {
          type: "tile",
          entity: robot.entity,
          vertical: true,
          features: [
            {
              type: "vacuum-commands",
              commands: [
                "start_pause",
                "stop",
                "return_home",
                "clean_spot",
                "locate",
              ],
            },
          ],
          features_position: "bottom",
          grid_options: { columns: 9, rows: 3 },
        },
      ],
    };
  }

  static mapSection(image, name, multi) {
    return {
      type: "grid",
      cards: [
        this.heading(multi ? `${name} · Carte` : "Carte", "mdi:map-outline"),
        {
          type: "picture-entity",
          entity: image,
          show_name: false,
          show_state: false,
        },
      ],
    };
  }

  static tilesSection(title, icon, ids, name, multi) {
    const cards = [this.heading(multi ? `${name} · ${title}` : title, icon)];
    for (const id of ids)
      cards.push({ type: "tile", entity: id, grid_options: { columns: 6 } });
    return { type: "grid", cards };
  }

  /* Regroupe image + entités d'entretien (robot + dock), par translation_key. */
  static gather(robot, ctx) {
    const { hass, entities, deviceById } = ctx;
    const duid = roborockId(deviceById.get(robot.deviceId));
    const deviceIds = new Set([robot.deviceId]);
    if (duid) {
      for (const d of deviceById.values()) {
        const id = roborockId(d);
        if (id && id.toLowerCase().startsWith(duid.toLowerCase()))
          deviceIds.add(d.id);
      }
    }
    const byKey = new Map();
    let image = null;
    for (const e of entities) {
      if (!deviceIds.has(e.device_id)) continue;
      if (e.disabled_by || e.hidden_by) continue;
      if (e.translation_key) byKey.set(e.translation_key, e.entity_id);
      if (!image && e.entity_id.startsWith("image.") && hass.states[e.entity_id])
        image = e.entity_id;
    }
    const pick = (keys) =>
      keys.map((k) => byKey.get(k)).filter((id) => id && hass.states[id]);
    return { image, dock: pick(DOCK_KEYS), consumables: pick(CONSUMABLE_KEYS) };
  }
}

customElements.define("ll-strategy-vacuum-view", VacuumViewStrategy);
