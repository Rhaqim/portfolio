<script lang="ts">
	import { onMount } from "svelte";

	import GridOverlay from "./GridOverlay.svelte";
	import CharacterImg from "./Spread/CharacterIMG.svelte";
	import Introduction from "./Spread/Introduction.svelte";
	import TableOfContents from "./Spread/TableOfContents.svelte";
	import Socials from "./Spread/Socials.svelte";

	let scrollY = 0;
	let isVisible = false;

	let gridCells: GridLayout[] = [
		{
			content: Introduction,
			rowSpan: 1,
			colSpan: 1,
			skewX: -5,
			backgroundColor: "rgba(255,255,255,0.03)",
			clipPath: "polygon(0 0, 100% 5%, 95% 100%, 0% 95%)",
		},
		{
			content: CharacterImg,
			rowSpan: 1,
			colSpan: 1,
			skewX: 3,
		},
		{
			content: TableOfContents,
			rowSpan: 1,
			colSpan: 1,
			skewY: -4,
		},
		{
			content: Socials,
			rowSpan: 1,
			colSpan: 1,
		},
	];

	const handleScroll = () => {
		scrollY = window.scrollY;
		if (scrollY > 10) {
			isVisible = true;
		}
	};

	onMount(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<div class="intro">
	<Introduction />
</div>

<section class="spread">
	<GridOverlay rows={2} columns={2} cells={gridCells} />

	<!-- Title Area -->
	<div class="title {isVisible ? 'visible' : ''}">
		<h1>MANGA MAGAZINE</h1>
		<p>Volume 1 — Adventures Await</p>
	</div>
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

	/* Title */
	.title {
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		color: white;
		transform: translateY(-50%) translateY(100px);
		opacity: 0;
		transition: all 0.8s ease-out;
		z-index: 6;
		font-family: "Comic Neue", sans-serif;
		pointer-events: none;
	}

	.title.visible {
		transform: translateY(-50%) translateY(0);
		opacity: 1;
	}

	.title h1 {
		font-size: 4rem;
		margin: 0;
	}

	.title p {
		font-size: 1.5rem;
		margin-top: 1rem;
	}
</style>
