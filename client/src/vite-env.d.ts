/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_API: string;
  readonly VITE_SERVER_ROOM_IMG: string;
  readonly VITE_SERVER_USER_IMG: string;

  readonly VITE_GOOGLE_KEY: string;

  readonly VITE_HTTP_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
