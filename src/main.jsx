import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StyleRegistry } from 'styled-jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyleRegistry>
      <App />
    </StyleRegistry>
  </StrictMode>,
)