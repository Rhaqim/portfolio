<script lang="ts">
        import { reveal } from "@/lib/actions/scrollReveal";
        import { interests } from "@/data/thoughts";
</script>

<section class="chapter next-arc" id="next" aria-label="Chapter 4 — Next Arc">

        <!-- Chapter bar -->
        <div class="chapter-bar" aria-hidden="true">
                <span class="bar-label">Chapter 04 — Next Arc</span>
                <div class="bar-line"></div>
        </div>

        <!-- Spread layout: interests grid + character -->
        <div class="spread">

                <!-- Left: dramatic title panel -->
                <div class="title-panel" use:reveal={{ direction: 'left', delay: 0.05 }}>
                        <div class="title-panel-inner">
                                <p class="arc-eyebrow">What I'm building toward</p>
                                <h2 class="arc-title">The<br/>Hardware<br/>Awaits.</h2>
                                <div class="arc-divider" aria-hidden="true"></div>
                                <p class="arc-sub">
                                        Backend systems are the foundation.<br/>
                                        The next chapter goes deeper —<br/>
                                        all the way to the metal.
                                </p>
                        </div>
                        <!-- Character illustration -->
                        <div class="arc-character" aria-hidden="true">
                                <img src="/images/character/character-ok.png" alt="" />
                        </div>
                </div>

                <!-- Right: 2x2 interest panels -->
                <div class="interests-grid">
                        {#each interests as item, i}
                                <article
                                        class="interest-panel"
                                        class:interest-panel--dark={item.type === 'next' && i % 2 === 0}
                                        class:interest-panel--red={i === 0}
                                        use:reveal={{ direction: i < 2 ? 'right' : 'up', delay: 0.12 + i * 0.14 }}
                                        aria-label={item.title}
                                >
                                        <div class="interest-inner">
                                                <div class="interest-icon" aria-hidden="true">{item.icon}</div>
                                                <h3 class="interest-title">{item.title}</h3>
                                                <p class="interest-sub">{item.subtitle}</p>
                                                {#if item.type === 'next'}
                                                        <span class="next-label">Next Arc</span>
                                                {:else}
                                                        <span class="current-label">Current</span>
                                                {/if}
                                        </div>
                                </article>
                        {/each}
                </div>
        </div>

        <!-- Contact row / footer inside last section -->
        <div class="contact-bar" use:reveal={{ direction: 'up', delay: 0.6 }}>
                <span class="contact-text">Let's build something.</span>
                <div class="contact-links">
                        <a href="mailto:anusiemj@gmail.com" class="contact-link">Email</a>
                        <a href="https://github.com/Rhaqim" target="_blank" rel="noopener noreferrer" class="contact-link">GitHub</a>
                        <a href="https://www.linkedin.com/in/john-franklin-anusiem/" target="_blank" rel="noopener noreferrer" class="contact-link">LinkedIn</a>
                </div>
        </div>

        <span class="page-number" aria-hidden="true">05</span>
</section>

<style>
        .next-arc {
                background: var(--ink);
                color: var(--white);
                display: flex;
                flex-direction: column;
        }

        /* Chapter bar */
        .chapter-bar {
                height: 44px;
                background: var(--red);
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
                color: var(--white);
                white-space: nowrap;
        }

        .bar-line {
                flex: 1;
                height: 1px;
                background: rgba(255, 255, 255, 0.3);
        }

        /* ---- Spread ---- */
        .spread {
                flex: 1;
                display: grid;
                grid-template-columns: 2fr 3fr;
                overflow: hidden;
        }

        /* ---- Left title panel ---- */
        .title-panel {
                border-right: 4px solid rgba(255, 255, 255, 0.15);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                position: relative;
        }

        .title-panel-inner {
                padding: clamp(24px, 4vw, 52px) clamp(20px, 3vw, 40px);
                position: relative;
                z-index: 2;
        }

        .arc-eyebrow {
                font-family: var(--font-display);
                font-size: clamp(0.85rem, 1.2vw, 1rem);
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--red);
                margin-bottom: 16px;
        }

        .arc-title {
                font-family: var(--font-title);
                font-size: clamp(3rem, 7vw, 5.5rem);
                line-height: 0.88;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--white);
                margin-bottom: 20px;
        }

        .arc-divider {
                width: 36px;
                height: 3px;
                background: var(--red);
                margin-bottom: 18px;
        }

        .arc-sub {
                font-family: var(--font-body);
                font-size: clamp(0.9rem, 1.3vw, 1.05rem);
                font-weight: 300;
                line-height: 1.7;
                color: rgba(255, 255, 255, 0.5);
        }

        .arc-character {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                overflow: hidden;
                padding: 0 16px;
                flex: 1;
                position: relative;
                z-index: 2;
        }

        .arc-character img {
                height: 65%;
                max-height: 380px;
                width: auto;
                object-fit: contain;
                object-position: bottom;
                opacity: 0.85;
                filter: drop-shadow(0 0 24px rgba(204, 20, 20, 0.25));
        }

        /* ---- Interests grid ---- */
        .interests-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
        }

        .interest-panel {
                border: 1px solid rgba(255, 255, 255, 0.08);
                position: relative;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.03);
        }

        .interest-panel--dark {
                background: rgba(0, 0, 0, 0.4);
        }

        .interest-panel--red {
                background: var(--red);
                border-color: var(--red);
        }

        .interest-inner {
                padding: clamp(16px, 3vw, 36px) clamp(16px, 2.5vw, 30px);
                display: flex;
                flex-direction: column;
                gap: 10px;
                height: 100%;
        }

        .interest-icon {
                font-size: clamp(1.4rem, 3vw, 2.2rem);
                line-height: 1;
        }

        .interest-title {
                font-family: var(--font-title);
                font-size: clamp(1.3rem, 3vw, 2.2rem);
                line-height: 0.92;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: var(--white);
        }

        .interest-sub {
                font-family: var(--font-body);
                font-size: clamp(0.88rem, 1.3vw, 1rem);
                font-weight: 300;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.55);
                flex: 1;
        }

        .interest-panel--red .interest-sub {
                color: rgba(255, 255, 255, 0.8);
        }

        .next-label,
        .current-label {
                font-family: var(--font-display);
                font-size: 0.78rem;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.35);
                margin-top: auto;
        }

        .next-label {
                color: rgba(255, 255, 255, 0.35);
        }

        .interest-panel--red .next-label {
                color: rgba(255, 255, 255, 0.7);
        }

        /* ---- Contact bar ---- */
        .contact-bar {
                height: 52px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 clamp(20px, 4vw, 60px);
                flex-shrink: 0;
                gap: 20px;
                position: relative;
                z-index: 5;
        }

        .contact-text {
                font-family: var(--font-display);
                font-size: clamp(0.9rem, 1.6vw, 1.1rem);
                letter-spacing: 3px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.45);
        }

        .contact-links {
                display: flex;
                gap: clamp(16px, 3vw, 32px);
        }

        .contact-link {
                font-family: var(--font-display);
                font-size: clamp(0.85rem, 1.2vw, 1rem);
                letter-spacing: 2px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.45);
                text-decoration: none;
                padding-bottom: 2px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.15);
                transition: color 0.3s ease, border-color 0.3s ease;
        }

        .contact-link:hover {
                color: var(--red);
                border-color: var(--red);
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
                .spread {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto 1fr;
                        overflow-y: auto;
                }

                .title-panel {
                        border-right: none;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        flex-direction: row;
                        align-items: center;
                }

                .title-panel-inner {
                        padding: 20px 24px;
                }

                .arc-character {
                        flex: 0 0 100px;
                        padding: 0 12px;
                }

                .arc-title {
                        font-size: clamp(2rem, 10vw, 3.5rem);
                }

                .contact-bar {
                        flex-direction: column;
                        height: auto;
                        padding: 16px 20px;
                        gap: 12px;
                }
        }
</style>
