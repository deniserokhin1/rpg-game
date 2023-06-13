import { EventMixin } from '../common/EventSourceMixin'
import { type ITerrain, type IThing, type ITerrainKeys, type ISprite } from '../configs/sprites'
export class ClientEngine {
    ctx: CanvasRenderingContext2D | null = null
    canvas: HTMLCanvasElement | null = null
    imageLoaders: Array<Promise<HTMLImageElement>> = []
    sprites: Record<ITerrainKeys, IThing> = {}
    images: Record<string, HTMLImageElement> = {}
    eventMixin: EventMixin

    constructor(canvas: HTMLCanvasElement) {
        Object.assign(this, {
            canvas,
            ctx: undefined,
            imageLoaders: [],
            sprites: {},
            images: {},
        })

        this.ctx = canvas.getContext('2d')
        this.loop = this.loop.bind(this)
        this.eventMixin = new EventMixin()
    }

    start() {
        this.loop()
    }

    loop(timestamp?: number) {
        const { ctx, canvas } = this
        if (!ctx || !canvas) {
            return
        }

        ctx.fillStyle = 'black'
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.eventMixin.trigger('render', timestamp)
        this.initNextFrame()
    }

    initNextFrame() {
        window.requestAnimationFrame(this.loop)
    }

    async loadSprites(spritesGroup: ITerrain) {
        this.imageLoaders = []

        for (const key in spritesGroup) {
            if (Object.hasOwnProperty.call(spritesGroup, key)) {
                this.sprites[key] = spritesGroup[key]
                const { img } = spritesGroup[key]
                if (!this.images[img]) {
                    this.imageLoaders.push(this.loadImage(img))
                }
            }
        }

        return Promise.all(this.imageLoaders)
    }

    async loadImage(url: string) {
        return new Promise((resolve: (img: HTMLImageElement) => void) => {
            const i = new Image()
            this.images[url] = i
            i.onload = () => {
                resolve(i)
            }

            i.src = url
        })
    }

    renderSpriteFrame({ sprite, frame, x, y, w, h }: ISprite) {
        const spriteCfg = this.sprites[sprite[0]]
        const [fx, fy, fw, fh] = spriteCfg.frames[frame]
        const img = this.images[spriteCfg.img]

        this.ctx?.drawImage(img, fx, fy, fw, fh, x, y, w, h)
    }
}
