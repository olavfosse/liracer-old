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

  const log = (...message) => console.log(ip,'|',...message)

  const message = {
    sender:  'liracer',
    content: 'Welcome to liracer!'
  }

  send('message', message)
  
  log('connected')

  ws.onmessage = (message) => {
    log('sent:', JSON.parse(message.data))
  }
})