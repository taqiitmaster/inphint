import { useState } from 'react'
import { api, setToken } from '../api'

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { token } = await api.login(username.trim(), password)
      setToken(token)
      onLoggedIn()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="a-login">
      <form className="a-login-card" onSubmit={submit}>
        <div className="a-brand"><img src="/assets/logo.webp" alt="Inphint" /></div>
        <h1>Admin sign in</h1>
        <p className="a-login-sub">Manage enquiries, services and projects.</p>
        <input className="a-input" placeholder="Username" value={username} autoFocus
          onChange={(e) => setUsername(e.target.value)} />
        <input className="a-input" type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="a-error">{error}</div>}
        <button className="a-btn a-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="a-back" href="/">← Back to site</a>
      </form>
    </div>
  )
}
