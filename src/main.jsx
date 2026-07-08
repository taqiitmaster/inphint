import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './index.css'

// Lightweight routing: /admin (and /admin/*) renders the admin panel;
// everything else renders the marketing site. No router dependency needed —
// the Express server (prod) and Vite (dev) both serve index.html for all paths.
const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin')
const Root = isAdmin ? AdminApp : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
