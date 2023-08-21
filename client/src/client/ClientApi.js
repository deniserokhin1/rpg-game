class ClientApi {
    constructor(cfg) {
        Object.assign(this, { ...cfg })
    }

    connect() {
        const { url } = this

        this.socket = new WebSocket(url)

        this.socket.onmessage = (e) => {
            const msg = JSON.parse(e.data)

            const { method, player, playersList, id, col, row, state, message, name } =
                msg

            switch (method) {
                case 'join':
                    this.onJoin(player, playersList)
                    break

                case 'move':
                    this.onMove({ id, col, row, state })
                    break

                case 'stop':
                    this.onStop({ id, state })
                    break

                case 'close':
                    this.onClose(id, col, row, name)
                    break

                case 'chat':
                    this.onChat(message, name)
                    break

                default:
                    break
            }
        }
    }

    onChat(message, name, status) {
        const text = document.createElement('div')
        text.classList.add('message')

        status
            ? (text.textContent = `${name} ${message}`)
            : (text.textContent = `${name}: ${message}`)

        this.messages.append(text)
        this.messages.scrollTop = this.messages.scrollHeight - this.messages.clientHeight
    }

    onJoin(player, playersList) {
        this.game.createCurrentPlayer(player)
        this.game.setPlayers(playersList)

        const { name } = player

        this.onChat('в сети.', name, true)
    }

    onClose(id, col, row, name) {
        this.game.deletePlayer(id, col, row)

        this.onChat('вышел из сети.', name, true)
    }

    onStop(stopCfg) {
        const { game } = this
        const { id, state } = stopCfg

        const player = game.getPlayerById(id)

        if (player) {
            player.setState(state)
        }
    }

    onMove(moveCfg) {
        const { game } = this
        const { id, col, row, state } = moveCfg

        const player = game.getPlayerById(id)

        if (player) {
            player.moveToCellCoord(col, row)
            player.setState(state)
        }
    }

    move(dir, state) {
        this.socket.send(
            JSON.stringify({
                method: 'move',
                dir,
                state,
                id: this.game.player.objCfg.playerId,
            })
        )
    }

    stop(state) {
        this.socket.send(
            JSON.stringify({
                method: 'stop',
                state,
                id: this.game.player.objCfg.playerId,
            })
        )
    }

    join(playerName, id) {
        this.socket.send(
            JSON.stringify({
                method: 'join',
                playerName,
                id,
            })
        )
    }

    chat(message) {
        this.socket.send(
            JSON.stringify({
                method: 'chat',
                message,
            })
        )
    }
}

export default ClientApi
