// section-cover.js
// Deux stratégies pour les volets (cover) :
//
// === Strategy 1 : Section (une area) ===
//   strategy:
//     type: custom:cover-area-section
//     area: bureau                  # area_id ou nom
//     heading: Volets               # optionnel (défaut "Volets")
//     heading_icon: mdi:roller-shade # optionnel
//
// === Strategy 2 : Floor (toutes les areas d'un étage) ===
//   strategy:
//     type: custom:cover-floor-section
//     floor: premier_etage          # floor_id ou nom
//     sort: name                    # optionnel (défaut "name")
//
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

/* ── helpers ─────────────────────────────────────────────────── */

async function getRegistries(hass) {
  const [areas, devices, entities, floors] = await Promise.all([
    hass.callWS({ type: "config/area_registry/list" }),
    hass.callWS({ type: "config/device_registry/list" }),
    hass.callWS({ type: "config/entity_registry/list" }),
    hass.callWS({ type: "config/floor_registry/list" }).catch(() => []),
  ]);
  return { areas, devices, entities, floors };
}

const resolveArea = (areas, key) => {
  if (!key) return undefined;
  return (
    areas.find((a) => a.area_id === key) ||
    areas.find(
      (a) => a.name.toLowerCase() === String(key).toLowerCase()
    )
  );
};

const resolveFloor = (floors, key) => {
  if (!key) return undefined;
  return (
    floors.find((f) => f.floor_id === key) ||
    floors.find(
      (f) => (f.name || "").toLowerCase() === String(key).toLowerCase()
    )
  );
};

/**
 * Find cover entities with device_class "shutter" assigned to a given area.
 * An entity is "in the area" if:
 *   - entity.area_id === areaId   (explicit override), OR
 *   - entity.area_id is null AND entity.device.area_id === areaId
 */
function findCoversInArea(hass, entities, devices, areaId) {
  const deviceAreaMap = new Map(devices.map((d) => [d.id, d.area_id]));
  return entities.filter((e) => {
    if (!e.entity_id.startsWith("cover.")) return false;
    if (e.disabled_by) return false;
    if (e.hidden_by) return false;
    if (hass.states[e.entity_id]?.attributes?.device_class !== "shutter") return false;
    const effectiveArea =
      e.area_id || (e.device_id ? deviceAreaMap.get(e.device_id) : null);
    return effectiveArea === areaId;
  });
}

/* ── strategy ────────────────────────────────────────────────── */

class CoverAreaSectionStrategy {
  static async generate(config, hass) {
    if (!config?.area)
      throw new Error("Cover (section) : fournir 'area'.");

    const { areas, devices, entities } = await getRegistries(hass);
    const area = resolveArea(areas, config.area);
    if (!area) throw new Error(`Area introuvable : ${config.area}`);
    const areaId = area.area_id;

    // Find all covers in the area
    const covers = findCoversInArea(hass, entities, devices, areaId);

    // Filter out unavailable covers
    const availableCovers = covers.filter(
      (e) => hass.states[e.entity_id]?.state !== "unavailable"
    );

    if (availableCovers.length === 0) {
      return {
        cards: [
          {
            type: "heading",
            heading: config.heading ?? "Volets",
            heading_style: config.heading_style ?? "title",
            icon: config.heading_icon ?? "mdi:roller-shade",
          },
          {
            type: "markdown",
            content: `Aucun volet disponible dans **${area.name}**.`,
          },
        ],
      };
    }

    // Sort covers alphabetically by name
    availableCovers.sort((a, b) => {
      const nameA = hass.states[a.entity_id]?.attributes?.friendly_name || a.entity_id;
      const nameB = hass.states[b.entity_id]?.attributes?.friendly_name || b.entity_id;
      return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
    });

    // Build cards
    const cards = [];

    // Heading
    cards.push({
      type: "heading",
      heading: config.heading ?? "Volets",
      heading_style: config.heading_style ?? "title",
      icon: config.heading_icon ?? "mdi:roller-shade",
    });

    // One tile per cover
    for (const cover of availableCovers) {
      cards.push({
        type: "tile",
        entity: cover.entity_id,
        vertical: false,
        features: [
          {
            type: "cover-open-close",
          },
        ],
        features_position: "inline",
      });
    }

    return { cards };
  }
}

customElements.define(
  "ll-strategy-cover-area-section",
  CoverAreaSectionStrategy
);

/* ── floor strategy ──────────────────────────────────────────── */

class CoverFloorSectionStrategy {
  static async generate(config, hass) {
    if (!config?.floor)
      throw new Error("Cover (floor) : fournir 'floor'.");

    const { areas, devices, entities, floors } = await getRegistries(hass);
    const floor = resolveFloor(floors, config.floor);
    if (!floor) throw new Error(`Floor introuvable : ${config.floor}`);

    // Get areas belonging to this floor
    let floorAreas = areas.filter((a) => a.floor_id === floor.floor_id);
    if ((config.sort ?? "name") === "name") {
      floorAreas.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
    }

    const cards = [];

    for (const area of floorAreas) {
      const covers = findCoversInArea(hass, entities, devices, area.area_id);
      const availableCovers = covers.filter(
        (e) => hass.states[e.entity_id]?.state !== "unavailable"
      );

      // Skip areas with no covers
      if (availableCovers.length === 0) continue;

      // Sort covers alphabetically
      availableCovers.sort((a, b) => {
        const nameA =
          hass.states[a.entity_id]?.attributes?.friendly_name || a.entity_id;
        const nameB =
          hass.states[b.entity_id]?.attributes?.friendly_name || b.entity_id;
        return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
      });

      // Heading with area icon + name
      cards.push({
        type: "heading",
        heading: area.name,
        heading_style: config.heading_style ?? "title",
        icon: area.icon || "mdi:roller-shade",
      });

      // One tile per cover
      for (const cover of availableCovers) {
        cards.push({
          type: "tile",
          entity: cover.entity_id,
          vertical: false,
          features: [
            {
              type: "cover-open-close",
            },
          ],
          features_position: "inline",
        });
      }
    }

    if (cards.length === 0) {
      return {
        cards: [
          {
            type: "markdown",
            content: `Aucun volet disponible dans l'étage **${floor.name}**.`,
          },
        ],
      };
    }

    return { cards };
  }
}

customElements.define(
  "ll-strategy-cover-floor-section",
  CoverFloorSectionStrategy
);
