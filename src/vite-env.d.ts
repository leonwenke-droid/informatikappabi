/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVAL_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
