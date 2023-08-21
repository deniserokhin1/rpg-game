import MovableObject from '../common/MovableObject'

export class ClientCamera extends MovableObject {
    // cfg -- { canvas, engine: ClientEngine }
    constructor(cfg) {
        super()
        Object.assign(
            this,
            {
                cfg,
                width: cfg.canvas.width,
                height: cfg.canvas.height,
            },
            cfg
        )
    }

    focusAtGameObject(obj) {
        // Получаем координаты середины перемещаемого обекта
        const pos = obj.worldPosition(50, 50)
        this.moveTo(pos.x - this.width / 2, pos.y - this.height / 2, false)
    }
}
