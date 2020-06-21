<script>
    import {navigate} from 'svelte-routing'
    import {onDestroy} from 'svelte'
    import {get} from 'svelte/store'
    import {hotelRestClient, hotelWebSocketClient} from '../hotel-client/HotelWebSocketClient'

    export let name = ''
    export let roomId = ''
    export let location = undefined
    let errorMessage

    async function joinRoom(roomCode) {
        errorMessage = undefined
        if (name === '') {
            errorMessage = 'Display Name required.'
            return
        }
        try {
            await hotelWebSocketClient.connect(roomId, name)
        } catch (code) {
            console.log(`caught `, code)
            switch (code) {
                case 2001: // RoomNotFound
                    errorMessage = 'Room not found.'
                    break
                case 2002: // NameInUse
                    errorMessage = 'Name already in use.'
                    break
                case 2003: // InvalidName
                    errorMessage = 'Invalid Name'
                    break
            }
        }
    }

    const unsubscribe = hotelWebSocketClient.subscribe(data => {
        if (data) navigate(`/sudoku/game/${roomId}/${name}`, {replace: true})
    })
    onDestroy(() => {
        console.log(`on Destroy`)
        unsubscribe()
    })

    async function onCreateRoom() {
        if (!name) {
            errorMessage = 'Display Name required.'
            return
        }
        const response = await hotelRestClient.createRoom()
        roomId = response.data.roomId
        joinRoom(roomId)
    }

    if (roomId !== '' && name) {
        joinRoom(roomId)
    }
</script>
<style>
    .error {
        color: red;
        text-align: center;
    }
</style>
<div class='flex flex-column parent'>
    <h3 class="mt3">Display Name:</h3>
    <input class='mb1' bind:value={name} placeholder="Display Name" maxlength={16}/>
    <h3 class="">Room Code</h3>
    <input class='mb1' bind:value={roomId} placeholder="Room Code"/>
    <button class='primary' on:click={()=>joinRoom(roomId)}> Join Room</button>
    <h3 class="hor-div mt3 mb3">Or if you want to start your own</h3>
    <button class='primary' on:click={onCreateRoom}> Create Room</button>



    {#if errorMessage }
        <h3 class='mt1 error'>{errorMessage}</h3>
    {/if}
</div>