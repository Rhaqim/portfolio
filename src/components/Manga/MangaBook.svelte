<script lang="ts">
        import Header from "@/components/Manga/header/Header.svelte";
        import AboutMe from "@/components/Manga/intro/AboutMe.svelte";
        import Projects from "@/components/Manga/projects/Projects.svelte";
        import Work from "@/components/Manga/work/Work.svelte";
        import NextArc from "@/components/Manga/gallery/Thoughts.svelte";
        import Nav from "@/components/Manga/navigation/Header.svelte";

        import { onMount } from "svelte";

        const chapters = [
                { id: "cover", label: "01" },
                { id: "about-me", label: "02" },
                { id: "projects", label: "03" },
                { id: "work", label: "04" },
                { id: "next", label: "05" },
        ];

        let activeChapter = "cover";

        onMount(() => {
                const sections = chapters.map(c => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];

                const observer = new IntersectionObserver(
                        (entries) => {
                                entries.forEach(entry => {
                                        if (entry.isIntersecting) {
                                                activeChapter = entry.target.id;
                                        }
                                });
                        },
                        { threshold: 0.5 }
                );

                sections.forEach(s => observer.observe(s));
                return () => observer.disconnect();
        });
</script>

<!-- Fixed side navigation dots -->
<Nav {chapters} {activeChapter} />

<!-- Scroll-snap container: each child is a "chapter" -->
<div class="manga-scroll">
        <Header />
        <AboutMe />
        <Projects />
        <Work />
        <NextArc />
</div>

<style>
        .manga-scroll {
                /* This element IS the scroll container */
                width: 100vw;
                height: 100svh;
                overflow-y: scroll;
                scroll-snap-type: y mandatory;
                scroll-behavior: smooth;
        }

        /* Children are .chapter elements defined in each component */
</style>
