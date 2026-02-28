// presence-strategies.js
// Deux stratégies : section (area) et floor (répète pour chaque area)
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

async function getRegistries(hass) {
  const areas = await hass.callWS({ type: "config/area_registry/list" });
  const floors = await hass.callWS({ type: "config/floor_registry/list" }).catch(() => []);
  return { areas, floors };
}
const resolveArea = (areas, key) => !key ? undefined : (
  areas.find(a => a.area_id === key) || areas.find(a => a.name.toLowerCase() === String(key).toLowerCase())
);

const resolveFloor = (floors, key) => !key ? undefined : (
  floors.find(f => f.floor_id === key) || floors.find(f => (f.name||"").toLowerCase() === String(key).toLowerCase())
);

function buildAEJinja(roomId, roomName, maxAge, classes) {
  return `
{%- macro clean_name(name,room) -%}
  {{ name
    | regex_replace('(?i)\\b(?:'+room+'|capteurs?)\\b', '')
    | regex_replace('\\\\s+', ' ')
    | trim }}
{%- endmacro -%}
{% set max_age = ${maxAge} %}
{% set room = '${roomName.replace(/'/g, "\\'")}' %}
{% set room_id = '${roomId.replace(/'/g, "\\'")}' %}
[
{%- for s in states.binary_sensor
     if s.attributes.device_class in ${JSON.stringify(classes)}
     and area_id(s.entity_id) == room_id -%}
  {%- set bad_state = s.state in ['unknown','unavailable'] -%}
  {%- set off_too_long = s.state == 'off' and (now().timestamp() - s.last_changed.timestamp()) > max_age -%}
  {%- if not bad_state and not off_too_long -%}
  {
    'entity': '{{ s.entity_id }}',
    'name': '{{clean_name(s.name,room)}}',
    'type': 'tile',
  }
  {%- if not loop.last -%},{%- endif -%}
  {%- endif -%}
{%- endfor -%}
]`.trim();
}

function areaSection(areaId,areaName, { columns, maxAge, includeVibration, areaCardOverrides }) {
  const classes = ["motion", "occupancy", "presence"];
  if (includeVibration) classes.push("vibration");

  const areaCard = {
    type: "area",
    area: areaId,
    alert_classes: ["motion", "occupancy"],
    sensor_classes: [],
    display_type: "compact",
    features_position: "bottom",
    color: "",
    vertical: false,
    grid_options: { columns: 12, rows: 1 },
    ...(areaCardOverrides || {}),
  };

  const aeCard = {
    type: "custom:auto-entities",
    card: { type: "grid", columns, square: false },
    card_param: "cards",
    filter: {
      include: [],
      exclude: [{ state: "unavailable" }, { state: "unknown" },{ label: "ignored_motion" }],
      template: buildAEJinja(areaId, areaName, maxAge, classes),
    },
  };

  return [areaCard, aeCard];
}


class HelloSectionStrategy {
  static async generate(config, hass) {
    const msg = config?.message ?? "Hello from a Section Strategy 👋";
    return {
      cards: [
        { type: "markdown", content: `### ${msg}\nSection render OK.` },
        { type: "tile", entity: Object.keys(hass.states)[0] || "sun.sun", name: "Tuile de test" },
      ],
    };
  }
}

customElements.define("ll-strategy-hello-section", HelloSectionStrategy);


/** === Strategy 1: section pour une area === */
class PresenceSectionStrategy {
  static async generate(config, hass) {
    if (!config?.area) throw new Error("Présence (section) : fournir 'area'.");
    const { areas } = await getRegistries(hass);
    const a = resolveArea(areas, config.area, { label: "presence-room", dumpOnNoMatch: true });
    //console.log("[PresenceSectionStrategy] area:", a);
    if (!a) throw new Error(`Area introuvable: ${config.area}`);
    const opts = {
      columns: config.columns ?? 2,
      maxAge: config.max_age ?? 600,
      includeVibration: config.include_vibration ?? false,
      areaCardOverrides: config.area_card || {},
    };
    const cards = areaSection(a.area_id,a.name, opts);
    //console.log("[PresenceSectionStrategy] cards:", cards);
    return { cards: [{ type: "grid", columns: 1, square: false, cards }] };
  }
}
customElements.define("ll-strategy-presence-area-section", PresenceSectionStrategy);

/** === Strategy 2: floor — répète pour chaque area du floor === */
class PresenceFloorStrategy {
  static async generate(config, hass) {
    if (!config?.floor) throw new Error("Présence (floor) : fournir 'floor'.");
    const { areas, floors } = await getRegistries(hass);
    const f = resolveFloor(floors, config.floor);
    if (!f) throw new Error(`Floor introuvable: ${config.floor}`);
    let floorAreas = areas.filter(a => a.floor_id === f.floor_id);
    if ((config.sort ?? "name") === "name") {
      floorAreas = floorAreas.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    }
    const opts = {
      columns: config.columns ?? 2,
      maxAge: config.max_age ?? 600,
      includeVibration: config.include_vibration ?? false,
      areaCardOverrides: config.area_card || {},
    };
    const cards = floorAreas.flatMap(a => areaSection(a.area_id,a.name, opts));
    return { cards: [{ type: "grid", columns: 1, square: false, cards }] };
  }
}
customElements.define("ll-strategy-presence-floor-section", PresenceFloorStrategy);


class PresenceDebugStrategy {
  static async generate(config, hass) {
    const { areas, floors } = await getRegistries(hass);
    console.log("[PresenceDebugStrategy] areas:", areas);
    console.log("[PresenceDebugStrategy] floors:", floors);

    const areasList = areas.map(a => `- ${a.name}  \`(${a.area_id})\``).join("\n");
    const floorsList = floors.map(f => `- ${f.name}  \`(${f.floor_id})\``).join("\n");

    return {
      cards: [
        { type: "markdown", content:
`### DEBUG — Areas
${areasList || "_aucune_"}
`},
        { type: "markdown", content:
`### DEBUG — Floors
${floorsList || "_aucun_"}
`}
      ]
    };
  }
}
customElements.define("ll-strategy-presence-debug", PresenceDebugStrategy);
