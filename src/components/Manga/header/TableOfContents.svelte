<script lang="ts">
    import { onMount } from "svelte";
    import { currentPage, flipping } from "$lib/stores/pageRouter";
    import { navigation } from "@/data/navigation";

    let hoveredItem = "";
    let isVisible = false;

    function goTo(sectionId: string) {
        flipping.set(true);
        setTimeout(() => {
            currentPage.set(sectionId);
            document
                .getElementById(sectionId)
                ?.scrollIntoView({ behavior: "smooth" });
            flipping.set(false);
        }, 600);
    }

    onMount(() => {
        const timer = setTimeout(() => {
            isVisible = true;
        }, 300);
        return () => clearTimeout(timer);
    });
</script>

<section class="table-of-contents" class:visible={isVisible}>
    <div class="toc-header">
        <h3 class="toc-title">Table of Contents</h3>
        <div class="toc-subtitle">Choose Your Adventure!</div>
    </div>
    
    <div class="toc-list">
        {#each navigation as nav, index}
            {#if nav.id !== "cover"}
                <div 
                    class="panel-toc"
                    class:hovered={hoveredItem === nav.id}
                    style="animation-delay: {index * 0.1}s"
                    on:mouseenter={() => hoveredItem = nav.id}
                    on:mouseleave={() => hoveredItem = ""}
                    role="button"
                    tabindex="0"
                    on:click={() => goTo(nav.id)}
                    on:keydown={(e) => e.key === 'Enter' && goTo(nav.id)}
                >
                    <div class="chapter-number">
                        {index}
                    </div>
                    <div class="chapter-info">
                        <span class="chapter-title">{nav.name}</span>
                        <div class="chapter-icon">{nav.icon}</div>
                    </div>
                    <div class="hover-effect">
                        <span class="sound-effect">CLICK!</span>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
    
    <div class="toc-footer">
        <div class="manga-hint">
            <span class="sound-effect">POW!</span>
            Click any chapter to jump right in!
        </div>
    </div>
</section>

<style>
    .table-of-contents {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 3px solid var(--manga-white);
        border-radius: var(--panel-radius);
        backdrop-filter: blur(10px);
        padding: var(--space-6);
        color: var(--manga-white);
        text-align: center;
        position: relative;
        overflow: hidden;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }

    .table-of-contents.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .table-of-contents::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            transparent 48%,
            rgba(255, 255, 255, 0.1) 49%,
            rgba(255, 255, 255, 0.1) 51%,
            transparent 52%
        );
        background-size: 20px 20px;
        pointer-events: none;
        opacity: 0.3;
    }

    .toc-header {
        margin-bottom: var(--space-6);
        z-index: 2;
        position: relative;
    }

    .toc-title {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-2xl);
        color: var(--manga-white);
        margin: 0 0 var(--space-2) 0;
        text-shadow: 2px 2px 0 var(--manga-black);
    }

    .toc-subtitle {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-base);
        color: var(--manga-yellow);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .toc-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        width: 100%;
        z-index: 2;
        position: relative;
    }

    .panel-toc {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: var(--manga-black);
        border: 2px solid var(--manga-white);
        border-radius: var(--panel-radius);
        padding: var(--space-3);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        opacity: 0;
        animation: slideInTOC 0.6s ease forwards;
    }

    .panel-toc:hover,
    .panel-toc.hovered {
        background: var(--manga-red);
        transform: translateX(10px) scale(1.02);
        box-shadow: 5px 5px 0px var(--manga-white);
    }

    .chapter-number {
        background: var(--manga-white);
        color: var(--manga-black);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Anton", sans-serif;
        font-weight: bold;
        font-size: var(--text-sm);
        flex-shrink: 0;
    }

    .chapter-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chapter-title {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-base);
        color: var(--manga-white);
        text-align: left;
    }

    .chapter-icon {
        font-size: var(--text-lg);
        opacity: 0.7;
    }

    .hover-effect {
        position: absolute;
        top: 50%;
        right: -50px;
        transform: translateY(-50%);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .panel-toc:hover .hover-effect {
        right: var(--space-2);
        opacity: 1;
    }

    .sound-effect {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-sm);
        color: var(--manga-yellow);
        text-shadow: 1px 1px 0 var(--manga-black);
        transform: rotate(-10deg);
    }

    .toc-footer {
        margin-top: var(--space-6);
        z-index: 2;
        position: relative;
    }

    .manga-hint {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-sm);
        color: var(--manga-light-gray);
        display: flex;
        align-items: center;
        gap: var(--space-2);
        justify-content: center;
    }

    @keyframes slideInTOC {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .table-of-contents {
            padding: var(--space-4);
        }

        .toc-title {
            font-size: var(--text-xl);
        }

        .toc-subtitle {
            font-size: var(--text-sm);
        }

        .panel-toc {
            padding: var(--space-2);
            gap: var(--space-2);
        }

        .chapter-number {
            width: 25px;
            height: 25px;
            font-size: var(--text-xs);
        }

        .chapter-title {
            font-size: var(--text-sm);
        }

        .chapter-icon {
            font-size: var(--text-base);
        }

        .panel-toc:hover {
            transform: translateY(-2px) scale(1.02);
        }
    }
</style>
