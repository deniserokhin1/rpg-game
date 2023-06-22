import MovableObject from '../common/MovableObject'
import EventSourceMixin from '../common/EventSourceMixin'

class ClientInput extends MovableObject {
    constructor(canvas) {
        super()
        Object.assign(this, {
            canvas,
            keysPressed: new Set(), // клавиши, зажатые в данный момент
            keyStateHandlers: {}, // обработчики, срабатывающие каждый рендер, если нажата клавиша
            keyHandlers: {}, // обработчики при нажатии определенной клавиши
        })
        canvas.addEventListener('keydown', (e) => this.onKeyDown(e))
        canvas.addEventListener('keyup', (e) => this.onKeyUp(e), false)
    }

    onKeyDown(e) {
        this.keysPressed.add(e.code)
        this.keyHandlers[e.code] && this.keyHandlers[e.code](true)
        this.trigger('keydown', e)
    }

    onKeyUp(e) {
        this.keyHandlers[e.code] && this.keyHandlers[e.code](false)
        this.keysPressed.delete(e.code)
        this.trigger('keyup', e)
    }

    onKey({ ...handlers }) {
        this.keyHandlers = { ...this.keyHandlers, ...handlers }
    }
}

Object.assign(ClientInput.prototype, EventSourceMixin)

export default ClientInput
