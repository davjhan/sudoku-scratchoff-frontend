<script>
    import {spring} from 'svelte/motion'

    export let data
    export let isSessionPlayer
    export let isTurn
    export let mouseEnter
    export let mouseLeave
    let interpolatedScore = spring(data.score, {
        stiffness: 0.2
    })

    $: interpolatedScore.set(data.score)
</script>
<style>
    .parent {
        text-align: center;
    }

    .area {
        transition: margin 0.1s ease-out;

    }

    .area:not(.isTurn) {
        margin-top: 1em;
        border-color: black;
    }

    .area:hover {
        cursor: pointer;
        background: #efefef;
    }
    .area > hr {
        border: #efefef 1px solid;
        margin: 0.25em 0;
    }
</style>
<div class="parent flex flex-column" class:isTurn on:mouseenter={()=>mouseEnter(data)}
     on:mouseleave={()=>mouseLeave(data)}>

    <div class="area" class:isTurn class:isSessionPlayer>
        <h4 class:isSessionPlayer
            class:isTurn>
            {data.name}
        </h4>
        <hr/>
        <h3 class:isTurn>{Math.round($interpolatedScore)}</h3>
    </div>
    {#if isSessionPlayer}
        <h4 class="bold">Me</h4>
    {:else}
        {#if data.isOnline}
            <h5 class="grayText">Online</h5>
        {:else}
            <h5 class="redText">Offline</h5>
        {/if}
    {/if}

</div>