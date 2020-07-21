import React from 'react'

const CodeField = ({code}) => {
  return (
    <>
      <div id="code-field-header"/>
      <pre id="code-field-body">
        {code}
      </pre>
    </>
  )
}

export default CodeField