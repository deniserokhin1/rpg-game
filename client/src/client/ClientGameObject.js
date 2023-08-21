import { animateEx } from '../common/util'
import MovableObject from '../common/MovableObject'

class ClientGameObject extends MovableObject {
    // cfg -- { cell: ClientCell, objCfg: wall | grass | { "type": "boy1", "player": true }, index}
    constructor(cfg) {
        super()

        const { x, y, width, height } = cfg.cell
        // Получаем ClientWorld
        const world = cfg.cell.world
        // Получаем gameObjects.json из ClientGame
        const gameObjs = world.game.gameObjects
        const objCfg = typeof cfg.objCfg === 'string' ? { type: cfg.objCfg } : cfg.objCfg

        Object.assign(
            this,
            {
                cfg,
                // Координаты
                x,
                y,
                // Размеры ячейки
                width,
                height,
                //  spriteCfg:
                //  {
                //  "name": "grass",
                //  "type": "static",
                //  "sprite": ["terrain", "grass"],
                //  "frame": 0
                //  }
                spriteCfg: gameObjs[objCfg.type],
                objectConfig: objCfg,
                type: objCfg.type,
                world,
                state: 'main',
                animationStartTime: 0,
            },
            cfg
        )
    }

    moveByCellCoord(dcol, drow, conditionCallback = null) {
        const { cell } = this
        return this.moveToCellCoord(
            cell.cellCol + dcol,
            cell.cellRow + drow,
            conditionCallback
        )
    }

    moveToCellCoord(dcol, drow, conditionCallback = null) {
        const { world } = this
        const newCell = world.cellAt(dcol, drow)
        const canMove = !conditionCallback || conditionCallback(newCell)

        if (canMove) {
            this.setCell(newCell)
        }

        return canMove
    }

    setCell(newCell) {
        if (newCell) {
            this.detouch()
            this.cell = newCell
            newCell.addGameObject(this)

            const defaultSpeed = 300
            const speed = this.world.game.isFirstStep ? defaultSpeed * 1.5 : defaultSpeed

            this.moveTo(newCell.x, newCell.y, true, speed)
        }
    }

    detouch() {
        if (this.cell) {
            // Удаляем из ячейки игровой объект
            // И обнуляем ячейку
            this.cell.removeGameObject(this)
            this.cell = null
        }
    }

    render(time) {
        super.render(time)

        const { x, y, width, height, world } = this
        const engine = world.engine

        const { sprite, frame, type } = this.spriteCfg

        const spriteFrame = type === 'static' ? frame : this.getCurrentFrame(time)

        engine.renderSpriteFrame({
            sprite,
            frame: spriteFrame,
            x,
            y,
            w: width,
            h: height,
        })
    }

    getCurrentFrame(time) {
        const state = this.spriteCfg.states[this.state]
        const lengthFrame = state.frames.length
        const animate = animateEx(
            lengthFrame,
            this.animationStartTime,
            time,
            state.duration,
            true
        )
        const frame = ((lengthFrame + animate.offset) | 0) % lengthFrame

        return state.frames[frame]
    }

    setState(state) {
        this.state = state

        if (this.world) {
            this.animationStartTime = this.world.engine.lastRenderTime
        }
    }
}

export default ClientGameObject
