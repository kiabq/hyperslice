import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    adapter: vercelStatic(),
    experimental: {
        assets: true
    }
});
