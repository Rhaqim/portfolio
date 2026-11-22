// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";

/**
 * Wrap every markdown table in a horizontally scrollable div so wide API
 * tables never force the page body to scroll sideways on mobile.
 */
function rehypeWrapTables() {
	return (tree) => {
		const walk = (node) => {
			if (!Array.isArray(node.children)) return;
			node.children = node.children.map((child) => {
				walk(child);
				if (child.type === "element" && child.tagName === "table") {
					return {
						type: "element",
						tagName: "div",
						properties: { className: ["table-scroll"] },
						children: [child],
					};
				}
				return child;
			});
		};
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: "https://rhaqim.com",
	// Company pages are unlisted: never in the sitemap (they're noindex too).
	integrations: [sitemap({ filter: (page) => !page.includes("/company/") && !page.endsWith("/demo/loom/") })],
	output: "static",
	// loom was renamed Noewright; keep old links (and sent company pages) working.
	// /demo/loom is a page of its own (src/pages/demo/loom.astro) so invite links keep their ?game= code.
	redirects: {
		"/loom": "/noewright",
	},
	devToolbar: {
		enabled: false,
	},
	markdown: {
		processor: unified({ rehypePlugins: [rehypeWrapTables] }),
		shikiConfig: {
			theme: "github-dark-default",
			wrap: false,
		},
	},
});
