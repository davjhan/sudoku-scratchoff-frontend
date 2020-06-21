<script>
    import GameOver from './GameOver.svelte'
    import HeartRoom from './HeartRoom.svelte'
    import SudokuRoom from './sudoku/SudokuRoom.svelte'
    import SudokuJoinRoom from './sudoku/SudokuJoinRoom.svelte'
    import {Router, Link, Route} from 'svelte-routing'
    import {hotelRestClient, hotelWebSocketClient} from './hotel-client/HotelWebSocketClient'

    export let url = ''

    hotelRestClient.init({
        endpoint: '__REST_ENDPOINT__',
        domain: 'sudoku-scratchoff'
    })
    hotelWebSocketClient.init({
        endpoint: '__WEBSOCKET_ENDPOINT__',
        domain: 'sudoku-scratchoff'
    })
</script>

<main>
    <div class="container mx-auto">
        <nav class="flex items-start white bg-black">
            <div class="flex-auto">
                <a href="/sudoku/join" class="btn py2 logo">Sudoku Sweepstakes</a>
            </div>
        </nav>
        <hr/>
        <Router url="{url}">
            <Route path="/" component="{SudokuJoinRoom}"/>
            <Route path="gameOver" component="{GameOver}"/>
            <Route path="heart" component="{HeartRoom}"/>
            <Route path="sudoku/" component="{SudokuJoinRoom}"/>
            <Route path="sudoku/join/" component="{SudokuJoinRoom}"/>
            <Route path="sudoku/join/:roomId" component="{SudokuJoinRoom}"/>
            <Route path="sudoku/join/:roomId/:name" component="{SudokuJoinRoom}"/>
            <Route path="sudoku/game/:roomId/:name" component="{SudokuRoom}"/>
        </Router>
    </div>


</main>

<style>
</style>