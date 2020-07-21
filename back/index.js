const WebSocket = require('ws')
const Game = require('./models/game')

const port = process.env.PORT
const wss = new WebSocket.Server({ port }, () => {
  console.log(`WebSocket server running on port ${port}`)
})

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress

  const send = (type, body) => {
    const object = {
      type,
      body,
    }
    log('sent:', object)
    ws.send(JSON.stringify(object))
  }

  const sendToWs = (type, body, ws) => {
    const object = {
      type,
      body
    }
    log('sent:', object)
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
        if(Game.getPlayer(id, ip)){
          sendMessage('liracer', 'Your ip is already connected to this game. Please close your other client.') 
        } else {
          Game.createPlayer(id, ip, ws)
          const {quote} = game
          send('quote', quote)
          send('messages', game.messages)
        }
      } else if(type === 'message'){
        const sender = Game.getPlayer(id, ip)
        const recipients = Game.get(id).players
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
    }

    log('received:', JSON.parse(message.data))
    dispatch()

   
  }

  ws.onclose = () => {
    Object.entries(Game.getAll()).forEach(([_, game]) => Game.removePlayer(game.id, ip))
  }
})