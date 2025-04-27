<script>
	import { onMount } from "svelte";
	let scrollY = 0;

	const handleScroll = () => {
		scrollY = window.scrollY;
	};

	onMount(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<section class="spread">
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

	<div class="title" style="transform: translateY({scrollY * 0.4}px);">
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
		background-image: url("/images/bg-layer-1.jpg"); /* Replace with your art */
		z-index: 1;
	}

	.midground {
		background-image: url("/images/bg-layer-2.png"); /* Maybe some manga effects / speed lines */
		z-index: 2;
	}

	.foreground {
		background-image: url("/images/bg-layer-3.png"); /* Character art */
		z-index: 3;
	}

	.title {
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		color: white;
		transform: translateY(-50%);
		z-index: 4;
		font-family: "Comic Neue", sans-serif;
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
