<script>
	import { onMount } from "svelte";
	let visible = false;
	let pageRef;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0.3 }
		);
		observer.observe(pageRef);

		return () => observer.disconnect();
	});
</script>

<div bind:this={pageRef} class="page {visible ? 'visible' : ''}">
	<slot />
</div>

<style>
	.page {
		opacity: 0;
		transform: rotateY(15deg) scale(0.95);
		transform-origin: left center;
		transition: all 0.8s ease-out;
		margin-bottom: 4rem;
		perspective: 1000px;
	}

	.page.visible {
		opacity: 1;
		transform: rotateY(0deg) scale(1);
	}
</style>
