declare namespace App {
  interface IPGeolocationResponse {
    ip: string;
    country_name: string;
    state_prov: string;
    district: string;
    city: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    isp: string;
    time_zone: {
      offset: number;
    };
  }

  interface SearchResults {
    ip: string;
    location: string;
    timezone: string;
    isp: string;
    latitude: string;
    longitude: string;
  }

  interface MapData {
    coordinates: {
      lat: number;
      lng: number;
    };
    location: string;
  }
}
