import './index.scss'
import Person from './assets/Male-1-Walk.png'
import terrainAtlas from './assets/terrain.png'
import { terrain, type ITerrainKeys } from './configs/sprites'
import world from './configs/world.json'
import ClientGame from './client/ClientGame'

const canvas = document.getElementById('game') as HTMLCanvasElement
const ctx = canvas.getContext('2d')
const widthField = canvas.width

const img = document.createElement('img')
const locality = document.createElement('img')
img.src = Person
locality.src = terrainAtlas

type Direction = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight'

const spriteW = 48
const spriteH = 48
const shots = 3
let cycle = 0
let bottomPresses = false
let pY = widthField / 2 - spriteW / 2
let pX = widthField / 2 - spriteW / 2
let key: Direction
let direction = 0
let canMove = true

function keyDownHandler(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        bottomPresses = true
    }

    key = e.key as Direction
}

function keyUpHandler(e: KeyboardEvent) {
    bottomPresses = false
    if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        bottomPresses = false
    }
}

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)

// Img.addEventListener('load', () => {
//     window.requestAnimationFrame(start)
// })

window.addEventListener('load', () => {
    ClientGame.init({ tagId: 'game' })
})

locality.addEventListener('load', () => {
    const { map } = world
    map.forEach((row: ITerrainKeys[][], y: number) => {
        row.forEach((cell, x) => {
            const [sX, sY, sW, sH] = terrain[cell[0]].frames[0]
            ctx?.drawImage(locality, sX, sY, sW, sH, spriteW * x, spriteH * y, spriteW, spriteH)
        })
    })
})

function start(timestamp: number) {
    if (bottomPresses) {
        move()
        cycle = canMove ? (cycle + 1) % shots : 0
    }

    ctx?.clearRect(0, 0, 600, 600)
    ctx?.drawImage(img, cycle * spriteW, direction, spriteW, spriteH, pX, pY, 48, 48)

    window.requestAnimationFrame(start)
}

function move() {
    switch (key) {
        case 'ArrowDown':
            direction = 0
            if (pY >= widthField - spriteW) {
                canMove = false
            } else {
                canMove = true
                pY += 10
            }

            break
        case 'ArrowLeft':
            direction = spriteW
            if (pX <= 0) {
                canMove = false
            } else {
                canMove = true
                pX -= 10
            }

            break
        case 'ArrowRight':
            direction = spriteW * 2
            if (pX >= widthField - spriteW) {
                canMove = false
            } else {
                canMove = true
                pX += 10
            }

            break
        case 'ArrowUp':
            direction = spriteW * 3
            if (pY <= 0) {
                canMove = false
            } else {
                canMove = true
                pY -= 10
            }

            break

        default:
            break
    }
}
