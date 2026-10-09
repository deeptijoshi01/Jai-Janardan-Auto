import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <FloatingWhatsApp />
    </>
  </StrictMode>,
)
