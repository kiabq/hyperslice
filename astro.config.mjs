import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    root: 'client/src',
    srcDir: 'client/src',
    experimental: {
        assets: true
    }
});
