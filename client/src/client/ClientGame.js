import { ClientEngine } from './ClientEngine'
import { ClientWorld } from './ClientWorld'
// import { spriteConfig } from '../configs/sprites'
// import levelCfg from '../configs/world.json'
// import gameObjects from '../configs/gameObjects.json'
import ClientApi from './ClientApi'

class ClientGame {
    // cfg здесь { tagId: 'game' }
    constructor(cfg) {
        Object.assign(this, {
            cfg,
            gameObjects: cfg.gameObjects,
            player: null,
            players: {},
            spawnPoints: [],
            isFirstStep: true,
            api: new ClientApi({
                game: this,
                ...cfg.apiCfg,
            }),
        })
        this.api.connect()
        this.engine = this.createEngine() // создаем движок ClientEngine
        this.world = this.createWorld() // инициализируем ClientWorld
        this.initEngine()
    }

    // Создаем движок
    createEngine() {
        const canvas = document.getElementById(this.cfg.tagId)
        // Создаем внутри контекст для рисования и пердаем ClientGame
        return new ClientEngine(canvas, this)
    }

    createWorld() {
        // Передаем ClientGame, ClientEngine и world.json
        return new ClientWorld(this, this.engine, this.cfg.world)
    }

    initEngine() {
        // Дожидаемся загрузки всех картинок
        this.engine.loadSprites(this.cfg.sprites).then(() => {
            // Проинициализировали мир
            this.world.init()
            this.engine.on('render', (_, time) => {
                this.player && this.engine.camera.focusAtGameObject(this.player)
                this.world.render(time)
            })

            this.engine.start()
            this.initKeys()
            this.engine.focus()

            //Передаем имя игрока и id на сервер
            const timestamp = Date.now()
            this.api.join(this.cfg.playerName, timestamp)
        })
    }

    getWorld() {
        return this.world
    }

    setPlayers(playersList) {
        playersList.forEach((player) => this.createPlayer(player))
    }

    setPlayer(player) {
        this.player = player
    }

    createCurrentPlayer(playerCfg) {
        const playerObj = this.createPlayer(playerCfg)

        if (!this.player) {
            this.setPlayer(playerObj)
        }
    }

    deletePlayer(id, col, row) {
        if (this.players[id]) {
            const cell = this.world.cellAt(col, row)

            cell.removeGameObject(this.players[id])

            delete this.players[id]
        }
    }

    createPlayer({ id, col, row, layer, skin, name }) {
        if (!this.players[id]) {
            const cell = this.world.cellAt(col, row)
            const playerObj = cell.createGameObj(
                {
                    class: 'player',
                    type: skin,
                    playerId: id,
                    playerName: name,
                },
                layer
            )

            cell.addGameObject(playerObj)
            this.players[id] = playerObj
        }

        return this.players[id]
    }

    addSpawnPoint(spawnPoint) {
        this.spawnPoints.push(spawnPoint)
    }

    initKeys() {
        this.engine.input.onKey({
            ArrowLeft: (keydown) => {
                if (keydown) {
                    this.changeCoord('left')
                }
            },
            ArrowRight: (keydown) => {
                if (keydown) {
                    this.changeCoord('right')
                }
            },
            ArrowUp: (keydown) => {
                if (keydown) {
                    this.changeCoord('up')
                }
            },
            ArrowDown: (keydown) => {
                if (keydown) {
                    this.changeCoord('down')
                }
            },
        })
    }

    getPlayerById(id) {
        return this.players[id]
    }

    changeCoord(dir) {
        const dirs = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1],
        }

        if (this.player && this.player.motionProgress === 1) {
            const canMove = this.player.moveByCellCoord(
                dirs[dir][0],
                dirs[dir][1],
                (cell) => cell.findObjectsByType('grass').length
            )

            if (canMove) {
                this.player.setState(dir)
                this.isFirstStep = false
                this.api.move(dirs[dir], dir)
            } else {
                this.player.setState('main')
                this.api.stop('main')
            }

            // this.player.on('motion-stopped', () => {
            //     this.player.setState('main')
            // })
        }

        this.engine.input.on('keyup', async () => {
            await new Promise((resolve) => {
                this.player.on('motion-stopped', () => {
                    resolve()
                })
                setTimeout(() => {
                    resolve()
                }, 500)
            }).then(() => {
                this.player.setState('main')
                this.api.stop('main')
                this.isFirstStep = true
            })
        })
    }

    // Cfg здесь { tagId: 'game' }
    static init(cfg) {
        if (ClientGame.game) {
            return
        }

        ClientGame.game = new ClientGame(cfg)

        return ClientGame.game.api
    }
}

export default ClientGame
