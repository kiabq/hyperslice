import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless"

// https://astro.build/config
export default defineConfig({
    experimental: {
        assets: true
    },
    output: "server",
    adapter: vercel({
        webAnalytics: {
            enabled: true
        }
    })
});
