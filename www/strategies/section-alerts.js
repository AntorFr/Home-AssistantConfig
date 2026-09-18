// section-alerts.js
// Stratégie de section : bandeau d'alertes de la maison (mushroom-chips-card).
//
// Auto-découvre toutes les entités `alert.*` et génère une puce conditionnelle
// par alerte (visible uniquement quand l'alerte est active). Deux dimensions
// pilotées par le registre Home Assistant, sans rien dans customize :
//
//   • CRITICITÉ  ← les *étiquettes* (labels) posées sur l'entité alert.
//                  Chaque label porte lui-même une couleur et une icône ; on
//                  s'en sert pour la couleur de la puce et l'ordre d'affichage
//                  (les plus critiques en premier).
//   • ONGLET     ← la *pièce* (area) associée à l'entité alert. La puce d'une
//                  alerte non acquittable (can_acknowledge:false) renvoie vers
//                  la page du dashboard correspondant à cette pièce.
//
// NB : l'intégration `alert:` (YAML) ne gère pas de unique_id → ses entités
// sont ABSENTES du registre : ni label ni pièce assignables via l'UI. Pour ces
// alertes, on lit en repli des attributs posés via `homeassistant: customize:` :
//   • icon:     mdi:...        (icône de la puce ; déjà standard)
//   • severity: critique       (nom d'un niveau de `severity` -> couleur/ordre)
//   • area:     piscine        (area_id ou nom de pièce -> navigation)
//
// Alerte acquittable  (can_acknowledge:true)  → tap = toggle (acquittement).
// Alerte non acquittable (can_acknowledge:false) → tap = navigate vers la pièce.
//
// === Utilisation (dans une vue "sections") ===
//   type: custom:alerts-section
//   base_path: /lovelace-maison            # optionnel, défaut ci-dessous
//   severity:                              # optionnel, du + critique au - critique
//     - { label: critique,      color: red,         icon: mdi:alert }
//     - { label: avertissement, color: orange,      icon: mdi:alert-outline }
//     - { label: info,          color: blue-grey,   icon: mdi:information-outline }
//   area_paths:                            # optionnel : exceptions area_id/slug -> path
//     chambre_amis: chambre-damis
//
// Docs : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/

/* ── helpers ─────────────────────────────────────────────────── */

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// "Salle à manger" -> "salle-a-manger"  (retire accents, minuscule, tirets)
function slugify(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Correspondance pièce (area_id) -> onglet du dashboard, pour les cas où le
// slug du nom de la pièce ne correspond pas au `path` de la vue. Une pièce
// absente de cette table retombe sur le slug de son nom (ex. "Piscine" ->
// "piscine"). Surchargée par la config `area_paths` du dashboard.
const DEFAULT_AREA_PATHS = {
  chambre_d_amis: "chambre-damis",
  chambre_parent: "parents",
  chambre_timothee: "timothee",
  chambre_emilie: "emilie",
  garage_1: "garages",
  garage: "garages",
  garage_3: "garages",
  salle_de_douche: "douche",
  electromobile: "tesla",
};

// Niveaux de criticité par défaut, du plus grave au moins grave.
const DEFAULT_SEVERITY = [
  { label: "critique", color: "red", icon: "mdi:alert" },
  { label: "avertissement", color: "orange", icon: "mdi:alert-outline" },
  { label: "info", color: "blue-grey", icon: "mdi:information-outline" },
];

/* ── stratégie ───────────────────────────────────────────────── */

class AlertsSectionStrategy {
  static async generate(config, hass) {
    const basePath = config?.base_path ?? "/lovelace-maison";
    // Table par défaut + surcharges du dashboard (la config a priorité).
    const areaPaths = { ...DEFAULT_AREA_PATHS, ...(config?.area_paths ?? {}) };
    const severity = asList(config?.severity).length
      ? config.severity
      : DEFAULT_SEVERITY;

    const [areas, devices, entities, labels] = await Promise.all([
      hass.callWS({ type: "config/area_registry/list" }),
      hass.callWS({ type: "config/device_registry/list" }),
      hass.callWS({ type: "config/entity_registry/list" }),
      hass.callWS({ type: "config/label_registry/list" }).catch(() => []),
    ]);

    const areaById = new Map(areas.map((a) => [a.area_id, a]));
    const deviceAreaById = new Map(devices.map((d) => [d.id, d.area_id]));
    const labelById = new Map(labels.map((l) => [l.label_id, l]));
    const regByEntityId = new Map(entities.map((e) => [e.entity_id, e]));

    // Rang de sévérité par nom de label (index dans `severity` = plus petit = plus grave).
    const severityRank = new Map();
    severity.forEach((s, i) => severityRank.set(slugify(s.label), i));

    // Résout la pièce effective d'une entité (override entité, sinon device).
    const areaOf = (e) => {
      const id = e.area_id || (e.device_id ? deviceAreaById.get(e.device_id) : null);
      return id ? areaById.get(id) : undefined;
    };

    // Chemin de navigation pour une pièce donnée.
    const pathForArea = (area) => {
      if (!area) return undefined;
      const slug = slugify(area.name);
      const target = areaPaths[area.area_id] ?? areaPaths[slug] ?? slug;
      return `${basePath}/${target}`;
    };

    // Les alertes de l'intégration `alert:` (YAML) n'ont pas de unique_id :
    // elles sont ABSENTES de l'entity_registry et n'existent que dans
    // hass.states. On part donc des états, puis on récupère l'entrée de
    // registre (labels/pièce) quand elle existe.
    const rows = Object.keys(hass.states)
      .filter((id) => id.startsWith("alert."))
      .map((entityId) => {
        const e = regByEntityId.get(entityId) ?? { entity_id: entityId };
        if (e.disabled_by || e.hidden_by) return null;
        const st = hass.states[entityId];
        const attrs = st?.attributes ?? {};

      // Criticité : premier label de l'entité qui figure dans `severity`.
      let rank = severity.length; // non tagué -> après tout le monde
      let sev = null;
      for (const labelId of e.labels ?? []) {
        const name = slugify(labelById.get(labelId)?.name ?? labelId);
        if (severityRank.has(name) && severityRank.get(name) < rank) {
          rank = severityRank.get(name);
          sev = severity[rank];
          // couleur/icône du label HA prioritaires si définies
          const reg = labelById.get(labelId);
          if (reg?.color) sev = { ...sev, color: reg.color };
          if (reg?.icon) sev = { ...sev, icon: reg.icon };
        }
      }
      // Repli : criticité portée par un attribut `severity` (customize), pour
      // les alertes YAML absentes du registre (pas de labels possibles).
      if (sev == null && attrs.severity != null) {
        const name = slugify(attrs.severity);
        if (severityRank.has(name)) {
          rank = severityRank.get(name);
          sev = severity[rank];
        }
      }

      let area = areaOf(e);
      // Repli : pièce portée par un attribut `area` (customize) = area_id ou nom.
      if (!area && attrs.area != null) {
        const wanted = slugify(attrs.area);
        area =
          areaById.get(attrs.area) ??
          areas.find((a) => a.area_id === attrs.area || slugify(a.name) === wanted);
      }
      const navPath = pathForArea(area);
      // can_acknowledge : true par défaut (attribut absent = acquittable).
      const canAck = attrs.can_acknowledge !== false;

      const color = sev?.color ?? "grey";
      const icon = attrs.icon ?? sev?.icon ?? "mdi:alert";
      const name = attrs.friendly_name ?? e.entity_id;

      // Non acquittable + pièce connue -> on renvoie vers la page. Sinon toggle.
      const tap_action =
        !canAck && navPath
          ? { action: "navigate", navigation_path: navPath }
          : { action: "toggle" };

      return { entity: e.entity_id, rank, color, icon, name, tap_action };
      })
      .filter(Boolean);

    // Tri : plus critique d'abord, puis alphabétique.
    rows.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

    const chips = rows.map((r) => ({
      type: "conditional",
      conditions: [{ condition: "state", entity: r.entity, state: "on" }],
      chip: {
        type: "entity",
        entity: r.entity,
        name: r.name,
        icon: r.icon,
        icon_color: r.color,
        content_info: "name",
        tap_action: r.tap_action,
        hold_action: { action: "more-info" },
        double_tap_action: { action: "none" },
      },
    }));

    return {
      cards: [
        {
          type: "custom:mushroom-chips-card",
          chips,
          alignment: "center",
          layout_options: { grid_columns: 20, grid_rows: "auto" },
        },
      ],
    };
  }
}

customElements.define("ll-strategy-alerts-section", AlertsSectionStrategy);
