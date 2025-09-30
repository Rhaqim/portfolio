// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	site: "https://rhaqim.com",
	integrations: [svelte()],
	output: "server",
	adapter: node({ mode: "standalone" }),
});
