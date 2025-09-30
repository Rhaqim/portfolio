<script lang="ts">
    import { onMount } from "svelte";

    import { navigation } from "@/data/navigation";
    import { currentPage, flipping } from "$lib/stores/pageRouter";

	const browser = typeof window !== "undefined";

    let isScrolled = false;
    let menuOpen = false;
    let isMobile = false;

    function goTo(sectionId: string) {
        flipping.set(true);
        menuOpen = false; // Close menu on navigation
        
        setTimeout(() => {
            currentPage.set(sectionId);
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: "smooth",
                    block: "start"
                });
            }
            flipping.set(false);
        }, 300);
    }

    const handleScroll = () => {
        // Show navigation after scrolling past the header
        isScrolled = window.scrollY > window.innerHeight * 0.5;
    };

    const handleResize = () => {
        isMobile = window.innerWidth <= 768;
    };

    const handleClickOutside = (event: MouseEvent) => {
        const nav = document.querySelector('.floating-nav');
        if (nav && !nav.contains(event.target as Node)) {
            menuOpen = false;
        }
    };

    onMount(() => {
        if (!browser) return;
        
        handleScroll();
        handleResize();
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        document.addEventListener("click", handleClickOutside);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<!-- Enhanced Floating Navigation -->
{#if isScrolled}
    <nav
        class="floating-nav"
        class:mobile={isMobile}
        role="navigation"
        aria-label="Main Navigation"
    >
        <!-- Navigation trigger button -->
        <button
            class="nav-trigger"
            class:active={menuOpen}
            on:click={() => (menuOpen = !menuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={menuOpen}
        >
            <span class="nav-icon">
                {#if menuOpen}
                    ✕
                {:else}
                    ☰
                {/if}
            </span>
            <span class="nav-label">Menu</span>
        </button>

        <!-- Slide-out menu -->
        <div 
            class="nav-menu" 
            class:open={menuOpen}
            role="menu"
            aria-hidden={!menuOpen}
        >
            <div class="nav-header">
                <h3 class="nav-title">Navigate</h3>
                <div class="nav-subtitle">Choose Your Chapter</div>
            </div>
            
            <ul class="nav-list">
                {#each navigation as nav, index}
                    <li class="nav-item" style="animation-delay: {index * 0.1}s">
                        <button
                            class="nav-link"
                            on:click={() => goTo(nav.id)}
                            role="menuitem"
                            aria-label="Go to {nav.name}"
                        >
                            <span class="nav-icon-item">{nav.icon || '📖'}</span>
                            <span class="nav-text">{nav.name}</span>
                            <span class="nav-arrow">→</span>
                        </button>
                    </li>
                {/each}
            </ul>
            
            <div class="nav-footer">
                <div class="sound-effect">CHOOSE!</div>
            </div>
        </div>
        
        <!-- Menu backdrop for mobile -->
        {#if menuOpen && isMobile}
            <div 
                class="nav-backdrop"
                on:click={() => (menuOpen = false)}
                role="button"
                tabindex="-1"
                aria-label="Close menu"
            ></div>
        {/if}
    </nav>
{/if}

<style>
    .floating-nav {
        position: fixed;
        top: var(--space-4);
        right: var(--space-4);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-family: "Bebas Neue", sans-serif;
    }

    .nav-trigger {
        background: var(--manga-black);
        color: var(--manga-white);
        border: 3px solid var(--manga-white);
        border-radius: 50px;
        padding: var(--space-3) var(--space-4);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-family: inherit;
        font-size: var(--text-base);
        box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .nav-trigger:hover,
    .nav-trigger.active {
        background: var(--manga-red);
        transform: scale(1.05);
        box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.4);
    }

    .nav-icon {
        font-size: var(--text-xl);
        transition: transform 0.3s ease;
    }

    .nav-trigger.active .nav-icon {
        transform: rotate(180deg);
    }

    .nav-label {
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .nav-menu {
        background: var(--manga-black);
        border: 3px solid var(--manga-white);
        border-radius: var(--panel-radius);
        margin-top: var(--space-3);
        overflow: hidden;
        width: 0;
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform: translateY(-10px);
        backdrop-filter: blur(10px);
        box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.3);
    }

    .nav-menu.open {
        width: 280px;
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }

    .nav-header {
        padding: var(--space-4) var(--space-4) var(--space-2) var(--space-4);
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        text-align: center;
    }

    .nav-title {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-xl);
        color: var(--manga-white);
        margin: 0 0 var(--space-1) 0;
        text-shadow: 2px 2px 0 var(--manga-red);
    }

    .nav-subtitle {
        font-size: var(--text-sm);
        color: var(--manga-gray);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: var(--space-2) 0;
    }

    .nav-item {
        opacity: 0;
        transform: translateX(20px);
        animation: slideInNav 0.6s ease forwards;
    }

    .nav-menu.open .nav-item {
        animation-play-state: running;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        width: 100%;
        padding: var(--space-3) var(--space-4);
        background: none;
        border: none;
        color: var(--manga-white);
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        font-family: inherit;
        font-size: var(--text-base);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-link:hover {
        background: var(--manga-red);
        color: var(--manga-white);
        transform: translateX(5px);
    }

    .nav-icon-item {
        font-size: var(--text-lg);
        width: 24px;
        text-align: center;
        flex-shrink: 0;
    }

    .nav-text {
        flex: 1;
        text-align: left;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .nav-arrow {
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
        font-size: var(--text-lg);
    }

    .nav-link:hover .nav-arrow {
        opacity: 1;
        transform: translateX(0);
    }

    .nav-footer {
        padding: var(--space-2) var(--space-4);
        text-align: center;
        border-top: 2px solid rgba(255, 255, 255, 0.2);
    }

    .sound-effect {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-sm);
        color: var(--manga-yellow);
        text-shadow: 1px 1px 0 var(--manga-black);
        transform: rotate(-5deg);
        display: inline-block;
    }

    .nav-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
        backdrop-filter: blur(5px);
    }

    @keyframes slideInNav {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .floating-nav {
            top: var(--space-3);
            right: var(--space-3);
        }

        .nav-trigger {
            padding: var(--space-2) var(--space-3);
            font-size: var(--text-sm);
        }

        .nav-label {
            display: none;
        }

        .nav-menu.open {
            width: 260px;
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            margin-top: 0;
            border-radius: 0;
            border-right: none;
            border-top: none;
            border-bottom: none;
        }

        .nav-header {
            padding-top: var(--space-6);
        }
    }

    @media (max-width: 480px) {
        .nav-menu.open {
            width: 100vw;
            border: none;
        }

        .nav-link {
            padding: var(--space-4);
            font-size: var(--text-lg);
        }
    }
</style>
