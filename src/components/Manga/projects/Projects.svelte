<script lang="ts">
        import { reveal } from "@/lib/actions/scrollReveal";
        import { projects } from "@/data/projects";
</script>

<section class="chapter projects" id="projects" aria-label="Chapter 2 — Projects">

        <!-- Chapter bar -->
        <div class="chapter-bar" aria-hidden="true">
                <span class="bar-label">Chapter 02 — Projects</span>
                <div class="bar-line"></div>
        </div>

        <!-- Halftone dots -->
        <div class="dots" aria-hidden="true"></div>

        <!-- Panel grid: asymmetric manga layout -->
        <div class="projects-grid">

                <!-- FEATURED: CoNexus — big left panel -->
                {#if projects[0]}
                {@const p = projects[0]}
                <article
                        class="project-panel project-panel--featured"
                        use:reveal={{ direction: 'left', delay: 0.05 }}
                        aria-label={p.title}
                >
                        <div class="panel-inner">
                                <div class="panel-top">
                                        <div class="project-meta">
                                                <span class="chapter-label">Featured</span>
                                                <span class="project-year">{p.year}</span>
                                        </div>
                                        <h2 class="project-title">{p.title}</h2>
                                        <p class="project-tagline">{p.tagline}</p>
                                </div>
                                <p class="project-desc">{p.description}</p>
                                <div class="panel-bottom">
                                        <div class="tech-list">
                                                {#each p.technologies as tech}
                                                        <span class="tech-tag tech-tag--light">{tech}</span>
                                                {/each}
                                        </div>
                                        <span class="{p.status === 'Live' ? 'status-live' : 'status-wip'}">
                                                {p.status}
                                        </span>
                                </div>
                        </div>
                        <!-- Red corner accent -->
                        <div class="corner-accent" aria-hidden="true"></div>
                </article>
                {/if}

                <!-- RIGHT COLUMN: two stacked panels -->
                <div class="right-col">

                        {#if projects[1]}
                        {@const p = projects[1]}
                        <article
                                class="project-panel project-panel--secondary"
                                use:reveal={{ direction: 'right', delay: 0.18 }}
                                aria-label={p.title}
                        >
                                <div class="panel-inner">
                                        <div class="panel-top">
                                                <div class="project-meta">
                                                        <span class="chapter-label">{p.year}</span>
                                                </div>
                                                <h2 class="project-title project-title--sm">{p.title}</h2>
                                                <p class="project-tagline">{p.tagline}</p>
                                        </div>
                                        <div class="panel-bottom">
                                                <div class="tech-list">
                                                        {#each p.technologies.slice(0, 4) as tech}
                                                                <span class="tech-tag">{tech}</span>
                                                        {/each}
                                                </div>
                                                <span class="{p.status === 'Live' ? 'status-live' : 'status-wip'}">
                                                        {p.status}
                                                </span>
                                        </div>
                                </div>
                        </article>
                        {/if}

                        {#if projects[2]}
                        {@const p = projects[2]}
                        <article
                                class="project-panel project-panel--dark"
                                use:reveal={{ direction: 'up', delay: 0.32 }}
                                aria-label={p.title}
                        >
                                <div class="panel-inner">
                                        <div class="panel-top">
                                                <div class="project-meta">
                                                        <span class="chapter-label chapter-label--dim">{p.year}</span>
                                                </div>
                                                <h2 class="project-title project-title--sm project-title--white">{p.title}</h2>
                                                <p class="project-tagline project-tagline--dim">{p.tagline}</p>
                                        </div>
                                        <div class="panel-bottom">
                                                <div class="tech-list">
                                                        {#each p.technologies as tech}
                                                                <span class="tech-tag tech-tag--outline-white">{tech}</span>
                                                        {/each}
                                                </div>
                                                <span class="status-wip">{p.status}</span>
                                        </div>
                                </div>
                                <!-- Network icon hint -->
                                <div class="panel-accent-text" aria-hidden="true">TELECOM</div>
                        </article>
                        {/if}

                </div>
        </div>

        <span class="page-number" aria-hidden="true">03</span>
</section>

<style>
        .projects {
                background: var(--paper);
                display: flex;
                flex-direction: column;
        }

        /* Chapter bar */
        .chapter-bar {
                height: 36px;
                background: var(--ink);
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 0 clamp(16px, 4vw, 48px);
                flex-shrink: 0;
                position: relative;
                z-index: 5;
        }

        .bar-label {
                font-family: var(--font-display);
                font-size: 0.72rem;
                letter-spacing: 5px;
                text-transform: uppercase;
                color: var(--red);
                white-space: nowrap;
        }

        .bar-line {
                flex: 1;
                height: 1px;
                background: rgba(255, 255, 255, 0.12);
        }

        .dots {
                position: absolute;
                inset: 36px 0 0 0;
                background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
                background-size: 18px 18px;
                pointer-events: none;
                z-index: 0;
        }

        /* ---- Grid ---- */
        .projects-grid {
                flex: 1;
                display: grid;
                grid-template-columns: 3fr 2fr;
                gap: 0;
                position: relative;
                z-index: 1;
                overflow: hidden;
        }

        /* ---- Panels ---- */
        .project-panel {
                border: var(--border);
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
        }

        .project-panel--featured {
                background: var(--white);
                border-right-width: 5px;
        }

        .project-panel--secondary {
                background: var(--paper);
                border-bottom: var(--border);
        }

        .project-panel--dark {
                background: var(--near-black);
                color: var(--white);
        }

        .right-col {
                display: flex;
                flex-direction: column;
        }

        .panel-inner {
                padding: clamp(20px, 3vw, 40px);
                display: flex;
                flex-direction: column;
                height: 100%;
                gap: clamp(12px, 2vh, 20px);
        }

        .panel-top {
                flex: 1;
        }

        .panel-bottom {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
        }

        /* ---- Meta / labels ---- */
        .project-meta {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
        }

        .chapter-label {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--red);
        }

        .chapter-label--dim {
                color: rgba(255, 255, 255, 0.35);
        }

        .project-year {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 2px;
                color: var(--gray);
        }

        /* ---- Typography ---- */
        .project-title {
                font-family: var(--font-title);
                font-size: clamp(2.5rem, 6vw, 5rem);
                line-height: 0.88;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--ink);
                margin-bottom: 8px;
        }

        .project-title--sm {
                font-size: clamp(1.6rem, 3.5vw, 3rem);
        }

        .project-title--white {
                color: var(--white);
        }

        .project-tagline {
                font-family: var(--font-display);
                font-size: clamp(0.75rem, 1.3vw, 0.95rem);
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--gray);
                margin-top: 6px;
        }

        .project-tagline--dim {
                color: rgba(255, 255, 255, 0.4);
        }

        .project-desc {
                font-family: var(--font-body);
                font-size: clamp(0.8rem, 1.2vw, 0.92rem);
                font-weight: 300;
                line-height: 1.65;
                color: var(--near-black);
                max-width: 480px;
        }

        /* ---- Tech tags ---- */
        .tech-list {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
        }

        .tech-tag {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 1px;
                padding: 2px 9px;
                border: 2px solid var(--ink);
                background: var(--ink);
                color: var(--white);
                text-transform: uppercase;
                border-radius: 2px;
        }

        .tech-tag--light {
                background: transparent;
                color: var(--ink);
        }

        .tech-tag--outline-white {
                background: transparent;
                border-color: rgba(255, 255, 255, 0.3);
                color: rgba(255, 255, 255, 0.8);
        }

        .status-live {
                font-family: var(--font-display);
                font-size: 0.68rem;
                letter-spacing: 2px;
                padding: 3px 10px;
                border: 2px solid var(--ink);
                background: #15803d;
                color: var(--white);
                text-transform: uppercase;
                white-space: nowrap;
        }

        .status-wip {
                font-family: var(--font-display);
                font-size: 0.68rem;
                letter-spacing: 2px;
                padding: 3px 10px;
                border: 2px solid;
                background: var(--yellow);
                color: var(--ink);
                text-transform: uppercase;
                white-space: nowrap;
        }

        /* Corner red accent */
        .corner-accent {
                position: absolute;
                top: 0;
                right: 0;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 48px 48px 0;
                border-color: transparent var(--red) transparent transparent;
        }

        /* Background text on dark panel */
        .panel-accent-text {
                position: absolute;
                bottom: 12px;
                right: 16px;
                font-family: var(--font-title);
                font-size: clamp(2.5rem, 6vw, 5rem);
                color: rgba(255, 255, 255, 0.04);
                letter-spacing: 4px;
                text-transform: uppercase;
                pointer-events: none;
                line-height: 1;
                user-select: none;
        }

        /* ---- Responsive ---- */
        @media (max-width: 900px) {
                .projects-grid {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto;
                        overflow-y: auto;
                }

                .project-panel--featured {
                        border-right-width: 3px;
                }

                .right-col {
                        flex-direction: row;
                }

                .project-panel--secondary,
                .project-panel--dark {
                        flex: 1;
                }
        }

        @media (max-width: 600px) {
                .right-col {
                        flex-direction: column;
                }
        }
</style>
