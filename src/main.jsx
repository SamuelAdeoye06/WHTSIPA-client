import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.jsx'
import { CountriesProvider } from './context/CountriesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CountriesProvider>
      <App />
    </CountriesProvider>
  </StrictMode>,
)
