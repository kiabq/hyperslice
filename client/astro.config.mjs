import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    experimental: {
        assets: true
    },
    adapter: vercel({
        webAnalytics: {
            enabled: true
        }
    })
});
