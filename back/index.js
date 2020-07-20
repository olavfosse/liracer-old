const WebSocket = require('ws')

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
    ws.send(JSON.stringify(object))
  }

  const sendJoinInstructions = () => {
    sendMessage('liracer', 'To join a game, send "/join id". If a game by the given id exists you join that, otherwise a new game is created.')
  }

  const sendMessage = (sender, content) => send('message', { sender, content })

  const log = (...message) => console.log(ip, '|', ...message)
  const error = (...error) => console.error(ip, '|', ...error)

  sendMessage('liracer', 'Welcome to liracer!')
  sendJoinInstructions()
  log('connected')

  ws.onmessage = (message) => {
  
    const dispatch = async () => {
      const { type, body } = JSON.parse(message.data)
      if(!(typeof type === 'string' && typeof body === 'object')){
        error('message invalid')
        return
      } else if (body.id === undefined){
        error('no id')
        sendMessage('liracer', 'You need to be in a game to do this.')
        sendJoinInstructions()
        return
      }
    }

    log('sent:', JSON.parse(message.data))
    dispatch()
  }
})