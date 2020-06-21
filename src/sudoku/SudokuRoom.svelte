<script>
    import {fly} from 'svelte/transition'
    import {quadOut} from 'svelte/easing'
    import SudokuBoard from './SudokuBoard.svelte'
    import ScoreCard from '../components/ScoreCard.svelte'
    import {navigate} from 'svelte-routing'
    import {onDestroy} from 'svelte'
    import Timer from 'easytimer.js'
    import {hotelWebSocketClient} from '../hotel-client/HotelWebSocketClient'

    export let name
    export let roomId
    export let location

    let data
    let message = 'Loading...'
    let isTurn = false
    let timer = new Timer({
        startValues: {seconds: 60},
        target: {seconds: 0},
        precision: 'secondTenths',
        countdown: true
    })
    let isSeizeTurnEnabled = true
    timer.addEventListener('secondTenthsUpdated', () => timer = timer)
    timer.addEventListener('targetAchieved', () => isSeizeTurnEnabled = true)

    function onCellClick(r, c) {
        hotelWebSocketClient.send({type: 'reveal', row: r, col: c})
    }

    function onSeizeTurn(r, c) {
        console.log(`onSeizeTurn `)
        hotelWebSocketClient.send({type: 'seizeTurn', timeOfCall: (new Date).getTime()})
    }

    let unsubscribe = hotelWebSocketClient.subscribe(message => {
        if(!message){
            hotelWebSocketClient.connect(roomId, name)
                    .then(() => console.log(`Reconnected.`))
                    .catch((e) => {
                        console.log(`Could not reconnect `, e)
                        navigate(`/sudoku/join/`, {replace: true})
                    })
            return
        }
        if (message.roomId) {
            data = message
            onDataLoaded()
        }
    })
    let highlightedOwner

    function scoreCardHoverEnter(it) {
        console.log(`over`, it)
        highlightedOwner = it.name
    }

    function scoreCardHoverExit(it) {
        highlightedOwner = undefined
    }

    function onDataLoaded() {
        console.log(`DATA LOADED`)
        message = getMessageText(data.players[data.turn])
        isTurn = data.players[data.turn].name === name
        // data.players
        //         .filter(it => it.markedCell)
        //         .forEach(it => {
        //             data.board[it.markedCell.row][it.markedCell.col].markedBy = it.name
        //         })
        const millis = (new Date).getTime()
        if (data.turnTimerExpiry) {
            const remainingSecondTenths = Math.max(0, (data.turnTimerExpiry - millis) / 100)
            if (remainingSecondTenths > 0) {
                isSeizeTurnEnabled = false
                timer.stop()
                timer.start({startValues: {secondTenths: remainingSecondTenths}})
                timer = timer
            }
        }
    }

    function getMessageText(playerInTurn) {
        if (playerInTurn.name === name) return `It is <b>your</b> turn. Pick a cell.`
        return `It is <b>${playerInTurn.name}</b>'s turn.`
    }

    function newGame() {
        hotelWebSocketClient.send({type: 'newGame'})
    }

    onDestroy(() => {
        unsubscribe()
    })

    function gamePlaying() {
        return data.mode === 'playing'
    }
</script>
<style>
    .boardContainer {
        max-width: 30em;
        /*width: 100%;*/
    }

    .primary {
        color: blue;
    }

    .scores {
        min-height: 108px;
    }
</style>
<div class='flex flex-column parent'>
    <h3 class="mt2">Room Code: <a href="/sudoku/join/{roomId}" target=_blank
                                  class="btn py2">{roomId}</a></h3>
    <h4>Share this: <code>{location.origin}/join/{roomId}</code></h4>
    {#if data}
        <div class="scores flex items-start mt3">
            {#each data.players as player, i}
                <ScoreCard data={player}
                           isSessionPlayer={name === player.name}
                           isTurn={data.turn === i}
                           mouseEnter={scoreCardHoverEnter}
                           mouseLeave={scoreCardHoverExit}/>
                <div class="mr1"></div>
            {/each}
        </div>
        {#if data.mode === 'playing'}
            <div class="flex flex items-center justify-center  mt2">
                <h3 class="center">{@html message}</h3>
                <button class="ml1" disabled={!isSeizeTurnEnabled} on:click={onSeizeTurn}>
                    {#if isTurn}
                        Forfeit turn
                    {:else}
                        Seize turn
                    {/if}
                    <b class:greenText={!isSeizeTurnEnabled}
                       class:redText={isSeizeTurnEnabled}
                    >{timer.getTimeValues().toString(['seconds', 'secondTenths'])}s</b>
                </button>
            </div>
        {:else if data && data.mode === 'gameOver'}
            <h3 class="center">Game Over</h3>
        {/if}

        <div class="boardContainer flex-auto self-center mt2">
            <SudokuBoard data={data.board} {onCellClick} {highlightedOwner} sessionName={name} {isTurn}
                         lastRevealed={data.lastRevealed}/>
        </div>

        {#if data.mode !== 'playing'}
            <button class="mt1" on:click={newGame}>
                New Game
            </button>
        {/if}
    {/if}
</div>