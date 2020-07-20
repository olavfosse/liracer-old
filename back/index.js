const WebSocket = require('ws')

const port = process.env.PORT
const wss = new WebSocket.Server({ port }, () => {
  console.log(`WebSocket server running on port ${port}`)
})
const Game = require('./models/game')

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress

  const send = (type, body) => {
    const object = {
      type,
      body,
    }
    ws.send(JSON.stringify(object))
  }

  const sendMessage = (sender, content) => send('message', { sender, content })

  const log = (...message) => console.log(ip, '|', ...message)
  const error = (...error) => console.error(ip, '|', ...error)

  log('connected')

  ws.onmessage = (message) => {
  
    const dispatch = async () => {
      const { type, body, id} = JSON.parse(message.data)
      if(!(typeof type === 'string' && typeof body === 'object' && id !== undefined)){
        error('message invalid')
      } else if(type === 'join'){
        const game = Game.get(id) || Game.create(id)
        game.players.push(ws)

        const {quote} = game
        send('quote', quote)
      }
    }

    log('sent:', JSON.parse(message.data))
    dispatch()
  }
})