import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import SolarS from './components/SolerS.tsx'
import Apod from './components/Apod.tsx'
import LoadingScreen from './components/hooks/LoadingScreen.tsx'
import Chatbot from './components/Chatbot.tsx'
import EPIC from './components/EPIC.tsx'

const RootApp = () => {
  const [showLoading, setShowLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return !localStorage.getItem('hasSeenLoading')
  })

  useEffect(() => {
    if (!showLoading) return

    const timer = window.setTimeout(() => {
      localStorage.setItem('hasSeenLoading', 'true')
      setShowLoading(false)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [showLoading])

  return (
    <>
      {showLoading && <LoadingScreen />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/solar" element={<SolarS />} />
          <Route path="/apod" element={<Apod />} />
          <Route path='chatbot' element={<Chatbot />} />
          <Route path="/epic" element={<EPIC />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
