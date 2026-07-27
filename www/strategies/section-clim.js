// section-clim.js
// Stratégie de section pour la climatisation d'une pièce.
//
// === Strategy : Section (une area) ===
//   strategy:
//     type: custom:clim-area-section
//     area: chambre_emilie             # area_id ou nom (obligatoire)
//     climate: climate.baillconnect_chambre_emilie   # optionnel : entité(s) clim explicite(s).
//                                       #   Si absent, recherche les clim de la pièce.
//     bedtime: input_datetime.children_night_time     # optionnel : heure de couché à afficher
//     auto: automation.xxx             # optionnel : automatisation d'auto-régulation.
//                                       #   Défaut : automation dont l'id vaut "<area_id>_clim_auto".
//     heading: Climatisation           # optionnel
//     heading_icon: mdi:air-conditioner # optionnel
//
// Rend : un titre, une carte de pilotage par climatiseur, un interrupteur
// "auto" (activer/désactiver la régulation automatique) et, en option,
// l'heure de couché utilisée pour le pré-refroidissement.
//
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

/* ── helpers ─────────────────────────────────────────────────── */

async function getRegistries(hass) {
  const [areas, devices, entities] = await Promise.all([
    hass.callWS({ type: "config/area_registry/list" }),
    hass.callWS({ type: "config/device_registry/list" }),
    hass.callWS({ type: "config/entity_registry/list" }),
  ]);
  return { areas, devices, entities };
}

const resolveArea = (areas, key) => {
  if (!key) return undefined;
  return (
    areas.find((a) => a.area_id === key) ||
    areas.find((a) => a.name.toLowerCase() === String(key).toLowerCase())
  );
};

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

/**
 * Trouve les climatiseurs (plateforme BaillConnect) assignés à une area.
 * Une entité est "dans l'area" si :
 *   - entity.area_id === areaId (override explicite), OU
 *   - entity.area_id est nul ET entity.device.area_id === areaId
 */
function findClimInArea(hass, entities, devices, areaId) {
  const deviceAreaMap = new Map(devices.map((d) => [d.id, d.area_id]));
  return entities
    .filter((e) => {
      if (!e.entity_id.startsWith("climate.")) return false;
      if (e.disabled_by || e.hidden_by) return false;
      if (e.platform !== "bailconnect") return false;
      const effectiveArea =
        e.area_id || (e.device_id ? deviceAreaMap.get(e.device_id) : null);
      return effectiveArea === areaId;
    })
    .map((e) => e.entity_id);
}

/** Retrouve l'entité automation dont l'attribut `id` correspond. */
function findAutomationByConfigId(hass, configId) {
  if (!configId) return undefined;
  return Object.values(hass.states).find(
    (s) =>
      s.entity_id.startsWith("automation.") && s.attributes?.id === configId
  )?.entity_id;
}

/* ── strategy ────────────────────────────────────────────────── */

class ClimAreaSectionStrategy {
  static async generate(config, hass) {
    if (!config?.area) throw new Error("Clim (section) : fournir 'area'.");

    const { areas, devices, entities } = await getRegistries(hass);
    const area = resolveArea(areas, config.area);
    if (!area) throw new Error(`Area introuvable : ${config.area}`);
    const areaId = area.area_id;

    const heading = config.heading ?? "Climatisation";
    const headingIcon = config.heading_icon ?? "mdi:air-conditioner";

    // Climatiseurs : explicites si fournis, sinon recherche dans l'area.
    let climEntities = asList(config.climate);
    if (climEntities.length === 0) {
      climEntities = findClimInArea(hass, entities, devices, areaId);
    }
    // On ne garde que les entités réellement présentes.
    climEntities = climEntities.filter((id) => hass.states[id]);

    const cards = [
      {
        type: "heading",
        heading,
        heading_style: config.heading_style ?? "title",
        icon: headingIcon,
      },
    ];

    if (climEntities.length === 0) {
      cards.push({
        type: "markdown",
        content: `Aucun climatiseur trouvé pour **${area.name}**.`,
      });
      return { cards };
    }

    // Une carte de pilotage par climatiseur.
    for (const entity of climEntities) {
      cards.push({
        type: "tile",
        entity,
        icon: headingIcon,
        features: [
          { type: "climate-hvac-modes", hvac_modes: ["off", "auto"] },
          { type: "target-temperature" },
        ],
      });
    }

    // Interrupteur d'auto-régulation (active/désactive l'automatisation).
    const autoId = config.auto_id ?? `${areaId}_clim_auto`;
    const autoEntity = config.auto ?? findAutomationByConfigId(hass, autoId);
    if (autoEntity && hass.states[autoEntity]) {
      cards.push({
        type: "tile",
        entity: autoEntity,
        name: "Régulation auto",
        icon: "mdi:autorenew",
        tap_action: { action: "toggle" },
      });
    }

    // Heure de couché (pré-refroidissement), en option.
    for (const bedtime of asList(config.bedtime)) {
      if (hass.states[bedtime]) {
        cards.push({
          type: "tile",
          entity: bedtime,
          name: "Heure de couché",
          icon: "mdi:bed-clock",
        });
      }
    }

    return { cards };
  }
}

customElements.define("ll-strategy-clim-area-section", ClimAreaSectionStrategy);

/* ── floor / maison strategy ─────────────────────────────────── */
//
// === Strategy : toutes les clim (ex. vue chauffage) ===
//   strategy:
//     type: custom:clim-floor-section
//     floor: etage           # optionnel : limite aux pièces d'un étage (area assignées)
//     climate: [ ... ]       # optionnel : liste explicite de clim
//     heading: Climatisation # optionnel
//
// Sans 'floor' ni 'climate', regroupe toutes les clim BaillConnect de la maison.

const resolveFloor = (floors, key) => {
  if (!key) return undefined;
  return (
    floors.find((f) => f.floor_id === key) ||
    floors.find((f) => (f.name || "").toLowerCase() === String(key).toLowerCase())
  );
};

/** Toutes les clim BaillConnect de la maison (option : filtrées par étage). */
function findAllClim(hass, entities, devices, areaIds) {
  const deviceAreaMap = new Map(devices.map((d) => [d.id, d.area_id]));
  return entities
    .filter((e) => {
      if (!e.entity_id.startsWith("climate.")) return false;
      if (e.disabled_by || e.hidden_by) return false;
      if (e.platform !== "bailconnect") return false;
      if (!areaIds) return true;
      const effectiveArea =
        e.area_id || (e.device_id ? deviceAreaMap.get(e.device_id) : null);
      return areaIds.has(effectiveArea);
    })
    .map((e) => e.entity_id);
}

/** Tous les interrupteurs de régulation auto (automations "<...>_clim_auto"). */
function findClimAutoToggles(hass) {
  return Object.values(hass.states)
    .filter(
      (s) =>
        s.entity_id.startsWith("automation.") &&
        typeof s.attributes?.id === "string" &&
        s.attributes.id.endsWith("_clim_auto")
    )
    .map((s) => s.entity_id);
}

const friendly = (hass, id) =>
  hass.states[id]?.attributes?.friendly_name || id;
const byFriendly = (hass) => (a, b) =>
  friendly(hass, a).localeCompare(friendly(hass, b), undefined, {
    sensitivity: "base",
  });

class ClimFloorSectionStrategy {
  static async generate(config, hass) {
    const [areas, devices, entities, floors] = await Promise.all([
      hass.callWS({ type: "config/area_registry/list" }),
      hass.callWS({ type: "config/device_registry/list" }),
      hass.callWS({ type: "config/entity_registry/list" }),
      hass.callWS({ type: "config/floor_registry/list" }).catch(() => []),
    ]);

    let areaIds;
    if (config?.floor) {
      const floor = resolveFloor(floors, config.floor);
      if (!floor) throw new Error(`Floor introuvable : ${config.floor}`);
      areaIds = new Set(
        areas.filter((a) => a.floor_id === floor.floor_id).map((a) => a.area_id)
      );
    }

    let climEntities = asList(config?.climate);
    if (climEntities.length === 0) {
      climEntities = findAllClim(hass, entities, devices, areaIds);
    }
    climEntities = climEntities
      .filter((id) => hass.states[id])
      .sort(byFriendly(hass));

    const cards = [
      {
        type: "heading",
        heading: config?.heading ?? "Climatisation",
        heading_style: config?.heading_style ?? "title",
        icon: config?.heading_icon ?? "mdi:air-conditioner",
      },
    ];

    if (climEntities.length === 0) {
      cards.push({ type: "markdown", content: "Aucun climatiseur trouvé." });
      return { cards };
    }

    for (const entity of climEntities) {
      cards.push({
        type: "tile",
        entity,
        icon: config?.heading_icon ?? "mdi:air-conditioner",
        features: [
          { type: "climate-hvac-modes", hvac_modes: ["off", "auto"] },
          { type: "target-temperature" },
        ],
      });
    }

    // Interrupteurs de régulation auto (une pièce = un interrupteur).
    const toggles = (asList(config?.auto).length
      ? asList(config.auto)
      : findClimAutoToggles(hass)
    )
      .filter((id) => hass.states[id])
      .sort(byFriendly(hass));

    if (toggles.length) {
      cards.push({
        type: "heading",
        heading: "Régulation auto",
        heading_style: "subtitle",
        icon: "mdi:autorenew",
      });
      for (const entity of toggles) {
        cards.push({
          type: "tile",
          entity,
          tap_action: { action: "toggle" },
        });
      }
    }

    return { cards };
  }
}

customElements.define("ll-strategy-clim-floor-section", ClimFloorSectionStrategy);
