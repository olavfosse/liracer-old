import React, { useEffect } from 'react'

const isUselessKey = (key) => ['Shift', 'Meta', 'Alt', 'Control'].includes(key)

const mapKeyToChar = (key) => {
  if(['Shift', 'Meta', 'Alt', 'Control', 'Backspace'].includes(key)){
    throw new Error('Not mapable to key')
  } else if (key === "Enter"){
    return "\n"
  } else if (key === 'Tab') {
    return "\t"
  } else {
    return key
  }
}

const CodeField = ({ code,
                     send,
                     gameId,
                     cursors,
                     cursorPosition,
                     setCursorPosition,
                     wrongChars,
                     setWrongChars,
                     color }) => {
  useEffect(() => {
    if(code !== ''){
      send('cursor', { cursorPosition }, gameId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPosition, gameId, code])

  const handleKeyDown = (event) => {
    if(['Tab', ' '].includes(event.key)){ // Prevent search bar being opened on Tab and scroll on Space
      event.preventDefault()
    }

    if(isUselessKey(event.key)){}
    else if (event.key === 'Backspace'){
      if(wrongChars > 0){
        setWrongChars(wrongChars - 1)
      } else if (cursorPosition > 0) {
        setCursorPosition(cursorPosition - 1)
      }
    } else if(wrongChars > 0){
      setWrongChars(wrongChars + 1)
    } else {
      if(mapKeyToChar(event.key) !== code[cursorPosition]) {
        setWrongChars(wrongChars + 1)
      } else {
        setCursorPosition(cursorPosition + 1)
      }
    }
  }

  return (
    <>
      <div id="code-field-header"/>
      <pre onKeyDown={handleKeyDown} id="code-field-body" tabIndex="0">
        {
          code && code.split('').map((char, index) => {
            let style = {}

            Object.entries(cursors).forEach(([cursorColor, innerIndex]) => {
              if(index === innerIndex && color !== cursorColor){
                style.background = cursorColor
              }
            })

            if(wrongChars > 0) {
              if(index >= cursorPosition && index < cursorPosition + wrongChars)
                style.background = '#ba5d5d'
            } else if (index === cursorPosition) {
              style.background = '#cfbaa5'
            }
        
            if(char === "\n"){
              return <br key={index}/>
            } else {
              return <span key={index} style={style}>{char}</span>
            }
          })
        }
      </pre>
    </>
  )
}

export default CodeField