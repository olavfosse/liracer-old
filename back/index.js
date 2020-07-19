const express = require('express')
const app = express()
const gamesRouter = require('./controllers/games')

app.use('/api/games', gamesRouter)
app.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP server running on port ${process.env.HTTP_PORT}`)
})