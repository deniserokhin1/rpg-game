const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')

const { PORT = 3000 } = process.env

const app = express()
app.use(express.static('dist'))

app.listen(PORT, () => {
    console.log(`Server is working on ${PORT} port`)
})
