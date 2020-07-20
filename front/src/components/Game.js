import React, { useState, useEffect } from 'react'
import './Game.css'

const wsUrl = 'ws://localhost:3001/'

const Game = () => {
  const [messages, setMessages] = useState([])
  const [code, setCode] = useState('')
  const [ws, setWs] = useState(null)

  useEffect(() => {
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
      <form id="chat-input">
        <input type="text"/>
      </form>
      <div id="code-field-header"/>
      <pre id="code-field-body">
        {code}
      </pre>
    </div> 
  )
}

export default Game