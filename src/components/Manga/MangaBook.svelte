<script lang="ts">
	import { onMount } from "svelte";

	import { navigation } from "@/data/navigation";

	import Header from "@components/Manga/Header.svelte";
	import AboutMe from "@components/Manga/AboutMe.svelte";
	import Work from "@components/Manga/Work.svelte";
	import Projects from "@components/Manga/Projects.svelte";
	import Gallery from "@components/Manga/Gallery.svelte";

	let isScrolled = false;
	let menuOpen = false;

	const handleScroll = () => {
		isScrolled = window.scrollY > window.innerHeight;
		console.log("isScrolled", isScrolled);
	};

	onMount(() => {
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<Header />

<!-- Floating nav trigger -->
<!-- {#if isScrolled} -->
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
					class="nav-link"
					on:click={() => (menuOpen = false)}
					aria-label={nav.id}
				>
					{nav.name}
				</a>
			{/each}
		</div>
	</div>
<!-- {/if} -->

<section>
	<AboutMe />

	<Work />

	<!-- <Projects />

	<Gallery /> -->
</section>

<footer style="text-align: center; font-size: 0.8rem; margin: 4rem 0;">
	© 2025 All Rights Reserved — Manga Magazine Vol.1
</footer>

<style>
	.floating-nav {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.nav-icon {
		background: black;
		color: white;
		padding: 0.6rem 0.8rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1.2rem;
		transition: background 0.3s;
	}

	.nav-menu {
		background: rgba(0, 0, 0, 0.9);
		color: white;
		border-radius: 0.5rem;
		margin-top: 0.5rem;
		overflow: hidden;
		width: 0;
		opacity: 0;
		pointer-events: none;
		transition:
			width 0.3s ease,
			opacity 0.3s ease;
	}

	.nav-menu.open {
		width: 200px;
		opacity: 1;
		pointer-events: auto;
	}

	.nav-link {
		display: block;
		padding: 0.75rem 1rem;
		text-decoration: none;
		color: white;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		transition: background 0.2s;
	}

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	@media (max-width: 768px) {
		.nav-menu.open {
			width: 160px;
		}
		.nav-icon {
			padding: 0.5rem 0.7rem;
			font-size: 1rem;
		}
	}
</style>
