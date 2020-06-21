<script>
    import {fly} from 'svelte/transition'
    import {quadOut} from 'svelte/easing'

    let rootElement
    let particles = []

    function spawnHeart() {
        let particle = {
            x: rootElement.getBoundingClientRect().x,
            y: -50
        }
        console.log(`root element `, rootElement.getBoundingClientRect())
        particles = [...particles, particle]
    }

    const flyParams = {
        y: 50,
        duration: 800,
        easing: quadOut,
        opacity: 0.3
    }
</script>
<style>
    /*.particles{*/
    /*    position: absolute;*/
    /*}*/
    .particle {
        position: absolute;
        user-select: none;
    }

    h2 {
        width: auto;
    }
</style>
<div>
    <h1>Heart Spawner</h1>

    <div class="particles flex flex-column items-start ">

        <h2 class="flex " bind:this={rootElement}>value</h2>

        {#each particles as p (p)}
            <h1 class="particle" style="transform: translate({p.x}px, {p.y}px)"
                in:fly="{flyParams}"
                on:introend={() => particles = particles.filter(it => it !== p)}
            >+1</h1>
        {/each}
        <h3 class="flex-none">whoa</h3>
    </div>
    <button on:click={spawnHeart}>Click me to spawn a heart</button>
</div>