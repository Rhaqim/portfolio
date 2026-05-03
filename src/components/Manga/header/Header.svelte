<script lang="ts">
        import { onMount } from "svelte";

        let loaded = false;

        onMount(() => {
                const timer = setTimeout(() => (loaded = true), 80);
                return () => clearTimeout(timer);
        });
</script>

<section class="chapter cover" id="cover" aria-label="Cover">
        <!-- Speed lines radiating from character -->
        <div class="speed-lines" aria-hidden="true"></div>

        <!-- Halftone dot texture -->
        <div class="dots" aria-hidden="true"></div>

        <!-- Diagonal ink slash accent -->
        <div class="ink-slash" aria-hidden="true"></div>

        <!-- Cover layout: text left, character right -->
        <div class="cover-grid">
                <!-- LEFT: Text block -->
                <div class="cover-text" class:loaded>
                        <p class="vol-label">Vol. 01 &nbsp;·&nbsp; Portfolio</p>

                        <h1 class="cover-name">Rhaqim<span class="dot">.</span></h1>

                        <div class="cover-roles">
                                <span class="role">Backend Engineer</span>
                                <span class="role">Systems Architect</span>
                        </div>

                        <div class="divider" aria-hidden="true"></div>

                        <nav class="cover-links" aria-label="Social links">
                                <a href="https://github.com/Rhaqim" target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href="https://www.linkedin.com/in/john-franklin-anusiem/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href="https://twitter.com/ivxnio" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                        </nav>
                </div>

                <!-- RIGHT: Character illustration -->
                <div class="cover-character" class:loaded aria-hidden="true">
                        <img
                                src="/images/character/character.png"
                                alt=""
                                fetchpriority="high"
                        />
                </div>
        </div>

        <!-- Scroll hint -->
        <div class="scroll-hint" class:loaded aria-hidden="true">
                <span class="scroll-label">Read</span>
                <div class="scroll-line"></div>
        </div>

        <!-- Page number -->
        <span class="page-number" aria-hidden="true">01</span>
</section>

<style>
        /* ---- Cover section ---- */
        .cover {
                background: var(--ink);
                color: var(--white);
                display: flex;
                align-items: stretch;
        }

        /* ---- Speed lines ---- */
        .speed-lines {
                position: absolute;
                inset: 0;
                background: conic-gradient(
                        from 0deg at 68% 52%,
                        transparent 0deg, rgba(255,255,255,0.024) 0.6deg, transparent 1.2deg,
                        transparent 4.5deg, rgba(255,255,255,0.018) 5.1deg, transparent 5.7deg,
                        transparent 9deg, rgba(255,255,255,0.030) 9.6deg, transparent 10.2deg,
                        transparent 13.5deg, rgba(255,255,255,0.016) 14.1deg, transparent 14.7deg,
                        transparent 18deg, rgba(255,255,255,0.022) 18.6deg, transparent 19.2deg,
                        transparent 22.5deg, rgba(255,255,255,0.014) 23.1deg, transparent 23.7deg,
                        transparent 50deg, rgba(255,255,255,0.012) 50.6deg, transparent 51.2deg,
                        transparent 310deg, rgba(255,255,255,0.016) 310.6deg, transparent 311.2deg,
                        transparent 330deg, rgba(255,255,255,0.022) 330.6deg, transparent 331.2deg,
                        transparent 345deg, rgba(255,255,255,0.018) 345.6deg, transparent 346.2deg,
                        transparent 355deg, rgba(255,255,255,0.024) 355.6deg, transparent 356.2deg
                );
                pointer-events: none;
                z-index: 1;
        }

        /* ---- Halftone dots ---- */
        .dots {
                position: absolute;
                inset: 0;
                background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
                background-size: 22px 22px;
                pointer-events: none;
                z-index: 1;
        }

        /* ---- Diagonal ink accent ---- */
        .ink-slash {
                position: absolute;
                top: 0;
                right: 42%;
                width: 3px;
                height: 100%;
                background: var(--red);
                transform: skewX(-6deg);
                opacity: 0.7;
                z-index: 2;
                pointer-events: none;
        }

        /* ---- Cover grid ---- */
        .cover-grid {
                position: relative;
                z-index: 3;
                display: grid;
                grid-template-columns: 1fr 1fr;
                width: 100%;
                height: 100%;
        }

        /* ---- Left: text ---- */
        .cover-text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 clamp(24px, 6vw, 80px);
                opacity: 0;
                transform: translateX(-50px);
                transition:
                        opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s,
                        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }

        .cover-text.loaded {
                opacity: 1;
                transform: translateX(0);
        }

        .vol-label {
                font-family: var(--font-display);
                font-size: clamp(0.65rem, 1vw, 0.8rem);
                letter-spacing: 5px;
                text-transform: uppercase;
                color: var(--red);
                margin-bottom: clamp(12px, 2vh, 20px);
        }

        .cover-name {
                font-family: var(--font-title);
                font-size: clamp(4.5rem, 13vw, 10rem);
                line-height: 0.86;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--white);
                margin-bottom: clamp(16px, 3vh, 28px);
        }

        .dot {
                color: var(--red);
        }

        .cover-roles {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-bottom: clamp(20px, 4vh, 36px);
        }

        .role {
                font-family: var(--font-display);
                font-size: clamp(0.9rem, 2vw, 1.4rem);
                letter-spacing: 3px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.6);
                line-height: 1.3;
        }

        .divider {
                width: 48px;
                height: 3px;
                background: var(--red);
                margin-bottom: clamp(20px, 4vh, 36px);
        }

        .cover-links {
                display: flex;
                gap: clamp(16px, 3vw, 28px);
                flex-wrap: wrap;
        }

        .cover-links a {
                font-family: var(--font-display);
                font-size: clamp(0.7rem, 1.1vw, 0.85rem);
                letter-spacing: 2px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.45);
                text-decoration: none;
                padding-bottom: 3px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.18);
                transition: color 0.3s ease, border-color 0.3s ease;
        }

        .cover-links a:hover {
                color: var(--red);
                border-color: var(--red);
        }

        /* ---- Right: character ---- */
        .cover-character {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                overflow: hidden;
                opacity: 0;
                transform: translateY(30px);
                transition:
                        opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s,
                        transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s;
        }

        .cover-character.loaded {
                opacity: 1;
                transform: translateY(0);
        }

        .cover-character img {
                height: 94vh;
                max-height: 960px;
                width: auto;
                object-fit: contain;
                object-position: bottom center;
                filter: drop-shadow(-8px 0 60px rgba(204, 20, 20, 0.18));
        }

        /* ---- Scroll hint ---- */
        .scroll-hint {
                position: absolute;
                bottom: 28px;
                left: clamp(24px, 6vw, 80px);
                display: flex;
                align-items: center;
                gap: 12px;
                opacity: 0;
                transition: opacity 0.8s ease 1.3s;
                z-index: 4;
        }

        .scroll-hint.loaded {
                opacity: 0.38;
        }

        .scroll-label {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--white);
        }

        .scroll-line {
                width: 40px;
                height: 1px;
                background: rgba(255, 255, 255, 0.5);
                position: relative;
                overflow: hidden;
        }

        .scroll-line::after {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: var(--red);
                animation: scroll-sweep 2.2s ease-in-out infinite 1.5s;
        }

        @keyframes scroll-sweep {
                0% { left: -100%; }
                50% { left: 0%; }
                100% { left: 100%; }
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
                .cover-grid {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto 1fr;
                }

                .cover-text {
                        grid-row: 1;
                        padding: clamp(60px, 12vh, 100px) 24px 16px;
                        justify-content: flex-end;
                }

                .cover-character {
                        grid-row: 2;
                        align-items: flex-end;
                        height: 55vh;
                }

                .cover-character img {
                        height: 100%;
                }

                .ink-slash {
                        display: none;
                }

                .cover-name {
                        font-size: clamp(3.5rem, 18vw, 6rem);
                }
        }
</style>
