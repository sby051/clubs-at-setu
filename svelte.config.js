import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        preprocess({
            postcss: true,
        }),
    ],

    kit: {
        adapter: adapter(),
        alias: {
            "@components": "./src/components",
            "@routes": "./src/routes",
            "@stores": "./src/stores",
            "@utils": "./src/utils",
            "@assets": "./src/assets",
            "@types": "./src/types",
            "@features": "./src/features",
            "@server": "./src/server",
            "@fb": "./src/firebase",
        },
        env: {
            publicPrefix: "", // TODO: REMOVE THIS WHEN PRIVATE ENV FIXED
        },
    },
};

export default config;
