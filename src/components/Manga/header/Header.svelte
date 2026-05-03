<script lang="ts">
        import { onMount } from "svelte";

        let loaded = false;
        let glitching = false;
        let japanese = false;

        onMount(() => {
                const loadTimer = setTimeout(() => (loaded = true), 80);

                let glitchTimeout: ReturnType<typeof setTimeout>;

                function scheduleGlitch() {
                        // Fire every 3 seconds
                        const delay = 3000;
                        glitchTimeout = setTimeout(() => {
                                // Phase 1: start chromatic aberration glitch
                                glitching = true;

                                // Phase 2 (180ms in): swap text to Japanese
                                setTimeout(() => { japanese = true; }, 180);

                                // Phase 3 (700ms in): restore English
                                setTimeout(() => { japanese = false; }, 700);

                                // Phase 4 (900ms in): end glitch, schedule next
                                setTimeout(() => {
                                        glitching = false;
                                        scheduleGlitch();
                                }, 900);
                        }, delay);
                }

                scheduleGlitch();

                return () => {
                        clearTimeout(loadTimer);
                        clearTimeout(glitchTimeout);
                };
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

                        <h1 class="cover-name">
                                <span
                                        class="name-glitch"
                                        class:glitching
                                        data-text={japanese ? 'ラキム' : 'Rhaqim'}
                                >{japanese ? 'ラキム' : 'Rhaqim'}</span><span class="dot">.</span>
                        </h1>

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
                font-size: clamp(0.85rem, 1.2vw, 1rem);
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

        /* ---- Akira-style name glitch ---- */
        .name-glitch {
                position: relative;
                display: inline-block;
        }

        /* Red channel — shifts left */
        .name-glitch::before,
        /* Cyan channel — shifts right */
        .name-glitch::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                font-family: inherit;
                font-size: inherit;
                line-height: inherit;
                letter-spacing: inherit;
                text-transform: inherit;
                opacity: 0;
                pointer-events: none;
        }

        .name-glitch::before {
                color: var(--red);
        }

        .name-glitch::after {
                color: #00e5ff;
        }

        .name-glitch.glitching {
                animation: glitch-body 0.9s steps(1) forwards;
        }

        .name-glitch.glitching::before {
                opacity: 1;
                animation: glitch-red 0.9s steps(1) forwards;
        }

        .name-glitch.glitching::after {
                opacity: 1;
                animation: glitch-cyan 0.9s steps(1) forwards;
        }

        @keyframes glitch-body {
                0%   { transform: translate(0, 0); }
                8%   { transform: translate(-4px, 1px); }
                16%  { transform: translate(4px, -2px); }
                24%  { transform: translate(0, 0); }
                32%  { transform: translate(-3px, 2px); }
                40%  { transform: translate(2px, -1px); }
                48%  { transform: translate(0, 0); }
                56%  { transform: translate(-2px, 1px); }
                64%  { transform: translate(3px, 0); }
                72%  { transform: translate(0, 0); }
                80%  { transform: translate(-1px, 1px); }
                90%  { transform: translate(1px, -1px); }
                100% { transform: translate(0, 0); }
        }

        @keyframes glitch-red {
                0%   { transform: translate(-6px, 0);  clip-path: inset(0% 0 88% 0); }
                10%  { transform: translate(-8px, 0);  clip-path: inset(32% 0 48% 0); }
                20%  { transform: translate(-5px, 2px); clip-path: inset(68% 0 12% 0); }
                30%  { transform: translate(-7px, 0);  clip-path: inset(12% 0 78% 0); }
                40%  { transform: translate(-4px, -1px); clip-path: inset(52% 0 32% 0); }
                50%  { transform: translate(-6px, 0);  clip-path: inset(78% 0 8% 0); }
                60%  { transform: translate(-3px, 1px); clip-path: inset(22% 0 62% 0); }
                70%  { transform: translate(-5px, 0);  clip-path: inset(44% 0 42% 0); }
                80%  { transform: translate(-2px, -1px); clip-path: inset(62% 0 24% 0); }
                90%  { transform: translate(-4px, 0);  clip-path: inset(88% 0 2% 0); }
                100% { transform: translate(0, 0);     clip-path: inset(0 0 100% 0); opacity: 0; }
        }

        @keyframes glitch-cyan {
                0%   { transform: translate(6px, 0);  clip-path: inset(78% 0 8% 0); }
                10%  { transform: translate(8px, -1px); clip-path: inset(18% 0 68% 0); }
                20%  { transform: translate(5px, 1px); clip-path: inset(48% 0 38% 0); }
                30%  { transform: translate(7px, 0);  clip-path: inset(72% 0 18% 0); }
                40%  { transform: translate(4px, -2px); clip-path: inset(8% 0 78% 0); }
                50%  { transform: translate(6px, 0);  clip-path: inset(38% 0 52% 0); }
                60%  { transform: translate(3px, 1px); clip-path: inset(82% 0 6% 0); }
                70%  { transform: translate(5px, 0);  clip-path: inset(28% 0 58% 0); }
                80%  { transform: translate(2px, -1px); clip-path: inset(58% 0 28% 0); }
                90%  { transform: translate(4px, 0);  clip-path: inset(92% 0 2% 0); }
                100% { transform: translate(0, 0);    clip-path: inset(0 0 100% 0); opacity: 0; }
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
                font-size: clamp(1.1rem, 2.3vw, 1.6rem);
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
                font-size: clamp(0.85rem, 1.3vw, 1.05rem);
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
