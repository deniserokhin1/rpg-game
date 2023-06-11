import { ClientEngine } from './ClientEngine'

export interface ICfg {
    tagId: string
}

class ClientGame {
    static game: ClientGame | null = null
    cfg: ICfg = { tagId: '' }
    engine: ClientEngine | undefined

    constructor(cfg: ICfg) {
        Object.assign(this, {
            cfg,
        })
        this.engine = this.createEngine()
        this.initEngine()
    }

    createEngine() {
        const canvas = document.getElementById(this.cfg.tagId)
        if (!(canvas instanceof HTMLCanvasElement)) return
        return new ClientEngine(canvas)
    }

    initEngine() {
        if (!this.engine) return
        this.engine.start()
    }

    static init(cfg: ICfg) {
        if (ClientGame.game) return
        ClientGame.game = new ClientGame(cfg)
    }
}

export default ClientGame
