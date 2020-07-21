const WebSocket = require('ws')
const Game = require('./models/game')

const port = process.env.PORT
const wss = new WebSocket.Server({ port }, () => {
  console.log(`WebSocket server running on port ${port}`)
})

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress

  const sendToWs = (type, body, ws) => {
    const object = {
      type,
      body
    }
    log('sent:', object)
    ws.send(JSON.stringify(object))
  }

  const send = (type, body) => sendToWs(type, body, ws)

  const log = (...message) => console.log(ip, '|', ...message)
  const error = (...error) => console.error(ip, '|', ...error)

  log('connected')

  ws.onmessage = (message) => {
    const handleJoin = (id) => {
      const game = Game.get(id) || Game.create(id)
      Game.removePlayer(ip)
      Game.createPlayer(id, ip, ws)
      const {quote} = game
      send('quote', quote)
      send('messages', game.messages)
    }

    const handleMessage = (body, id) => {
      const sender = Game.getPlayer(ip)
      const recipients = Game.get(id).players
      console.log(sender)
      if(sender !== undefined){
        const message = {
          content: body.content,
          sender: sender.name
        }
        Game.createMessage(id, message)
        recipients.forEach(({ws}) => sendToWs('message', message, ws))
        log(Game.get(id))
      }
    }

    const dispatch = async () => {
      const { type, body, id} = JSON.parse(message.data)
      if(!(typeof type === 'string' && typeof body === 'object' && id !== undefined)){
        error('message invalid')
      } else if(type === 'join'){
        handleJoin(id)
      } else if(type === 'message'){
        handleMessage(body, id)
      }
    }

    log('received:', JSON.parse(message.data))
    dispatch()
  }

  ws.onclose = () => {
    Object.entries(Game.getAll()).forEach(([_, game]) => Game.removePlayer(ip))
  }
})