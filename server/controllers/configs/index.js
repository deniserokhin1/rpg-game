const path = require('path')

const getConfig = (req, res) => {
    let config
    let ex

    try {
        const { config } = req.params

        const ex = config === 'sprites' ? 'js' : 'json'

        const file = require(path.resolve(
            __dirname,
            '..',
            '..',
            'configs',
            `${config}.${ex}`
        ))
        res.json(file)
    } catch (e) {
        console.log(`Error while getting ${config}.${ex} from server. Error: ${e}`)
        return res.status(500).json('Error')
    }
}

module.exports = { getConfig }
