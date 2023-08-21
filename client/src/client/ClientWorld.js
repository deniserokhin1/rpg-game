import { clamp } from '../common/util'
import PositionedObject from '../common/PositionedObject'
import ClientCell from './ClientCell'

export class ClientWorld extends PositionedObject {
    // Получаем ClientGame, ClientEngine и world.json
    constructor(game, engine, levelCfg) {
        super(levelCfg)

        const worldHeight = levelCfg.map.length
        const worldWidth = levelCfg.map[0].length
        const cellSize = engine.canvas.height / levelCfg.camera.height

        Object.assign(this, {
            game,
            engine,
            levelCfg,
            // Высота отрисовываемого мира
            height: worldHeight * cellSize,
            // Ширина отрисовываемого мира
            width: worldWidth * cellSize,
            worldHeight,
            worldWidth,
            cellWidth: cellSize,
            cellHeight: cellSize,
            map: [],
        })
    }

    init() {
        const { levelCfg, map, worldWidth, worldHeight } = this

        for (let row = 0; row < worldWidth; row++) {
            for (let col = 0; col < worldHeight; col++) {
                if (!map[row]) {
                    map[row] = []
                }

                //Делаем в map двумерный массив
                map[row][col] = new ClientCell({
                    world: this,
                    cellCol: col, // index
                    cellRow: row, // index
                    cellCfg: levelCfg.map[row][col], // [["wall"]]
                })
            }
        }
    }

    render(time) {
        const { levelCfg } = this
        for (let layerId = 0; layerId < levelCfg.layers.length; layerId++) {
            const layer = levelCfg.layers[layerId]

            if (layer.isStatic) {
                this.renderStaticLayer(time, layer, layerId)
            } else {
                this.renderDynamicLayer(time, layerId, this.getRenderRange())
            }
        }
    }

    renderStaticLayer(time, layer, layerId) {
        const { engine } = this
        const { camera } = engine

        const layerName = 'static_layer_' + layerId
        const cameraPos = camera.worldBounds()

        if (!layer.isRendered) {
            engine.addCanvas(layerName, this.width, this.height)
            engine.switchCanvas(layerName)

            camera.moveTo(0, 0, false)

            this.renderDynamicLayer(time, layerId)

            camera.moveTo(cameraPos.x, cameraPos.y, false)

            engine.switchCanvas('main')
            layer.isRendered = true
        }

        engine.renderCanvas(layerName, cameraPos, {
            x: 0,
            y: 0,
            width: cameraPos.width,
            height: cameraPos.height,
        })
    }

    renderDynamicLayer(time, layerId, rangeCells) {
        const { map, worldWidth, worldHeight } = this

        if (!rangeCells) {
            rangeCells = {
                startCell: this.cellAt(0, 0),
                endCell: this.cellAt(worldWidth - 1, worldHeight - 1),
            }
        }

        const { startCell, endCell } = rangeCells

        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                // Вызываем метод render у ClientCell
                map[row][col].render(time, layerId)
            }
        }
    }

    cellAt(col, row) {
        return this.map[row] && this.map[row][col]
    }

    cellAtXY(x, y) {
        const { width, height, cellWidth, cellHeight } = this

        return this.cellAt(
            (clamp(x, 0, width - 1) / cellWidth) | 0,
            (clamp(y, 0, height - 1) / cellHeight) | 0
        )
    }

    getRenderRange() {
        const { x, y, width, height } = this.engine.camera.worldBounds()
        const { cellWidth, cellHeight } = this

        return {
            startCell: this.cellAtXY(x - cellWidth, y - cellHeight),
            endCell: this.cellAtXY(x + width + cellWidth, y + height + cellHeight),
        }
    }
}
