const Quote = require('./quote')
const { random } = require('./quote')

const makeColor = (name, code) => ({
  name,
  code
})

const colors = [
  makeColor('teak',         '#ba9570'), // hsl(30°,  40%, 73%)
  makeColor('timblet',      '#baba70'), // hsl(60°,  40%, 73%)
  makeColor('olivine',      '#95ba70'), // hsl(90°,  40%, 73%)
  makeColor('fern',         '#70ba70'), // hsl(120°, 40%, 73%)
  makeColor('silver tree',  '#70ba95'), // hsl(150°, 40%, 73%)
  makeColor('neptune',      '#70baba'), // hsl(180°, 40%, 73%)
  makeColor('ship cove',    '#7070ba'), // hsl(240°, 40%, 73%)
  makeColor('wisteria',     '#9570ba'), // hsl(270°, 40%, 73%)
  makeColor('fuchsia pink', '#ba70ba'), // hsl(300°, 40%, 73%)
  makeColor('turkish rose', '#ba7095')  // hsl(330°, 40%, 73%)
]

const games = {}

const get = (gameId) => games[gameId]

const getAll = () => games

const create = (id) => {
  const quote = Quote.random()
  const messages = [
    {
      sender: 'liracer',
      content: `The game id is ${id}`
    },
    {
      sender: 'liracer',
      content: `The current program is ${quote.program}`
    }
  ]
  const players = []

  const game = {
    id,
    quote,
    messages,
    players
  }

  games[id] = game

  return game
}

const remove = (gameId) => {
  delete games[gameId]
}

const getPlayer = (playerIp) => {
  let player
  Object.entries(games).forEach(([_, game]) => {
    game.players.forEach((innerPlayer) => {
      if(innerPlayer.ip === playerIp){
        player = innerPlayer
        return
      }
    })
    if(player){
      return
    }
  })

  return player
}

const uniqueColor = (gameId) => colors.find(color => {
  return !games[gameId].players.some(player => {
    return JSON.stringify(player.color) === JSON.stringify(color.code)
  })  
})

const createPlayer = (gameId, playerIp, ws) => {
  const color = uniqueColor(gameId)
  if(color !== undefined){
    const player = {
      ip: playerIp,
      color: color.code,
      name: color.name,
      ws
    }
    games[gameId].players.push(player)
    return player
  } else {
    throw 'Could not create player since the room is full'
  }
}

const removePlayer = (playerIp) => {
  Object.entries(games).forEach(([_, game]) => {
    game.players = game.players.filter(player => player.ip !== playerIp)
  })
}

const createMessage = (id, message) => {
  games[id].messages.push(message)
}

const newQuote = (id) => get(id).quote = Quote.random()

const publicInterface = {
  get,
  getAll,
  create,
  remove,
  getPlayer,
  createPlayer, 
  removePlayer,
  createMessage,
  newQuote
}

module.exports = publicInterface