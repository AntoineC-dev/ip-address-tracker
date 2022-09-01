/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IPGEOLOCATION_API_KEY: string;
  readonly VITE_MAPBOX_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
