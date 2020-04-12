import React, { useState, createContext, FunctionComponent } from 'react'

type MessageType = 'info' | 'success' | 'error' | 'warning'

interface GlobalMessage {
  open: boolean
  message: string
  type: MessageType
}

interface GlobalMessageContext extends GlobalMessage {
  setGlobalMessage: (value: GlobalMessage) => void
}

const initialMessage: GlobalMessageContext = {
  open: false,
  message: '',
  type: 'info',
  setGlobalMessage: (value: GlobalMessage) => {},
}

export const GlobalMessageContext = createContext<GlobalMessageContext>(initialMessage)

export const GlobalMessageProvider: FunctionComponent = (props) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<MessageType>('info')

  const setGlobalMessage = ({ open, message, type }: GlobalMessage) => {
    setOpen(open)
    setMessage(message)
    setType(type)
  }

  return (
    <GlobalMessageContext.Provider
      value={{
        open,
        message,
        type,
        setGlobalMessage,
      }}
    >
      {props.children}
    </GlobalMessageContext.Provider>
  )
}
