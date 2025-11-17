import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../socket/socket'

export default function Chat({ username, onLogout }) {
  const {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  } = useSocket()

  const [text, setText] = useState('')
  const [recipient, setRecipient] = useState('')
  const typingTimeout = useRef(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const handleChange = (e) => {
    setText(e.target.value)
    setTyping(true)
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setTyping(false), 800)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (recipient) {
      sendPrivateMessage(recipient, text.trim())
    } else {
      sendMessage(text.trim())
    }
    setText('')
    setTyping(false)
  }

  return (
    <div className="chat">
      <aside className="sidebar">
        <div className="user-info">
          <strong>{username}</strong>
          <div className="status">{isConnected ? 'Online' : 'Offline'}</div>
          <button onClick={onLogout} className="logout">Logout</button>
        </div>

        <div className="users">
          <h4>Online Users</h4>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => setRecipient(u.id === socket.id ? '' : u.id)}
                  className={recipient === u.id ? 'selected' : ''}
                >
                  {u.username}{u.id === socket.id ? ' (you)' : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="main">
        <div className="messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={m.system ? 'message system' : m.senderId === socket.id ? 'message mine' : 'message'}>
              {m.system ? (
                <div className="system-text">{m.message}</div>
              ) : (
                <>
                  <div className="meta">
                    <span className="sender">{m.sender}</span>
                    <span className="time">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="body">{m.message}</div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="typing">
          {typingUsers.length > 0 && (
            <div>{typingUsers.join(', ')} typing...</div>
          )}
        </div>

        <form onSubmit={handleSend} className="composer">
          <input
            value={text}
            onChange={handleChange}
            placeholder={recipient ? 'Message (private)' : 'Type a message...'}
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  )
}
