import terrainIMG from '../assets/terrain.png'
import charactersIMG from '../assets/characters.png'

export const spriteConfig = {
    terrain: {
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
            frames: [[256, 0, 64, 64]],
        },
        fire: {
            img: terrainIMG,
            frames: [[0, 320, 64, 64]],
        },
        spawn: {
            img: terrainIMG,
            frames: [[384, 640, 64, 64]],
        },
        npcSpawn: {
            img: terrainIMG,
            frames: [[896, 576, 64, 64]],
        },
    },
    characters: {
        girl1: {
            img: charactersIMG,
            frames: [
                [0, 0, 96, 96],
                [96, 0, 96, 96],
                [192, 0, 96, 96],
                [0, 96, 96, 96],
                [96, 96, 96, 96],
                [192, 96, 96, 96],
                [0, 192, 96, 96],
                [96, 192, 96, 96],
                [192, 192, 96, 96],
                [0, 288, 96, 96],
                [96, 288, 96, 96],
                [192, 288, 96, 96],
            ],
        },
        girl2: {
            img: charactersIMG,
            frames: [
                [288, 0, 96, 96],
                [384, 0, 96, 96],
                [480, 0, 96, 96],
                [288, 96, 96, 96],
                [384, 96, 96, 96],
                [480, 96, 96, 96],
                [288, 192, 96, 96],
                [384, 192, 96, 96],
                [480, 192, 96, 96],
                [288, 288, 96, 96],
                [384, 288, 96, 96],
                [480, 288, 96, 96],
            ],
        },
        girl3: {
            img: charactersIMG,
            frames: [
                [576, 0, 96, 96],
                [672, 0, 96, 96],
                [768, 0, 96, 96],
                [576, 96, 96, 96],
                [672, 96, 96, 96],
                [768, 96, 96, 96],
                [576, 192, 96, 96],
                [672, 192, 96, 96],
                [768, 192, 96, 96],
                [576, 288, 96, 96],
                [672, 288, 96, 96],
                [768, 288, 96, 96],
            ],
        },
        boy1: {
            img: charactersIMG,
            frames: [
                [0, 384, 96, 96],
                [96, 384, 96, 96],
                [192, 384, 96, 96],
                [0, 480, 96, 96],
                [96, 480, 96, 96],
                [192, 480, 96, 96],
                [0, 576, 96, 96],
                [96, 576, 96, 96],
                [192, 576, 96, 96],
                [0, 672, 96, 96],
                [96, 672, 96, 96],
                [192, 672, 96, 96],
            ],
        },
        boy2: {
            img: charactersIMG,
            frames: [
                [288, 384, 96, 96],
                [384, 384, 96, 96],
                [480, 384, 96, 96],
                [288, 480, 96, 96],
                [384, 480, 96, 96],
                [480, 480, 96, 96],
                [288, 576, 96, 96],
                [384, 576, 96, 96],
                [480, 576, 96, 96],
                [288, 672, 96, 96],
                [384, 672, 96, 96],
                [480, 672, 96, 96],
            ],
        },
        boy3: {
            img: charactersIMG,
            frames: [
                [576, 384, 96, 96],
                [672, 384, 96, 96],
                [768, 384, 96, 96],
                [576, 480, 96, 96],
                [672, 480, 96, 96],
                [768, 480, 96, 96],
                [576, 576, 96, 96],
                [672, 576, 96, 96],
                [768, 576, 96, 96],
                [576, 672, 96, 96],
                [672, 672, 96, 96],
                [768, 672, 96, 96],
            ],
        },
    },
}
