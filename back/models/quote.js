const fs = require('fs')
const path = require('path')

const getQuotes = () => {
  const quotes = []
  const rootPath = path.join(__dirname, 'quotes')

  const languages = fs.readdirSync(rootPath)
  languages.forEach(language => {
    const programsPath = path.join(rootPath, language)
    const programPaths = fs.readdirSync(programsPath)

    programPaths.forEach(program => {
      const programPath = path.join(programsPath, program)
      const options = { encoding: 'utf8', flag:'r' }
      const code = fs.readFileSync(programPath, options)

      const quote = {
        language,
        code,
        program,
      }

      quotes.push(quote)
    })
  })

  return quotes
}

const enforceNoSpaceIndentation = (quotes) => {
  quotes.forEach(quote => {
    const programPath = path.join(__dirname, 'quotes', quote.language, quote.program)
    quote.code.split('\n').forEach((line, index) => {
      if(line.startsWith(' ')) {
        throw `Found space indentation at ${programPath}:${index+1}`
      }
    })
  })
}

const quotes = getQuotes()
enforceNoSpaceIndentation(quotes)

const random = () => quotes[Math.floor(Math.random() * quotes.length)]

module.exports = { random }