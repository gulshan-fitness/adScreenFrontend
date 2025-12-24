import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Context_holder from './Context_holder.jsx'
import PaymentSuccessPopup from './Payment/PaymentSuccessPopup.jsx'

createRoot(document.getElementById('root')).render(
  <Context_holder>

  <App />

  <PaymentSuccessPopup/>
  
</Context_holder>,
)
