import { animateEx, clamp } from './util'
import PositionedObject from './PositionedObject'

class MovableObject extends PositionedObject {
    constructor(cfg) {
        super(cfg)

        Object.assign(
            this,
            {
                toX: 0,
                toY: 0,
                deltaX: 0,
                deltaY: 0,

                speed: 0,

                motionStartTime: 0,
                motionProgress: 1,

                clampToMap: true, // по умолчанию объект не должен вылетать за пределы карты
            },
            cfg
        )
    }

    render(time) {
        this.speed && this.animateMotion(time)
    }

    // Работает только для персонажа
    animateMotion(time) {
        console.log(this)
        if (this.speed) {
            const me = this

            const dx = animateEx(me.deltaX, me.motionStartTime, time, me.speed)
            const dy = animateEx(me.deltaY, me.motionStartTime, time, me.speed)

            const newX = me.toX + dx.offset - me.deltaX
            const newY = me.toY + dy.offset - me.deltaY

            me.motionProgress = dx.progress

            if (newX === me.toX && newY === me.toY) {
                me.speed = 0
                me.motionStartTime = 0
                me.motionProgress = 1

                me.trigger('motion-stopped')
            }

            me.x = newX
            me.y = newY
        }
    }

    moveTo(x, y, smooth = true, speed = 400) {
        // 0 и -200 по дефолту
        let [newX, newY] = [x, y]

        const { width, height } = this

        if (this.clampToMap && this.engine) {
            // Сюда залетают координаты только с камеры
            const world = this.engine.game.getWorld()
            if (world) {
                // Делаем, чтобы камера не выходила за пределы мира
                // левый верхний угол

                newX = clamp(x, 0, world.width - width)
                newY = clamp(y, 0, world.height - height)
            }
        }

        if (smooth) {
            this.startMotion(newX, newY, speed)
        } else {
            // Устанаваливаем координаты для камеры
            this.x = newX
            this.y = newY
        }
    }

    startMotion(newX, newY, speed) {
        // Сюда залетает ClientGameObject контекст
        if (this.world) {
            Object.assign(this, {
                motionStartTime: this.world.engine.lastRenderTime,
                speed,
                toX: newX,
                toY: newY,
                deltaX: newX - this.x,
                deltaY: newY - this.y,
            })
        }
    }
}

export default MovableObject
