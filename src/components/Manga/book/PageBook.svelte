<script>
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	export let pages = [];
	let currentIndex = 0;

	const transition =
		typeof document?.startViewTransition === "undefined"
			? fn => fn()
			: fn => document.startViewTransition(fn);

	function goTo(index) {
		if (index < 0 || index >= pages.length) return;
		transition(() => {
			currentIndex = index;
		});
	}
</script>

<div class="book-container">
	{#each pages as Page, i}
		<div
			class="page"
			style="display: {i === currentIndex ? 'block' : 'none'}"
			view-transition-name={"page-" + i}
		>
			<svelte:component this={Page} />
		</div>
	{/each}
</div>

<nav class="nav">
	<button on:click={() => goTo(currentIndex - 1)}>← Prev</button>
	<button on:click={() => goTo(currentIndex + 1)}>Next →</button>
</nav>

<style>
	.book-container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.nav {
		position: absolute;
		bottom: 2rem;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0 2rem;
		z-index: 1000;
	}
</style>
