<script lang="ts">
    import { onMount } from "svelte";
    
    // Enhanced project data with more details
    const projects = [
        {
            title: "Degenerous DAO Platform",
            description: "A decentralized application for DAO governance with smart contracts and blockchain integration. Built for the future of decentralized decision making.",
            technologies: ["React", "Solidity", "Web3.js", "Node.js", "IPFS", "Ethereum"],
            status: "Live",
            featured: true,
            year: "2024"
        },
        {
            title: "USSD Banking Service",
            description: "High-performance backend service for mobile banking across multiple African countries. Serving millions of users daily.",
            technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
            status: "Production",
            featured: true,
            year: "2023"
        },
        {
            title: "AI-Powered Game Engine",
            description: "Experimental game engine with AI-driven procedural content generation. Pushing the boundaries of what's possible in gaming.",
            technologies: ["Rust", "CUDA", "OpenGL", "Python", "TensorFlow"],
            status: "In Progress",
            featured: false,
            year: "2024"
        },
        {
            title: "Manga Portfolio Site",
            description: "This very website! A manga-inspired portfolio built with Astro and Svelte. Where creativity meets code.",
            technologies: ["Astro", "Svelte", "TypeScript", "CSS"],
            status: "Live",
            featured: false,
            year: "2024"
        }
    ];
    
    let currentProject = 0;
    let isVisible = false;
    
    const nextProject = () => {
        if (currentProject < projects.length - 1) {
            currentProject += 1;
        } else {
            currentProject = 0;
        }
    };
    
    const prevProject = () => {
        if (currentProject > 0) {
            currentProject -= 1;
        } else {
            currentProject = projects.length - 1;
        }
    };
    
    onMount(() => {
        const timer = setTimeout(() => {
            isVisible = true;
        }, 500);
        return () => clearTimeout(timer);
    });
</script>

<section id="projects" class="manga-page {isVisible ? 'scale-in' : ''}">
    <div class="page-container">
        <div class="full-page project-page">
            <div class="chapter-header">
                <div class="chapter-number">Chapter 3</div>
                <h1 class="chapter-title">Projects</h1>
                <div class="chapter-subtitle">Building the Future</div>
            </div>
            
            <div class="project-showcase">
                <div class="project-main">
                    <div class="project-header">
                        <div class="project-title-card">
                            <h2>{projects[currentProject].title}</h2>
                            <div class="project-year">{projects[currentProject].year}</div>
                        </div>
                        
                        <div class="project-badges">
                            <div class="project-status status-{projects[currentProject].status.toLowerCase().replace(' ', '-')}">
                                {projects[currentProject].status}
                            </div>
                            {#if projects[currentProject].featured}
                                <div class="featured-badge">
                                    <span class="sound-effect">FEATURED!</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                    
                    <div class="project-content">
                        <div class="speech-bubble project-description">
                            {projects[currentProject].description}
                        </div>
                        
                        <div class="tech-showcase">
                            <div class="tech-header">
                                <span class="sound-effect">TECH STACK!</span>
                            </div>
                            <div class="tech-grid">
                                {#each projects[currentProject].technologies as tech}
                                    <div class="tech-tag">{tech}</div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="project-navigation">
                <button class="nav-btn prev-btn" on:click={prevProject}>
                    <span class="nav-icon">←</span>
                    <span class="nav-text">Previous</span>
                </button>
                
                <div class="project-counter">
                    <div class="counter-display">
                        <span class="current">{currentProject + 1}</span>
                        <span class="divider">/</span>
                        <span class="total">{projects.length}</span>
                    </div>
                    <div class="counter-label">Projects</div>
                </div>
                
                <button class="nav-btn next-btn" on:click={nextProject}>
                    <span class="nav-text">Next</span>
                    <span class="nav-icon">→</span>
                </button>
            </div>
        </div>
    </div>
</section>

<style>
    .manga-page {
        width: 100vw;
        height: 100vh;
        background: var(--manga-paper);
        background-image: 
            radial-gradient(circle at 1px 1px, var(--manga-gray) 1px, transparent 0);
        background-size: 25px 25px;
        position: relative;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.8s ease;
    }

    .manga-page.scale-in {
        opacity: 1;
        transform: scale(1);
    }

    .page-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
    }

    .full-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: var(--manga-white);
        border: 4px solid var(--manga-black);
        border-radius: var(--panel-radius);
        box-shadow: 
            0 0 0 8px var(--manga-paper),
            0 0 0 12px var(--manga-black),
            20px 20px 0 var(--manga-black);
        position: relative;
        overflow: hidden;
        padding: var(--space-6);
    }

    .full-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            transparent 48%,
            rgba(37, 99, 235, 0.03) 49%,
            rgba(37, 99, 235, 0.03) 51%,
            transparent 52%
        );
        background-size: 40px 40px;
        pointer-events: none;
        z-index: 1;
    }

    .chapter-header {
        text-align: center;
        z-index: 2;
        position: relative;
        margin-bottom: var(--space-4);
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
            6px 6px 0 var(--manga-blue);
        margin: 0 0 var(--space-2) 0;
        transform: rotate(1deg);
    }

    .chapter-subtitle {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-xl);
        color: var(--manga-gray);
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .project-showcase {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        position: relative;
    }

    .project-main {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-4);
        flex-wrap: wrap;
    }

    .project-title-card {
        background: var(--manga-red);
        color: var(--manga-white);
        padding: var(--space-4) var(--space-6);
        border-radius: 15px;
        border: 3px solid var(--manga-black);
        transform: rotate(-1deg);
        box-shadow: 5px 5px 0 var(--manga-black);
        position: relative;
        flex: 1;
        min-width: 250px;
    }

    .project-title-card h2 {
        font-family: "Bangers", sans-serif;
        font-size: clamp(1.25rem, 4vw, 2rem);
        margin: 0;
        text-shadow: 2px 2px 0 var(--manga-black);
        line-height: 1.2;
    }

    .project-year {
        background: var(--manga-yellow);
        color: var(--manga-black);
        padding: var(--space-1) var(--space-2);
        border-radius: 10px;
        font-family: "Anton", sans-serif;
        font-size: var(--text-sm);
        position: absolute;
        top: -8px;
        right: -8px;
        border: 2px solid var(--manga-black);
    }

    .project-badges {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        align-items: flex-end;
    }

    .project-status {
        padding: var(--space-2) var(--space-3);
        border-radius: 20px;
        font-family: "Bangers", sans-serif;
        font-size: var(--text-base);
        font-weight: bold;
        text-transform: uppercase;
        border: 2px solid var(--manga-black);
    }

    .status-live {
        background: #10b981;
        color: var(--manga-white);
    }

    .status-production {
        background: var(--manga-blue);
        color: var(--manga-white);
    }

    .status-in-progress {
        background: var(--manga-yellow);
        color: var(--manga-black);
    }

    .featured-badge {
        background: var(--manga-red);
        color: var(--manga-white);
        padding: var(--space-2);
        border-radius: 50%;
        border: 3px solid var(--manga-white);
        transform: rotate(15deg);
        box-shadow: 3px 3px 0 var(--manga-black);
    }

    .project-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .speech-bubble.project-description {
        background: var(--manga-white);
        border: 3px solid var(--manga-black);
        border-radius: 25px;
        padding: var(--space-6);
        font-size: var(--text-lg);
        line-height: 1.6;
        text-align: center;
        position: relative;
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .speech-bubble.project-description::after {
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

    .tech-showcase {
        text-align: center;
    }

    .tech-header {
        margin-bottom: var(--space-4);
    }

    .sound-effect {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-2xl);
        color: var(--manga-red);
        text-shadow: 2px 2px 0 var(--manga-black);
        transform: rotate(-3deg);
        display: inline-block;
    }

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: var(--space-3);
        max-width: 700px;
        margin: 0 auto;
    }

    .tech-tag {
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
        cursor: pointer;
    }

    .tech-tag:hover {
        transform: scale(1.05) rotate(2deg);
        background: var(--manga-red);
        box-shadow: 3px 3px 0 var(--manga-black);
    }

    .project-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4);
        z-index: 2;
        position: relative;
    }

    .nav-btn {
        background: var(--manga-black);
        color: var(--manga-white);
        border: 3px solid var(--manga-white);
        padding: var(--space-3) var(--space-4);
        border-radius: 50px;
        font-family: "Bangers", sans-serif;
        font-size: var(--text-lg);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .nav-btn:hover {
        background: var(--manga-red);
        transform: scale(1.05);
        box-shadow: 5px 5px 0 var(--manga-black);
    }

    .nav-icon {
        font-size: var(--text-xl);
    }

    .project-counter {
        text-align: center;
    }

    .counter-display {
        font-family: "Anton", sans-serif;
        font-size: var(--text-3xl);
        color: var(--manga-black);
        background: var(--manga-yellow);
        padding: var(--space-3) var(--space-4);
        border-radius: 50px;
        border: 3px solid var(--manga-black);
        display: inline-block;
        box-shadow: 3px 3px 0 var(--manga-black);
    }

    .current {
        color: var(--manga-red);
        font-size: var(--text-4xl);
    }

    .counter-label {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-sm);
        color: var(--manga-gray);
        margin-top: var(--space-1);
        text-transform: uppercase;
        letter-spacing: 1px;
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

        .project-header {
            flex-direction: column;
            align-items: stretch;
        }

        .project-badges {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .project-content {
            gap: var(--space-4);
        }

        .speech-bubble.project-description {
            padding: var(--space-4);
            font-size: var(--text-base);
        }

        .tech-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-2);
        }

        .project-navigation {
            flex-direction: column;
            gap: var(--space-3);
        }

        .nav-btn {
            width: 100%;
            justify-content: center;
            padding: var(--space-2) var(--space-3);
        }

        .nav-text {
            display: none;
        }
    }

    @media (max-width: 480px) {
        .chapter-title {
            font-size: 2rem;
        }

        .project-title-card {
            padding: var(--space-3) var(--space-4);
        }

        .tech-grid {
            grid-template-columns: 1fr 1fr;
        }

        .tech-tag {
            font-size: var(--text-sm);
            padding: var(--space-1) var(--space-2);
        }
    }
</style>
