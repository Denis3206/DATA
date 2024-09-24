import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Inicio from '../componentes/login.jsx'
import Team from '../componentes/Equipos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App></App>
    <Inicio>
    </Inicio>
    
  </StrictMode>,
)
