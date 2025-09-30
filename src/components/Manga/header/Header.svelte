<script lang="ts">
    import { onMount } from "svelte";
    import GridOverlay from "./GridOverlay.svelte";
    import CharacterImg from "./CharacterIntro.svelte";
    import Introduction from "./Introduction.svelte";
    import TableOfContents from "./TableOfContents.svelte";
    import Socials from "./Socials.svelte";

	const browser = typeof window !== "undefined";

    let isMobile = false;
    let isLoaded = false;

    let gridCells: GridLayout[] = [
        {
            content: Introduction,
            rowSpan: 1,
            colSpan: 1,
            skewX: -2,
            backgroundColor: "rgba(255,255,255,0.08)",
            clipPath: "polygon(0 0, 100% 5%, 95% 100%, 0% 95%)",
            effect: "appear",
            effectDuration: 0.8,
            effectDelay: 0.2,
        },
        {
            content: CharacterImg,
            rowSpan: 1,
            colSpan: 1,
            skewX: 2,
            backgroundColor: "rgba(255,255,255,0.06)",
            effect: "appear",
            effectDuration: 0.8,
            effectDelay: 0.5,
        },
        {
            content: TableOfContents,
            rowSpan: 1,
            colSpan: 1,
            skewY: -2,
            backgroundColor: "rgba(255,255,255,0.08)",
            effect: "appear",
            effectDuration: 0.8,
            effectDelay: 0.8,
        },
        {
            content: Socials,
            rowSpan: 1,
            colSpan: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            effect: "appear",
            effectDuration: 0.8,
            effectDelay: 1.1,
        },
    ];

    onMount(() => {
        if (!browser) return;
        
        isMobile = window.innerWidth <= 768;
        
        const handleResize = () => {
            isMobile = window.innerWidth <= 768;
        };
        
        window.addEventListener('resize', handleResize);
        
        // Add entrance animation
        setTimeout(() => {
            isLoaded = true;
        }, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<!-- Mobile Version: Show Introduction only, hide grid -->
<div class="intro" class:show={isMobile} class:loaded={isLoaded}>
    <Introduction />
</div>

<!-- Desktop Version -->
<section id="cover" class="spread" class:show={!isMobile} class:loaded={isLoaded}>
    <div class="background-effects">
        <div class="effect-particle"></div>
        <div class="effect-particle"></div>
        <div class="effect-particle"></div>
    </div>
    <GridOverlay rows={2} columns={2} cells={gridCells} />
</section>

<style>
    .spread {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: var(--manga-black);
        background-image: 
            radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
        perspective: 1000px;
        display: none;
        opacity: 0;
        transform: scale(0.95);
        transition: all 1s ease-out;
    }

    .spread.show {
        display: block;
    }

    .spread.loaded {
        opacity: 1;
        transform: scale(1);
    }

    .intro {
        display: none;
        width: 100%;
        min-height: 100vh;
        background: var(--manga-black);
        background-image: 
            radial-gradient(circle at 30% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(37, 99, 235, 0.15) 0%, transparent 60%);
        color: var(--manga-white);
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s ease-out;
        padding: var(--space-4);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .intro.show {
        display: flex;
    }

    .intro.loaded {
        opacity: 1;
        transform: translateY(0);
    }

    .background-effects {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .effect-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--manga-white);
        border-radius: 50%;
        opacity: 0.3;
        animation: float 6s ease-in-out infinite;
    }

    .effect-particle:nth-child(1) {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
        animation-duration: 8s;
    }

    .effect-particle:nth-child(2) {
        top: 60%;
        right: 15%;
        animation-delay: 2s;
        animation-duration: 10s;
    }

    .effect-particle:nth-child(3) {
        bottom: 30%;
        left: 70%;
        animation-delay: 4s;
        animation-duration: 7s;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
        }
    }

    /* Media Queries */
    @media (max-width: 768px) {
        .spread {
            display: none !important;
        }

        .intro {
            display: flex !important;
            padding: var(--space-3);
        }
    }

    @media (min-width: 769px) {
        .intro {
            display: none !important;
        }

        .spread {
            display: block !important;
        }
    }
</style>
