<script lang="ts">
	import GridOverlay from "./GridOverlay.svelte";
	import CharacterImg from "./HeaderComponents/CharacterIntro.svelte";
	import Introduction from "./HeaderComponents/Introduction.svelte";
	import TableOfContents from "./HeaderComponents/TableOfContents.svelte";
	import Socials from "./HeaderComponents/Socials.svelte";

	let gridCells: GridLayout[] = [
		{
			content: Introduction,
			rowSpan: 1,
			colSpan: 1,
			skewX: -5,
			backgroundColor: "rgba(255,255,255,0.03)",
			clipPath: "polygon(0 0, 100% 5%, 95% 100%, 0% 95%)",
			effect: "appear",
			effectDuration: 0.5,
			effectDelay: 0.1,
		},
		{
			content: CharacterImg,
			rowSpan: 1,
			colSpan: 1,
			skewX: 3,
			effect: "appear",
			effectDuration: 0.5,
			effectDelay: 0.5,
		},
		{
			content: TableOfContents,
			rowSpan: 1,
			colSpan: 1,
			skewY: -4,
			effect: "appear",
			effectDuration: 0.5,
			effectDelay: 1,
		},
		{
			content: Socials,
			rowSpan: 1,
			colSpan: 1,
			effect: "appear",
			effectDuration: 0.5,
			effectDelay: 1.5,
		},
	];
</script>

<div class="intro">
	<Introduction />
</div>

<section id="cover" class="spread">
	<GridOverlay rows={2} columns={2} cells={gridCells} />
</section>

<style>
	.spread {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: #000;
		perspective: 1000px;
	}

	@media (max-width: 768px) {
		.spread {
			display: none;
		}

		.intro {
			display: block;
			width: 100%;
			height: 100vh;
		}
	}

	@media (min-width: 769px) {
		.spread {
			display: block;
		}
		.intro {
			display: none;
		}
	}
</style>
