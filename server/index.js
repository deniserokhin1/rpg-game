const cors = require('cors')
const express = require('express')
const router = require('./routes/router')
const WebSocketHandlers = require('./handlers')
const app = express()

const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/api', router)

let playersList = []

const handlers = new WebSocketHandlers(playersList, aWss)

app.ws('/', (ws, req) => handlers.attachHandlers(ws))

app.listen(PORT, () => console.log(`Server is working on ${PORT} port.`))
