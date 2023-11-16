/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_PROTOCOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
