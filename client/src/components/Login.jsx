import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onLogin(name.trim())
  }

  return (
    <div className="login">
      <h2>Welcome to Chat</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Enter a display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}
