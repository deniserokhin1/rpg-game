import ClientGame from './client/ClientGame'
import './index.scss'

// Стартовая точка нашей логики
window.addEventListener('load', () => {
    ClientGame.init({ tagId: 'game' })
})
