import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import SolarS from './components/SolerS.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
       <Route path="/solar" element={<SolarS />} />

    </Routes>
  </BrowserRouter>,
  </StrictMode>,
)
