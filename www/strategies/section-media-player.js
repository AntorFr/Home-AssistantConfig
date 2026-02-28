// section-media-player.js
// Stratégie de section : affiche un media player Music Assistant
// avec son music browser et un bouton "Lancer" pour une area donnée.
//
// Usage dans une section :
//   strategy:
//     type: custom:media-player-area-section
//     area: chambre_emilie          # area_id ou nom
//     heading: Musique              # optionnel (défaut "Musique")
//     heading_icon: mdi:music       # optionnel
//     player_rows: 3               # optionnel (défaut 3)
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
    areas.find(
      (a) => a.name.toLowerCase() === String(key).toLowerCase()
    )
  );
};

/**
 * Find Music Assistant media_player entities assigned to a given area.
 * An entity is "in the area" if:
 *   - entity.area_id === areaId   (explicit override), OR
 *   - entity.area_id is null AND entity.device.area_id === areaId
 */
function findMAPlayersInArea(entities, devices, areaId) {
  const deviceAreaMap = new Map(devices.map((d) => [d.id, d.area_id]));
  return entities.filter((e) => {
    if (!e.entity_id.startsWith("media_player.")) return false;
    if (e.platform !== "music_assistant") return false;
    if (e.disabled_by) return false;
    const effectiveArea =
      e.area_id || (e.device_id ? deviceAreaMap.get(e.device_id) : null);
    return effectiveArea === areaId;
  });
}

/* ── strategy ────────────────────────────────────────────────── */

class MediaPlayerAreaSectionStrategy {
  static async generate(config, hass) {
    if (!config?.area)
      throw new Error("MediaPlayer (section) : fournir 'area'.");

    const { areas, devices, entities } = await getRegistries(hass);
    const area = resolveArea(areas, config.area);
    if (!area) throw new Error(`Area introuvable : ${config.area}`);
    const areaId = area.area_id;

    // ── 1. Trouver le media_player Music Assistant ──────────
    const maPlayers = findMAPlayersInArea(entities, devices, areaId);
    if (maPlayers.length === 0) {
      // Pas de lecteur MA → section vide (ou message)
      return {
        cards: [
          {
            type: "markdown",
            content: `Aucun lecteur Music Assistant dans **${area.name}**.`,
          },
        ],
      };
    }
    const playerEntityId = maPlayers[0].entity_id;

    // ── 2. Trouver dynamiquement le music browser ───────────
    let musicBrowserId = null;
    for (const eid of Object.keys(hass.states)) {
      if (!eid.startsWith("input_select.music_browser_")) continue;
      // Vérifie area_id dans entity registry
      const ent = entities.find((e) => e.entity_id === eid);
      if (ent && ent.area_id === areaId) {
        musicBrowserId = eid;
        break;
      }
    }
    const hasMusicBrowser = !!musicBrowserId;

    // ── 3. Construire les cartes ────────────────────────────
    const cards = [];

    // Heading
    cards.push({
      type: "heading",
      heading: config.heading ?? "Musique",
      ...(config.heading_icon ? { icon: config.heading_icon } : {}),
    });

    // Mushroom media player
    const playerRows = config.player_rows ?? 3;
    cards.push({
      type: "custom:mushroom-media-player-card",
      use_media_info: true,
      show_volume_level: false,
      volume_controls: ["volume_set"],
      media_controls: ["play_pause_stop"],
      collapsible_controls: true,
      entity: playerEntityId,
      layout: "vertical",
      layout_options: {
        grid_columns: 4,
        grid_rows: playerRows,
      },
    });

    // Music browser dropdown
    if (hasMusicBrowser) {
      cards.push({
        type: "entities",
        entities: [{ entity: musicBrowserId }],
        layout_options: {
          grid_columns: 3,
          grid_rows: 2,
        },
      });
    }

    // Bouton "Lancer"
    cards.push({
      type: "custom:mushroom-template-card",
      primary: "Lancer",
      secondary: "",
      icon: "mdi:speaker-play",
      fill_container: true,
      icon_color: "indigo",
      layout: "vertical",
      tap_action: {
        action: "call-service",
        service: "script.play_mood_music",
        target: {},
        data: {
          rooms: [areaId],
        },
      },
      layout_options: {
        grid_columns: 1,
        grid_rows: 2,
      },
    });

    return { cards };
  }
}

customElements.define(
  "ll-strategy-media-player-area-section",
  MediaPlayerAreaSectionStrategy
);
