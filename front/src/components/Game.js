import React, { useState, useEffect } from 'react'
import './Game.css'

const wsUrl = 'ws://localhost:3001/'
const instructionMessage = {
  sender: 'liracer',
  content: 'To join a game, send "/join id". If a game by the given id exists you join that, otherwise a new game is created.'
}

const Game = () => {
  const [messages, setMessages] = useState([])
  const [code, setCode] = useState('')
  const [ws, setWs] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [gameId, setGameId] = useState(null)

  const send = (type, body, id) => {
    const message = {
      type,
      body,
      id
    }
    ws.send(JSON.stringify(message))
  }

  useEffect(() => {
    const message = {
      sender: 'liracer',
      content: 'Welcome to liracer!'
    }
    setMessages([...messages, message, {...instructionMessage}])
    const fetchWs = async () => {
      const websocket = new WebSocket(wsUrl)
      setWs(websocket)
    }
    fetchWs()
  }, [])

  useEffect(() => {
    if(ws === null){
      return
    }

    const saveMessage = (message) => setMessages((messages) => messages.concat(message))

    const dispatch = (message) => {
      const { type, body } = JSON.parse(message.data)
      switch(type){
        case('message'):
          saveMessage(body)
          break
        default:
          throw new Error('Could not dispatch message')
      }
    }

    ws.onmessage = dispatch
  }, [ws])

  const handleSubmitChatInput = (event) => {
    event.preventDefault()

    if(chatInput === '') return

    const dispatch = () => {
      const words = chatInput.split('')
      const command = words[0]
      switch(command){
        case('/join'):
          const id = words[1]
          send('join', {}, id)
          break
        default:
          if(gameId === null){
            const message1 = {
              sender: 'liracer',
              content: 'You need to be in a game to do this.'
            }
            setMessages([...messages, message1, {...instructionMessage}])
          }
      }
    }

    dispatch()
    setChatInput('')
  }

  return (
    <div id="game">
      <div id="chat-header"/>
      <div id="chat-body">
        {
          messages.map(({sender, content}, index) => (
            <div key={index}>
              <b>&lt;{sender}&gt;</b>
              <span>{content}</span>
            </div>
          ))
        }
      </div>
      <form onSubmit={handleSubmitChatInput} id="chat-input">
        <input onChange={(event) => setChatInput(event.target.value)}
               type="text"
               value={chatInput}/>
      </form>
      <div id="code-field-header"/>
      <pre id="code-field-body">
        {code}
      </pre>
    </div> 
  )
}

export default Game