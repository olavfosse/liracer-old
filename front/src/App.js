import React, { useState } from 'react'
import Menu from './components/Menu'
import Game from './components/Game'
import 'bootstrap/dist/css/bootstrap.min.css'
import gameService from './services/game'

const App = () => {
  const [messages, setMessages] = useState(null)
  const [quote, setQuote] = useState(null)
  const [status, setStatus] = useState('menu')

  const handleClickStartGame = async () => {
    const game = await gameService.create()
    enterGame(game)
  }

  const handleClickJoinGame = async () => {
    const id = prompt('Game ID')
    const game = await gameService.get(id)
    enterGame(game)
  }

  const enterGame = (game) => {
    setMessages(game.messages)
    setQuote(game.quote)
    setStatus('game')
  }

  return (
    (
      status === 'menu' && <Menu onClickStartGame={handleClickStartGame}
                                 onClickJoinGame={handleClickJoinGame}/>
    ) ||
    (
      status === 'game' && <Game quote={quote} messages={messages}/>
    )                     
  )
}

export default App;
