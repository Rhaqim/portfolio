<script lang="ts">
        export let chapters: Array<{ id: string; label: string }> = [];
        export let activeChapter: string = "";

        function scrollTo(id: string) {
                const el = document.getElementById(id);
                el?.scrollIntoView({ behavior: "smooth" });
        }
</script>

<nav class="side-nav" aria-label="Chapter navigation">
        <ul class="nav-list">
                {#each chapters as chapter}
                        <li>
                                <button
                                        class="nav-dot"
                                        class:active={activeChapter === chapter.id}
                                        on:click={() => scrollTo(chapter.id)}
                                        aria-label="Go to chapter {chapter.label}"
                                        title="Chapter {chapter.label}"
                                >
                                        <span class="dot-inner" aria-hidden="true"></span>
                                        <span class="dot-label" aria-hidden="true">{chapter.label}</span>
                                </button>
                        </li>
                {/each}
        </ul>
</nav>

<style>
        .side-nav {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 100;
        }

        .nav-list {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
        }

        .nav-dot {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
                flex-direction: row-reverse;
        }

        .dot-inner {
                display: block;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: background 0.3s ease, transform 0.3s ease, width 0.3s ease;
        }

        .nav-dot.active .dot-inner {
                background: var(--red);
                border-color: var(--red);
                transform: scale(1.4);
        }

        .dot-label {
                font-family: var(--font-display);
                font-size: 0.6rem;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0);
                transition: color 0.3s ease;
                pointer-events: none;
        }

        .nav-dot:hover .dot-label,
        .nav-dot.active .dot-label {
                color: rgba(255, 255, 255, 0.5);
        }

        .nav-dot:hover .dot-inner {
                background: rgba(255, 255, 255, 0.6);
                transform: scale(1.2);
        }

        @media (max-width: 640px) {
                .side-nav {
                        right: 10px;
                }

                .dot-label {
                        display: none;
                }
        }
</style>
