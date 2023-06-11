export class ClientEngine {
    ctx: CanvasRenderingContext2D | null = null
    canvas: HTMLCanvasElement | null = null

    constructor(canvas: HTMLCanvasElement) {
        Object.assign(this, {
            canvas,
            ctx: null,
        })

        this.ctx = canvas.getContext('2d')
        this.loop = this.loop.bind(this)
    }

    start() {
        this.loop()
    }

    loop() {
        const { ctx, canvas } = this
        if (!ctx || !canvas) return
        ctx.fillStyle = 'black'
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.initNextFrame()
    }

    initNextFrame() {
        window.requestAnimationFrame(this.loop)
    }
}
