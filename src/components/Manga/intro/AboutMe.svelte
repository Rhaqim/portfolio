<script>
    import { onMount } from "svelte";
    
    let isVisible = false;
    
    onMount(() => {
        const timer = setTimeout(() => {
            isVisible = true;
        }, 300);
        return () => clearTimeout(timer);
    });
</script>

<section id="about-me" class="wrapper">
    <div class="section manga-chapter">
        <div class="chapter-header">
            <div class="chapter-number">Chapter 1</div>
            <h2 class="chapter-title">About Me</h2>
        </div>
        
        <div class="chapter-content {isVisible ? 'fade-in' : ''}">
            <div class="speech-bubble">
                Hello! I'm <span class="highlight">Anusiem John-Franklin</span> — a passionate
                software engineer, lifelong learner, and adventurer in technology!
            </div>
            
            <div class="manga-panel">
                <p>
                    I love building innovative things, from crafting powerful backend
                    systems with <strong>Go</strong> and <strong>Rust</strong>, to experimenting with game development,
                    graphics programming, and even deploying AI on CUDA servers.
                </p>
            </div>
            
            <div class="thought-bubble">
                My journey has taken me across a wide spectrum of tech: server
                management, Docker, Redis caching, creating Telegram bots, working with
                NFTs, and building creative frontends with Svelte, Astro, and
                TypeScript.
            </div>
            
            <div class="manga-panel">
                <p>
                    Beyond coding, I'm a huge fan of <em>manga</em>, storytelling, video games, and
                    robotics — dreaming of revolutionary technology that fuses art,
                    engineering, and imagination.
                </p>
            </div>
            
            <div class="speech-bubble">
                <span class="sound-effect">POW!</span> Whether it's building efficient systems, exploring new worlds through
                manga, or designing the future of gaming and AI, I'm always chasing the
                next exciting challenge!
            </div>
        </div>
    </div>
</section>

<style>
	.highlight {
		font-weight: bold;
		color: #e63946;
	}
</style>
