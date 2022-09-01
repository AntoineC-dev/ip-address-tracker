/** API CONFIG */
const API_KEY = import.meta.env.VITE_IPGEOLOCATION_API_KEY;
const API_BASE = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`;
const FIELDS = "country_name,state_prov,district,city,zipcode,latitude,longitude,isp,time_zone";

const generateEndpoint = (ipOrDomain: string | null) => {
  if (!ipOrDomain) return `${API_BASE}&fields=${FIELDS}`;
  return `${API_BASE}&ip=${ipOrDomain}&fields=${FIELDS}`;
};

/** FORMATTER */
const UTC_FORMATTER = new Intl.NumberFormat("en-us", {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 2,
});

export const formatNbToUtc = (val: number | string) => {
  const nb = typeof val === "string" ? parseFloat(val) : val;
  return `UTC ${UTC_FORMATTER.format(nb).replace(".", ":").padStart(6, "+")}`;
};

/** API REQUEST */
export const getIpGeolocationData = async (ipOrDomain: string | null): Promise<App.SearchResults> => {
  const response = await (await fetch(generateEndpoint(ipOrDomain), { method: "GET" })).json();
  // Custom API error
  if (response.message) throw new Error(response.message);
  // Format response data --> App.SearchResults
  const { city, country_name, district, state_prov, zipcode, time_zone, ...rest } =
    response as App.IPGeolocationResponse;
  const location_pre = district || state_prov || country_name;
  const location = `${location_pre}, ${city} ${zipcode}`.trim();
  const timezone = formatNbToUtc(time_zone.offset);
  return { location, timezone, ...rest } as App.SearchResults;
};
