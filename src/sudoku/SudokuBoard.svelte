<script>
    import {scale} from 'svelte/transition'
    import {elasticOut} from 'svelte/easing'
    import {createEventDispatcher} from 'svelte'

    export let data
    export let onCellClick
    export let sessionName
    export let isTurn
    export let lastRevealed
    export let highlightedOwner

    const dispatch = createEventDispatcher()

    function onRightClick(e, r, c) {
        dispatch('markCell', {row: r, col: c})
        e.preventDefault()
    }

    function onClick(r, c) {
        if (isTurn) onCellClick(r, c)
    }
</script>
<style>
    .flex-container {
        padding: 0;
        margin: 0;
        display: flex;
        flex-flow: row;
        justify-content: center;
        line-height: 30px;
    }

    .flex-item {
        border: gray solid 1px;
        font-weight: bold;
        text-align: center;
        min-width: 1.3em;
        min-height: 1.3em;
        width: 2em;
        height: 2em;
        /*flex: 1 0 auto;*/
        align-items: center;
        justify-content: center;
        /*height: auto;*/
        display: flex;
    }

    .cell {
        display: flex;
        align-self: center;
        justify-self: center;

    }

    .board {
        border: black 4px solid;
    }

    .hor-frame {
        height: 2px;
        background: black;
    }

    .vert-frame {
        width: 2px;
        background: black;
    }

    .cell {
        position: relative;
        user-select: none;
        font-size: 1.5em;
        background: #efefef;
    }

    .cell.revealed {
        background: #ffffff;
    }

    .cell.highlightAffected:not(.highlight) {
        color: rgba(0, 0, 0, 0.3);
    }

    .cell.isSessionName:before {
        content: '';
        width: 100%;
        height: 100%;
        outline: #efefef solid 2px;
        outline-offset: -4px;
        position: absolute;
    }

    .cell.isTurn {
        cursor: pointer;
    }

    .cell.isLastRevealed {
        background: #fff1be !important;
    }

    .cell.isTurn:hover {
        outline: rgba(0, 0, 0, 0.3) dashed 2px;
        outline-offset: -4px;
    }

    .cell.isTurn:active:after {
        content: '';
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.43);
        position: absolute;
    }
</style>
<div class="board">
    {#each data as row, r}
        <div class='flex-container'>
            {#each row as item, c}
                <div class='flex-item cell'
                     class:revealed={item.shownValue !== 0}
                     class:highlightAffected={highlightedOwner}
                     class:highlight={highlightedOwner === item.owner}
                     class:isSessionName={sessionName === item.owner}
                     class:isTurn
                     class:isLastRevealed={lastRevealed && lastRevealed.row === r && lastRevealed.col === c}
                     on:click={()=>onClick(r,c)}
                     on:contextmenu={(e)=>onRightClick(e, r,c)}
                >
                    {#if item.shownValue !== 0}
                        <span transition:scale={{start:0.2,easing:elasticOut, duration:700}}>
                            {item.shownValue}
                        </span>
                    {/if}
                </div>

                {#if (c+1)%3 === 0 && c !== 8}
                    <div class="vert-frame"></div>
                {/if}
            {/each}
        </div>

        {#if (r+1)%3 === 0 && r !== 8}
            <div class="hor-frame"/>
        {/if}
    {/each}
</div>