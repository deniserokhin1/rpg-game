import terrainIMG from '../assets/terrain.png'

export interface IThing {
    img: typeof terrainIMG
    frames: number[][]
}

export interface ITerrain {
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
    layers: {
        isStatic: boolean
    }[]
    map: {
        walls: string[][]
    }[][]
}

export type ITerrainKeys = keyof typeof terrain

export const terrain: ITerrain = {
    grass: {
        img: terrainIMG,
        frames: [[896, 256, 64, 64]],
    },
    water: {
        img: terrainIMG,
        frames: [[0, 576, 64, 64]],
    },
    wall: {
        img: terrainIMG,
        frames: [[0, 64, 64, 64]],
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
