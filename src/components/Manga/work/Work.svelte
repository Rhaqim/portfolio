<script lang="ts">
        import { reveal } from "@/lib/actions/scrollReveal";
        import { workHistory } from "@/data/work";
</script>

<section class="chapter work" id="work" aria-label="Chapter 3 — Experience">

        <!-- Chapter bar -->
        <div class="chapter-bar" aria-hidden="true">
                <span class="bar-label">Chapter 03 — Experience</span>
                <div class="bar-line"></div>
        </div>

        <!-- Halftone -->
        <div class="dots" aria-hidden="true"></div>

        <!-- Full-width stacked job panels -->
        <div class="timeline">
                {#each workHistory as job, i}
                        <article
                                class="job-panel"
                                class:job-panel--alt={i % 2 === 1}
                                class:job-panel--last={i === workHistory.length - 1}
                                use:reveal={{ direction: 'up', delay: i * 0.12 }}
                                aria-label="{job.role} at {job.company}"
                        >
                                <div class="job-inner">
                                        <!-- Left: accent stripe + period -->
                                        <div class="job-accent">
                                                <div class="accent-stripe" aria-hidden="true"></div>
                                                <span class="period-label">{job.period}</span>
                                        </div>

                                        <!-- Center: main content -->
                                        <div class="job-content">
                                                <div class="job-header">
                                                        <h2 class="company-name">
                                                                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
                                                                        {job.company}
                                                                </a>
                                                        </h2>
                                                        <p class="job-role">{job.role}</p>
                                                </div>

                                                <blockquote class="job-impact">
                                                        {job.impact}
                                                </blockquote>

                                                <div class="tech-list">
                                                        {#each job.technologies as tech}
                                                                <span class="tech-tag">{tech}</span>
                                                        {/each}
                                                </div>
                                        </div>

                                        <!-- Right: decorative number -->
                                        <div class="job-number" aria-hidden="true">0{i + 1}</div>
                                </div>

                                {#if i === 0}
                                        <span class="current-badge">Current</span>
                                {/if}
                        </article>
                {/each}
        </div>

        <span class="page-number" aria-hidden="true">04</span>
</section>

<style>
        .work {
                background: var(--white);
                display: flex;
                flex-direction: column;
                overflow: hidden;
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
                background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 18px 18px;
                pointer-events: none;
                z-index: 0;
        }

        /* ---- Full-width stacked panels ---- */
        .timeline {
                flex: 1;
                display: grid;
                grid-template-rows: repeat(3, 1fr);
                position: relative;
                z-index: 1;
                overflow: hidden;
        }

        /* ---- Job panels ---- */
        .job-panel {
                position: relative;
                border-bottom: var(--border);
                background: var(--paper);
                overflow: hidden;
        }

        .job-panel--alt {
                background: var(--white);
        }

        .job-panel--last {
                border-bottom: none;
        }

        .job-inner {
                display: grid;
                grid-template-columns: 120px 1fr auto;
                gap: clamp(16px, 3vw, 40px);
                align-items: center;
                padding: clamp(18px, 3vh, 36px) clamp(20px, 4vw, 56px);
                height: 100%;
        }

        /* ---- Left accent column ---- */
        .job-accent {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                height: 100%;
                justify-content: center;
        }

        .accent-stripe {
                width: 4px;
                flex: 1;
                max-height: 48px;
                background: var(--red);
                border-radius: 2px;
        }

        .period-label {
                font-family: var(--font-display);
                font-size: 0.8rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--gray);
                white-space: nowrap;
                writing-mode: vertical-rl;
                text-orientation: mixed;
        }

        /* ---- Center content ---- */
        .job-content {
                display: flex;
                flex-direction: column;
                gap: clamp(10px, 1.5vh, 18px);
        }

        .job-header {
                display: flex;
                flex-direction: column;
                gap: 4px;
        }

        .company-name {
                font-family: var(--font-title);
                font-size: clamp(2rem, 4.5vw, 3.5rem);
                line-height: 0.9;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: var(--ink);
        }

        .company-name a {
                color: inherit;
                text-decoration: none;
                transition: color 0.25s ease;
        }

        .company-name a:hover {
                color: var(--red);
        }

        .job-role {
                font-family: var(--font-display);
                font-size: clamp(0.88rem, 1.3vw, 1rem);
                letter-spacing: 3px;
                text-transform: uppercase;
                color: var(--gray);
        }

        /* ---- Impact quote ---- */
        .job-impact {
                font-family: var(--font-body);
                font-size: clamp(0.95rem, 1.4vw, 1.1rem);
                font-weight: 700;
                line-height: 1.5;
                color: var(--near-black);
                border-left: 3px solid var(--red);
                padding-left: 12px;
                margin: 0;
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
                background: transparent;
                color: var(--near-black);
                text-transform: uppercase;
                border-radius: 2px;
        }

        /* ---- Right decorative number ---- */
        .job-number {
                font-family: var(--font-title);
                font-size: clamp(3rem, 7vw, 6rem);
                color: rgba(0, 0, 0, 0.04);
                line-height: 1;
                pointer-events: none;
                user-select: none;
                flex-shrink: 0;
        }

        /* ---- Current badge (absolute on panel) ---- */
        .current-badge {
                position: absolute;
                top: 0;
                right: 0;
                font-family: var(--font-display);
                font-size: 0.72rem;
                letter-spacing: 2px;
                padding: 4px 14px;
                background: var(--red);
                color: var(--white);
                text-transform: uppercase;
                border: 2px solid var(--ink);
                white-space: nowrap;
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
                .job-inner {
                        grid-template-columns: 1fr;
                        gap: 12px;
                        padding: 20px;
                }

                .job-accent {
                        flex-direction: row;
                        height: auto;
                        justify-content: flex-start;
                }

                .accent-stripe {
                        width: 36px;
                        height: 4px;
                        flex: none;
                        max-height: none;
                }

                .period-label {
                        writing-mode: horizontal-tb;
                }

                .job-number {
                        display: none;
                }
        }
</style>
