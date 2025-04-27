<script>
	import { onMount } from "svelte";
	let scrollY = 0;
	let isVisible = false;

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

<section class="spread">
	<!-- Parallax Layers -->
	<div
		class="background"
		style="transform: translateY({scrollY * 0.2}px);"
	></div>
	<div
		class="midground"
		style="transform: translateY({scrollY * 0.5}px);"
	></div>
	<div
		class="foreground"
		style="transform: translateY({scrollY * 0.8}px);"
	></div>

	<!-- Manga Grid Overlay -->
	<div class="grid-overlay"></div>

	<!-- Manga Paper Texture Overlay -->
	<div class="texture-overlay"></div>

	<!-- Title Area with entrance effect -->
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

	.background,
	.midground,
	.foreground {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		will-change: transform;
		z-index: 1;
	}

	.background {
		background-image: url("/images/bg-layer-1.jpg");
		z-index: 1;
	}

	.midground {
		background-image: url("/images/bg-layer-2.png");
		z-index: 2;
	}

	.foreground {
		background-image: url("/images/bg-layer-3.png");
		z-index: 3;
	}

	/* Manga Grid Overlay */
	.grid-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("/images/manga-grid.png"); /* Create this image */
		opacity: 0.2; /* Make it subtle */
		z-index: 4;
	}

	/* Manga Paper Texture Overlay */
	.texture-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("/images/paper-texture.png"); /* Paper noise or grain */
		opacity: 0.1; /* Subtle texture */
		z-index: 5;
	}

	/* Title */
	.title {
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		color: white;
		transform: translateY(-50%) translateY(100px); /* Start off-screen */
		opacity: 0;
		transition: all 0.8s ease-out;
		z-index: 6;
		font-family: "Comic Neue", sans-serif;
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
