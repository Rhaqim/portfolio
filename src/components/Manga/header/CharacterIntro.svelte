<script>
    import { onMount } from "svelte";
    
    let characterState = "default";
    let isHovered = false;
    let speechIndex = 0;
    
    const speeches = [
        "Hello! I'm Anusiem John-Franklin and this is Rhaqim!",
        "He'll be your guide through this manga adventure!",
        "I hope you enjoy exploring my portfolio!",
        "Click around to discover more about my journey!"
    ];
    
    let currentSpeech = speeches[0];
    
    const handleCharacterClick = () => {
        speechIndex = (speechIndex + 1) % speeches.length;
        currentSpeech = speeches[speechIndex];
        characterState = speechIndex % 2 === 0 ? "happy" : "thinking";
    };
    
    onMount(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                speechIndex = (speechIndex + 1) % speeches.length;
                currentSpeech = speeches[speechIndex];
            }
        }, 5000);
        
        return () => clearInterval(interval);
    });
</script>

<div class="container">
    <div class="character">
        <!-- Main Speech Bubble -->
        <div class="speech-bubble main" class:active={speechIndex < 2}>
            <p>{currentSpeech}</p>
            <div class="speech-tail"></div>
        </div>
        
        <!-- Thought Bubble for special states -->
        {#if characterState === "thinking"}
            <div class="thought-bubble">
                <p>Let me think of something cool to show you...</p>
                <div class="thought-circles">
                    <div class="circle small"></div>
                    <div class="circle medium"></div>
                    <div class="circle large"></div>
                </div>
            </div>
        {/if}
        
        <!-- Character Image with Multiple States -->
        <div 
            class="character-wrapper"
            on:mouseenter={() => isHovered = true}
            on:mouseleave={() => isHovered = false}
            on:click={handleCharacterClick}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === 'Enter' && handleCharacterClick()}
        >
            <img 
                class="character-image" 
                src="/images/character/character{characterState === 'happy' ? '-hi' : characterState === 'thinking' ? '-thinking' : ''}.png" 
                alt="Rhaqim - Your manga guide" 
            />
            
            <!-- Action lines for emphasis -->
            <div class="action-lines" class:visible={isHovered}>
                <div class="line line-1"></div>
                <div class="line line-2"></div>
                <div class="line line-3"></div>
            </div>
        </div>
        
        <!-- Name Tag -->
        <div class="name-tag">
            <span class="name-english">Rhaqim</span>
            <span class="name-japanese">ラキム</span>
        </div>
    </div>
</div>

<style>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url("/images/background/bg-layer-2.png");
        background-size: cover;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .container::before {
        content: '';
        position: absolute;
        inset: 0;
        background: 
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.1) 0%, transparent 40%);
        z-index: 1;
    }

    .character {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
    }

    .speech-bubble {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--manga-white);
        color: var(--manga-black);
        border: 3px solid var(--manga-black);
        border-radius: 20px;
        padding: var(--space-3) var(--space-4);
        max-width: 280px;
        min-width: 200px;
        text-align: center;
        font-family: "Bebas Neue", sans-serif;
        font-size: var(--text-base);
        font-weight: bold;
        box-shadow: 5px 5px 0px var(--manga-black);
        opacity: 1;
        transition: all 0.3s ease;
        z-index: 10;
    }

    .speech-bubble p {
        margin: 0;
        line-height: 1.4;
    }

    .speech-tail {
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 15px solid var(--manga-white);
    }

    .speech-tail::before {
        content: '';
        position: absolute;
        bottom: 3px;
        left: -18px;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-top: 18px solid var(--manga-black);
        z-index: -1;
    }

    .thought-bubble {
        position: absolute;
        top: -120px;
        right: -60px;
        background: var(--manga-light-gray);
        border: 2px dashed var(--manga-gray);
        border-radius: 25px;
        padding: var(--space-3);
        max-width: 180px;
        font-style: italic;
        font-size: var(--text-sm);
        animation: thoughtFloat 3s ease-in-out infinite;
    }

    .thought-circles {
        position: absolute;
        bottom: -20px;
        left: 20px;
        display: flex;
        gap: 5px;
        align-items: end;
    }

    .circle {
        background: var(--manga-light-gray);
        border: 2px solid var(--manga-gray);
        border-radius: 50%;
        animation: thoughtBubble 1.5s ease-in-out infinite;
    }

    .circle.small {
        width: 8px;
        height: 8px;
        animation-delay: 0s;
    }

    .circle.medium {
        width: 12px;
        height: 12px;
        animation-delay: 0.2s;
    }

    .circle.large {
        width: 16px;
        height: 16px;
        animation-delay: 0.4s;
    }

    .character-wrapper {
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .character-wrapper:hover {
        transform: scale(1.05);
    }

    .character-image {
        width: 180px;
        height: auto;
        filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3));
        transition: all 0.3s ease;
    }

    .action-lines {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .action-lines.visible {
        opacity: 1;
    }

    .line {
        position: absolute;
        background: var(--manga-white);
        transform-origin: center;
    }

    .line-1 {
        width: 3px;
        height: 40px;
        top: 10%;
        left: 20%;
        transform: rotate(45deg);
        animation: actionLine 0.6s ease-out;
    }

    .line-2 {
        width: 3px;
        height: 50px;
        top: 20%;
        right: 15%;
        transform: rotate(-30deg);
        animation: actionLine 0.6s ease-out 0.1s;
    }

    .line-3 {
        width: 3px;
        height: 35px;
        bottom: 25%;
        left: 15%;
        transform: rotate(60deg);
        animation: actionLine 0.6s ease-out 0.2s;
    }

    .name-tag {
        background: var(--manga-red);
        color: var(--manga-white);
        padding: var(--space-1) var(--space-3);
        border-radius: var(--panel-radius);
        border: 2px solid var(--manga-black);
        text-align: center;
        position: relative;
        box-shadow: 3px 3px 0px var(--manga-black);
    }

    .name-english {
        font-family: "Bangers", sans-serif;
        font-size: var(--text-lg);
        display: block;
    }

    .name-japanese {
        font-family: "Noto Sans JP", sans-serif;
        font-size: var(--text-sm);
        opacity: 0.8;
        display: block;
    }

    @keyframes thoughtFloat {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes thoughtBubble {
        0%, 100% {
            opacity: 0.7;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    @keyframes actionLine {
        from {
            opacity: 0;
            transform: scale(0) rotate(var(--rotation, 0deg));
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation, 0deg));
        }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .speech-bubble {
            max-width: 220px;
            min-width: 180px;
            font-size: var(--text-sm);
            padding: var(--space-2) var(--space-3);
            top: -60px;
        }

        .character-image {
            width: 140px;
        }

        .thought-bubble {
            max-width: 150px;
            font-size: var(--text-xs);
            top: -100px;
            right: -40px;
        }

        .action-lines {
            width: 160px;
            height: 160px;
        }

        .name-tag {
            padding: var(--space-1) var(--space-2);
        }

        .name-english {
            font-size: var(--text-base);
        }
    }
</style>
