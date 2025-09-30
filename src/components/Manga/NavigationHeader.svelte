<script lang="ts">
	import { onMount } from "svelte";

	import { navigation } from "@/data/navigation";
	import { currentPage, flipping } from "$lib/stores/pageRouter";

	let isScrolled = false;
	let menuOpen = false;

	function goTo(sectionId: string) {
		flipping.set(true); // start flip animation
		setTimeout(() => {
			currentPage.set(sectionId);
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: "smooth" });
			flipping.set(false);
		}, 600); // match your flip animation timing
	}

	const handleScroll = () => {
		isScrolled = window.scrollY > window.innerHeight * 0.9;
	};

	onMount(() => {
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<!-- Floating nav trigger -->
{#if isScrolled}
	<div
		class="floating-nav"
		role="button"
		tabindex="0"
		aria-label="Navigation Menu"
		on:mouseenter={() => (menuOpen = true)}
		on:mouseleave={() => (menuOpen = false)}
	>
		<!-- Icon or trigger button -->
		<div class="nav-icon">☰</div>

		<!-- Slide-out menu -->
		<div class="nav-menu" class:open={menuOpen}>
			{#each navigation as nav}
				<a
					href={nav.href}
					on:click|preventDefault={() => goTo(nav.id)}
					class="nav-link"
					on:click={() => (menuOpen = false)}
					aria-label={nav.id}
				>
					{nav.name}
				</a>
			{/each}
		</div>
	</div>
{/if}
