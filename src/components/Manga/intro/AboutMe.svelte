<script lang="ts">
        import { reveal } from "@/lib/actions/scrollReveal";
</script>

<section class="chapter about" id="about-me" aria-label="Chapter 1 — About">
        <!-- Chapter label bar -->
        <div class="chapter-bar" aria-hidden="true">
                <span class="bar-label">Chapter 01 — About</span>
        </div>

        <!-- Halftone texture -->
        <div class="dots" aria-hidden="true"></div>

        <!-- Two-panel layout -->
        <div class="about-grid">

                <!-- LEFT PANEL: Character + bio -->
                <div class="panel panel--left" use:reveal={{ direction: 'left', delay: 0.1 }}>
                        <div class="character-wrap">
                                <img
                                        src="/images/character/character-thinking.png"
                                        alt="Character thinking"
                                />
                        </div>
                        <div class="bio-bubble">
                                <p>I build systems that tell stories.</p>
                        </div>
                </div>

                <!-- RIGHT: 4 skill panels in a grid -->
                <div class="skills-grid">

                        <div class="skill-panel" use:reveal={{ direction: 'right', delay: 0.15 }}>
                                <span class="skill-label">Languages</span>
                                <div class="skill-tags">
                                        <span class="tech-tag">Go</span>
                                        <span class="tech-tag">Rust</span>
                                        <span class="tech-tag">Python</span>
                                        <span class="tech-tag">TypeScript</span>
                                </div>
                        </div>

                        <div class="skill-panel" use:reveal={{ direction: 'right', delay: 0.28 }}>
                                <span class="skill-label">Data</span>
                                <div class="skill-tags">
                                        <span class="tech-tag">PostgreSQL</span>
                                        <span class="tech-tag">Redis</span>
                                        <span class="tech-tag">MongoDB</span>
                                </div>
                        </div>

                        <div class="skill-panel" use:reveal={{ direction: 'up', delay: 0.4 }}>
                                <span class="skill-label">Infrastructure</span>
                                <div class="skill-tags">
                                        <span class="tech-tag">Docker</span>
                                        <span class="tech-tag">Kubernetes</span>
                                        <span class="tech-tag">Nginx</span>
                                </div>
                        </div>

                        <!-- Featured "next" panel — embedded systems -->
                        <div class="skill-panel skill-panel--next" use:reveal={{ direction: 'slam', delay: 0.54 }}>
                                <div class="next-star" aria-hidden="true">★</div>
                                <span class="skill-label skill-label--white">What's Next</span>
                                <div class="skill-tags">
                                        <span class="tech-tag tech-tag--light-on-dark">Embedded C/C++</span>
                                        <span class="tech-tag tech-tag--light-on-dark">RTOS</span>
                                        <span class="tech-tag tech-tag--light-on-dark">Rust Embedded</span>
                                        <span class="tech-tag tech-tag--light-on-dark">IoT</span>
                                </div>
                        </div>

                </div>
        </div>

        <span class="page-number" aria-hidden="true">02</span>
</section>

<style>
        .about {
                background: var(--paper);
                display: flex;
                flex-direction: column;
        }

        /* Chapter label bar across top */
        .chapter-bar {
                height: 36px;
                background: var(--ink);
                display: flex;
                align-items: center;
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
        }

        .dots {
                position: absolute;
                inset: 36px 0 0 0;
                background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
                background-size: 18px 18px;
                pointer-events: none;
                z-index: 0;
        }

        /* ---- Main grid ---- */
        .about-grid {
                flex: 1;
                display: grid;
                grid-template-columns: 2fr 3fr;
                gap: 0;
                position: relative;
                z-index: 1;
                overflow: hidden;
        }

        /* ---- Left character panel ---- */
        .panel--left {
                border-right: var(--border-thick);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                padding: 0 clamp(16px, 3vw, 32px) clamp(16px, 3vh, 32px);
                background: var(--paper);
                overflow: hidden;
                position: relative;
        }

        .character-wrap {
                flex: 1;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                overflow: hidden;
                width: 100%;
        }

        .character-wrap img {
                height: 75%;
                max-height: 500px;
                width: auto;
                object-fit: contain;
                object-position: bottom center;
        }

        .bio-bubble {
                background: var(--white);
                border: var(--border);
                border-radius: 14px;
                padding: 14px 20px;
                position: relative;
                font-family: var(--font-body);
                font-size: clamp(0.82rem, 1.3vw, 1rem);
                line-height: 1.55;
                font-weight: 700;
                margin-bottom: 8px;
                width: 100%;
                text-align: center;
                box-shadow: var(--panel-shadow-sm);
        }

        .bio-bubble::after {
                content: "";
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                border: 8px solid transparent;
                border-bottom-color: var(--ink);
        }

        .bio-bubble::before {
                content: "";
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-bottom-color: var(--white);
                z-index: 1;
        }

        /* ---- Skills grid ---- */
        .skills-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
        }

        .skill-panel {
                border-left: var(--border);
                border-bottom: var(--border);
                padding: clamp(16px, 3vw, 32px) clamp(16px, 2.5vw, 28px);
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: var(--paper);
        }

        .skill-panel:nth-child(2),
        .skill-panel:nth-child(4) {
                border-left: none;
        }

        .skill-panel:nth-child(3),
        .skill-panel:nth-child(4) {
                border-bottom: none;
        }

        /* Featured embedded panel */
        .skill-panel--next {
                background: var(--ink);
                border-color: var(--ink);
                position: relative;
                overflow: hidden;
        }

        .next-star {
                position: absolute;
                top: 10px;
                right: 16px;
                color: var(--red);
                font-size: 1.4rem;
                animation: star-pulse 2.5s ease-in-out infinite;
        }

        @keyframes star-pulse {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.2) rotate(15deg); opacity: 0.7; }
        }

        .skill-label {
                font-family: var(--font-display);
                font-size: clamp(0.65rem, 1vw, 0.75rem);
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--gray);
        }

        .skill-label--white {
                color: rgba(255, 255, 255, 0.5);
        }

        .skill-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
        }

        .tech-tag {
                font-family: var(--font-display);
                font-size: 0.7rem;
                letter-spacing: 1px;
                padding: 3px 10px;
                border: 2px solid var(--ink);
                background: var(--ink);
                color: var(--white);
                text-transform: uppercase;
                display: inline-block;
                border-radius: 2px;
        }

        .tech-tag--light-on-dark {
                background: transparent;
                border-color: rgba(255, 255, 255, 0.35);
                color: rgba(255, 255, 255, 0.85);
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
                .about-grid {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto 1fr;
                }

                .panel--left {
                        border-right: none;
                        border-bottom: var(--border-thick);
                        flex-direction: row;
                        align-items: center;
                        padding: 16px 20px;
                        gap: 16px;
                        min-height: 0;
                }

                .character-wrap {
                        flex: 0 0 90px;
                        height: 100%;
                }

                .character-wrap img {
                        height: 100%;
                        max-height: 120px;
                }

                .bio-bubble {
                        text-align: left;
                        margin-bottom: 0;
                }

                .bio-bubble::after,
                .bio-bubble::before {
                        top: 50%;
                        left: -15px;
                        transform: translateY(-50%);
                        border: 8px solid transparent;
                        border-right-color: var(--ink);
                        border-bottom-color: transparent;
                }

                .bio-bubble::before {
                        left: -11px;
                        border: 6px solid transparent;
                        border-right-color: var(--white);
                        border-bottom-color: transparent;
                }

                .skills-grid {
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: 1fr 1fr;
                }
        }
</style>
