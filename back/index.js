const WebSocket = require('ws')
const Game = require('./models/game')

const port = process.env.PORT || 443
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

  // Send to all players in game gameId
  const sendToGame = (type, body, gameId) => {
    Game.get(gameId).players.forEach((player) => sendToWs(type, body, player.ws))
  }

  const send = (type, body) => sendToWs(type, body, ws)

  const log = (...message) => console.log(ip, '|', ...message)
  const error = (...error) => console.error(ip, '|', ...error)

  log('connected')

  ws.onmessage = (message) => {
    const handleJoin = (id) => {
      const game = Game.get(id) || Game.create(id)
      Game.removePlayer(ip)
      const {color} = Game.createPlayer(id, ip, ws)
      const {quote} = game
      send('color', { color })
      send('quote', quote)
      send('messages', game.messages)
    }

    const handleMessage = (body, id) => {
      const sender = Game.getPlayer(ip)
      if(sender !== undefined){
        const message = {
          content: body.content,
          sender: sender.name
        }
        Game.createMessage(id, message)
        sendToGame('message', message, id)
      }
    }

    const handleCursor = (body, id) => {
      const { color, name} = Game.getPlayer(ip)
      if(body.cursorPosition === Game.get(id).quote.code.length){
        const quote = Game.newQuote(id)
        sendToGame('quote', quote, id)
        const message = {
          sender: 'liracer',
          content: `${name} won!`
        }
        sendToGame('message', message, id)
        Game.createMessage(message)
      } else {
        sendToGame('cursor', {...body, color}, id)
      }
    }

    const dispatch = async () => {
      let data
      try {
        data = JSON.parse(message.data)
      } catch {
        error('inparsable message')
        return
      }
      log('received:', data)
      const { type, body, id } = data
      if(!(typeof type === 'string' && typeof body === 'object' && id !== undefined)){
        error('message invalid')
      } else if(type === 'join'){
        handleJoin(id)
      } else if(type === 'message'){
        handleMessage(body, id)
      } else if(type === 'cursor'){
        handleCursor(body, id)
      } else {
        error('message indispatchable')
      }
    }

    dispatch()
  }

  ws.onclose = () => {
    Game.removePlayer(ip)
  }
})