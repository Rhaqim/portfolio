// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	site: "https://rhaqim.com",
	integrations: [svelte()],
	output: "static",
	devToolbar: {
		enabled: false,
	},
});
