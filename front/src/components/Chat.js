import React from 'react'

const Chat = ({ messages, onSubmitChatInput, setChatInput, chatInput }) => {  
  return (
    <>
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
      <form onSubmit={onSubmitChatInput} id="chat-input">
        <input onChange={(event) => setChatInput(event.target.value)}
               type="text"
               value={chatInput}/>
      </form>
    </>
  )
}

export default Chat