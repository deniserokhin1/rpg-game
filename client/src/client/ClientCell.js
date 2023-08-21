import PositionedObject from '../common/PositionedObject'
import ClientGameObject from './ClientGameObject'
import { ClientPlayer } from './ClientPlayer'

class ClientCell extends PositionedObject {
    // cfg -- { world: ClientWorld, cellCol: index, cellRow: index, cellCfg: levelCfg.map[row][col]})
    constructor(cfg) {
        super(cfg)
        // Размер ячейки engine.canvas.height / levelCfg.camera.heigh
        const { cellWidth, cellHeight } = cfg.world

        Object.assign(
            this,
            {
                cfg,
                y: cellHeight * cfg.cellRow, // Если levelCfg.camera.heigh = 15, то последний y будет = 760
                x: cellWidth * cfg.cellCol,
                width: cellWidth, // Размер ячейки
                height: cellHeight,
                objects: [],
                col: cfg.cellCol,
                row: cfg.cellRow,
                objectClasses: {
                    player: ClientPlayer,
                },
            },
            cfg
        )

        this.initGameObjects()
    }

    createGameObj(objCfg, layerId) {
        const { objectClasses } = this

        let ObjectClasses

        if (objCfg.class) {
            ObjectClasses = objectClasses[objCfg.class]
        } else {
            ObjectClasses = ClientGameObject
        }

        const obj = new ObjectClasses({
            cell: this,
            objCfg,
            layerId,
        })

        if (obj.type === 'spawn') {
            this.world.game.addSpawnPoint(obj)
        }

        return obj
    }

    initGameObjects() {
        const { cellCfg } = this

        this.objects = cellCfg.map((layer, layerId) =>
            layer.map((objCfg) => this.createGameObj(objCfg, layerId))
        )
    }

    render(time, layerId) {
        const { objects } = this

        if (objects[layerId]) {

            objects[layerId].forEach((obj) => {
                obj.render(time)
            })
        }
    }

    removeGameObject(objToRemove) {
        const { objects } = this
        objects.forEach(
            (layer, layerId) =>
                (objects[layerId] = layer.filter((obj) => obj !== objToRemove))
        )
    }

    addGameObject(objToAdd) {
        const { objects } = this
        if (!objToAdd.layerId) {
            objToAdd.layerId = objects.length
        }

        if (!objects[objToAdd.layerId]) {
            objects[objToAdd.layerId] = []
        }
        objects[objToAdd.layerId].push(objToAdd)
    }

    findObjectsByType(type) {
        let foundObjects = []
        this.objects.forEach(
            (layer) =>
                (foundObjects = [...foundObjects, ...layer].filter(
                    (obj) => obj.type === type
                ))
        )
        return foundObjects
    }
}

export default ClientCell
