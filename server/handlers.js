module.exports = class WebSocketHandlers {
    constructor(playersList, aWss) {
        this.playersList = playersList
        this.aWss = aWss
    }

    handleJoin(ws, { id, playerName }) {
        const joiningPlayer = {
            col: 9,
            row: 11,
            name: playerName,
            skin: 'boy3',
            layer: 2,
            id,
        }
        this.playersList.push(joiningPlayer)
        const data = {
            method: 'join',
            player: joiningPlayer,
            playersList: this.playersList,
        }
        this.connectionHandler(ws, data)
    }

    handleMove({ id, dir, state }) {
        const player = this.playersList.find((p) => p.id === id)
        player.col += dir[0]
        player.row += dir[1]

        this.broadcastConnection({
            method: 'move',
            id,
            col: player.col,
            row: player.row,
            state,
        })
    }

    handleStop({ id, state }) {
        this.broadcastConnection({
            method: 'stop',
            id,
            state,
        })
    }

    handleChat(ws, { message }) {
        const player = this.playersList.find((p) => p.id === ws.id)
        this.broadcastConnection({
            method: 'chat',
            message,
            name: player.name,
        })
    }

    handleClose(ws) {
        const { id, col, row, name } = this.playersList.find((p) => p.id === ws.id)
        this.playersList = this.playersList.filter((p) => p.id !== ws.id)
        this.broadcastConnection({
            method: 'close',
            id,
            col,
            row,
            name
        })
    }

    connectionHandler(ws, data) {
        ws.id = data.player.id
        this.broadcastConnection(data)
    }

    broadcastConnection(msg) {
        // Предполагается, что `aWss` доступен извне класса.
        this.aWss.clients.forEach((client) => client.send(JSON.stringify(msg)))
    }

    attachHandlers(ws) {
        ws.on('message', (msg) => {
            const data = JSON.parse(msg)
            switch (data.method) {
                case 'join':
                    this.handleJoin(ws, data)
                    break
                case 'move':
                    this.handleMove(data)
                    break
                case 'stop':
                    this.handleStop(data)
                    break
                case 'chat':
                    this.handleChat(ws, data)
                    break
                default:
                    break
            }
        })

        ws.on('close', () => {
            this.handleClose(ws)
        })
    }
}
