// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://rhaqim.com",
	integrations: [svelte()],
	output: "server",
	adapter: vercel(),
});
