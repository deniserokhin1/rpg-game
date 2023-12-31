import { clamp } from '../common/util'
import EventSourceMixin from '../common/EventSourceMixin'
import { ClientCamera } from './ClientCamera'
import ClientInput from './ClientInput'
import { spriteConfig } from '../configs/sprites'

export class ClientEngine {
    constructor(canvas, game) {
        Object.assign(this, {
            canvas,
            canvases: {
                main: canvas,
            },
            ctx: null,
            imageLoaders: [],
            images: {},
            camera: new ClientCamera({ canvas, engine: this }),
            input: new ClientInput(canvas),
            game, // ClientGame
            lastRenderTime: 0,
            startTime: 0,
        })

        this.ctx = canvas.getContext('2d')
        this.loop = this.loop.bind(this)
        this.sprites = {}
    }

    start() {
        this.loop()
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp
        }

        this.lastRenderTime = timestamp

        const { ctx, canvas } = this

        ctx.fillStyle = 'black'
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.trigger('render', timestamp)
        this.initNextFrame()
    }

    initNextFrame() {
        window.requestAnimationFrame(this.loop)
    }

    // Сохраняем в память spriteConfig
    async loadSprites(spritesGroup) {
        this.imageLoaders = []

        for (const groupName in spritesGroup) {
            if (Object.hasOwnProperty.call(spritesGroup, groupName)) {
                const group = spritesGroup[groupName]
                this.sprites[groupName] = group

                // Сохраняем у каждого спрайта картинку в images, на которую он ссылается
                for (const spriteName in group) {
                    const { img } = group[spriteName]
                    if (!this.images[img]) {
                        this.imageLoaders.push(this.loadImage(img))
                    }
                }
            }
        }

        // В this.imageLoaders сохраняем промисы
        return Promise.all(this.imageLoaders)
    }

    async loadImage(url) {
        return new Promise((resolve) => {
            const i = new Image()
            this.images[url] = i
            console.log('url:', url)
            i.src = url
            i.onload = () => {
                resolve(i)
            }
        })
    }

    renderSpriteFrame({ sprite, frame, x, y, w, h }) {
        const spriteCfg = this.sprites[sprite[0]]
        const [fx, fy, fw, fh] = spriteCfg[sprite[1]].frames[frame]
        const img = this.images[spriteCfg[sprite[1]].img]
        const camera = this.camera

        this.ctx.drawImage(img, fx, fy, fw, fh, x - camera.x, y - camera.y, w, h)
    }

    addCanvas(name, width, height) {
        let canvas = this.canvases[name]

        if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            this.canvases[name] = canvas
        }

        return canvas
    }

    switchCanvas(name) {
        const canvas = this.canvases[name]

        if (canvas) {
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
        }

        return canvas
    }

    focus() {
        this.canvases.main.focus()
    }

    renderCanvas(name, fromPos, toPos) {
        const canvas = this.canvases[name]

        if (canvas) {
            this.ctx.drawImage(
                canvas,
                fromPos.x,
                fromPos.y,
                fromPos.width,
                fromPos.height,
                toPos.x,
                toPos.y,
                toPos.width,
                toPos.height
            )
        }
    }

    renderSign(opt) {
        const options = Object.assign(
            {
                color: 'Black',
                bgColor: '#f4f4f4',
                font: '16px sans-serif',
                verticalPadding: 5,
                horizontalPadding: 3,
                textAlign: 'center',
                textBaseLine: 'center',
            },
            opt
        )

        const { ctx, camera } = this
        ctx.textBaseLine = options.textBaseLine
        ctx.textAlign = options.textAlign
        ctx.font = options.font

        const measure = ctx.measureText(options.text)
        const textHeight = measure.actualBoundingBoxAscent

        const barWidth = clamp(
            measure.width + 2 * options.horizontalPadding,
            options.minWIdth,
            options.maxWidth
        )
        const barHeight = textHeight + 2 * options.verticalPadding

        const barX = options.x - barWidth / 2 - camera.x
        const barY = options.y - barHeight / 2 - camera.y

        const textWidth = clamp(
            measure.width,
            0,
            barWidth - 2 * options.horizontalPadding
        )

        ctx.fillStyle = options.bgColor
        ctx.fillRect(barX, barY, barWidth, barHeight)

        ctx.fillStyle = options.color
        ctx.fillText(
            options.text,
            barX + barWidth / 2,
            barY + barHeight - options.verticalPadding,
            textWidth
        )
    }
}

Object.assign(ClientEngine.prototype, EventSourceMixin)
