import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../socket/socket'

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

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
    markRead,
    addReaction,
    removeReaction,
  } = useSocket()

  const [text, setText] = useState('')
  const [recipient, setRecipient] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const typingTimeout = useRef(null)
  const messagesRef = useRef(null)

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Send browser notification on new message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.senderId !== socket.id && !lastMsg.system) {
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${lastMsg.sender}`, {
            body: lastMsg.message.substring(0, 50),
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="50">💬</text></svg>',
          })
        }
      }
    }
  }, [messages, socket.id])

  // Mark messages as read when viewing them
  useEffect(() => {
    messages.forEach((m) => {
      if (m.senderId !== socket.id && !m.readBy?.[socket.id]) {
        markRead(m.id)
      }
    })
  }, [messages, socket.id, markRead])

  // Scroll to bottom on new messages
  useEffect(() => {
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

  const handleReaction = (messageId, reaction) => {
    const message = messages.find(m => m.id === messageId)
    if (message?.reactions?.[reaction]?.includes(socket.id)) {
      removeReaction(messageId, reaction)
    } else {
      addReaction(messageId, reaction)
    }
    setShowReactionPicker(null)
  }

  const filteredMessages = messages.filter((m) =>
    m.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sender?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="chat">
      <aside className="sidebar">
        <div className="user-info">
          <strong>{username}</strong>
          <div className="status">{isConnected ? '🟢 Online' : '🔴 Offline'}</div>
          <button onClick={onLogout} className="logout">Logout</button>
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="users">
          <h4>Online Users ({users.length})</h4>
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
          {filteredMessages.map((m) => (
            <div key={m.id} className={m.system ? 'message system' : m.senderId === socket.id ? 'message mine' : 'message'}>
              {m.system ? (
                <div className="system-text">{m.message}</div>
              ) : (
                <>
                  <div className="meta">
                    <span className="sender">{m.sender}</span>
                    <span className="time">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    {m.readBy && Object.keys(m.readBy).length > 1 && (
                      <span className="read-receipt">✓✓</span>
                    )}
                  </div>
                  <div className="body">{m.message}</div>
                  <div className="reactions-row">
                    {Object.entries(m.reactions || {}).map(([reaction, users]) =>
                      users.length > 0 ? (
                        <button
                          key={reaction}
                          className={`reaction ${users.includes(socket.id) ? 'reacted' : ''}`}
                          onClick={() => handleReaction(m.id, reaction)}
                          title={users.map((id) => (users[id]?.username || 'User')).join(', ')}
                        >
                          {reaction} {users.length}
                        </button>
                      ) : null
                    )}
                    <div className="reaction-picker-wrapper">
                      <button
                        className="reaction-add"
                        onClick={() => setShowReactionPicker(showReactionPicker === m.id ? null : m.id)}
                      >
                        +
                      </button>
                      {showReactionPicker === m.id && (
                        <div className="reaction-picker">
                          {REACTIONS.map((r) => (
                            <button
                              key={r}
                              onClick={() => handleReaction(m.id, r)}
                              className="reaction-option"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="typing">
          {typingUsers.length > 0 && <div>{typingUsers.join(', ')} typing...</div>}
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
