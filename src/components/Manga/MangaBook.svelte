<script lang="ts">
	import Header from "@/components/Manga/header/Header.svelte";
	import AboutMe from "@/components/Manga/intro/AboutMe.svelte";
	import Work from "@/components/Manga/work/Work.svelte";
	import Projects from "@/components/Manga/projects/Projects.svelte";
	import Gallery from "@/components/Manga/gallery/Gallery.svelte";
</script>

<Header />

<section>
	<AboutMe />

	<Work />

	<Projects />

	<Gallery />
</section>

<footer style="text-align: center; font-size: 0.8rem; margin: 4rem 0;">
	© 2025 All Rights Reserved — Manga Magazine Vol.1
</footer>
