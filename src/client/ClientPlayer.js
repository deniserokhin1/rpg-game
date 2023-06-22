import ClientGameObject from './ClientGameObject'

export class ClientPlayer extends ClientGameObject {
    constructor(cfg) {
        super(cfg)

        this.playerName = 'Denchik'
        const world = cfg.cell.world
        world.game.setPlayer(this)
    }

    render(time) {
        super.render(time)

        const { world } = this

        world.engine.renderSign({
            x: this.x + world.cellWidth / 2,
            y: this.y - 15,
            minWIdth: world.cellWidth,
            maxWidth: world.cellWidth * 1.5,
            text: this.playerName,
        })
    }
}
