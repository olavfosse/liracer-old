const express = require('express')
const Game = require('../models/game')
const router = express.Router()

router.post('', (_request, response) => {
  const { quote, messages } = Game.create('')
  response.json({
    quote,
    messages
  })
})

router.get('/:id', (request, response) => {
  const { quote, messages } = Game.get(request.params.id)
  response.json({
    quote,
    messages
  })
})

module.exports = router