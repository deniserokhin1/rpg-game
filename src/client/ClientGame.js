import { ClientEngine } from './ClientEngine'
import { ClientWorld } from './ClientWorld'
import { spriteConfig } from '../configs/sprites'
import levelCfg from '../configs/world.json'
import gameObjects from '../configs/gameObjects.json'

class ClientGame {
    // cfg здесь { tagId: 'game' }
    constructor(cfg) {
        Object.assign(this, {
            cfg,
            gameObjects,
            player: null,
            isFirstStep: true,
        })
        this.engine = this.createEngine() // создаем движок ClientEngine
        this.world = this.createWorld() // инициализируем ClientWorld
        this.initEngine()
    }

    setPlayer(player) {
        this.player = player
    }

    // Создаем движок
    createEngine() {
        const canvas = document.getElementById(this.cfg.tagId)
        // Создаем внутри контекст для рисования и пердаем ClientGame
        return new ClientEngine(canvas, this)
    }

    createWorld() {
        // Передаем ClientGame, ClientEngine и world.json
        return new ClientWorld(this, this.engine, levelCfg)
    }

    initEngine() {
        // Дожидаемся загрузки всех картинок
        this.engine.loadSprites(spriteConfig).then(() => {
            // Проинициализировали мир
            this.world.init()
            this.engine.on('render', (_, time) => {
                this.engine.camera.focusAtGameObject(this.player)
                this.world.render(time)
            })

            this.engine.start()
            this.initKeys()
        })
    }

    getWorld() {
        return this.world
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
                (cell) => {
                    return cell.findObjectsByType('grass').length
                }
            )

            if (canMove) {
                this.player.setState(dir)
                this.isFirstStep = false
            } else {
                this.player.setState('main')
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
    }
}

export default ClientGame
