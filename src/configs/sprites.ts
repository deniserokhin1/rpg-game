import terrainIMG from '../assets/terrain.png'

export interface IThing {
    img: string
    frames: number[][]
}

export interface ISprite {
    sprite: ITerrainKeys[]
    frame: number
    x: number
    y: number
    w: number
    h: number
}

export interface ITerrain {
    [key: string]: IThing
    grass: IThing
    water: IThing
    wall: IThing
    spawn: IThing
    npcSpawn: IThing
}

export interface IMap {
    camera: {
        height: number
        width: number
        x: number
        y: number
    }
    layers: Array<{
        isStatic: boolean
    }>
    map: string[][][][]
}

export type ITerrainKeys = keyof ITerrain

export const terrain: ITerrain = {
    grass: {
        img: terrainIMG,
        frames: [[896, 256, 64, 64]],
    },
    water: {
        img: terrainIMG,
        frames: [[512, 64, 64, 64]],
    },
    wall: {
        img: terrainIMG,
        frames: [[448, 0, 64, 64]],
    },
    spawn: {
        img: terrainIMG,
        frames: [[384, 640, 64, 64]],
    },
    npcSpawn: {
        img: terrainIMG,
        frames: [[896, 576, 64, 64]],
    },
}
