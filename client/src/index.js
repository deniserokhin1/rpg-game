import ClientGame from './client/ClientGame'
import './index.scss'

window.addEventListener('load', async () => {
    const world = await fetch('http://localhost:8000/api/world').then((res) => {
        return res.json()
    })

    const sprites = await fetch('http://localhost:8000/api/sprites').then((res) => {
        return res.json()
    })

    const gameObjects = await fetch('http://localhost:8000/api/game-objects').then(
        (res) => {
            return res.json()
        }
    )

    const startContainer = document.querySelector('.start-container')
    const startGameForm = document.getElementById('form')
    const chatForm = document.getElementById('chat')
    const startGameInput = document.querySelector('.input')
    const chatContainer = document.querySelector('.chatContainer')
    const chatInput = document.querySelector('.chatInput')
    const loading = document.querySelector('.loading')
    const messages = document.querySelector('.messages')
    const canvas = document.getElementById('game')

    loading.style.display = 'none'
    startContainer.style.display = 'flex'

    window.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
        setTimeout(() => {
            canvas.focus()
        }, 500)
    })

    startGameForm.addEventListener('submit', formStartGameHandler)
    chatForm.addEventListener('submit', formChatHandler)

    startGameInput.addEventListener('click', inputClickHandler)
    chatInput.addEventListener('click', inputClickHandler)

    let api = null

    function formStartGameHandler(e) {
        e.preventDefault()
        const playerName = startGameInput.value
        if (!playerName) return

        api = ClientGame.init({
            tagId: 'game',
            world,
            sprites,
            gameObjects,
            playerName,
            apiCfg: {
                url: 'ws://localhost:8000/',
                messages,
            },
        })

        chatContainer.style.display = 'block'

        startGameForm.removeEventListener('submit', formStartGameHandler)
        startGameInput.removeEventListener('click', inputClickHandler)

        startContainer.remove()
    }

    function inputClickHandler(e) {
        e.stopPropagation()
    }

    function formChatHandler(e) {
        e.preventDefault()
        if (!chatInput.value) return
        api.chat(chatInput.value)
        chatInput.value = ''
    }
})
