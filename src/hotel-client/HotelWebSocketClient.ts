import WebSocketAsPromised from 'websocket-as-promised'
import axios from 'axios'

export const hotelRestClient = makeHotelRestClient()
export const hotelWebSocketClient = makeHotelWebSocketClient()

interface HotelClientParams {
    endpoint:string,
    domain:string,
}
function makeHotelRestClient(){
    let params: HotelClientParams | undefined
    function init(_params:HotelClientParams){
        params = _params
    }
    async function createRoom(){
        if(!params) throw new UninitializedError()
        return axios.post(`${params.endpoint}/${params.domain}/createRoom`)
    }
    async function listRooms(){
        if(!params) throw new UninitializedError()
        return axios.post(`${params.endpoint}/${params.domain}/listRooms`)
    }
    return { init, createRoom, listRooms}
}

function makeHotelWebSocketClient(){
    let params: HotelClientParams | undefined
    let socket: WebSocketAsPromised | undefined
    let latestData: any | undefined
    function init(_params:HotelClientParams){
        params = _params
    }

    const subscriptions = new Set<(value: WebSocketAsPromised | undefined) => void>()

    function isConnected(){
        return socket
    }

    function close() {
        if (socket) {
            socket.close()
            socket = undefined
        }
    }

    async function connect(roomId: string, name: string) {
        console.log(`saocket`, socket)
        if(!params) throw new UninitializedError()
        if (socket) return
        const ws = new WebSocketAsPromised(`${params.endpoint}/${params.domain}/room/${roomId}/${name}`, {
            packMessage: data => JSON.stringify(data),
            unpackMessage: data => JSON.parse(data as string)
        })
        socket = ws
        return new Promise<void>((resolve, reject) => {
            ws.open().catch(e => console.error('Opening error', e))
            ws.onClose.addOnceListener(event => {
                reject(event.code)
                console.log(`Socket closed.`)
                subscriptions.clear()
                socket = undefined
            })
            ws.onUnpackedMessage.addListener(data => {
                latestData = data
                subscriptions.forEach(subscription => subscription(latestData))
                resolve()
            })
        })
    }

    function send(message:any){
        socket?.sendPacked(message)
    }

    function subscribe(subscription: (value: any) => void) {
        subscription(latestData)
        subscriptions.add(subscription)
        return () => {
            subscriptions.delete(subscription)
            if (subscriptions.size === 0) {
                setTimeout(function () {
                    if (subscriptions.size === 0) {
                        console.log(`Closing socket because of no subscribers`)
                        close()
                    }
                }, 3000)
            }
        }
    }

    return {
        init,
        isConnected,
        connect,
        close,
        send,
        subscribe
    }
}

class UninitializedError extends Error {}