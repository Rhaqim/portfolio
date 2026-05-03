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

        <!-- Timeline -->
        <div class="timeline">
                {#each workHistory as job, i}
                        <article
                                class="job-panel"
                                class:job-panel--right={i % 2 === 1}
                                use:reveal={{ direction: i % 2 === 0 ? 'left' : 'right', delay: i * 0.14 }}
                                aria-label="{job.role} at {job.company}"
                        >
                                <!-- Period tab -->
                                <div class="period-tab" aria-hidden="true">{job.period}</div>

                                <div class="job-inner">
                                        <div class="job-header">
                                                <div>
                                                        <h2 class="company-name">
                                                                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
                                                                        {job.company}
                                                                </a>
                                                        </h2>
                                                        <p class="job-role">{job.role}</p>
                                                </div>
                                                {#if i === 0}
                                                        <span class="current-badge">Current</span>
                                                {/if}
                                        </div>

                                        <!-- Impact: one bold sentence -->
                                        <blockquote class="job-impact">
                                                {job.impact}
                                        </blockquote>

                                        <!-- Tech tags -->
                                        <div class="tech-list">
                                                {#each job.technologies as tech}
                                                        <span class="tech-tag">{tech}</span>
                                                {/each}
                                        </div>
                                </div>

                                <!-- Decorative number -->
                                <div class="job-number" aria-hidden="true">0{i + 1}</div>
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
                background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 18px 18px;
                pointer-events: none;
                z-index: 0;
        }

        /* ---- Timeline ---- */
        .timeline {
                flex: 1;
                display: grid;
                grid-template-rows: repeat(3, 1fr);
                position: relative;
                z-index: 1;
                overflow: hidden;
        }

        /* Vertical spine line */
        .timeline::before {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 50%;
                width: 4px;
                background: var(--ink);
                transform: translateX(-50%);
                z-index: 0;
        }

        /* ---- Job panels ---- */
        .job-panel {
                position: relative;
                border: var(--border);
                background: var(--paper);
                margin: clamp(8px, 1.5vh, 14px) clamp(16px, 4vw, 60px) clamp(8px, 1.5vh, 14px) clamp(16px, 4vw, 60px);
                border-radius: var(--panel-radius);
                box-shadow: var(--panel-shadow);
                overflow: hidden;

                /* Alternate: left-aligned by default */
                margin-right: calc(50% + 24px);
        }

        .job-panel--right {
                margin-left: calc(50% + 24px);
                margin-right: clamp(16px, 4vw, 60px);
                background: var(--white);
        }

        .job-inner {
                padding: clamp(14px, 2.5vw, 28px);
                display: flex;
                flex-direction: column;
                gap: 10px;
                height: 100%;
        }

        /* ---- Period tab ---- */
        .period-tab {
                position: absolute;
                top: 0;
                right: 0;
                background: var(--ink);
                color: var(--white);
                font-family: var(--font-display);
                font-size: 0.62rem;
                letter-spacing: 2px;
                padding: 3px 10px;
                border-bottom-left-radius: 4px;
        }

        .job-panel--right .period-tab {
                right: auto;
                left: 0;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 4px;
        }

        /* ---- Job header ---- */
        .job-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
        }

        .company-name {
                font-family: var(--font-title);
                font-size: clamp(1.4rem, 3.5vw, 2.4rem);
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
                font-size: clamp(0.68rem, 1.2vw, 0.82rem);
                letter-spacing: 3px;
                text-transform: uppercase;
                color: var(--gray);
                margin-top: 4px;
        }

        .current-badge {
                font-family: var(--font-display);
                font-size: 0.62rem;
                letter-spacing: 2px;
                padding: 2px 8px;
                background: var(--red);
                color: var(--white);
                text-transform: uppercase;
                border: 2px solid var(--ink);
                white-space: nowrap;
                flex-shrink: 0;
        }

        /* ---- Impact quote ---- */
        .job-impact {
                font-family: var(--font-body);
                font-size: clamp(0.8rem, 1.2vw, 0.92rem);
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
                gap: 4px;
                margin-top: auto;
        }

        .tech-tag {
                font-family: var(--font-display);
                font-size: 0.62rem;
                letter-spacing: 1px;
                padding: 2px 8px;
                border: 2px solid var(--ink);
                background: transparent;
                color: var(--near-black);
                text-transform: uppercase;
                border-radius: 2px;
        }

        /* ---- Job number watermark ---- */
        .job-number {
                position: absolute;
                bottom: 8px;
                right: 14px;
                font-family: var(--font-title);
                font-size: clamp(2rem, 5vw, 4rem);
                color: rgba(0, 0, 0, 0.04);
                line-height: 1;
                pointer-events: none;
                user-select: none;
        }

        .job-panel--right .job-number {
                right: auto;
                left: 14px;
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
                .timeline::before {
                        left: 24px;
                }

                .job-panel {
                        margin: 8px 16px 8px 48px;
                }

                .job-panel--right {
                        margin: 8px 16px 8px 48px;
                        background: var(--paper);
                }

                .period-tab {
                        right: 0;
                        left: auto;
                        border-bottom-left-radius: 4px;
                        border-bottom-right-radius: 0;
                }

                .job-panel--right .period-tab {
                        right: 0;
                        left: auto;
                        border-bottom-left-radius: 4px;
                        border-bottom-right-radius: 0;
                }

                .job-panel--right .job-number {
                        right: 14px;
                        left: auto;
                }
        }
</style>
