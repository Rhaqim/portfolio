<script>
	import { onMount, onDestroy } from "svelte";
	let scrollY = 0;
	let pageOffsetTop = 0;
	let rotation = 0;
	let pageRef;

	function handleScroll() {
		const scrollTop = window.scrollY;
		const viewportHeight = window.innerHeight;

		const distanceFromTop = pageRef.offsetTop - scrollTop;
		const progress = Math.min(
			Math.max(1 - distanceFromTop / viewportHeight, 0),
			1
		);

		rotation = (1 - progress) * 90; // Rotate from 90deg to 0deg
	}

	onMount(() => {
		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Initialize

		pageOffsetTop = pageRef.offsetTop;

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	});
</script>

<div
	bind:this={pageRef}
	class="page"
	style="transform: rotateY({rotation}deg) scale(1); transform-origin: left center;"
>
	<slot />
</div>

<style>
	.page {
		transition: transform 0.1s linear;
		margin-bottom: 4rem;
		perspective: 1000px;
	}
</style>
