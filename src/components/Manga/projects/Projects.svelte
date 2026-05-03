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

                <!-- FEATURED: first project — big left panel -->
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
                                        <div class="panel-actions">
                                                {#if p.url}
                                                        <a href={p.url} target="_blank" rel="noopener noreferrer" class="project-link project-link--live" aria-label="View live site">
                                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                                Live
                                                        </a>
                                                {/if}
                                                {#if p.githubUrl}
                                                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View source on GitHub">
                                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                                                GitHub
                                                        </a>
                                                {/if}
                                                <span class="{p.status === 'Live' ? 'status-live' : 'status-wip'}">
                                                        {p.status}
                                                </span>
                                        </div>
                                </div>
                        </div>
                        <!-- Red corner accent -->
                        <div class="corner-accent" aria-hidden="true"></div>
                </article>
                {/if}

                <!-- RIGHT COLUMN: remaining projects, scrolls if more than 2 -->
                <div class="right-col">
                        {#each projects.slice(1) as p, i}
                        <article
                                class="project-panel"
                                class:project-panel--secondary={i % 2 === 0}
                                class:project-panel--dark={i % 2 === 1}
                                use:reveal={{ direction: i % 2 === 0 ? 'right' : 'up', delay: 0.14 + i * 0.14 }}
                                aria-label={p.title}
                        >
                                <div class="panel-inner">
                                        <div class="panel-top">
                                                <div class="project-meta">
                                                        <span class="chapter-label" class:chapter-label--dim={i % 2 === 1}>{p.year}</span>
                                                </div>
                                                <h2 class="project-title project-title--sm" class:project-title--white={i % 2 === 1}>{p.title}</h2>
                                                <p class="project-tagline" class:project-tagline--dim={i % 2 === 1}>{p.tagline}</p>
                                        </div>
                                        <div class="panel-bottom">
                                                <div class="tech-list">
                                                        {#each p.technologies.slice(0, 4) as tech}
                                                                {#if i % 2 === 1}
                                                                        <span class="tech-tag tech-tag--outline-white">{tech}</span>
                                                                {:else}
                                                                        <span class="tech-tag">{tech}</span>
                                                                {/if}
                                                        {/each}
                                                </div>
                                                <div class="panel-actions">
                                                        {#if p.url}
                                                                <a href={p.url} target="_blank" rel="noopener noreferrer"
                                                                        class="project-link"
                                                                        class:project-link--light={i % 2 === 1}
                                                                        class:project-link--live={true}
                                                                        aria-label="View live site">
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                                        Live
                                                                </a>
                                                        {/if}
                                                        {#if p.githubUrl}
                                                                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                                                                        class="project-link"
                                                                        class:project-link--light={i % 2 === 1}
                                                                        aria-label="View source on GitHub">
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                                                        GitHub
                                                                </a>
                                                        {/if}
                                                        <span class="{p.status === 'Live' ? 'status-live' : 'status-wip'}">
                                                                {p.status}
                                                        </span>
                                                </div>
                                        </div>
                                </div>
                                {#if i % 2 === 1}
                                        <div class="panel-accent-text" aria-hidden="true">{p.tagline.split(' ')[0].toUpperCase()}</div>
                                {/if}
                        </article>
                        {/each}
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
                height: 44px;
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
                font-size: 0.9rem;
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
                inset: 44px 0 0 0;
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
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--ink) transparent;
        }

        /* Each right-column panel fills half the column.
           With 2 panels = perfect fill. 3+ panels = right col scrolls internally. */
        .right-col .project-panel {
                flex: 0 0 50%;
                min-height: 44%;
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
                gap: 10px;
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
                font-size: 0.82rem;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--red);
        }

        .chapter-label--dim {
                color: rgba(255, 255, 255, 0.35);
        }

        .project-year {
                font-family: var(--font-display);
                font-size: 0.82rem;
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
                font-size: clamp(0.9rem, 1.5vw, 1.1rem);
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
                font-size: clamp(0.95rem, 1.4vw, 1.1rem);
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
                font-size: 0.78rem;
                letter-spacing: 1px;
                padding: 3px 10px;
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

        /* ---- Panel actions row (links + status) ---- */
        .panel-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
        }

        .project-link {
                font-family: var(--font-display);
                font-size: 0.72rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                text-decoration: none;
                padding: 3px 10px;
                border: 2px solid var(--ink);
                color: var(--ink);
                background: transparent;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
                transition: background 0.2s ease, color 0.2s ease;
        }

        .project-link:hover {
                background: var(--ink);
                color: var(--white);
        }

        .project-link--live {
                border-color: var(--red);
                color: var(--red);
        }

        .project-link--live:hover {
                background: var(--red);
                color: var(--white);
        }

        /* On dark panels, invert the link colours */
        .project-link--light {
                border-color: rgba(255, 255, 255, 0.4);
                color: rgba(255, 255, 255, 0.7);
        }

        .project-link--light:hover {
                background: rgba(255, 255, 255, 0.12);
                color: var(--white);
                border-color: var(--white);
        }

        .project-link--light.project-link--live {
                border-color: var(--red);
                color: var(--red);
        }

        .project-link--light.project-link--live:hover {
                background: var(--red);
                color: var(--white);
        }

        /* ---- Status badges ---- */
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
