import * as L from "leaflet";
import locationSvg from "../assets/icon-location.svg";

/** Config */
const DEFAULT_ZOOM = 14;

/** Custom icon */
export const customMapIcon: L.IconOptions = {
  iconUrl: locationSvg,
  iconSize: [46, 56],
  iconAnchor: [23, 56],
  popupAnchor: [0, -56],
};

/** Mapbox (tile layer) */
const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
const mapboxUrl = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`;
const mapboxStreets: L.TileLayerOptions = { id: "mapbox/streets-v11", tileSize: 512, zoomOffset: -1, attribution: "" };

const createMarker = (data: App.MapData) => {
  return L.marker(data.coordinates, { title: data.location, icon: L.icon(customMapIcon) });
};

export const createMap = (mapEl: HTMLElement, data: App.MapData): { map: L.Map; marker: L.Marker } => {
  const map = L.map(mapEl, { zoomControl: false }).setView(data.coordinates, DEFAULT_ZOOM);
  L.tileLayer(mapboxUrl, mapboxStreets).addTo(map);
  const marker = createMarker(data).addTo(map);
  return { map, marker };
};

export const updateMap = (map: L.Map, prevMarker: L.Marker, data: App.MapData): L.Marker => {
  map.setView(data.coordinates, DEFAULT_ZOOM);
  prevMarker.remove();
  return createMarker(data).addTo(map);
};
