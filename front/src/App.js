import React, { useState } from 'react'
import Menu from './components/Menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import gameService from './services/game'

const App = () => {
  const [messages, setMessages] = useState(null)
  const [quote, setQuote] = useState(null)

  const handleClickStartGame = async () => {
    const game = await gameService.create()
    setMessages(game.messages)
    setQuote(game.quote)
  }

  const handleClickJoinGame = async () => {
    const id = prompt('Game ID')
    const game = await gameService.get(id)
    setMessages(game.messages)
    setQuote(game.quote)
  }

  return <Menu onClickStartGame={handleClickStartGame}
               onClickJoinGame={handleClickJoinGame}/>
}

export default App;
