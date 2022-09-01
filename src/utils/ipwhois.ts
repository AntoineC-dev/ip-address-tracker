const API_BASE = "https://ipwho.is";
const FIELDS = "ip,country,region,city,postal,latitude,longitude,connection.isp,timezone.utc";

interface IPWhoIsJSONResponse {
  ip: string;
  success: boolean;
  message?: string;
  country: string;
  region: string;
  city: string;
  postal: string;
  latitude: string;
  longitude: string;
  connection: {
    isp: string;
  };
  timezone: {
    utc: string;
  };
}

const formatdata = (data: IPWhoIsJSONResponse): App.SearchResults => {
  const { ip, latitude, longitude, connection } = data;
  const location_pre = data.region || data.country;
  const location = `${location_pre}, ${data.city} ${data.postal}`.trim();
  const timezone = `UTC ${data.timezone.utc}`;
  return { location, ip, isp: connection.isp, latitude, longitude, timezone };
};

export const getIpGeolocationData = async (ip?: string) => {
  const response = ip
    ? await fetch(`${API_BASE}/${ip}?fields=${FIELDS}`)
    : await fetch(`${API_BASE}/?fields=${FIELDS}`);
  const data = (await response.json()) as IPWhoIsJSONResponse;
  if (data.message) throw new Error(data.message);
  return formatdata(data);
};
