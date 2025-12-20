import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Context_holder from './Context_holder.jsx'

createRoot(document.getElementById('root')).render(
  <Context_holder>

  <App />
  
</Context_holder>,
)
