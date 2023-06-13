import { ClientEngine } from './ClientEngine'
import { terrain as sprites } from '../configs/sprites'
import levelCfg from '../configs/world.json'
import { ClientWorld } from './ClientWorld'

export interface ICfg {
    tagId: string
}

class ClientGame {
    static game: ClientGame | null = null
    cfg: ICfg = { tagId: '' }
    engine: ClientEngine
    world: ClientWorld

    constructor(cfg: ICfg) {
        Object.assign(this, {
            cfg,
        })
        this.engine = this.createEngine()
        this.world = this.createWorld()
        this.initEngine()
    }

    createEngine() {
        const canvas = document.getElementById(this.cfg.tagId) as HTMLCanvasElement
        return new ClientEngine(canvas)
    }

    createWorld() {
        return new ClientWorld(this, this.engine, levelCfg)
    }

    initEngine() {
        void this?.engine?.loadSprites(sprites).then(() => {
            this?.engine?.start()

            this.engine?.eventMixin.on('render', (_, time: number) => {
                this.world.drawMap()
            })
        })
    }

    static init(cfg: ICfg) {
        if (ClientGame.game) {
            return
        }

        ClientGame.game = new ClientGame(cfg)
    }
}

export default ClientGame
