import "./styles/style.scss";
import type { Map, Marker } from "leaflet";
import { isValidIp, getIpGeolocationData, getErrorMessage, createMap, updateMap } from "./utils";

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

const toast = document.getElementById("toast") as HTMLDivElement;
const toastMessage = document.querySelector(".toast-message") as HTMLSpanElement;
const toastBtn = document.querySelector(".toast-close") as HTMLButtonElement;

const mapEl = document.getElementById("map") as HTMLDivElement;

/**
 * SETUP ERROR TOAST
 */

const hideErrorToast = () => {
  if (!toast.classList.contains("show")) return;
  toast.classList.remove("show");
  toastMessage.textContent = null;
};
const showErrorToast = (message: string) => {
  toastMessage.textContent = message;
  toast.classList.add("fade", "show");
  setTimeout(hideErrorToast, 4500);
};
toastBtn.addEventListener("click", hideErrorToast);

/**
 * SETUP IP GEOLOCATION
 */
let map: Map | undefined = undefined;
let marker: Marker | undefined = undefined;

const handleIpGeolocationApiRequest = async (searchValue?: string) => {
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
    showErrorToast(message);
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
  if (!isValidIp(searchValue)) {
    handleFormError("Invalid ip address");
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
  await handleIpGeolocationApiRequest("test"); // Gets current ip data
})();
