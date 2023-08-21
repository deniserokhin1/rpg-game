const express = require('express')

const { PORT = 3000 } = process.env

const app = express()
app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.status(200)
    res.send('It is working!')
    console.log('Yo Common!')
})

app.listen(PORT, () => {
    console.log(`Server is working on ${PORT} port`)
})
