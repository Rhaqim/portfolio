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
	integrations: [sitemap()],
	output: "static",
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
