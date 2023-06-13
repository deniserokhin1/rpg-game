import { type IMap } from 'configs/sprites'
import { type ClientEngine } from './ClientEngine'
import type ClientGame from './ClientGame'

export class ClientWorld {
    levelCfg: IMap = {
        camera: {
            height: 0,
            width: 0,
            x: 0,
            y: 0,
        },
        layers: [],
        map: [],
    }

    engine: ClientEngine | undefined

    constructor(game: ClientGame, engine: ClientEngine, levelCfg: IMap) {
        Object.assign(this, {
            game,
            engine,
            levelCfg,
            height: levelCfg.map.length,
            width: levelCfg.map[0].length,
        })
    }

    init() {
        this.engine?.renderSpriteFrame({
            sprite: ['grass'],
            frame: 0,
            x: 0,
            y: 0,
            w: 48,
            h: 48,
        })
    }

    drawMap() {
        this.levelCfg.map.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.engine?.renderSpriteFrame({
                    sprite: cell[0],
                    frame: 0,
                    x: x * 48,
                    y: y * 48,
                    w: 48,
                    h: 48,
                })
            })
        })
    }
}
