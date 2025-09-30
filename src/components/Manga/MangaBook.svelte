<script lang="ts">
	import Header from "@/components/Manga/header/Header.svelte";
	import AboutMe from "@/components/Manga/intro/AboutMe.svelte";
	import Work from "@/components/Manga/work/Work.svelte";
	import Projects from "@/components/Manga/projects/Projects.svelte";
	import Gallery from "@/components/Manga/gallery/Gallery.svelte";
	
	import { onMount } from "svelte";
	
	let isLoaded = false;
	
	onMount(() => {
		// Ensure smooth loading
		const timer = setTimeout(() => {
			isLoaded = true;
		}, 100);
		
		return () => clearTimeout(timer);
	});
</script>

<!-- Header Section -->
<Header />

<!-- Main Content - Each component takes full viewport -->
<div class="manga-book" class:loaded={isLoaded}>
	<AboutMe />
	<Work />
	<Projects />
	<Gallery />
</div>

<!-- Footer -->
<footer class="manga-footer">
	<div class="footer-content">
		<div class="footer-text">
			© 2025 All Rights Reserved — Manga Magazine Vol.1
		</div>
		<div class="footer-subtitle">
			Built with ❤️ using Astro & Svelte
		</div>
	</div>
</footer>

<style>
	.manga-book {
		width: 100%;
		position: relative;
		/* Remove any constraints that prevent full viewport usage */
		opacity: 0;
		transition: opacity 0.8s ease;
	}
	
	.manga-book.loaded {
		opacity: 1;
	}
	
	/* Ensure each section can use full viewport */
	.manga-book :global(section) {
		width: 100vw;
		min-height: 100vh;
		position: relative;
		/* Remove any default margins/padding that create layout issues */
		margin: 0;
		padding: 0;
	}
	
	/* Remove any default section styling that might interfere */
	.manga-book :global(.wrapper) {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}
	
	.manga-book :global(.section) {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		box-shadow: none;
		background: none;
	}
	
	.manga-footer {
		background: var(--manga-black);
		color: var(--manga-white);
		padding: var(--space-8) var(--space-4);
		text-align: center;
		position: relative;
		border-top: 3px solid var(--manga-red);
	}
	
	.footer-content {
		max-width: 600px;
		margin: 0 auto;
	}
	
	.footer-text {
		font-family: "Bangers", sans-serif;
		font-size: var(--text-lg);
		color: var(--manga-white);
		text-shadow: 2px 2px 0 var(--manga-red);
		margin-bottom: var(--space-2);
	}
	
	.footer-subtitle {
		font-family: "Bebas Neue", sans-serif;
		font-size: var(--text-base);
		color: var(--manga-gray);
		opacity: 0.8;
	}
	
	/* Mobile responsive footer */
	@media (max-width: 768px) {
		.manga-footer {
			padding: var(--space-6) var(--space-3);
		}
		
		.footer-text {
			font-size: var(--text-base);
		}
		
		.footer-subtitle {
			font-size: var(--text-sm);
		}
	}
</style>
