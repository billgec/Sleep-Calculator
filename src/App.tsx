import './App.css'
import { Calculator } from './components/Calculator.tsx'
import { Footer } from './components/Footer.tsx'
import { NightSky } from './components/NightSky.tsx'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { LegalNotice } from './pages/LegalNotice.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx'
import { useHashRoute } from './useHashRoute.ts'

function App() {
  const route = useHashRoute()

  return (
    <>
      <NightSky />
      <ThemeToggle />
      {route === 'legal-notice' ? (
        <LegalNotice />
      ) : route === 'privacy' ? (
        <PrivacyPolicy />
      ) : (
        <Calculator />
      )}
      <Footer />
    </>
  )
}

export default App
