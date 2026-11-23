import "./style.css";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-action-bar";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-block";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import type { Action } from "@esri/calcite-components/components/calcite-action";
import type { ShellPanel } from "@esri/calcite-components/components/calcite-shell-panel";

const errorMessage = document.querySelector<HTMLDivElement>("#error-message")!;
const mapElement = document.querySelector<ArcgisMap>("#map")!;
const sidebar = document.querySelector<ShellPanel>("#sidebar")!;
const sidebarToggle = document.querySelector<Action>("#sidebar-toggle")!;
const themeToggle = document.querySelector<Action>("#theme-toggle")!;

function showError(message: string, error: unknown): void {
  console.error(message, error);
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

sidebarToggle.addEventListener("click", () => {
  sidebar.collapsed = !sidebar.collapsed;
  sidebarToggle.active = !sidebar.collapsed;
  sidebarToggle.setAttribute("aria-expanded", String(!sidebar.collapsed));
  sidebarToggle.setAttribute("aria-label", sidebar.collapsed ? "Mostrar herramientas" : "Ocultar herramientas");
});

themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("calcite-mode-dark");
  document.documentElement.classList.toggle("calcite-mode-light", !dark);
  themeToggle.icon = dark ? "brightness" : "moon";
  themeToggle.text = dark ? "Activar tema claro" : "Activar tema oscuro";
  themeToggle.setAttribute("aria-label", themeToggle.text);
});

const mobile = window.matchMedia("(max-width: 600px)");
function updateSidebarLayout(): void {
  sidebar.displayMode = mobile.matches ? "overlay" : "dock";
}
mobile.addEventListener("change", updateSidebarLayout);
updateSidebarLayout();

async function initialize(): Promise<void> {
  const [, , , , , , , , { default: FeatureLayer }, { default: Graphic }, reactiveUtils] = await Promise.all([
    import("@arcgis/map-components/components/arcgis-map"),
    import("@arcgis/map-components/components/arcgis-search"),
    import("@arcgis/map-components/components/arcgis-zoom"),
    import("@arcgis/map-components/components/arcgis-home"),
    import("@arcgis/map-components/components/arcgis-compass"),
    import("@arcgis/map-components/components/arcgis-layer-list"),
    import("@arcgis/map-components/components/arcgis-legend"),
    import("@arcgis/map-components/components/arcgis-basemap-gallery"),
    import("@arcgis/core/layers/FeatureLayer.js"),
    import("@arcgis/core/Graphic.js"),
    import("@arcgis/core/core/reactiveUtils.js"),
  ]);

  await mapElement.viewOnReady();
  const map = mapElement.map;
  if (!map) throw new Error("No se ha creado el mapa.");
  reactiveUtils.watch(
    () => mapElement.fatalError,
    (error) => {
      if (error) showError("El mapa ha dejado de funcionar. Recarga la página para intentarlo de nuevo.", error);
    },
    { initial: true },
  );

  const cities = [
    { name: "Madrid", longitude: -3.7038, latitude: 40.4168 },
    { name: "Barcelona", longitude: 2.1734, latitude: 41.3851 },
    { name: "Valencia", longitude: -0.3763, latitude: 39.4699 },
    { name: "Sevilla", longitude: -5.9845, latitude: 37.3891 },
    { name: "Bilbao", longitude: -2.9349, latitude: 43.263 },
    { name: "Las Palmas de Gran Canaria", longitude: -15.4314, latitude: 28.1235 },
  ];
  const cityLayer = new FeatureLayer({
    title: "Ciudades de ejemplo",
    objectIdField: "id",
    fields: [
      { name: "id", alias: "ID", type: "oid" },
      { name: "name", alias: "Ciudad", type: "string" },
    ],
    source: cities.map((city, index) => new Graphic({
      geometry: { type: "point", longitude: city.longitude, latitude: city.latitude },
      attributes: { id: index + 1, name: city.name },
    })),
    renderer: {
      type: "simple",
      label: "Ciudad de ejemplo",
      symbol: { type: "simple-marker", color: "#087e8b", size: 9, outline: { color: "white", width: 1.5 } },
    },
    popupTemplate: { title: "{name}", content: "Ciudad incluida como ejemplo en el visor." },
  });
  map.add(cityLayer);
  await cityLayer.load();

  reactiveUtils.watch(
    () => map.basemap?.loadStatus,
    (status) => {
      if (status === "failed") {
        showError("No se ha podido cargar el mapa base. Comprueba tu conexión o selecciona otro mapa base.", map.basemap?.loadError);
      }
    },
    { initial: true },
  );
}

initialize().catch((error: unknown) => {
  showError("No se ha podido iniciar el visor. Comprueba tu conexión y recarga la página.", error);
});
