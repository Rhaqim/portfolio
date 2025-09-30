<script lang="ts">
    import { onMount } from "svelte";
    import { workHistory } from "@/data/work";

    let currentPage = 0;
    let isVisible = false;

    const nextPage = () => {
        if (currentPage < workHistory.length) {
            currentPage += 1;
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            currentPage -= 1;
        }
    };

    onMount(() => {
        const timer = setTimeout(() => {
            isVisible = true;
        }, 600);
        return () => clearTimeout(timer);
    });
</script>

<section id="work" class="manga-page {isVisible ? 'fade-in' : ''}">
    <div class="page-container">
        {#if currentPage === 0}
            <!-- Introduction Page -->
            <div
                role="button"
                tabindex="0"
                class="full-page intro-page"
                on:click={nextPage}
                on:keydown={e => {
                    if (e.key === "Enter" || e.key === " ") nextPage();
                }}
            >
                <div class="chapter-header">
                    <div class="chapter-number">Chapter 2</div>
                    <h1 class="chapter-title">Work Experience</h1>
                    <div class="chapter-subtitle">My Professional Journey</div>
                </div>
                
                <div class="intro-panels">
                    <div class="speech-bubble large">
                        I thrive on building efficient, scalable systems — from low-level
                        server optimization to high-performance frontends.
                    </div>
                    
                    <div class="manga-panel intro-panel">
                        <div class="panel-content">
                            <h3>What I Do</h3>
                            <p>
                                My work spans creative tech projects: building backends, exploring
                                game development, AI deployments, crafting bots, managing VPS
                                deployments, and even engineering NFT-gated systems.
                            </p>
                        </div>
                    </div>
                    
                    <div class="thought-bubble large">
                        Every project I approach focuses on clean architecture, system
                        performance, and user experience — blending engineering precision
                        with creative expression.
                    </div>
                </div>
                
                <div class="continue-hint">
                    <span class="sound-effect">TAP!</span>
                    <p>Tap anywhere to explore my experience</p>
                </div>
            </div>
        {:else}
            <!-- Work Detail Page -->
            <div
                role="button"
                tabindex="0"
                class="full-page work-detail-page"
                on:click={nextPage}
                on:keydown={e => {
                    if (e.key === "Enter" || e.key === " ") nextPage();
                }}
            >
                <div class="work-header">
                    <div class="company-badge">
                        <h2>{workHistory[currentPage - 1].company}</h2>
                    </div>
                    <div class="role-tag">
                        {workHistory[currentPage - 1].role}
                    </div>
                </div>
                
                <div class="work-content">
                    <div class="description-panel">
                        <div class="speech-bubble work-speech">
                            {workHistory[currentPage - 1].description}
                        </div>
                    </div>
                    
                    {#if workHistory[currentPage - 1].technologies}
                        <div class="tech-showcase">
                            <div class="tech-header">
                                <span class="sound-effect">TECH STACK!</span>
                            </div>
                            <div class="tech-grid">
                                {#each workHistory[currentPage - 1].technologies.slice(0, 8) as tech}
                                    <div class="tech-badge">{tech}</div>
                                {/each}
                                {#if workHistory[currentPage - 1].technologies.length > 8}
                                    <div class="tech-badge more-badge">
                                        +{workHistory[currentPage - 1].technologies.length - 8} more
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
                
                <div class="page-counter">
                    <span class="current">{currentPage}</span> / <span class="total">{workHistory.length}</span>
                </div>
            </div>
        {/if}

        <!-- Navigation Controls -->
        {#if currentPage > 0}
            <button class="nav-button prev-nav" on:click|stopPropagation={prevPage}>
                <span class="nav-icon">←</span>
                <span class="nav-text">Previous</span>
            </button>
        {/if}

        {#if currentPage < workHistory.length}
            <button class="nav-button next-nav" on:click|stopPropagation={nextPage}>
                <span class="nav-text">Next</span>
                <span class="nav-icon">→</span>
            </button>
        {/if}
    </div>
</section>

<style>
    .manga-page {
        width: 100vw;
        min-height: 100vh;
        background: var(--manga-paper);
        background-image: 
            radial-gradient(circle at 1px 1px, var(--manga-gray) 1px, transparent 0);
        background-size: 20px 20px;
        position: relative;
        overflow: hidden;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }

    .manga-page.fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    .page-container {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
    }

    .full-page {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6);
        background: var(--manga-white);
        border: 4px solid var(--manga-black);
        border-radius: var(--panel-radius);
        box-shadow: 
            0 0 0 8px var(--manga-paper),
            0 0 0 12px var(--manga-black),
            20px 20px 0 var(--manga-black);
        position: relative;
        overflow: hidden;
    }

    .full-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            transparent 48%,
            rgba(0, 0, 0, 0.02) 49%,
            rgba(0, 0, 0, 0.02) 51%,
            transparent 52%
        );
        background-size: 30px 30px;
        pointer-events: none;
        z-index: 1;
    }

    .chapter-header {
        text-align: center;
        z-index: 2;
        position: relative;
    }

    .chapter-number {
        background: var(--manga-black);
        color: var(--manga-white);
        padding: var(--space-2) var(--space-4);
        border-radius: 50px;
        font-family: "Anton", sans-serif;
        font-size: var(--text-lg);
        display: inline-block;
        margin-bottom: var(--space-3);
    }

    .chapter-title {
        font-family: "Bangers", sans-serif;
        font-size: clamp(2rem, 8vw, 4rem);
        color: var(--manga-black);
        text-shadow: 
            3px 3px 0 var(--manga-white),
            6px 6px 0 var(--manga-red);
        margin: 0 0 var(--space-2) 0;
        transform: rotate(-1deg);
    }

    .chapter-subtitle {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-xl);
        color: var(--manga-gray);
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .intro-panels {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        width: 100%;
        max-width: 800px;
        z-index: 2;
        position: relative;
        flex: 1;
        justify-content: center;
    }

    .speech-bubble.large {
        background: var(--manga-white);
        border: 3px solid var(--manga-black);
        border-radius: 25px;
        padding: var(--space-6);
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-xl);
        text-align: center;
        position: relative;
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .speech-bubble.large::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 15px solid var(--manga-white);
    }

    .manga-panel.intro-panel {
        background: var(--manga-light-gray);
        border: 3px solid var(--manga-black);
        border-radius: var(--panel-radius);
        padding: var(--space-6);
        transform: rotate(1deg);
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .panel-content h3 {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-2xl);
        color: var(--manga-black);
        margin: 0 0 var(--space-3) 0;
    }

    .thought-bubble.large {
        background: var(--manga-light-gray);
        border: 3px dashed var(--manga-gray);
        border-radius: 30px;
        padding: var(--space-6);
        font-style: italic;
        font-size: var(--text-lg);
        text-align: center;
        position: relative;
    }

    .continue-hint {
        text-align: center;
        z-index: 2;
        position: relative;
    }

    .sound-effect {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-2xl);
        color: var(--manga-red);
        text-shadow: 2px 2px 0 var(--manga-black);
        transform: rotate(-5deg);
        display: block;
        margin-bottom: var(--space-2);
    }

    /* Work Detail Page Styles */
    .work-header {
        text-align: center;
        z-index: 2;
        position: relative;
    }

    .company-badge {
        background: var(--manga-red);
        color: var(--manga-white);
        padding: var(--space-4) var(--space-6);
        border-radius: 15px;
        border: 3px solid var(--manga-black);
        margin-bottom: var(--space-3);
        transform: rotate(-1deg);
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .company-badge h2 {
        font-family: "Bangers", sans-serif;
        font-size: clamp(1.5rem, 6vw, 2.5rem);
        margin: 0;
        text-shadow: 2px 2px 0 var(--manga-black);
    }

    .role-tag {
        background: var(--manga-yellow);
        color: var(--manga-black);
        padding: var(--space-2) var(--space-4);
        border-radius: 20px;
        border: 2px solid var(--manga-black);
        font-family: "Anton", sans-serif;
        font-size: var(--text-lg);
        display: inline-block;
    }

    .work-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: var(--space-6);
        width: 100%;
        max-width: 900px;
        z-index: 2;
        position: relative;
    }

    .description-panel {
        text-align: center;
    }

    .speech-bubble.work-speech {
        background: var(--manga-white);
        border: 3px solid var(--manga-black);
        border-radius: 20px;
        padding: var(--space-6);
        font-size: var(--text-lg);
        line-height: 1.6;
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .tech-showcase {
        text-align: center;
    }

    .tech-header {
        margin-bottom: var(--space-4);
    }

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--space-3);
        max-width: 600px;
        margin: 0 auto;
    }

    .tech-badge {
        background: var(--manga-blue);
        color: var(--manga-white);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--panel-radius);
        border: 2px solid var(--manga-black);
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-base);
        font-weight: bold;
        text-align: center;
        transition: all 0.3s ease;
    }

    .tech-badge:hover {
        transform: scale(1.05) rotate(2deg);
        background: var(--manga-red);
    }

    .more-badge {
        background: var(--manga-gray);
        font-style: italic;
    }

    .page-counter {
        font-family: "Anton", sans-serif;
        font-size: var(--text-2xl);
        color: var(--manga-black);
        background: var(--manga-yellow);
        padding: var(--space-3) var(--space-4);
        border-radius: 50px;
        border: 3px solid var(--manga-black);
        z-index: 2;
        position: relative;
    }

    .current {
        color: var(--manga-red);
        font-size: var(--text-3xl);
    }

    /* Navigation Buttons */
    .nav-button {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        background: var(--manga-black);
        color: var(--manga-white);
        border: 3px solid var(--manga-white);
        padding: var(--space-3) var(--space-4);
        border-radius: 50px;
        font-family: "Bangers", sans-serif;
        font-size: var(--text-lg);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .nav-button:hover {
        background: var(--manga-red);
        transform: translateY(-50%) scale(1.1);
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .prev-nav {
        left: var(--space-4);
    }

    .next-nav {
        right: var(--space-4);
    }

    .nav-icon {
        font-size: var(--text-2xl);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .page-container {
            padding: var(--space-2);
        }

        .full-page {
            padding: var(--space-4);
            border-width: 3px;
            box-shadow: 
                0 0 0 6px var(--manga-paper),
                0 0 0 9px var(--manga-black),
                15px 15px 0 var(--manga-black);
        }

        .intro-panels {
            gap: var(--space-4);
        }

        .speech-bubble.large,
        .thought-bubble.large {
            padding: var(--space-4);
            font-size: var(--text-lg);
        }

        .manga-panel.intro-panel {
            padding: var(--space-4);
            transform: none;
        }

        .tech-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: var(--space-2);
        }

        .nav-button {
            position: fixed;
            top: auto;
            bottom: var(--space-4);
            transform: none;
            padding: var(--space-2) var(--space-3);
            font-size: var(--text-base);
        }

        .prev-nav {
            left: var(--space-3);
        }

        .next-nav {
            right: var(--space-3);
        }

        .nav-text {
            display: none;
        }
    }

    @media (max-width: 480px) {
        .chapter-title {
            font-size: 2rem;
            text-shadow: 
                2px 2px 0 var(--manga-white),
                4px 4px 0 var(--manga-red);
        }

        .speech-bubble.large,
        .thought-bubble.large,
        .speech-bubble.work-speech {
            font-size: var(--text-base);
            padding: var(--space-3);
        }

        .tech-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
