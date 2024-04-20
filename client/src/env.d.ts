/// <reference types="astro/client-image" />
declare module 'qrious'

interface ImportMetaEnv {
    readonly PUBLIC_BACKEND_URL: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}