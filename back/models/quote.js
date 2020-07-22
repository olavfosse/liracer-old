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

const getProgramPath = (language, program) => path.join(__dirname, 'quotes', language, program)

const enforceNoSpaceIndentation = (quotes) => {
  quotes.forEach(quote => {
    quote.code.split('\n').forEach((line, index) => {
      if(line.startsWith(' ')) {
        const path = getProgramPath(quote.language, quote.program)
        console.error(`ERROR: Found space indentation at ${path}:${index + 1}`)
        process.exit(1)
      }
    })
  })
}

const enforceMaxium79CharactersPerLine = (quotes) => {
  quotes.forEach(quote => {
    quote.code.split('\n').forEach((line, index) => {
      if(line.length > 79) {
        const path = getProgramPath(quote.language, quote.program)
        console.error(`ERROR: Found line with more than 79 characters at ${path}:${index + 1}`)
        process.exit(1)
      }
    })
  })
}

const enforceNoExcessNewline = (quotes) => {
  quotes.forEach(quote => {
    const index = quote.code.length - 1
    if(quote.code[index] === '\n'){
      const path = getProgramPath(quote.language, quote.program)
      // refactor getProgramPath to be getQuotePath
      console.error(`ERROR: Found excess newline at ${path}:${index + 1}`)
      process.exit(1)
    }
  })
}

const quotes = getQuotes()
enforceNoSpaceIndentation(quotes)
enforceMaxium79CharactersPerLine(quotes)
enforceNoExcessNewline(quotes)

const random = () => quotes[Math.floor(Math.random() * quotes.length)]

module.exports = { random }