import React from 'react'
import './Game.css'

const Game = ({ quote, messages }) => (
  <div id="game">
    <div id="chat-header"/>
    <div id="chat-body">
      {
        messages.map(({sender, content}) => (
          <div class="message">
            <b>&lt;{sender}&gt;</b>
            <span>{content}</span>
          </div>
        ))
      }
    </div>
    <div id="code-field-header"/>
    <pre id="code-field-body">
      {quote.code}
    </pre>
  </div> 
)

export default Game