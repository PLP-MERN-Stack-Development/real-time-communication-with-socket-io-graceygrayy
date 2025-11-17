import React, { useState } from 'react'
import { useSocket } from './socket/socket'
import Login from './components/Login'
import Chat from './components/Chat'

export default function App() {
  const { socket } = useSocket()
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  const handleLogin = (name) => {
    setUsername(name)
    localStorage.setItem('username', name)
    socket.connect()
    socket.emit('user_join', name)
  }

  const handleLogout = () => {
    socket.disconnect()
    localStorage.removeItem('username')
    setUsername('')
  }

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} />
      )}
    </div>
  )
}
