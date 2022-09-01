import "./styles/style.scss";
import type { Map, Marker } from "leaflet";
import { isValidDomain, isValidIp, getIpGeolocationData, getErrorMessage, createMap, updateMap } from "./utils";

/**
 * HTML ELEMENTS
 */

const formEl = document.getElementById("form") as HTMLFormElement;
const searchInputEl = document.getElementById("search") as HTMLInputElement;
const searchErrorEl = document.getElementById("search-error") as HTMLSpanElement;

const ipAddressEl = document.getElementById("ip-address") as HTMLSpanElement;
const locationEl = document.getElementById("location") as HTMLSpanElement;
const timezoneEl = document.getElementById("timezone") as HTMLSpanElement;
const ispEl = document.getElementById("isp") as HTMLSpanElement;

const mapEl = document.getElementById("map") as HTMLDivElement;

/**
 * SETUP IP GEOLOCATION
 */
let map: Map | undefined = undefined;
let marker: Marker | undefined = undefined;

const handleIpGeolocationApiRequest = async (searchValue: string | null) => {
  try {
    const searchResults = await getIpGeolocationData(searchValue);
    ipAddressEl.textContent = searchResults.ip;
    locationEl.textContent = searchResults.location;
    timezoneEl.textContent = searchResults.timezone;
    ispEl.textContent = searchResults.isp;
    const lat = parseFloat(searchResults.latitude);
    const lng = parseFloat(searchResults.longitude);
    const mapData: App.MapData = { coordinates: { lat, lng }, location: searchResults.location };
    if (!map || !marker) {
      const results = createMap(mapEl, mapData);
      map = results.map;
      marker = results.marker;
    } else {
      marker = updateMap(map, marker, mapData);
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(message);
  }
};

/**
 * SETUP FORM & VALIDATION
 */

const handleFormError = (error?: string) => {
  if (error) {
    searchInputEl.setAttribute("aria-invalid", "true");
    searchErrorEl.textContent = error;
  } else {
    searchInputEl.removeAttribute("aria-invalid");
    searchErrorEl.textContent = null;
  }
};

const onSubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  const searchValue = (new FormData(formEl).get("search") as string).trim();
  if (!isValidIp(searchValue) && !isValidDomain(searchValue)) {
    handleFormError("Invalid ip or domain");
    return searchInputEl.focus();
  }
  await handleIpGeolocationApiRequest(searchValue);
  formEl.reset();
};
formEl.addEventListener("submit", onSubmit);

const onInput = () => searchErrorEl.textContent && handleFormError();
searchInputEl.addEventListener("input", onInput);

/**
 * INITIALIZE APP
 */

(async function initializeApp() {
  await handleIpGeolocationApiRequest(null); // Gets current ip data
})();
