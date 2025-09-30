<script>
	export let socials = [
		{
			name: "Twitter",
			url: "https://twitter.com/ivxnio",
			jp: "ツイッター",
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/in/john-franklin-anusiem/",
			jp: "リンクトイン",
		},
		{ name: "GitHub", url: "https://github.com/Rhaqim", jp: "ギットハブ" },
	];
</script>

<div class="socials-container">
	{#each socials as social}
		<a
			class="social-link"
			href={social.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="english">{social.name}</span>
			<span class="japanese">{social.jp}</span>
		</a>
	{/each}
</div>

<style>
	.socials-container {
		display: flex;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		position: relative;
		z-index: 2;
		flex-wrap: wrap;
	}

	.social-link {
		position: relative;
		color: #f0f0f0;
		text-decoration: none;
		font-size: 2rem;
		font-weight: bold;
		font-family: "Impact", "Arial Black", sans-serif;
		letter-spacing: 1px;
		padding: 10px 20px;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			color 0.3s ease;
	}

	.social-link:hover {
		transform: scale(1.1);
		color: red;
	}

	.english {
		position: relative;
		z-index: 2;
		transition: opacity 0.3s ease;
	}

	.japanese {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-5deg);
		font-family: "Noto Sans JP", sans-serif;
		color: red;
		font-size: 1.5rem;
		opacity: 0.7;
		z-index: 1;
		transition: all 0.3s ease;
		pointer-events: none;
		text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
	}

	/* Hover effect: Japanese comes to the front */
	.social-link:hover .japanese {
		z-index: 3;
		opacity: 1;
		transform: translate(-50%, -50%) rotate(0deg) scale(1.1);
	}

	/* And English fades slightly */
	.social-link:hover .english {
		opacity: 0.5;
	}
</style>

<!-- <script>
    import { onMount } from "svelte";
    
    export let socials = [
        {
            name: "Twitter",
            url: "https://twitter.com/ivxnio",
            jp: "ツイッター",
            icon: "🐦",
            color: "#1DA1F2"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/john-franklin-anusiem/",
            jp: "リンクトイン",
            icon: "💼",
            color: "#0077B5"
        },
        { 
            name: "GitHub", 
            url: "https://github.com/Rhaqim", 
            jp: "ギットハブ",
            icon: "👨‍💻",
            color: "#333"
        },
    ];

    let hoveredSocial = "";
    let isVisible = false;

    onMount(() => {
        const timer = setTimeout(() => {
            isVisible = true;
        }, 500);
        return () => clearTimeout(timer);
    });
</script>

<div class="socials-container" class:visible={isVisible}>
    <div class="socials-header">
        <h3 class="socials-title">Connect With Me!</h3>
        <div class="sound-effect">FOLLOW!</div>
    </div>
    
    <div class="socials-grid">
        {#each socials as social, index}
            <a
                class="social-link manga-panel"
                class:hovered={hoveredSocial === social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style="animation-delay: {index * 0.2}s; --accent-color: {social.color}"
                on:mouseenter={() => hoveredSocial = social.name}
                on:mouseleave={() => hoveredSocial = ""}
            >
                <div class="social-icon">{social.icon}</div>
                <div class="social-content">
                    <span class="english">{social.name}</span>
                    <span class="japanese">{social.jp}</span>
                </div>
                <div class="hover-effect">
                    <span class="click-hint">CLICK!</span>
                </div>
            </a>
        {/each}
    </div>
    
    <div class="socials-footer">
        <div class="speech-bubble">
            Let's build something amazing together! 🚀
        </div>
    </div>
</div>

<style>
    .socials-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: var(--space-4);
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--panel-radius);
        backdrop-filter: blur(5px);
        position: relative;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.8s ease;
    }

    .socials-container.visible {
        opacity: 1;
        transform: scale(1);
    }

    .socials-header {
        text-align: center;
        margin-bottom: var(--space-4);
        position: relative;
    }

    .socials-title {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-xl);
        color: var(--manga-white);
        margin: 0 0 var(--space-2) 0;
        text-shadow: 2px 2px 0 var(--manga-black);
    }

    .sound-effect {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-sm);
        color: var(--manga-yellow);
        text-shadow: 1px 1px 0 var(--manga-black);
        transform: rotate(-5deg);
        display: inline-block;
    }

    .socials-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        width: 100%;
        max-width: 280px;
    }

    .social-link {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: var(--manga-black);
        border: 2px solid var(--manga-white);
        border-radius: var(--panel-radius);
        color: var(--manga-white);
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        opacity: 0;
        animation: socialSlideIn 0.6s ease forwards;
    }

    .social-link:hover,
    .social-link.hovered {
        background: var(--accent-color, var(--manga-red));
        transform: translateX(10px) scale(1.05);
        box-shadow: 5px 5px 0px var(--manga-white);
    }

    .social-icon {
        font-size: var(--text-2xl);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--manga-white);
        border-radius: 50%;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .social-link:hover .social-icon {
        background: var(--manga-yellow);
        transform: rotate(360deg);
    }

    .social-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .english {
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-lg);
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .japanese {
        font-family: "Noto Sans JP", sans-serif;
        font-size: var(--text-sm);
        opacity: 0.7;
        transition: all 0.3s ease;
    }

    .social-link:hover .english {
        transform: translateX(5px);
    }

    .social-link:hover .japanese {
        opacity: 1;
        transform: translateX(5px);
        color: var(--manga-yellow);
    }

    .hover-effect {
        position: absolute;
        top: 50%;
        right: -50px;
        transform: translateY(-50%);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .social-link:hover .hover-effect {
        right: var(--space-2);
        opacity: 1;
    }

    .click-hint {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-xs);
        color: var(--manga-yellow);
        text-shadow: 1px 1px 0 var(--manga-black);
        transform: rotate(-10deg);
        white-space: nowrap;
    }

    .socials-footer {
        margin-top: var(--space-4);
        text-align: center;
    }

    .speech-bubble {
        background: var(--manga-white);
        color: var(--manga-black);
        padding: var(--space-2) var(--space-3);
        border: 2px solid var(--manga-black);
        border-radius: 15px;
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-sm);
        position: relative;
        display: inline-block;
        animation: bubble 2s ease-in-out infinite;
    }

    .speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid var(--manga-white);
    }

    @keyframes socialSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes bubble {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .socials-container {
            padding: var(--space-3);
        }

        .socials-title {
            font-size: var(--text-lg);
        }

        .socials-grid {
            max-width: 100%;
        }

        .social-link {
            padding: var(--space-2);
            gap: var(--space-2);
        }

        .social-icon {
            width: 35px;
            height: 35px;
            font-size: var(--text-xl);
        }

        .english {
            font-size: var(--text-base);
        }

        .japanese {
            font-size: var(--text-xs);
        }

        .social-link:hover {
            transform: translateY(-2px) scale(1.02);
        }

        .speech-bubble {
            font-size: var(--text-xs);
            padding: var(--space-1) var(--space-2);
        }
    }
</style> -->
